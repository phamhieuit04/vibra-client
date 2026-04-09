import './assets/main.css';

import router from './router';
import { createApp } from 'vue';
import { createPinia } from 'pinia';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';
import { firebaseApp, firebaseMessaging } from '../firebase';
import { initColorFromStorage, initThemeFromStorage } from './helpers/themePreferences';
import App from './App.vue';

initThemeFromStorage();
initColorFromStorage();

const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);
const app = createApp(App);

app.use(pinia);
app.use(router, firebaseApp, firebaseMessaging);

app.mount('#app');
