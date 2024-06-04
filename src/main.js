import { createApp, h } from 'vue';
import App from './App.vue';
import router from './router';
import { provideGameContext } from './context/GameContext';

const app = createApp({
  setup() {
    provideGameContext();
  },
  render: () => h(App),
});

app.use(router);
app.mount('#app');
