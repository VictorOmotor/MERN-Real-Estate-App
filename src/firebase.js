// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "platinum-real-estate-840c0.firebaseapp.com",
  projectId: "platinum-real-estate-840c0",
  storageBucket: "platinum-real-estate-840c0.appspot.com",
  messagingSenderId: "93200884368",
  appId: "1:93200884368:web:62632bccd6038444fc6e15"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);