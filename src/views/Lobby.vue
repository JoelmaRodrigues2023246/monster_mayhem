<!-- src/views/Lobby.vue -->
<!-- This is the lobby page where players can see the host and other players in the lobby. -->
<!-- The host can start the game from this page. -->

<template>
  <div class="lobby">
    <h1>Lobby</h1>
    <div v-if="lobby">
      <p>Host: {{ lobby.host }}</p>
      <p>Players:</p>
      <ul>
        <li v-for="player in lobby.players" :key="player">{{ player }}</li>
      </ul>
      <p v-if="lobby.players.length < 4">Waiting for more players to join...</p>
      <p v-else>Ready to start the game!</p>
      <button v-if="isHost && lobby.players.length >= 4" @click="startGame">Start Game</button>
      <button @click="copyLobbyLink">Copy Lobby Link</button>
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

    const loadLobby = async () => {
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
      }
    };

    const startGame = async () => {
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
    };

    const copyLobbyLink = () => {
      const link = `${window.location.origin}/lobby/${lobbyId}`;
      navigator.clipboard.writeText(link).then(() => {
        alert('Lobby link copied to clipboard');
      });
    };

    onMounted(() => {
      loadLobby();
    });

    return {
      lobby,
      isHost,
      startGame,
      copyLobbyLink
    };
  }
};
</script>

<style scoped>
/* Styles for the lobby page */
.lobby {
  text-align: center;
  margin-top: 50px;
}
.lobby h1 {
  font-size: 2.5em;
  margin-bottom: 20px;
}
.lobby p {
  font-size: 1.2em;
  margin-bottom: 20px;
}
.lobby ul {
  list-style-type: none;
  padding: 0;
}
.lobby li {
  font-size: 1em;
  margin: 10px 0;
}
.lobby button {
  margin: 10px;
  padding: 10px 20px;
  font-size: 1em;
  cursor: pointer;
}
</style>