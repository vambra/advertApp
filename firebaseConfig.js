import * as firebase from 'firebase/app';
import { initializeApp } from 'firebase/app';
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";



const firebaseConfig = {
    apiKey: "AIzaSyCbuY-ZI8nHYyMOTJp3xH1eVxx-K--abhU",
    authDomain: "advertapp-53745.firebaseapp.com",
    projectId: "advertapp-53745",
    storageBucket: "advertapp-53745.appspot.com",
    messagingSenderId: "81797364912",
    appId: "1:81797364912:web:f57c0cdc380b941e0e0f75"
  };


const app = initializeApp(firebaseConfig)
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);
//const PostsRef = db.collection("posts")

export { auth , db, storage };
