import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
    apiKey: "AIzaSyD4n4HB-WuevLUYyBsNCXOvwnR4zSJiFrI",
    authDomain: "lab04-advtopics.firebaseapp.com",
    databaseURL: "https://lab04-advtopics-default-rtdb.firebaseio.com",
    projectId: "lab04-advtopics",
    storageBucket: "lab04-advtopics.firebasestorage.app",
    messagingSenderId: "317114471112",
    appId: "1:317114471112:web:56804f8c584907f6640bfd"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getDatabase(app);
