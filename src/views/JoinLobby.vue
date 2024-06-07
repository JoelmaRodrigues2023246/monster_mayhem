<!-- src/views/JoinLobby.vue -->
<!-- This is the page where players can join a lobby by entering the lobby ID. -->
 
<template>
  <div class="join-lobby-container">
    <img src="@/assets/images/logo.png" alt="Monster Mayhem Logo" class="logo">
    <input v-model="lobbyId" placeholder="Enter Lobby ID" class="input-field" />
    <button @click="joinLobby" class="join-button">Join Lobby</button>
  </div>
</template>

<script>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

export default {
  name: 'JoinLobby',
  setup() {
    const lobbyId = ref('');
    const router = useRouter();

    const joinLobby = () => {
      if (lobbyId.value) {
        router.push(`/lobby/${lobbyId.value}`);
      } else {
        alert('Please enter a valid lobby ID');
      }
    };

    return { lobbyId, joinLobby };
  }
};
</script>

<style scoped>
.join-lobby-container {
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

.input-field {
  display: block;
  width: 80%;
  margin: 10px auto;
  padding: 10px;
  border: none;
  border-radius: 5px;
  font-size: 1.2em;
  background: rgba(255, 255, 255, 0.9);
  color: #333;
}

.join-button {
  background-color: #ff7f00;
  border: none;
  border-radius: 5px;
  color: white;
  font-size: 1.2em;
  padding: 10px 20px;
  margin: 10px;
  cursor: pointer;
}

.join-button:hover {
  background-color: #ff5f00;
}
</style>
