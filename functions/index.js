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
const chromium = require('chromium')
const { v4: uuidv4 } = require('uuid')

admin.initializeApp()
const bucket = admin.storage().bucket()

const configMap = {
    baseViewPackageUrl: 'https://stayeasy-7ac2c.web.app/package/{packageCode}/pdf',
    networkPageWaitUntil: 'domcontentloaded',
    basePdfFileName: 'pkg-{packageCode}.pdf',
    bucketDirName: 'package-pdfs',
    bucketPublicBaseUrl: 'https://firebasestorage.googleapis.com/v0/b/{bucketName}/o/{fileName}?alt=media&token={downloadToken}',
    generatePackagePdfMaxMemoryAllocated: '1GiB'
}

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
                    await page.waitForSelector('#packagePdfContainer', {visible: true})

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
