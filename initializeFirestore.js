const admin = require('firebase-admin');
const { getFirestore } = require('firebase-admin/firestore');

// Substitute the following values with your project's credentials
const serviceAccount = require('./monstermayhem-b03f8-firebase-adminsdk-f84wi-9e03990ca9.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = getFirestore();

async function initializeGameData() {
  const gameRef = db.collection('games').doc(); // Deixe Firestore gerar um ID automaticamente
  await gameRef.set({
    host: "hostUID",
    players: ["player1UID", "player2UID", "player3UID", "player4UID"],
    state: {
      turn: "player1UID",
      playersData: {
        "player1UID": {
          "monsters": [
            { "type": "vampire", "position": [0, 0] }
          ],
          "stats": {
            "monstersKilled": 0,
            "monstersLost": 0
          }
        },
        "player2UID": {
          "monsters": [
            { "type": "werewolf", "position": [1, 2] }
          ],
          "stats": {
            "monstersKilled": 0,
            "monstersLost": 0
          }
        },
        "player3UID": {
          "monsters": [
            { "type": "ghost", "position": [2, 2] }
          ],
          "stats": {
            "monstersKilled": 0,
            "monstersLost": 0
          }
        },
        "player4UID": {
          "monsters": [],
          "stats": {
            "monstersKilled": 0,
            "monstersLost": 0
          }
        }
      }
    }
  });
  console.log('Game data initialized with ID:', gameRef.id);
}

initializeGameData().catch(console.error);
