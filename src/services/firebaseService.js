// src/services/firebaseService.js
// Firebase service functions

import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { db } from './firebaseConfig';
import { collection, addDoc, doc, updateDoc, arrayUnion, getDoc, deleteDoc } from 'firebase/firestore';

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

// Function to update the lobby
export const updateLobby = async (lobbyId, data) => {
  try {
    const lobbyRef = doc(db, 'lobbies', lobbyId);
    await updateDoc(lobbyRef, data);
  } catch (error) {
    console.error('Failed to update lobby: ', error);
  }
};

// Function to save the game state
export const saveGameState = async (gameId, gameState) => {
  try {
    const gameRef = doc(db, 'games', gameId);
    await updateDoc(gameRef, gameState);
    console.log('Game state saved successfully.');
  } catch (error) {
    console.error('Error saving game state:', error);
  }
};

// Function to load the game state
export const loadGameState = async (gameId) => {
  try {
    const gameRef = doc(db, 'games', gameId);
    const gameSnap = await getDoc(gameRef);
    if (gameSnap.exists()) {
      return gameSnap.data();
    } else {
      console.error('No such game state!');
      return null;
    }
  } catch (error) {
    console.error('Error loading game state:', error);
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

// Function to delete the lobby
export const deleteLobby = async (lobbyId) => {
  try {
    const lobbyRef = doc(db, 'lobbies', lobbyId);
    await deleteDoc(lobbyRef);
    console.log('Lobby deleted successfully.');
  } catch (error) {
    console.error('Error deleting lobby:', error);
  }
};