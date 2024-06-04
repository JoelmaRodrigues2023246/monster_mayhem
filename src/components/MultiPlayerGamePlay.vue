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
  name: 'MultiPlayerGamePlay',
  components: {
    PlayerInfo,
    GameBoard,
    GameControls,
    PlayerStats
  }
}
</script>

<style scoped>
/* Estilos para o modo de jogo multiplayer */
</style>