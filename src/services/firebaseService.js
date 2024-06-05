// src/services/firebaseService.js
// Firebase service functions

import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { db } from './firebaseConfig';
import { collection, addDoc } from 'firebase/firestore';

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