/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */
const puppeteer = require("puppeteer")
const logger = require("firebase-functions/logger")
const {onDocumentCreated} = require("firebase-functions/v2/firestore")
const admin = require("firebase-admin")
const functions = require('firebase-functions')
const Busboy = require("busboy")
const XLSX = require('xlsx')
const express = require("express");
const bodyParser = require("body-parser")
const { getAuth } = require("firebase-admin/auth")
const chromium = require('chromium')
const { v4: uuidv4 } = require('uuid')

admin.initializeApp()
const bucket = admin.storage().bucket()

const app = express()
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))

const auth = getAuth()

const configMap = {
    baseViewPackageUrl: 'https://stayeasy-7ac2c.web.app/package/{packageCode}/pdf',
    networkPageWaitUntil: 'networkidle2',
    basePdfFileName: 'pkg-{packageCode}.pdf',
    bucketDirName: 'package-pdfs',
    bucketPublicBaseUrl: 'https://firebasestorage.googleapis.com/v0/b/{bucketName}/o/{fileName}?alt=media&token={downloadToken}',
    generatePackagePdfMaxMemoryAllocated: '1GiB'
}

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

exports.generatePackagePdf = onDocumentCreated(
    {
        document: "/packages/{packId}",
        memory: configMap.generatePackagePdfMaxMemoryAllocated
    },
    async (event) => {
        if (!event.params.packId) return null;
        if (!event.data) {
            logger.log("No data associated with the event")
            return;
        }

        return puppeteer.launch({
            headless: true,
            args: ['--disable-features=IsolateOrigins',
                '--disable-site-isolation-trials',
                '--autoplay-policy=user-gesture-required',
                '--disable-background-networking',
                '--disable-background-timer-throttling',
                '--disable-backgrounding-occluded-windows',
                '--disable-breakpad',
                '--disable-client-side-phishing-detection',
                '--disable-component-update',
                '--disable-default-apps',
                '--disable-dev-shm-usage',
                '--disable-domain-reliability',
                '--disable-extensions',
                '--disable-features=AudioServiceOutOfProcess',
                '--disable-hang-monitor',
                '--disable-ipc-flooding-protection',
                '--disable-notifications',
                '--disable-offer-store-unmasked-wallet-cards',
                '--disable-popup-blocking',
                '--disable-print-preview',
                '--disable-prompt-on-repost',
                '--disable-renderer-backgrounding',
                '--disable-setuid-sandbox',
                '--disable-speech-api',
                '--disable-sync',
                '--hide-scrollbars',
                '--ignore-gpu-blacklist',
                '--metrics-recording-only',
                '--mute-audio',
                '--no-default-browser-check',
                '--no-first-run',
                '--no-pings',
                '--no-sandbox',
                '--no-zygote',
                '--password-store=basic',
                '--use-gl=swiftshader',
                '--use-mock-keychain'],
            executablePath: chromium.path
        }).then(async (browser) => {
            return browser.newPage().then(async (page) => {

                // dummy page = `https://stayeasy-7ac2c.web.app/package/LYAaU5n1zgDaDUaDHPX1U/pdf`

                // return page.goto(configMap.baseViewPackageUrl.replace('{packageCode}', event.params.packId),

                await page.goto('https://stayeasy-7ac2c.web.app/package/LYAaU5n1zgDaDUaDHPX1U/pdf',
                    {waitUntil: configMap.networkPageWaitUntil}).then(async () => {

                    const pdfFileName = configMap.basePdfFileName.replace('{packageCode}', event.params.packId)
                    return page.pdf({path: pdfFileName, printBackground: true}).then(async () => {
                        return browser.close().then(async () => {
                            const downloadToken = uuidv4()
                            return bucket.upload(pdfFileName, {
                                destination: `${configMap.bucketDirName}/${pdfFileName}`,
                                metadata: {
                                    contentType: 'pdf',
                                    metadata: {
                                        firebaseStorageDownloadTokens: downloadToken
                                    }
                                }
                            }).then(async (data) => {
                                const publicDownloadUrl = configMap.bucketPublicBaseUrl.replace('{bucketName}',
                                    bucket.name).replace('{fileName}', encodeURIComponent(data[0].name)).replace('{downloadToken}', downloadToken)

                                // generating firebase bucket file download links - https://stackoverflow.com/questions/42956250/get-download-url-from-file-uploaded-with-cloud-functions-for-firebase

                                logger.log("Pkg Pdf Download Link:", publicDownloadUrl)

                                return event.data.ref.update({
                                    pdfDownloadUrl: publicDownloadUrl
                                }).then(async () => true)
                            })
                        })
                    })
                })
            })
        }).catch((err) => {
            logger.log("Package PDF creation failed: ", err)
        })

    }
)

app.post("/users/:userId/destinations/:destinationName/upload-rate-sheet/", async (req, res) => {
    try{
        const busboy = Busboy({headers: req.headers});
        let fileBuffer = Buffer.alloc(0);
        let fileName;

        // Listen for 'file' event to capture the uploaded file data
        busboy.on('file', (fieldName, file, fileDetails) => {
            fileName = fileDetails.filename
            logger.log(`Received rate sheet: ${fileName}`);

            // Accumulate the file data in memory
            file.on('data', (data) => {
                fileBuffer = Buffer.concat([fileBuffer, data]);
            });

            file.on('end', () => {
                logger.log(`Received TA Destination Rate sheet: ${fileDetails.filename}`)

                const workbook = XLSX.read(fileBuffer, {type: 'buffer'});
                // Convert the first sheet to JSON
                const sheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[sheetName];
                const jsonData = XLSX.utils.sheet_to_json(worksheet);
            })
        })

        busboy.on('error', (error) => {
            return res.status(500).send(`Error while processing file: ${error}`);
        })

        busboy.on('finish', () => {
            return res.status(201).send({message: 'Rate sheet uploaded successfully'})
        })

        if (req.rawBody) {
            busboy.end(req.rawBody);
        } else {
            req.pipe(busboy);
        }
    }
    catch(err){
        logger.log(`Uploaded rate sheet processing failed => ${err}`)
        return res.status(500).send({message: 'Something went wrong processing your request'})
    }
})
