import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-storage.js";

// Note: In a production environment, use environment variables for these.
const firebaseConfig = {
    apiKey: "AIzaSyCm5N8NWBxBkqK55Wq0B-vakWkY0n2E2u4",
    authDomain: "sras-chat.firebaseapp.com",
    databaseURL: "https://sras-chat-default-rtdb.firebaseio.com",
    projectId: "sras-chat",
    storageBucket: "sras-chat.appspot.com", // Fixed format for Storage Bucket
    messagingSenderId: "364225075541",
    appId: "1:364225075541:web:84a97485ecb4fa8c60f7dc"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getDatabase(app);
export const storage = getStorage(app);