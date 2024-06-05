<!-- src/views/MultiPlayerGamePlay.vue -->
<!-- This is the multiplayer game play page where players can play the game. -->
<!-- The game state is updated in real-time using Firebase Firestore. -->

<template>
    <div>
      <h1>Game</h1>
      <div v-if="game">
        <p>Turn: {{ currentPlayer }}</p>
        <GameBoard :state="game.state" @move="makeMove" />
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
  import { doc, getDoc, updateDoc } from 'firebase/firestore';
  import { getAuth } from 'firebase/auth';
  import GameBoard from './GameBoard.vue';
  
  export default {
    name: 'MultiPlayerGamePlay',
    components: {
      GameBoard
    },
    setup() {
      const route = useRoute();
      const auth = getAuth();
      const gameId = route.params.id;
      const game = ref(null);
      const currentPlayer = ref('');
  
      const loadGame = async () => {
        const gameRef = doc(db, 'games', gameId);
        const gameSnap = await getDoc(gameRef);
  
        if (gameSnap.exists()) {
          game.value = gameSnap.data();
          currentPlayer.value = auth.currentUser.uid;
        }
      };
  
      const makeMove = async (move) => {
        if (game.value.turn !== currentPlayer.value) {
          alert('Not your turn!');
          return;
        }
  
        // Update game state with the move
        const newState = { ...game.value.state, ...move };
        const nextTurn = game.value.players[(game.value.players.indexOf(currentPlayer.value) + 1) % game.value.players.length];
  
        const gameRef = doc(db, 'games', gameId);
        await updateDoc(gameRef, {
          state: newState,
          turn: nextTurn
        });
  
        game.value.state = newState;
        game.value.turn = nextTurn;
      };
  
      onMounted(() => {
        loadGame();
      });
  
      return {
        game,
        currentPlayer,
        makeMove
      };
    }
  };
  </script>
  
  <style scoped>
  /* Styles for the game page */
  </style>
  