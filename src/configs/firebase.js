// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { GoogleAuthProvider } from "firebase/auth"; // TODO: Add SDKs for Firebase products that you want to use

// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAwcl2V1tg7rp6ogCC40wUyt8t3whx6NJ4",
  authDomain: "smoking-cessation-1bdb2.firebaseapp.com",
  projectId: "smoking-cessation-1bdb2",
  storageBucket: "smoking-cessation-1bdb2.firebasestorage.app",
  messagingSenderId: "672119636219",
  appId: "1:672119636219:web:954c3373e4bd9a99f0705e",
  measurementId: "G-FHL3H73LWZ",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const provider = new GoogleAuthProvider();

export { provider };
