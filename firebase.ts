import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD5iEZtXJgjSNdJOQtvONQJ8i3xPvmswz4",
  authDomain: "bizflow-986z1.firebaseapp.com",
  // NOTE: I've added your databaseURL here
  databaseURL: "https://bizflow-986z1-default-rtdb.firebaseio.com",
  projectId: "bizflow-986z1",
  storageBucket: "bizflow-986z1.firebasestorage.app",
  messagingSenderId: "420013413677",
  appId: "1:420013413677:web:98be1aa159ab09fb61efa4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Realtime Database and get a reference to the service
export const db = getDatabase(app);