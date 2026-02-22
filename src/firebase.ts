// src/firebase.ts
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, OAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore"; // <-- НОВОЕ: Импортируем Firestore

// Твои настройки Firebase
const firebaseConfig = {
  apiKey: "AIzaSyAfOYxIXhoVfcqxpo7d0gr2HXxi__-8C4g",
  authDomain: "ielts-master-1351e.firebaseapp.com",
  projectId: "ielts-master-1351e",
  storageBucket: "ielts-master-1351e.firebasestorage.app",
  messagingSenderId: "1042261502500",
  appId: "1:1042261502500:web:ebb5c0147d0a85073c06b1",
  measurementId: "G-EQ1HS49BF7"
};

// Инициализируем приложение
const app = initializeApp(firebaseConfig);

// Экспортируем инструменты для входа
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const appleProvider = new OAuthProvider('apple.com');

// <-- НОВОЕ: Экспортируем базу данных, чтобы App.tsx мог в неё писать
export const db = getFirestore(app);