import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth }         from 'firebase/auth';
import { getDatabase }     from 'firebase/database';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';


const firebaseConfig = {
    apiKey: "AIzaSyAEVU-ffSvzsGw9C5TBRmq2lXhmnm9NuPQ",
    authDomain: "fir-cb338.firebaseapp.com",
    databaseURL: "https://fir-cb338-default-rtdb.firebaseio.com",
    projectId: "fir-cb338",
    storageBucket: "fir-cb338.firebasestorage.app",
    messagingSenderId: "324463671269",
    appId: "1:324463671269:web:a6e8563d662ea3d807210c",
    measurementId: "G-9FS71HR6VP"
};

const app = initializeApp(firebaseConfig);
const dbFirestore = getFirestore(app);
const storage = getStorage(app);
const auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
});
const db   = getDatabase(app);



export{db, storage, auth, dbFirestore};