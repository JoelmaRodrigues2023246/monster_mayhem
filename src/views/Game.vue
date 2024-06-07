<template>
  <div class="game">
    <h1>Game</h1>
    <p>Player: {{ currentPlayerNickname }}</p>
    <p>Current Turn: {{ currentTurnNickname }}</p>
    <div v-if="gameData">
      <div class="board">
        <div v-for="row in 10" :key="row" class="row">
          <div v-for="col in 10" :key="col" class="cell">
            {{ getMonsterAt(row - 1, col - 1) }}
          </div>
        </div>
      </div>
      <div class="controls">
        <button @click="addMonster('vampire')">Add Vampire</button>
        <button @click="addMonster('werewolf')">Add Werewolf</button>
        <button @click="addMonster('ghost')">Add Ghost</button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { db } from '../services/firebaseConfig';
import { doc, getDoc, onSnapshot, updateDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../services/firebaseConfig';

export default {
  name: 'Game',
  setup() {
    const route = useRoute();
    const gameId = ref(route.params.id);
    const gameData = ref(null);
    const currentPlayerNickname = ref('');
    const currentTurnNickname = ref('');
    const user = ref(null);

    const playerColors = {
      player1UID: 'green',
      player2UID: 'red',
      player3UID: 'blue',
      player4UID: 'yellow',
    };

    const loadGame = async () => {
      const gameRef = doc(db, 'games', gameId.value);
      const gameSnap = await getDoc(gameRef);
      if (gameSnap.exists()) {
        gameData.value = gameSnap.data();
        updateCurrentTurnNickname();
      } else {
        console.error('No such game!');
      }
    };

    const updateCurrentTurnNickname = async () => {
      if (gameData.value && gameData.value.turn) {
        currentTurnNickname.value = await getNicknameById(gameData.value.turn);
      }
    };

    onMounted(() => {
      loadGame();
      const gameRef = doc(db, 'games', gameId.value);
      onSnapshot(gameRef, (doc) => {
        if (doc.exists()) {
          gameData.value = doc.data();
          console.log("Game Data:", gameData.value);
          console.log("Turn:", gameData.value.turn);
          updateCurrentTurnNickname();
        }
      });

      onAuthStateChanged(auth, (currentUser) => {
        if (currentUser) {
          user.value = currentUser;
          getNicknameById(currentUser.uid).then((nickname) => {
            currentPlayerNickname.value = nickname;
          });
        }
      });
    });

    const getNicknameById = async (uid) => {
      const userRef = doc(db, 'users', uid);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        return userSnap.data().nickname;
      } else {
        return 'Unknown';
      }
    };

    const getMonsterAt = (row, col) => {
      if (!gameData.value) return '';
      for (let player in gameData.value.state.playersData) {
        const monsters = gameData.value.state.playersData[player].monsters;
        for (let monster of monsters) {
          if (monster.position[0] === row && monster.position[1] === col) {
            return monster.type.charAt(0).toUpperCase(); // Exibe a inicial do monstro
          }
        }
      }
      return '';
    };

    const addMonster = async (monsterType) => {
      if (!gameData.value) return;
      const newState = { ...gameData.value.state };
      const currentPlayer = newState.turn;
      if (!newState.playersData[currentPlayer].monsters) {
        newState.playersData[currentPlayer].monsters = [];
      }
      const playerMonsters = newState.playersData[currentPlayer].monsters;
      playerMonsters.push({ type: monsterType, position: getRandomPositionForPlayer(currentPlayer) });
      await updateDoc(doc(db, 'games', gameId.value), { state: newState });
    };

    const getRandomPositionForPlayer = (playerId) => {
      // Start positions for each player's monsters: how many monsters each player has/where they are placed
      const side = playerId === 'player1UID' ? 0 : playerId === 'player2UID' ? 9 : playerId === 'player3UID' ? [0, 9] : [9, 0];
      if (side === 0 || side === 9) {
        return [side, Math.floor(Math.random() * 10)];
      } else {
        return [Math.floor(Math.random() * 10), side];
      }
    };

    return {
      gameId,
      gameData,
      currentPlayerNickname,
      currentTurnNickname,
      playerColors,
      getMonsterAt,
      addMonster,
    };
  },
};
</script>

<style scoped>
.game {
  text-align: center;
  margin-top: 50px;
}
.board {
  display: grid;
  grid-template-columns: repeat(10, 30px);
  grid-template-rows: repeat(10, 30px);
  gap: 1px;
  margin: 20px auto;
}
.cell {
  width: 30px;
  height: 30px;
  border: 1px solid #000;
  display: flex;
  justify-content: center;
  align-items: center;
}
.controls {
  margin-top: 20px;
}
.controls button {
  margin: 0 5px;
}
</style>
