<!-- src/views/JoinLobby.vue -->
<!-- This is the page where players can join a lobby by entering the lobby ID. -->
 
<template>
  <div>
    <h1>Join Lobby</h1>
    <input v-model="lobbyId" placeholder="Enter Lobby ID" />
    <button @click="joinLobby">Join Lobby</button>
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
/* Add any styles you need */
</style>