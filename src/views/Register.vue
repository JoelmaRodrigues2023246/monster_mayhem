<template>
  <div>
    <h1>Register</h1>
    <form @submit.prevent="register">
      <input type="email" v-model="email" placeholder="Email" required autocomplete="username" />
      <input type="password" v-model="password" placeholder="Password" required autocomplete="new-password" />
      <input type="text" v-model="nickname" placeholder="Nickname" required />
      <button type="submit">Register</button>
    </form>
    <router-link to="/login">Already have an account? Login</router-link>
  </div>
</template>

<script>
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
/* Styles for the registration form */
</style>
