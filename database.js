const firebase = require("firebase/app");

require('dotenv').config();
const firebaseConfig = {
    apiKey: "AIzaSyDr_W2TH9vNJG0XKANkfEkI0MZyxExMsug",
    authDomain: "iot-ssh.firebaseapp.com",
    projectId: "iot-ssh",
    storageBucket: "iot-ssh.appspot.com",
    messagingSenderId: "249538182307",
    appId: "1:249538182307:web:033c3123275da03128d316",
    measurementId: "G-KGBCC432RD"
};
const app = firebase.initializeApp(firebaseConfig);
var { getDatabase, ref, set } = require('firebase/database');

function writeSSH() {
    const db = getDatabase();
    set(ref(db, 'link/'), {
        ssh: process.env.SSH
    });
}

exports.database = writeSSH;