import { initializeApp } from "firebase/app";
import { getFirestore, FieldValue } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: 'AIzaSyAAIDo4V50W0mnNAWxJkBe5TiWkRviuOT8',
    authDomain: 'instagram-b16fe.firebaseapp.com',
    projectId: 'instagram-b16fe',
    storageBucket: 'instagram-b16fe.appspot.com',
    messagingSenderId: '106465031125',
    appId: '1:106465031125:web:370be120c646909320835c'
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth();


export { db, FieldValue, auth };