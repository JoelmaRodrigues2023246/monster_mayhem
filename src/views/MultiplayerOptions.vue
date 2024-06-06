<!--  src/views/MultiplayerOptions.vue -->
<!-- This is the page where players can choose between creating a new multiplayer lobby or joining an existing one. -->
 
<template>
  <div class="multiplayer-options">
    <h1>Choose an option:</h1>
    <button @click="createLobby">Create Multiplayer Lobby</button>
    <router-link to="/joinlobby">
      <button>Join Multiplayer Lobby</button>
    </router-link>
  </div>
</template>

<script>
import { useRouter } from 'vue-router';
import { createLobby } from '../services/firebaseService';

export default {
  name: 'MultiplayerOptions',
  setup() {
    const router = useRouter();

    const createLobbyHandler = async () => {
      try {
        const lobbyId = await createLobby();
        router.push(`/lobby/${lobbyId}`);
      } catch (error) {
        console.error('Error creating lobby:', error);
        alert('Failed to create lobby: ' + error.message);
      }
    };

    return { createLobby: createLobbyHandler };
  }
};
</script>

<style scoped>
.multiplayer-options {
  text-align: center;
  margin-top: 50px;
}
.multiplayer-options h1 {
  font-size: 2.5em;
  margin-bottom: 20px;
}
.multiplayer-options button {
  margin: 10px;
  padding: 10px 20px;
  font-size: 1em;
  cursor: pointer;
}
</style>