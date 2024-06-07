<!--  src/views/MultiplayerOptions.vue -->
<!-- This is the page where players can choose between creating a new multiplayer lobby or joining an existing one. -->
 
<template>
  <div class="multiplayer-options">
    <img src="@/assets/images/logo.png" alt="Monster Mayhem Logo" class="logo">
    <router-link to="/joinlobby">
      <button class="mode-button">Join Multiplayer Lobby</button>
    </router-link>
    <button @click="createLobby" class="mode-button">Create Multiplayer Lobby</button>
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
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background-image: url('@/assets/images/background_mm - Copy.jpg');
  background-size: cover;
  background-position: center;
  color: white;
  text-align: center;
}

.logo {
  width: 300px;
  height: auto;
  margin-bottom: 20px;
}

.mode-button {
  background-color: #ff7f00;
  border: none;
  border-radius: 5px;
  color: white;
  font-size: 1.2em;
  padding: 10px 20px;
  margin: 10px;
  cursor: pointer;
}

.mode-button:hover {
  background-color: #ff5f00;
}
</style>
