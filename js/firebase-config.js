// Firebase Configuration & Service Module (ESM CDN Compatible with GitHub Pages & Localhost)
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { getFirestore, doc, setDoc, getDoc, collection, addDoc, getDocs, onSnapshot } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { getAnalytics, isSupported } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-analytics.js";

// User's Firebase Configuration
export const firebaseConfig = {
  apiKey: "AIzaSyCoCH02SCTc_ors0S7BJMSsrGZNayp4g7k",
  authDomain: "tienganh-b5bdc.firebaseapp.com",
  projectId: "tienganh-b5bdc",
  storageBucket: "tienganh-b5bdc.firebasestorage.app",
  messagingSenderId: "200409903334",
  appId: "1:200409903334:web:11eec0c0657a338eb14b27",
  measurementId: "G-CHPQPTKY7W"
};

// Initialize Firebase App
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

// Initialize Analytics safely
export let analytics = null;
isSupported().then(supported => {
  if (supported) {
    analytics = getAnalytics(app);
    console.log("[Firebase] Analytics initialized successfully.");
  }
}).catch(err => {
  console.warn("[Firebase] Analytics not supported in current environment:", err.message);
});

// Firebase Cloud Sync Service for Users & Learning Progress
export const firebaseService = {
  async syncUserDataToCloud(userId, data) {
    if (!userId || !db) return false;
    try {
      const userRef = doc(db, "users_data", userId);
      await setDoc(userRef, {
        ...data,
        lastUpdated: new Date().toISOString()
      }, { merge: true });
      return true;
    } catch (err) {
      console.warn("[Firebase Cloud] Sync notice:", err.message);
      return false;
    }
  },

  async loadUserDataFromCloud(userId) {
    if (!userId || !db) return null;
    try {
      const userRef = doc(db, "users_data", userId);
      const snapshot = await getDoc(userRef);
      if (snapshot.exists()) {
        return snapshot.data();
      }
    } catch (err) {
      console.warn("[Firebase Cloud] Fetch notice:", err.message);
    }
    return null;
  }
};
