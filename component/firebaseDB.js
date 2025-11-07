
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyB53LWsmEieu9WLYGRKPWxkY6rpgyYi4B8",
  authDomain: "sut-mobile-match.firebaseapp.com",
  projectId: "sut-mobile-match",
  storageBucket: "sut-mobile-match.firebasestorage.app",
  messagingSenderId: "1052749125062",
  appId: "1:1052749125062:web:bdc6626236cac2c9aa0ec7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };