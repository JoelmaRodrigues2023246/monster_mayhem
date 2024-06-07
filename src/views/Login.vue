<!-- Login form with email or nickname and password fields -->
<!-- Redirects to the home page after successful login -->

<template>
  <div class="login-container">
    <img src="@/assets/images/logo.png" alt="Monster Mayhem Logo" class="logo">
    <form @submit.prevent="login">
      <input type="text" v-model="identifier" placeholder="Email or Nickname" required autocomplete="username" class="input-field" />
      <input type="password" v-model="password" placeholder="Password" required autocomplete="current-password" class="input-field" />
      <button type="submit" class="login-button">Login</button>
    </form>
    <router-link to="/register">
      <button class="register-button">Don't have an account? Register</button>
    </router-link>
  </div>
</template>

<script>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { db } from '../services/firebaseConfig';
import { collection, query, where, getDocs } from 'firebase/firestore';

export default {
  name: 'Login',
  setup() {
    const router = useRouter();
    const identifier = ref('');
    const password = ref('');
    const auth = getAuth();

    const login = async () => {
      try {
        let email = identifier.value;

        // Check if the identifier is a nickname
        if (!identifier.value.includes('@')) {
          console.log('Looking up email for nickname:', identifier.value);
          const usersRef = collection(db, 'users');
          const q = query(usersRef, where('nickname', '==', identifier.value));
          const querySnapshot = await getDocs(q);

          if (querySnapshot.empty) {
            alert('No user found with this nickname');
            return;
          }

          // Assume the first result is the correct one (there should only be one)
          email = querySnapshot.docs[0].data().email;
          console.log('Found email for nickname:', email);
        }

        await signInWithEmailAndPassword(auth, email, password.value);
        alert('Login successful!');
        router.push('/home');
      } catch (error) {
        alert('Login failed: ' + error.message);
        console.error('Login error:', error);
      }
    };

    return {
      identifier,
      password,
      login
    };
  }
};
</script>

<style scoped>
.login-container {
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

.login-button, .register-button {
  background-color: #ff7f00;
  border: none;
  border-radius: 5px;
  color: white;
  font-size: 1.2em;
  padding: 10px 20px;
  margin: 10px;
  cursor: pointer;
}

.login-button:hover, .register-button:hover {
  background-color: #ff5f00;
}
</style>

