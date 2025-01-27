// Import the functions you need from the SDKs you need
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { initializeApp } from '@react-native-firebase/app';
import { getStorage } from '@react-native-firebase/storage';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCTEmocsaMFz-aYc_R-h_2Op0oEt84I68Q",
  authDomain: "test-app-5c40f.firebaseapp.com",
  projectId: "test-app-5c40f",
  storageBucket: "test-app-5c40f.firebasestorage.app",
  messagingSenderId: "640351118069",
  appId: "1:640351118069:web:47787320016e9cbfd05bbc"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// Get Firestore instance
const db = firestore();
const storage = getStorage(app);

export { auth, db , storage};
