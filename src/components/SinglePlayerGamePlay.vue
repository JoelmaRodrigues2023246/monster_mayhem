// src/components/SinglePlayerGamePlay.vue
// This is the SinglePlayerGamePlay component template: it will be used to display the game board, player information, game controls, and player stats for a single player game.

<template>
  <div>
    <PlayerInfo />
    <GameBoard />
    <GameControls />
    <PlayerStats />
  </div>
</template>

<script>
import PlayerInfo from './PlayerInfo'
import GameBoard from './GameBoard'
import GameControls from './GameControls'
import PlayerStats from './PlayerStats'

export default {
  name: 'SinglePlayerGamePlay',
  components: {
    PlayerInfo,
    GameBoard,
    GameControls,
    PlayerStats
  }
}
</script>

<style scoped>
/* Style for the SinglePlayerGamePlay component */
</style>