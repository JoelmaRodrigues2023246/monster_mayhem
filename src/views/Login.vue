<template>
  <div>
    <h1>Login</h1>
    <form @submit.prevent="login">
      <input type="text" v-model="identifier" placeholder="Email or Nickname" required autocomplete="username" />
      <input type="password" v-model="password" placeholder="Password" required autocomplete="current-password" />
      <button type="submit">Login</button>
    </form>
    <router-link to="/register">Don't have an account? Register</router-link>
  </div>
</template>

<script>
import { ref } from 'vue';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { db } from '../services/firebaseConfig';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { useRouter } from 'vue-router';

export default {
  name: 'Login',
  setup() {
    const identifier = ref('');
    const password = ref('');
    const auth = getAuth();
    const router = useRouter();

    const login = async () => {
      try {
        let email = identifier.value;

        // Check if the identifier is a nickname
        if (!identifier.value.includes('@')) {
          console.log('Looking up email for nickname:', identifier.value); // Debug log
          // Search for the email associated with the nickname in Firestore
          const usersRef = collection(db, 'users');
          const q = query(usersRef, where('nickname', '==', identifier.value));
          const querySnapshot = await getDocs(q);

          if (querySnapshot.empty) {
            alert('No user found with this nickname');
            return;
          }

          // Assume the first result is the correct one (there should only be one)
          email = querySnapshot.docs[0].data().email;
          console.log('Found email for nickname:', email); // Debug log
        }

        // Authenticate the user with the found email or the provided email
        await signInWithEmailAndPassword(auth, email, password.value);

        alert('Login successful!');
        router.push('/home'); // Redirect to home after login
      } catch (error) {
        alert('Login failed: ' + error.message);
        console.error('Login error:', error); // Debug log
      }
    };

    return { identifier, password, login };
  }
};
</script>

<style scoped>
/* Styles for the login form */
</style>
