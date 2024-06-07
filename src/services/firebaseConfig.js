// src/services/firebaseConfig.js
// This file contains the Firebase configuration and exports the app, db, and auth objects.

import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAqdKkeGNt4sTSCPMh4JKLOcfplM0Us3HY",
  authDomain: "monstermayhem-b03f8.firebaseapp.com",
  projectId: "monstermayhem-b03f8",
  storageBucket: "monstermayhem-b03f8.appspot.com",
  messagingSenderId: "776677356698",
  appId: "1:776677356698:web:7b010f0b1f8a2b71a69b23"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { app, db, auth};