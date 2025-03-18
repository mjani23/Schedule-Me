import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";


const firebaseConfig = {
  apiKey: "AIzaSyDoYML7xLSHQyip871Y-V3DwATMRYH94Ak",
  authDomain: "schedule-me-e47de.firebaseapp.com",
  projectId: "schedule-me-e47de",
  storageBucket: "schedule-me-e47de.firebasestorage.app",
  messagingSenderId: "13969671487",
  appId: "1:13969671487:web:49d21572f79acb7cb2bf8a"
};


const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
