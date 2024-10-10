/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */
const logger = require("firebase-functions/logger")
const admin = require("firebase-admin")
const functions = require('firebase-functions')
const express = require("express");
const bodyParser = require("body-parser")
const {getAuth} = require("firebase-admin/auth")
const csv = require('csv-parser')
const axios = require('axios')

admin.initializeApp()
const db = admin.firestore();
const app = express()
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))
const auth = getAuth()

// const configMap = {
//     baseViewPackageUrl: 'https://stayeasy-7ac2c.web.app/package/{packageCode}/pdf',
//     networkPageWaitUntil: 'domcontentloaded',
//     basePdfFileName: 'pkg-{packageCode}.pdf',
//     bucketDirName: 'package-pdfs',
//     bucketPublicBaseUrl: 'https://firebasestorage.googleapis.com/v0/b/{bucketName}/o/{fileName}?alt=media&token={downloadToken}',
//     generatePackagePdfMaxMemoryAllocated: '1GiB'
// }

app.use(async (req, res, next) => {
    let idToken = req.headers.authorization;
    if (!idToken) {
        res.status(400).send("authorization header missing.")
        return;
    }
    try {
        let decodedToken = await auth.verifyIdToken(idToken)
        const uid = decodedToken.uid
        res.locals.user = decodedToken.phone_number
        res.locals.authenticated = true
        next()
    } catch (e) {
        res.status(400).send("Auth token invalid");
        return false;
    }
})

exports.webApi = functions.https.onRequest(app)

// exports.generatePackagePdf = onDocumentCreated(
//     {
//         document: "/packages/{packId}",
//         memory: configMap.generatePackagePdfMaxMemoryAllocated
//     },
//     async (event) => {
//         if (!event.params.packId) return null;
//         if (!event.data) {
//             logger.log("No data associated with the event")
//             return;
//         }
//
//         return puppeteer.launch({
//             headless: true,
//             args: ['--disable-features=IsolateOrigins',
//                 '--disable-site-isolation-trials',
//                 '--autoplay-policy=user-gesture-required',
//                 '--disable-background-networking',
//                 '--disable-background-timer-throttling',
//                 '--disable-backgrounding-occluded-windows',
//                 '--disable-breakpad',
//                 '--disable-client-side-phishing-detection',
//                 '--disable-component-update',
//                 '--disable-default-apps',
//                 '--disable-dev-shm-usage',
//                 '--disable-domain-reliability',
//                 '--disable-extensions',
//                 '--disable-features=AudioServiceOutOfProcess',
//                 '--disable-hang-monitor',
//                 '--disable-ipc-flooding-protection',
//                 '--disable-notifications',
//                 '--disable-offer-store-unmasked-wallet-cards',
//                 '--disable-popup-blocking',
//                 '--disable-print-preview',
//                 '--disable-prompt-on-repost',
//                 '--disable-renderer-backgrounding',
//                 '--disable-setuid-sandbox',
//                 '--disable-speech-api',
//                 '--disable-sync',
//                 '--hide-scrollbars',
//                 '--ignore-gpu-blacklist',
//                 '--metrics-recording-only',
//                 '--mute-audio',
//                 '--no-default-browser-check',
//                 '--no-first-run',
//                 '--no-pings',
//                 '--no-sandbox',
//                 '--no-zygote',
//                 '--password-store=basic',
//                 '--use-gl=swiftshader',
//                 '--use-mock-keychain'],
//             executablePath: chromium.path
//         }).then(async (browser) => {
//             return browser.newPage().then(async (page) => {
//
//                 // dummy page = `https://stayeasy-7ac2c.web.app/package/LYAaU5n1zgDaDUaDHPX1U/pdf`
//
//                 // return page.goto(configMap.baseViewPackageUrl.replace('{packageCode}', event.params.packId),
//
//                 await page.goto('https://stayeasy-7ac2c.web.app/package/LYAaU5n1zgDaDUaDHPX1U/pdf',
//                     {waitUntil: configMap.networkPageWaitUntil}).then(async () => {
//                     await page.waitForSelector('#packagePdfContainer', {visible: true})
//
//                     const pdfFileName = configMap.basePdfFileName.replace('{packageCode}', event.params.packId)
//                     return page.pdf({path: pdfFileName, printBackground: true}).then(async () => {
//                         return browser.close().then(async () => {
//                             const downloadToken = uuidv4()
//                             return bucket.upload(pdfFileName, {
//                                 destination: `${configMap.bucketDirName}/${pdfFileName}`,
//                                 metadata: {
//                                     contentType: 'pdf',
//                                     metadata: {
//                                         firebaseStorageDownloadTokens: downloadToken
//                                     }
//                                 }
//                             }).then(async (data) => {
//                                 const publicDownloadUrl = configMap.bucketPublicBaseUrl.replace('{bucketName}',
//                                     bucket.name).replace('{fileName}', encodeURIComponent(data[0].name)).replace('{downloadToken}', downloadToken)
//
//                                 // generating firebase bucket file download links - https://stackoverflow.com/questions/42956250/get-download-url-from-file-uploaded-with-cloud-functions-for-firebase
//
//                                 logger.log("Pkg Pdf Download Link:", publicDownloadUrl)
//
//                                 return event.data.ref.update({
//                                     pdfDownloadUrl: publicDownloadUrl
//                                 }).then(async () => true)
//                             })
//                         })
//                     })
//                 })
//             })
//         }).catch((err) => {
//             logger.log("Package PDF creation failed: ", err)
//         })
//
//     }
// )

app.post("/destinations/:destinationName/upload-rate-sheet/", async (req, res) => {
    try {
        const [validFromDate, validUntilDate, fileUrl, hotelId] =
            [Math.floor(new Date(req.body.validFrom).getTime() / 1000),
                Math.floor(new Date(req.body.validUntil).getTime() / 1000),
                req.body.fileUrl, req.body.hotelId]

        const response = await axios.get(fileUrl, {responseType: 'stream'})
        const results = []
        response.data
            .pipe(csv())
            .on('data', (row) => {
                results.push(row)
            })
            .on('end', async () => {
                let docRef
                const batch = db.batch()
                const dbCollection = await db.collection('userRates')

                results.forEach((rate) => {
                    docRef = dbCollection.doc()
                    batch.set(docRef, {
                        destination: req.params.destinationName,
                        hotelId: hotelId,
                        hotelName: rate['Hotel Name'],
                        roomRates: {
                            [rate['Room Name']]: {
                                cpaiPrice: rate['CPAI'],
                                extraBedCpaiPrice: rate['Extra Bed Adult CPAI'],
                                extraBedMapaiPrice: rate['Extra Bed Adult MAPAI'],
                                mapaiPrice: rate['MAPAI'],
                                occupancy: {
                                    adult: rate['Adult Occupancy'],
                                    child: rate['Child Occupancy']
                                },
                                roomName: rate['Room Name']
                            }
                        },
                        userId: res.locals.user,
                        validFrom: validFromDate,
                        validUntil: validUntilDate
                    })
                })
                await batch.commit()
            })
        return res.status(201).send({message: 'Rate sheet uploaded successfully'})

    } catch (err) {
        logger.log(`Uploaded rate sheet processing failed => ${err}`)
        return res.status(500).send({message: 'Something went wrong processing your request'})
    }
})
