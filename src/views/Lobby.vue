<!-- src/views/Lobby.vue -->
<!-- This is the lobby page where players can see the host and other players in the lobby. -->
<!-- The host can start the game from this page. -->

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
      <p>Share this link with your friends: <a :href="lobbyLink">{{ lobbyLink }}</a></p>
      <button @click="copyLobbyLink">Copy Lobby Link</button>
    </div>
    <div v-else>
      <p>Loading lobby...</p>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { db } from '../services/firebaseConfig';
import { doc, getDoc, updateDoc, arrayUnion } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

export default {
  name: 'Lobby',
  setup() {
    const route = useRoute();
    const auth = getAuth();
    const lobbyId = route.params.id;
    const lobby = ref(null);
    const isHost = ref(false);
    const lobbyLink = ref('');

    const loadLobby = async () => {
      const lobbyRef = doc(db, 'lobbies', lobbyId);
      const lobbySnap = await getDoc(lobbyRef);

      if (lobbySnap.exists()) {
        lobby.value = lobbySnap.data();
        lobbyLink.value = `${window.location.origin}/lobby/${lobbyId}`;

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
      // Implement game start logic here
    };

    const copyLobbyLink = () => {
      navigator.clipboard.writeText(lobbyLink.value)
        .then(() => {
          alert('Lobby link copied to clipboard');
        })
        .catch(err => {
          console.error('Failed to copy lobby link: ', err);
        });
    };

    onMounted(() => {
      loadLobby();
    });

    return {
      lobby,
      isHost,
      startGame,
      lobbyLink,
      copyLobbyLink
    };
  }
};
</script>

<style scoped>
/* Styles for the lobby page */
</style>