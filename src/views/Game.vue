<!-- src/views/Game.vue -->
<!-- This is the page where the game logic will be implemented. -->

<template>
  <div class="game">
    <h1>Game</h1>
    <p>Game ID: {{ gameId }}</p>
    <!-- Game logic -->
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { db } from '../services/firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';

export default {
  name: 'Game',
  setup() {
    const route = useRoute();
    const gameId = ref(route.params.id);
    const gameData = ref(null);

    const loadGame = async () => {
      const gameRef = doc(db, 'games', gameId.value);
      const gameSnap = await getDoc(gameRef);
      if (gameSnap.exists()) {
        gameData.value = gameSnap.data();
      } else {
        console.error('No such game!');
      }
    };

    onMounted(() => {
      loadGame();
    });

    return {
      gameId,
      gameData
    };
  }
};
</script>

<style scoped>
/* Styles for the game page */
.game {
  text-align: center;
  margin-top: 50px;
}
.game h1 {
  font-size: 2.5em;
  margin-bottom: 20px;
}
.game p {
  font-size: 1.2em;
  margin-bottom: 20px;
}
</style>