const { initializeApp } = require("firebase/app");
const { getAuth } = require("firebase/auth");

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyA1Zr6w-R-sunuAoMHV0IKkq8FSUYqsQF8",
    authDomain: "signup-47e8b.firebaseapp.com",
    projectId: "signup-47e8b",
    storageBucket: "signup-47e8b.firebasestorage.app",
    messagingSenderId: "534020058909",
    appId: "1:534020058909:web:d021e2f2c814868b97fbf4",
    measurementId: "G-QDNWDNKH7Y"
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);

// Export Auth instance
const auth = getAuth(firebaseApp);

module.exports = { auth };
