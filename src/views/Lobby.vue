<!-- src/views/Lobby.vue -->
<!-- This is the lobby page where players can see the host and other players in the lobby. -->
<!-- The host can start the game from this page. -->

<template>
  <div class="lobby">
    <h1>Lobby</h1>
    <div v-if="lobby">
      <p>Host: {{ hostNickname }}</p>
      <p>Players:</p>
      <ul>
        <li v-for="(player, index) in playerNicknames" :key="index">{{ player }}</li>
      </ul>
      <p v-if="lobby.players.length < 4">Waiting for more players to join...</p>
      <p v-else>Ready to start the game!</p>
      <button v-if="isHost && lobby.players.length >= 4" @click="startGame">Start Game</button>
      <button @click="copyLobbyLink">Copy Lobby Code</button>
    </div>
    <div v-else>
      <p>Loading lobby...</p>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { db } from '../services/firebaseConfig';
import { doc, onSnapshot, arrayUnion, deleteDoc, addDoc, collection } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { updateLobby, getUserNicknameById } from '../services/firebaseService';

export default {
  name: 'Lobby',
  setup() {
    const route = useRoute();
    const router = useRouter();
    const auth = getAuth();
    const lobbyId = route.params.id;
    const lobby = ref(null);
    const isHost = ref(false);
    const hostNickname = ref('');
    const playerNicknames = ref([]);

    const loadLobby = async () => {
      const lobbyRef = doc(db, 'lobbies', lobbyId);
      onSnapshot(lobbyRef, async (doc) => {
        if (doc.exists()) {
          lobby.value = doc.data();

          // Check if the current user is the host
          isHost.value = auth.currentUser.uid === lobby.value.host;

          // Get host nickname
          hostNickname.value = await getUserNicknameById(lobby.value.host);

          // Get player nicknames
          playerNicknames.value = await Promise.all(lobby.value.players.map(async (playerId) => {
            return await getUserNicknameById(playerId);
          }));

          // Add the current player to the lobby if not already added
          if (!lobby.value.players.includes(auth.currentUser.uid)) {
            await updateLobby(lobbyId, {
              players: arrayUnion(auth.currentUser.uid)
            });
            lobby.value.players.push(auth.currentUser.uid);
            playerNicknames.value.push(await getUserNicknameById(auth.currentUser.uid));
          }
        } else {
          alert('Lobby does not exist anymore.');
          router.push('/multiplayer-options');
        }
      });
    };

    const startGame = async () => {
      const gameRef = await addDoc(collection(db, 'games'), {
        host: lobby.value.host,
        players: lobby.value.players,
        state: {}, // Initial game state
        turn: lobby.value.players[0]
      });

      await updateLobby(lobbyId, {
        status: 'in-game',
        gameId: gameRef.id
      });

      router.push(`/game/${gameRef.id}`);
    };

    const copyLobbyLink = () => {
      const link = lobbyId;
      navigator.clipboard.writeText(link).then(() => {
        alert('Lobby link copied to clipboard');
      });
    };

    const handleBeforeUnload = (event) => {
      if (isHost.value) {
        event.preventDefault();
        event.returnValue = '';
      }
    };

    const handleLeaveLobby = async () => {
      if (isHost.value) {
        if (confirm('If you leave, the lobby will be deleted and all players will be redirected. Do you want to proceed?')) {
          await deleteDoc(doc(db, 'lobbies', lobbyId));
          router.push('/multiplayer-options');
        }
      } else {
        router.push('/multiplayer-options');
      }
    };

    onMounted(() => {
      loadLobby();
      window.addEventListener('beforeunload', handleBeforeUnload);
    });

    onBeforeUnmount(() => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    });

    return {
      lobby,
      isHost,
      hostNickname,
      playerNicknames,
      startGame,
      copyLobbyLink,
      handleLeaveLobby
    };
  },
  beforeRouteLeave(to, from, next) {
    const auth = getAuth();
    const isHost = auth.currentUser && auth.currentUser.uid === this.lobby.host;

    if (isHost) {
      if (confirm('If you leave, the lobby will be deleted and all players will be redirected. Do you want to proceed?')) {
        deleteDoc(doc(db, 'lobbies', this.$route.params.id)).then(() => {
          next();
        });
      } else {
        next(false);
      }
    } else {
      next();
    }
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