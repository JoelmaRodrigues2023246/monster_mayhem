// src/router/index.js
// Router configuration

import { createRouter, createWebHistory } from 'vue-router';
import { getAuth } from 'firebase/auth';
import Home from '../views/Home.vue';
import Lobby from '../views/Lobby.vue';
import GameSetup from '../views/GameSetup.vue';
import SinglePlayerGamePlay from '../components/SinglePlayerGamePlay.vue';
import MultiPlayerGamePlay from '../components/MultiPlayerGamePlay.vue';
import Login from '../views/Login.vue';
import Register from '../views/Register.vue';
import Welcome from '../views/Welcome.vue';
import JoinLobby from '../views/JoinLobby.vue';
import MultiplayerOptions from '../views/MultiplayerOptions.vue';
import Game from '../views/Game.vue';

const routes = [
  { path: '/', name: 'Welcome', component: Welcome },
  { path: '/home', name: 'Home', component: Home, meta: { requiresAuth: true } },
  { path: '/lobby/:id', name: 'Lobby', component: Lobby, meta: { requiresAuth: true } },
  { path: '/setup', name: 'GameSetup', component: GameSetup, meta: { requiresAuth: true } },
  { path: '/singleplayer', name: 'SinglePlayerGamePlay', component: SinglePlayerGamePlay, meta: { requiresAuth: true } },
  { path: '/multiplayer', name: 'MultiPlayerGamePlay', component: MultiPlayerGamePlay, meta: { requiresAuth: true } },
  { path: '/login', name: 'Login', component: Login },
  { path: '/register', name: 'Register', component: Register },
  { path: '/joinlobby', name: 'JoinLobby', component: JoinLobby, meta: { requiresAuth: true } },
  { path: '/multiplayer-options', name: 'MultiplayerOptions', component: MultiplayerOptions, meta: { requiresAuth: true } },
  { path: '/game/:id', name: 'Game', component: Game, meta: { requiresAuth: true } }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

router.beforeEach(async (to, from, next) => {
  const auth = getAuth();
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  const user = auth.currentUser;

  if (requiresAuth && !user) {
    next('/login');
  } else if (!requiresAuth && user && to.path === '/') {
    next('/home');
  } else {
    next();
  }
});

export default router;
