<!-- src/views/Lobby.vue-->
<!--This is the Lobby page where players can see the lobby details, players, and start the game.-->

<template>
  <div class="lobby">
    <h1>Lobby</h1>
    <div v-if="lobby">
      <p>Host: {{ hostNickname }}</p>
      <p>Players:</p>
      <ul>
        <li v-for="(player, index) in playerNicknames" :key="index">
          {{ player }}
        </li>
      </ul>
      <p v-if="lobby.players.length < 4">Waiting for more players to join...</p>
      <p v-else>Ready to start the game!</p>
      <button v-if="showStartButton" @click="startGame">Start Game</button>
      <button @click="copyLobbyLink">Copy Lobby Code</button>
    </div>
    <div v-else>
      <p>Loading lobby...</p>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, onBeforeUnmount } from "vue";
import { useRoute, useRouter } from "vue-router";
import { db } from "../services/firebaseConfig";
import {
  doc,
  onSnapshot,
  arrayUnion,
  updateDoc,
  deleteDoc,
  addDoc,
  collection,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { updateLobby, getUserNicknameById } from "../services/firebaseService";

export default {
  name: "Lobby",
  setup() {
    const route = useRoute();
    const router = useRouter();
    const auth = getAuth();
    const lobbyId = route.params.id;
    const lobby = ref(null);
    const isHost = ref(false);
    const hostNickname = ref("");
    const playerNicknames = ref([]);
    const showStartButton = ref(false);

    const startGame = async () => {
      try {
        const gameRef = await addDoc(collection(db, "games"), {
          host: lobby.value.host,
          players: lobby.value.players,
          state: {}, // Initial game state
          turn: lobby.value.players[0],
        });

        await updateLobby(lobbyId, {
          status: "in-game",
          gameId: gameRef.id,
        });

        // Direct all players to the game page
        lobby.value.players.forEach(async (playerId) => {
          const playerRef = doc(db, "users", playerId);
          await updateDoc(playerRef, {
            currentGame: gameRef.id,
          });
        });

        // Ensure the host is redirected to the game page
        setTimeout(() => {
          router.push(`/game/${gameRef.id}`);
        }, 1000); // Add a slight delay to ensure all updates are propagated
      } catch (error) {
        console.error("Error starting game:", error);
      }
    };

    const copyLobbyLink = () => {
      const link = lobbyId;
      navigator.clipboard.writeText(link).then(() => {
        alert("Lobby link copied to clipboard");
      });
    };

    const handleBeforeUnload = (event) => {
      if (isHost.value) {
        event.preventDefault();
        event.returnValue = "";
      }
    };

    const handleLeaveLobby = async () => {
      if (isHost.value) {
        if (
          confirm(
            "If you leave, the lobby will be deleted. Do you want to proceed?"
          )
        ) {
          await deleteDoc(doc(db, "lobbies", lobbyId));
          router.push("/multiplayer-options");
        }
      } else {
        router.push("/multiplayer-options");
      }
    };

    onMounted(() => {
      const lobbyRef = doc(db, "lobbies", lobbyId);
      onSnapshot(lobbyRef, async (doc) => {
        if (doc.exists()) {
          lobby.value = doc.data();

          // Redirects to the game page if the game has already started
          if (lobby.value.status === "in-game" && lobby.value.gameId) {
            router.push(`/game/${lobby.value.gameId}`);
          }

          // Check if the current user is the host
          isHost.value = auth.currentUser.uid === lobby.value.host;

          // Fetch nicknames for the host and players
          hostNickname.value = await getUserNicknameById(lobby.value.host);
          playerNicknames.value = await Promise.all(
            lobby.value.players.map((playerId) => getUserNicknameById(playerId))
          );

          // Add the current player to the lobby if not already added
          if (!lobby.value.players.includes(auth.currentUser.uid)) {
            await updateLobby(lobbyId, {
              players: arrayUnion(auth.currentUser.uid),
            });
          }

          // Check if ready to start the game
          showStartButton.value = isHost.value && lobby.value.players.length === 4;
        } else {
          alert("Lobby does not exist anymore.");
          router.push("/multiplayer-options");
        }
      });
    });

    onBeforeUnmount(() => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    });

    return {
      lobby,
      isHost,
      hostNickname,
      playerNicknames,
      showStartButton,
      startGame,
      copyLobbyLink,
      handleLeaveLobby,
    };
  },
  beforeRouteLeave(to, from, next) {
    const auth = getAuth();
    const isHost = auth.currentUser && auth.currentUser.uid === this.lobby.host;

    if (isHost && to.name !== "Game") {
      if (
        confirm(
          "If you leave, the lobby will be deleted. Do you want to proceed?"
        )
      ) {
        deleteDoc(doc(db, "lobbies", this.$route.params.id)).then(() => {
          next();
        });
      } else {
        next(false);
      }
    } else {
      next();
    }
  },
};
</script>
