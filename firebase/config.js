// firebase/config.js
import { initializeApp } from "firebase/app";
import {
    getAuth,
    initializeAuth,
    getReactNativePersistence
} from "firebase/auth";
import { getDatabase }   from "firebase/database";
import { Platform }      from "react-native";
import AsyncStorage      from "@react-native-async-storage/async-storage";

const firebaseConfig = {
    apiKey:             "AIzaSyAEVU-ffSvzsGw9C5TBRmq2lXhmnm9NuPQ",
    authDomain:         "fir-cb338.firebaseapp.com",
    databaseURL:        "https://fir-cb338-default-rtdb.firebaseio.com",
    projectId:          "fir-cb338",
    storageBucket:      "fir-cb338.firebasestorage.app",
    messagingSenderId:  "324463671269",
    appId:               "1:324463671269:web:a6e8563d662ea3d807210c",
    measurementId:      "G-9FS71HR6VP"
};

// Inicializa Firebase
const app        = initializeApp(firebaseConfig);
const db          = getDatabase(app);

// Auth distinto para web y móvil
const auth = Platform.OS === 'web'
  ? getAuth(app)                                      
  : initializeAuth(app, {                             
    persistence: getReactNativePersistence(AsyncStorage),
    });

export { db, auth };
