// firebaseConfig.js
import { initializeApp } from 'firebase/app'
import { getAnalytics } from 'firebase/analytics'
import { getFirestore } from 'firebase/firestore'
import { getAuth } from 'firebase/auth' // Use getAuth to get the auth instance

// Your web app's Firebase configuration
// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: 'AIzaSyBG9en6_FBgmO9ZjV3Z8eos-oMtMwUneJE',
    authDomain: 'manajemen-organisasi-mahasiswa.firebaseapp.com',
    projectId: 'manajemen-organisasi-mahasiswa',
    storageBucket: 'manajemen-organisasi-mahasiswa.firebasestorage.app',
    messagingSenderId: '122932549726',
    appId: '1:122932549726:web:4b7ed902f50b58f30a7ccf',
    measurementId: 'G-HSTJ4RHJNK'
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)

// Initialize Firestore and Authentication
export const db = getFirestore(app) // Firestore instance
export const auth = getAuth(app) // Correctly using getAuth() to get the auth instance

// Initialize Analytics (only if running in the browser environment)
let analytics
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'production') {
    analytics = getAnalytics(app)
}
