// Import the functions you need from the SDKs you need
// import firebase from 'firebase/app';
import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";
import { getMessaging } from "firebase/messaging";
import { getAnalytics } from "firebase/analytics";
import { getStorage } from "firebase/storage";
import { getVertexAI, getGenerativeModel } from "firebase/vertexai-preview";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_CONFIG_APIKEY,
  authDomain: process.env.REACT_APP_FIREBASE_CONFIG_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_CONFIG_PROJECTID,
  storageBucket: process.env.REACT_APP_FIREBASE_CONFIG_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_CONFIG_MESSAGING_SENDERID,
  appId: process.env.REACT_APP_FIREBASE_CONFIG_APPID
};

// Initialize Firebase
const firebase = initializeApp(firebaseConfig);
const auth = getAuth(firebase);
const db = getFirestore(firebase);
// const messaging = getMessaging(firebase);
const analytics = getAnalytics(firebase);
const storage = getStorage(firebase);
// Initialize the Vertex AI service
const vertexAI = getVertexAI(firebase);
const gemini = getGenerativeModel(vertexAI, { model: "gemini-1.5-flash" });
// connectFirestoreEmulator(db, '127.0.0.1', 8080);
// firebase.
// let auth = firebase.auth();
export {
  firebase,
  auth,
  db,
  // messaging,
  analytics,
  storage,
  gemini
};
