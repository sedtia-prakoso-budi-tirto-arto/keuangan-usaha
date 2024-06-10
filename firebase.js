// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
//import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAhdpB_Bgc9UyMaOb4flwEVyU25Sx2a3g8",
  authDomain: "pancong-b0552.firebaseapp.com",
  projectId: "pancong-b0552",
  storageBucket: "pancong-b0552.appspot.com",
  messagingSenderId: "59373731016",
  appId: "1:59373731016:web:a17565a93682f3f65139fd",
  measurementId: "G-MVR3ZP570V"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

//firebase.initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
//const analytics = getAnalytics(app);

