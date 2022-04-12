import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import {store, key} from './store/index'

import alertDialog from "@/components/alertDialog.vue";

createApp(App)
    .use(store, key)
    .use(router)
    .component('alertDialog', alertDialog)
    .mount('#app')
