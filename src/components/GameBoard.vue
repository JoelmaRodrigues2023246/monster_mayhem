<!-- src/components/GameBoard.vue -->
<!-- This is the game board component where players can make moves during the game. -->

<template>
  <div>
    <!-- Display the game board -->
    <div v-for="(cell, index) in state" :key="index" @click="handleClick(index)">
      {{ cell }}
    </div>
  </div>
</template>

<script>
export default {
  name: 'GameBoard',
  props: {
    state: {
      type: Object,
      required: true
    }
  },
  methods: {
    handleClick(index) {
      this.$emit('move', { [index]: this.$root.currentPlayer });
    }
  }
};
</script>

<style scoped>
/* Styles for the game board */
</style>
