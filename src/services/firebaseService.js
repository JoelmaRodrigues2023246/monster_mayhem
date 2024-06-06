// src/services/firebaseService.js
// Firebase service functions

import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { db } from './firebaseConfig';
import { collection, addDoc, doc, updateDoc, arrayUnion, getDoc } from 'firebase/firestore';

// Function to create a lobby
export const createLobby = async () => {
  const auth = getAuth();
  const user = auth.currentUser;

  if (!user) { // Check if the user is authenticated
    alert('User is not authenticated!'); // Alert the user if they are not authenticated
    return;
  }

  try { // Try to create a lobby
    const lobbyRef = await addDoc(collection(db, 'lobbies'), {
      host: user.uid,
      players: [user.uid],
      status: 'waiting'
    });
    console.log('Lobby created with ID: ', lobbyRef.id);
    return lobbyRef.id;
  } catch (error) {
    console.error('Failed to create lobby: ', error);
  }
};

// Function to join an existing lobby
export const joinLobby = async (lobbyId) => {
  const auth = getAuth();
  const user = auth.currentUser;

  if (!user) {
    alert('User is not authenticated!');
    return;
  }

  try {
    const lobbyRef = doc(db, 'lobbies', lobbyId);
    const lobbySnap = await getDoc(lobbyRef);

    if (!lobbySnap.exists()) {
      throw new Error('Lobby does not exist');
    }

    await updateDoc(lobbyRef, {
      players: arrayUnion(user.uid)
    });

    console.log('Joined lobby with ID: ', lobbyId);
  } catch (error) {
    console.error('Failed to join lobby: ', error);
  }
};

// Function to get user nickname by ID
export const getUserNicknameById = async (userId) => {
  try {
    const userRef = doc(db, 'users', userId);
    const userSnap = await getDoc(userRef);
    if (userSnap.exists()) {
      return userSnap.data().nickname;
    } else {
      console.error('No such user!');
      return null;
    }
  } catch (error) {
    console.error('Error fetching user nickname:', error);
    return null;
  }
};

// Function to check if the user is authenticated
export const checkAuth = () => {
  return new Promise((resolve, reject) => {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        resolve(user);
      } else {
        reject('User is not authenticated');
      }
    });
  });
};