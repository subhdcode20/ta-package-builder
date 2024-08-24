/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */
import puppeteer from 'puppeteer';

// const {onRequest} = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");
// const {
//     setDoc,
//     addDoc,
//     collection,
//     query,
//     where,
//     getDocs,
//     arrayUnion
//   } = require("firebase-admin/firestore");
const {
  onDocumentCreated,
  // onDocumentUpdated,
} = require("firebase-functions/v2/firestore");
const admin = require("firebase-admin");

admin.initializeApp();
// const db = admin.firestore();


exports.generatePackagePdf = onDocumentCreated(
  "/packages/{packId}",
  async (event) => {
    if (!event.params.packId) return null;
    if (!event.data) {
          logger.log("No data associated with the event");
          return;
      }
      const packData = event.data.data();
      logger.log("pack data found ", packData);
      const browser = await puppeteer.launch();
      const page = await browser.newPage();
      await page.goto('https://news.ycombinator.com', {
          waitUntil: 'networkidle2',
      });
      // Saves the PDF to hn.pdf.
      let pdfData = await page.pdf({
          path: 'test.pdf',
      });
      logger.log("pdf data ", pdfData);
      await browser.close();
  }
)
// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

// exports.helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

