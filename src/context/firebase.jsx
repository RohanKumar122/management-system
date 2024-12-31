import { createContext, useContext, useState, useEffect } from "react";

import React from 'react';
import { initializeApp } from "firebase/app";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";
import { getFirestore, collection, addDoc, getDocs,updateDoc,deleteDoc } from "firebase/firestore";
// import { getMessaging } from "firebase/messaging";
import { doc} from "firebase/firestore";  // Add this import

// import { getStorage, ref, uploadBytes } from "firebase/storage";

const FirebaseContext = createContext(null);

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID,
};


export const useFirebase = () => useContext(FirebaseContext);

const firebaseApp = initializeApp(firebaseConfig);
const firebaseAuth = getAuth(firebaseApp);
const firestore = getFirestore(firebaseApp);
const googleProvider = new GoogleAuthProvider();
// const storage = getStorage(firebaseApp);
// const messaging = getMessaging(firebaseApp);

export const FirebaseProvider = (props) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(firebaseAuth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser); // Set user when logged in
      } else {
        setUser(null); // Set user to null when logged out
      }
    });

    return () => unsubscribe(); // Cleanup on unmount
  }, []);

  const setAdminPrivilege = async (uid, isAdmin) => {
    try {
      const userRef = doc(firestore, 'users', uid);
      await updateDoc(userRef, {
        isAdmin: isAdmin,
      });
      console.log(`User ${uid} is now ${isAdmin ? 'an admin' : 'a regular user'}`);
    } catch (error) {
      console.error('Error setting admin:', error);
    }
  };

  const listAllUsers = async () => {
    try {
      const querySnapshot = await getDocs(collection(firestore, "users")); // Assuming "users" is your Firestore collection
      const users = querySnapshot.docs.map(doc => ({
        uid: doc.id,
        ...doc.data(),
      }));
      return users;
    } catch (error) {
      console.error("Error fetching users:", error);
      throw error; // Propagate the error to be handled in the component
    }
  };
  
  const addUser = async (userData) => {
    try {
      const usersCollection = collection(firestore, "users");
      await addDoc(usersCollection, userData);
    } catch (error) {
      console.error("Error adding user:", error);
    }
  };

  // Delete a user
  const deleteUser = async (uid) => {
    try {
      const userDocRef = doc(firestore, "users", uid);
      await deleteDoc(userDocRef);
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  // Set a user as an admin
  const setUserAdmin = async (uid, isAdmin) => {
    try {
      const userDocRef = doc(firestore, "users", uid);
      await updateDoc(userDocRef, { isAdmin: isAdmin });
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };
  
  const signupUserWithEmailAndPassword = (email, password, isAdmin) =>
    createUserWithEmailAndPassword(firebaseAuth, email, password, isAdmin);

  const loginWithEmailAndPassword = (email, password, isAdmin) =>
    signInWithEmailAndPassword(firebaseAuth, email, password, isAdmin);

  const signinWithGoogle = () => signInWithPopup(firebaseAuth, googleProvider);

  const logout = async () => {
    try {
      await signOut(firebaseAuth);
      console.log("User logged out successfully");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const handleCreateNewListing = async (name, isbn, price) => {
    try {
      const docRef = await addDoc(collection(firestore, "books"), {
        name,
        isbn,
        price,
        userId: user.uid, // Use user ID for the current logged-in user
        userEmail: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
      });
      return { success: true, id: docRef.id };
    } catch (error) {
      console.error("Error creating new listing:", error);
      return { success: false, error: error.message }; // Return error details
    }
  };

  const listAllBooks = async () => {
    const querySnapshot = await getDocs(collection(firestore, "books"));
    return querySnapshot;
  };


  const isLoggedIn = user ? true : false;

  return (
    <FirebaseContext.Provider
      value={{
        user, // Expose user data in context
        signupUserWithEmailAndPassword,
        loginWithEmailAndPassword,
        signinWithGoogle,
        handleCreateNewListing,
        isLoggedIn,
        addUser,
        deleteUser,
        setUserAdmin,
        logout,
        listAllBooks,
        setAdminPrivilege,
        listAllUsers
      }}
    >
      {props.children}
    </FirebaseContext.Provider>
  );
};
