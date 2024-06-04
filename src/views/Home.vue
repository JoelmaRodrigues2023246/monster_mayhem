<template>
  <div class="game-home">
    <h1>Welcome to Monster Mayhem!</h1>
    <p>Choose your mode:</p>
    <router-link to="/singleplayer">
      <button>Single Player</button>
    </router-link>
    <button @click="createLobby">Multiplayer</button>
    <button @click="logout">Logout</button>
  </div>
</template>

<script>
import { getAuth, signOut } from 'firebase/auth';
import { useRouter } from 'vue-router';
import { db } from '../services/firebaseConfig';
import { collection, addDoc } from 'firebase/firestore';

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

    const createLobby = async () => {
      const lobbyRef = await addDoc(collection(db, 'lobbies'), {
        host: auth.currentUser.uid,
        players: [auth.currentUser.uid],
        status: 'waiting'
      });
      router.push(`/lobby/${lobbyRef.id}`);
    };

    return { logout, createLobby };
  }
};
</script>

<style scoped>
.game-home {
  text-align: center;
  margin-top: 50px;
}
.game-home h1 {
  font-size: 2.5em;
  margin-bottom: 20px;
}
.game-home p {
  font-size: 1.2em;
  margin-bottom: 20px;
}
.game-home button {
  margin: 10px;
  padding: 10px 20px;
  font-size: 1em;
  cursor: pointer;
}
</style>