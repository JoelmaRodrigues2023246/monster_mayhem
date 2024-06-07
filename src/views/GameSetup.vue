<!--src/views/GameSetup.vue-->
<!--This is the page where the user can choose between single player and multiplayer game modes.-->

<template>
  <div>
    <h1>Game Setup</h1>
    <router-link to="/singleplayer">Single Player</router-link>
    <router-link to="/multiplayer">Multiplayer</router-link>
  </div>
</template>

<script>
export default {
  name: 'GameSetup'
}
</script>

<style scoped>
/* Style for the GameSetup component */
</style>
