// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBG9en6_FBgmO9ZjV3Z8eos-oMtMwUneJE",
  authDomain: "manajemen-organisasi-mahasiswa.firebaseapp.com",
  projectId: "manajemen-organisasi-mahasiswa",
  storageBucket: "manajemen-organisasi-mahasiswa.firebasestorage.app",
  messagingSenderId: "122932549726",
  appId: "1:122932549726:web:4b7ed902f50b58f30a7ccf",
  measurementId: "G-HSTJ4RHJNK"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app)

// Initialize Analytics
let analytics;
if (typeof window !== "undefined") {
  analytics = getAnalytics(app);
}

// Initialize Firestore
const firestore = getFirestore(app);

// Initialize Authentication
const auth = getAuth(app);
