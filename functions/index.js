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

admin.initializeApp()
const bucket = admin.storage().bucket()

const configMap = {
    baseViewPackageUrl: 'https://stayeasy-7ac2c.web.app/package/{packageCode}/pdf',
    networkPageWaitUntil: 'networkidle2',
    basePdfFileName: 'pkg-{packageCode}.pdf',
    bucketDirName: 'package-pdfs',
    bucketPublicBaseUrl: 'https://storage.googleapis.com/{bucketName}/package-pdfs/{pdfFileName}'
}

exports.generatePackagePdf = onDocumentCreated(
    "/packages/{packId}",
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
                '--use-mock-keychain']
        }).then(async (browser) => {
            return browser.newPage().then(async (page) => {

                // dummy page = `https://stayeasy-7ac2c.web.app/package/LYAaU5n1zgDaDUaDHPX1U/pdf`

                return page.goto(configMap.baseViewPackageUrl.replace('{packageCode}', event.params.packId),
                    {waitUntil: configMap.networkPageWaitUntil}).then(async () => {

                    const pdfFileName = configMap.basePdfFileName.replace('{packageCode}', event.params.packId)
                    return page.pdf({path: pdfFileName, printBackground: true}).then(async () => {
                        return browser.close().then(async () => {

                            // todo: take care of file security rules for files in firebase bucket

                            return bucket.upload(pdfFileName, {
                                destination: `${configMap.bucketDirName}/${pdfFileName}`,
                            }).then(async () => {
                                const publicUrl = configMap.bucketPublicBaseUrl.replace('{bucketName}',
                                    bucket.name).replace('{pdfFileName}', pdfFileName)

                                // example url -> https://storage.googleapis.com/stayeasy-7ac2c.appspot.com/package-pdfs/pkg-lz0hzMb3a3wAme4vQlEH.pdf

                                logger.log("File Download Link:", publicUrl);
                            })
                        })
                    })
                })
            })
        })

    }
)
