
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";



// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCNVFVSLmDKIkZ00WOoclLZUEEmFibMTTE",
  authDomain: "quiz-app-f0a20.firebaseapp.com",
  projectId: "quiz-app-f0a20",
  storageBucket: "quiz-app-f0a20.firebasestorage.app",
  messagingSenderId: "282995442169",
  appId: "1:282995442169:web:3f01b664e856a90dea3d28",
};
// const firebaseConfig = {
//   apiKey: import.meta.env.VITE_apiKey,
//   authDomain: import.meta.env.VITE_authDomain,
//   projectId: import.meta.env.VITE_projectId,
//   storageBucket: import.meta.env.VITE_storageBucket,
//   messagingSenderId: import.meta.env.VITE_messagingSenderId,
//   appId: import.meta.env.VITE_appId,
// };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);