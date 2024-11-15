import '@/assets/tailwind.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { VueDraggableNext } from 'vue-draggable-next'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import App from './App.vue'
import router from './router'

const app = createApp(App)

app.component('draggable', VueDraggableNext)
const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

app.use(pinia)
app.use(router)

app.mount('#app')
