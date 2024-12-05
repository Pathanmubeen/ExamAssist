import { auth } from "../config/firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";

import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";


const googleProvider = new GoogleAuthProvider();

export const handleGoogleSignIn = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    return user;
  } catch (error) {
    throw new Error(error.message);
  }
};

export async function handleRegister(email, password) {
  return new Promise(async (resolve, reject) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      resolve(userCredential.user);
    } catch (error) {
      throw reject({ message: error.message });
    }
  });
}

export async function handleLogin(email, password) {
  return new Promise(async (resolve, reject) => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      resolve(userCredential.user);
    } catch (error) {
      console.error(error);
      throw reject({ message: error.message });
    }
  });
}
