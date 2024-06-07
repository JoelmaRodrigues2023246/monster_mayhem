<!--  src/views/Home.vue -->
<!-- This is the home page where players can choose between single player and multiplayer modes. -->
<!-- Players can also logout from this page. -->

<template>
  <div class="game-home">
    <img src="@/assets/images/logo.png" alt="Monster Mayhem Logo" class="logo">
    <p>Choose your mode:</p>
    <router-link to="/singleplayer">
      <button class="mode-button">Single Player</button>
    </router-link>
    <router-link to="/multiplayer-options">
      <button class="mode-button">Multiplayer</button>
    </router-link>
    <button @click="logout" class="logout-button">Logout</button>
  </div>
</template>

<script>
import { getAuth, signOut } from 'firebase/auth';
import { useRouter } from 'vue-router';

export default {
  name: 'Home',
  setup() {
    const router = useRouter();
    const auth = getAuth();

    const logout = async () => {
      try {
        await signOut(auth);
        router.push('/login');
      } catch (error) {
        alert('Logout failed: ' + error.message);
      }
    };

    return { logout };
  }
};
</script>

<style scoped>
.game-home {
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

.game-home p {
  font-size: 1.2em;
  margin-bottom: 20px;
}

.mode-button, .logout-button {
  background-color: #ff7f00;
  border: none;
  border-radius: 5px;
  color: white;
  font-size: 1.2em;
  padding: 10px 20px;
  margin: 10px;
  cursor: pointer;
}

.mode-button:hover, .logout-button:hover {
  background-color: #ff5f00;
}
</style>
