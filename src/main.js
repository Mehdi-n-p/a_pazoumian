import { createApp } from 'vue'
import { createPinia } from 'pinia';
import App from './App.vue'
import router from './router';

// Import CSS
import './style.css'
// import { toPrimitive } from 'core-js/fn/symbol';

createApp(App).use(createPinia()).mount('#app')
// createApp(App).use(router).use(createPinia()).mount('#app')
