<!-- src/views/Lobby.vue -->
<template>
  <div>
    <h1>Lobby</h1>
    <div v-if="lobby">
      <p>Host: {{ lobby.host }}</p>
      <p>Players:</p>
      <ul>
        <li v-for="player in lobby.players" :key="player">{{ player }}</li>
      </ul>
      <button v-if="isHost" @click="startGame">Start Game</button>
    </div>
    <div v-else>
      <p>Loading lobby...</p>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { db } from '../services/firebaseConfig';
import { doc, getDoc, updateDoc, arrayUnion, collection, addDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

export default {
  name: 'Lobby',
  setup() {
    const route = useRoute();
    const router = useRouter();
    const auth = getAuth();
    const lobbyId = route.params.id;
    const lobby = ref(null);
    const isHost = ref(false);

    // Function to load the lobby data
    const loadLobby = async () => {
      try {
        const lobbyRef = doc(db, 'lobbies', lobbyId);
        const lobbySnap = await getDoc(lobbyRef);

        if (lobbySnap.exists()) {
          lobby.value = lobbySnap.data();

          // Check if the current user is the host
          isHost.value = auth.currentUser.uid === lobby.value.host;

          // Add the current player to the lobby if not already added
          if (!lobby.value.players.includes(auth.currentUser.uid)) {
            await updateDoc(lobbyRef, {
              players: arrayUnion(auth.currentUser.uid)
            });
            lobby.value.players.push(auth.currentUser.uid);
          }
        } else {
          console.error('Lobby does not exist');
        }
      } catch (error) {
        console.error('Failed to load lobby:', error);
      }
    };

    // Function to start the game
    const startGame = async () => {
      try {
        const gameRef = await addDoc(collection(db, 'games'), {
          host: lobby.value.host,
          players: lobby.value.players,
          state: {}, // Initial game state
          turn: lobby.value.players[0]
        });

        const lobbyRef = doc(db, 'lobbies', lobbyId);
        await updateDoc(lobbyRef, {
          status: 'in-game',
          gameId: gameRef.id
        });

        router.push(`/game/${gameRef.id}`);
      } catch (error) {
        console.error('Failed to start game:', error);
      }
    };

    // Load lobby data when the component is mounted
    onMounted(() => {
      loadLobby();
    });

    return {
      lobby,
      isHost,
      startGame
    };
  }
};
</script>

<style scoped>
/* Styles for the lobby page */
</style>