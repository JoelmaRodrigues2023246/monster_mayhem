<!-- src/views/Register.vue -->
<!-- Registration form with email, password, and nickname fields -->
<!-- Redirects to the home page after successful registration -->
<!-- Saves the nickname in Firestore -->

<template>
  <div class="register-container">
    <img src="@/assets/images/logo.png" alt="Monster Mayhem Logo" class="logo">
    <form @submit.prevent="register">
      <input type="email" v-model="email" placeholder="Email" required autocomplete="username" class="input-field" />
      <input type="password" v-model="password" placeholder="Password" required autocomplete="new-password" class="input-field" />
      <input type="text" v-model="nickname" placeholder="Nickname" required class="input-field" />
      <button type="submit" class="register-button">Register</button>
    </form>
    <router-link to="/login">
      <button class="login-button">Already have an account? Login</button>
    </router-link>
  </div>
</template>

<script>
// Import the necessary functions and objects from Firebase
import { ref } from 'vue';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { useRouter } from 'vue-router';
import { db } from '../services/firebaseConfig';

export default {
  name: 'Register',
  setup() {
    const email = ref('');
    const password = ref('');
    const nickname = ref('');
    const auth = getAuth();
    const router = useRouter();

    const register = async () => {
      try {
        const userCredential = await createUserWithEmailAndPassword(auth, email.value, password.value);
        const user = userCredential.user;

        // Save the nickname in Firestore
        await setDoc(doc(db, 'users', user.uid), {
          email: email.value,
          nickname: nickname.value,
        });

        alert('Registration successful!');
        router.push('/home'); // Redirect to home after registration
      } catch (error) {
        alert('Registration failed: ' + error.message);
      }
    };

    return { email, password, nickname, register };
  }
};
</script>

<style scoped>
.register-container {
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

.register-button, .login-button {
  background-color: #ff7f00;
  border: none;
  border-radius: 5px;
  color: white;
  font-size: 1.2em;
  padding: 10px 20px;
  margin: 10px;
  cursor: pointer;
}

.register-button:hover, .login-button:hover {
  background-color: #ff5f00;
}
</style>

