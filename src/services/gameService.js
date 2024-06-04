// src/services/gameService.js
// This file will contain the logic to create a new game in the database. 
// We will use the addDoc function from the firebase/firestore module to add a new document to the games collection. 
// The createGame function will return the ID of the newly created game.

import { db } from './firebaseConfig';
import { collection, addDoc } from 'firebase/firestore';

export const createGame = async () => {
  try {
    const docRef = await addDoc(collection(db, 'games'), {
      gameId: 'unique_game_id', // Generate a unique game ID
      players: [],
      state: {}, // Initialize game state
      turn: ''
    });
    console.log('Game created with ID: ', docRef.id);
    return docRef.id;
  } catch (e) {
    console.error('Error adding document: ', e);
    throw e;
  }
};
