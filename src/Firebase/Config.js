import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
   apiKey: "AIzaSyDza8mNtwxKJxkdPySxHGqslgjyFAVqMLI",
   authDomain: "blog-manager-f2618.firebaseapp.com",
   projectId: "blog-manager-f2618",
   storageBucket: "blog-manager-f2618.appspot.com",
   messagingSenderId: "946862637293",
   appId: "1:946862637293:web:70401b099e6efa9143cce4"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);