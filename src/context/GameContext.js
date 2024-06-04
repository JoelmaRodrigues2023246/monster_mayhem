import { reactive, provide, inject } from 'vue';

const GameContextSymbol = Symbol();

export function provideGameContext() {
  const gameState = reactive({
    // define your state here, for example:
    players: [],
    gameStatus: 'not_started',
    // more states...
  });

  provide(GameContextSymbol, gameState);
}

export function useGameContext() {
  const context = inject(GameContextSymbol);
  if (!context) {
    throw new Error('useGameContext must be used within a GameProvider');
  }
  return context;
}
