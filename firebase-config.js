// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDlDVpjDBQH3-VfNaG4NY0ZiyPKWBcac4Y",
  authDomain: "spizor-website.firebaseapp.com",
  projectId: "spizor-website",
  storageBucket: "spizor-website.firebasestorage.app",
  messagingSenderId: "327411463627",
  appId: "1:327411463627:web:519a17f4c7f247a405324e",
};
// Firebase Initialization
const app = firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();
const storage = firebase.storage();
