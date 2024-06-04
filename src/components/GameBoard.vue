<template>
  <div id="game-container"></div>
</template>

<script>
import Phaser from 'phaser'

export default {
  name: 'GameBoard',
  mounted() {
    const config = {
      type: Phaser.AUTO,
      width: 800,
      height: 600,
      scene: {
        preload: this.preload,
        create: this.create,
        update: this.update
      }
    }
    new Phaser.Game(config)
  },
  methods: {
    preload() {
      // Carregar recursos do jogo
    },
    create() {
      // Configurar o jogo
    },
    update() {
      // Atualizar o jogo
    }
  }
}
</script>

<style>
#game-container {
  width: 100%;
  height: 100%;
}
</style>
