<!-- src/views/Welcome.vue -->
<!-- This is the welcome page where players can choose between logging in or registering. -->

<template>
  <div class="welcome-container">
    <img src="@/assets/images/logo.png" alt="Monster Mayhem Logo" class="logo">
    <router-link to="/login">
      <button class="welcome-button">Login</button>
    </router-link>
    <router-link to="/register">
      <button class="welcome-button">Register</button>
    </router-link>
  </div>
</template>

<script>
export default {
  name: 'Welcome',
};
</script>

<style scoped>
.welcome-container {
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

.welcome-button {
  background-color: #ff7f00;
  border: none;
  border-radius: 5px;
  color: white;
  font-size: 1.2em;
  padding: 10px 20px;
  margin: 10px;
  cursor: pointer;
}

.welcome-button:hover {
  background-color: #ff5f00;
}
</style>
