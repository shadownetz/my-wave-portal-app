import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import alertDialog from "@/components/alertDialog.vue";

createApp(App)
    .use(store)
    .use(router)
    .component('alertDialog', alertDialog)
    .mount('#app')
