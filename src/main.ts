import './assets/main.css'
import { inject } from '@vercel/analytics';
import { loadFull } from "tsparticles";
import VueParticles from '@tsparticles/vue3';
 
inject();

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(VueParticles, {
  init: async engine => {
    await loadFull(engine);
  }
})

app.mount('#app')
