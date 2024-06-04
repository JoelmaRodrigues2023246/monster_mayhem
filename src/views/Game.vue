<!-- src/views/Game.vue -->
<template>
    <div>
      <h1>Game</h1>
      <div v-if="game">
        <p>Current Turn: {{ game.turn }}</p>
        <p>Game State: {{ game.state }}</p>
        <!-- Render the game board or other game elements based on game.state -->
      </div>
      <div v-else>
        <p>Loading game...</p>
      </div>
    </div>
  </template>
  
  <script>
  import { ref, onMounted } from 'vue';
  import { useRoute } from 'vue-router';
  import { db } from '../services/firebaseConfig';
  import { doc, getDoc, onSnapshot, updateDoc } from 'firebase/firestore';
  import { getAuth } from 'firebase/auth';
  
  export default {
    name: 'Game',
    setup() {
      const route = useRoute();
      const auth = getAuth();
      const gameId = route.params.id;
      const game = ref(null);
  
      const loadGame = async () => {
        const gameRef = doc(db, 'games', gameId);
        const gameSnap = await getDoc(gameRef);
  
        if (gameSnap.exists()) {
          game.value = gameSnap.data();
  
          // Listen for real-time updates to the game document
          onSnapshot(gameRef, (doc) => {
            game.value = doc.data();
          });
        } else {
          alert('Game not found');
        }
      };
  
      const makeMove = async (newState) => {
        if (auth.currentUser.uid === game.value.turn) {
          const gameRef = doc(db, 'games', gameId);
          await updateDoc(gameRef, {
            state: newState,
            turn: getNextPlayer(game.value.players, game.value.turn)
          });
        } else {
          alert('It is not your turn');
        }
      };
  
      const getNextPlayer = (players, currentTurn) => {
        const currentIndex = players.indexOf(currentTurn);
        return players[(currentIndex + 1) % players.length];
      };
  
      onMounted(() => {
        loadGame();
      });
  
      return {
        game,
        makeMove
      };
    }
  };
  </script>
  
  <style scoped>
  /* Styles for the game page */
  </style>
  