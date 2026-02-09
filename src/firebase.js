import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
    apiKey: "AIzaSyBPrbBtv36t1C4AERSNUP9TZ1MCqm3AwZ4",
    authDomain: "allergytable-278cb.firebaseapp.com",
    projectId: "allergytable-278cb",
    storageBucket: "allergytable-278cb.firebasestorage.app",
    messagingSenderId: "774850419649",
    appId: "1:774850419649:web:df75e2bca75e5e0b122d40",
    measurementId: "G-6LL978EJ24"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

import { getFirestore } from "firebase/firestore";

// ... existing code ...

// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(app);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

export { auth, db, googleProvider, analytics };
