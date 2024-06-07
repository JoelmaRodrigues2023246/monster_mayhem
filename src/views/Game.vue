<!-- src/views/Game.vue -->
 <!-- this is the game page where the game board is displayed and players can add and move monsters -->
<!-- The game board is a 10x10 grid where players can add monsters -->
<!-- Players can only add monsters to the edge of the board based on their position -->
<!-- Players can move monsters to adjacent cells -->
<!-- The game state is stored in Firestore and updated in real-time -->
<!-- The current player's turn is displayed at the top of the page -->
<!-- The player's nickname is displayed at the top of the page -->
<!-- The player's monsters are displayed on the board -->
<!-- Players can end their turn by clicking the "End Turn" button -->

<template>
  <div class="game-container">
    <img src="@/assets/images/logo.png" alt="Monster Mayhem Logo" class="logo">
    <p>Player: {{ currentPlayerNickname }}</p>
    <p>Current Turn: {{ currentTurnNickname }}</p>
    <div v-if="gameData">
      <div class="board">
        <div v-for="row in 10" :key="row" class="row">
          <div
            v-for="col in 10"
            :key="col"
            class="cell"
            :data-row="row - 1"
            :data-col="col - 1"
            @click="selectCell(row - 1, col - 1)"
          >
            {{ getMonsterAt(row - 1, col - 1) }}
          </div>
        </div>
      </div>
      <div class="controls">
        <button @click="prepareAddMonster('vampire')" class="game-button">Add Vampire</button>
        <button @click="prepareAddMonster('werewolf')" class="game-button">Add Werewolf</button>
        <button @click="prepareAddMonster('ghost')" class="game-button">Add Ghost</button>
        <button id="endTurnButton" @click="endTurn" :disabled="!canEndTurn" class="end-turn-button">
          End Turn
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import { db } from "../services/firebaseConfig";
import { doc, getDoc, onSnapshot, updateDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../services/firebaseConfig";

export default {
  name: "Game",
  setup() {
    const route = useRoute();
    const gameId = ref(route.params.id);
    const gameData = ref(null);
    const currentPlayerNickname = ref("");
    const currentTurnNickname = ref("");
    const selectedMonsterType = ref(null);
    const selectedMonster = ref(null);
    const user = ref(null);
    const canEndTurn = ref(false);
    let addedMonster = false;
    let movedMonster = false;

    const playerColors = {
      player1UID: "green",
      player2UID: "red",
      player3UID: "blue",
      player4UID: "yellow",
    };

    // Load game data from Firestore
    const loadGame = async () => {
      const gameRef = doc(db, "games", gameId.value);
      const gameSnap = await getDoc(gameRef);
      if (gameSnap.exists()) {
        gameData.value = gameSnap.data();
        updateCurrentTurnNickname();
      } else {
        console.error("No such game!");
      }
    };

    // Update current turn nickname
    const updateCurrentTurnNickname = async () => {
      if (gameData.value && gameData.value.turn) {
        currentTurnNickname.value = await getNicknameById(gameData.value.turn);
      }
    };

    onMounted(() => {
      loadGame();
      const gameRef = doc(db, "games", gameId.value);
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

    // Get nickname by user ID
    const getNicknameById = async (uid) => {
      const userRef = doc(db, "users", uid);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        return userSnap.data().nickname;
      } else {
        return "Unknown";
      }
    };

    // Get the monster at a specific position
    const getMonsterAt = (row, col) => {
      if (!gameData.value) return "";
      for (let player in gameData.value.state.playersData) {
        const monsters = gameData.value.state.playersData[player].monsters;
        for (let monster of monsters) {
          if (monster.position[0] === row && monster.position[1] === col) {
            return monster.type.charAt(0).toUpperCase(); // Display the initial of the monster
          }
        }
      }
      return "";
    };

    // Highlight permitted cells for the current player
    const highlightPermittedCells = (cells) => {
      cells.forEach(([row, col]) => {
        document
          .querySelector(`.cell[data-row='${row}'][data-col='${col}']`)
          .classList.add("highlight");
      });
    };

    // Clear highlights from cells
    const clearHighlights = () => {
      document
        .querySelectorAll(".cell.highlight")
        .forEach((cell) => cell.classList.remove("highlight"));
    };

    // Prepare to add a monster of a specific type
    const prepareAddMonster = (monsterType) => {
      selectedMonsterType.value = monsterType;
      clearHighlights();
      const permittedCells = getPermittedCells(gameData.value.turn);
      console.log("Permitted Cells:", permittedCells);
      highlightPermittedCells(permittedCells);
    };

    // Get permitted cells for the current player
    const getPermittedCells = (playerId) => {
      console.log("Getting permitted cells for player:", playerId);
      let permittedCells = [];
      const playerIndex = gameData.value.players.indexOf(playerId);

      switch (playerIndex) {
        case 0: // Player 1
          permittedCells = Array.from({ length: 9 }, (_, i) => [i + 1, 0]);
          break;
        case 1: // Player 2
          permittedCells = Array.from({ length: 9 }, (_, i) => [0, i]);
          break;
        case 2: // Player 3
          permittedCells = Array.from({ length: 9 }, (_, i) => [i, 9]);
          break;
        case 3: // Player 4
          permittedCells = Array.from({ length: 9 }, (_, i) => [9, i + 1]);
          break;
        default:
          console.log("No matching player ID found.");
          return [];
      }

      console.log(`Permitted cells for player${playerIndex + 1}:`, permittedCells);
      return permittedCells;
    };

    // Select a cell to place the monster or move the monster
    const selectCell = async (row, col) => {
      console.log("Selected cell:", [row, col]);
      if (selectedMonsterType.value) {
        await addMonsterToCell(row, col);
      } else if (selectedMonster.value) {
        await moveMonsterToCell(row, col);
      }
    };

    // Add monster to the selected cell
    const addMonsterToCell = async (row, col) => {
      if (!selectedMonsterType.value || !gameData.value) return;

      const permittedCells = getPermittedCells(gameData.value.turn);
      if (!permittedCells.some((cell) => cell[0] === row && cell[1] === col))
        return; // Check if cell is permitted

      console.log(
        "Adding monster to cell:",
        selectedMonsterType.value,
        "at position:",
        [row, col]
      );

      const newState = { ...gameData.value.state };
      const currentPlayer = newState.turn;

      if (!newState.playersData[currentPlayer]) {
        console.error("Player data not found:", currentPlayer);
        return;
      }

      if (!newState.playersData[currentPlayer].monsters) {
        newState.playersData[currentPlayer].monsters = [];
      }

      const playerMonsters = newState.playersData[currentPlayer].monsters;
      console.log("Current player monsters before adding:", playerMonsters);

      playerMonsters.push({
        type: selectedMonsterType.value,
        position: [row, col],
      });

      console.log("Current player monsters after adding:", playerMonsters);

      try {
        await updateDoc(doc(db, "games", gameId.value), { state: newState });
        selectedMonsterType.value = null; // Reset selected monster type
        addedMonster = true;
        checkEndTurnAvailability();
        clearHighlights();
      } catch (error) {
        console.error("Error updating document:", error);
      }
    };

    // Move monster to the selected cell
    const moveMonsterToCell = async (row, col) => {
      if (!selectedMonster.value || !gameData.value) return;

      const newState = { ...gameData.value.state };
      const currentPlayer = newState.turn;
      const playerMonsters = newState.playersData[currentPlayer].monsters;

      // Find the monster and update its position
      const monster = playerMonsters.find(
        (m) =>
          m.position[0] === selectedMonster.value[0] &&
          m.position[1] === selectedMonster.value[1]
      );
      if (monster) {
        monster.position = [row, col];
        await updateDoc(doc(db, "games", gameId.value), { state: newState });
        movedMonster = true;
        checkEndTurnAvailability();
        clearHighlights();
        selectedMonster.value = null; // Reset selected monster
      }
    };

    // Check if the end turn button can be enabled
    const checkEndTurnAvailability = () => {
      canEndTurn.value = addedMonster && movedMonster;
    };

    // End the turn for the current player
    const endTurn = async () => {
      addedMonster = false;
      movedMonster = false;
      canEndTurn.value = false;

      const newState = { ...gameData.value.state };
      const currentPlayerIndex = gameData.value.players.indexOf(
        gameData.value.turn
      );
      const nextPlayerIndex =
        (currentPlayerIndex + 1) % gameData.value.players.length;
      newState.turn = gameData.value.players[nextPlayerIndex];

      await updateDoc(doc(db, "games", gameId.value), { state: newState });
      updateCurrentTurnNickname();
    };

    return {
      gameId,
      gameData,
      currentPlayerNickname,
      currentTurnNickname,
      playerColors,
      getMonsterAt,
      prepareAddMonster,
      selectCell,
      canEndTurn,
      endTurn,
    };
  },
};
</script>

<style scoped>
.game-container {
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

.highlight {
  background-color: yellow;
}

.controls {
  margin-top: 20px;
}

.game-button, .end-turn-button {
  background-color: #ff7f00;
  border: none;
  border-radius: 5px;
  color: white;
  font-size: 1.2em;
  padding: 10px 20px;
  margin: 10px;
  cursor: pointer;
}

.game-button:hover, .end-turn-button:hover {
  background-color: #ff5f00;
}
</style>
