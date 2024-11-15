import '@/assets/tailwind.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

import { createPinia } from 'pinia'
import { VueDraggableNext } from 'vue-draggable-next'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

/* Import Font Awesome */
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { 
    faCircleCheck, 
    faCircleXmark, 
    faTriangleExclamation, 
    faCircleInfo,
    faXmark,
    faPlus,
    faTrash
} from '@fortawesome/free-solid-svg-icons'

const app = createApp(App)

/* Ajout des icônes à la bibliothèque */
library.add(faCircleCheck, faCircleXmark, faTriangleExclamation, faCircleInfo, faXmark, faPlus, faTrash)
/* Enregistrement du composant Font Awesome */
app.component('font-awesome-icon', FontAwesomeIcon)

/* Enregistrement du composant VueDraggableNext */
app.component('draggable', VueDraggableNext)

/* Enregistrement du plugin Pinia */
const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

app.use(pinia)
app.use(router)
app.mount('#app')
