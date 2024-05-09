import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store.js';

import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

import { faSearch, faUserSecret } from '@fortawesome/free-solid-svg-icons'
import { faCheck } from '@fortawesome/free-solid-svg-icons'
import { faPenToSquare } from '@fortawesome/free-solid-svg-icons'
import { faSquareCheck } from '@fortawesome/free-regular-svg-icons'

library.add(faCheck)
library.add(faUserSecret)
library.add(faSearch)
library.add(faPenToSquare)
library.add(faSquareCheck)

const app = createApp(App)

app.use(store);
app.use(router)

app.component('font-awesome-icon', FontAwesomeIcon).mount('#app')
