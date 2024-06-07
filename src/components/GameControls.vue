<!-- This component will be used to add and move monsters in the game -->
<!-- src/components/GameControls.vue -->

<template>
  <div class="game-controls">
    <button @click="addMonster">Add Monster</button>
    <button @click="moveMonster">Move Monster</button>
  </div>
</template>

<script>
import { useGameContext } from '../context/GameContext';

export default {
  name: 'GameControls',
  setup() {
    const gameState = useGameContext();

    const addMonster = () => {
      // Logic to add monster
    };

    const moveMonster = () => {
      // Logic to move monster
    };

    return {
      addMonster,
      moveMonster,
      gameState,
    };
  },
};
</script>

<style scoped>
/* Your styles here */
</style>
