import '../src/output.css'

import { createApp } from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from '../src/router'; // Impor router yang sudah Anda konfigurasi

createApp(App).use(router).mount('#app');
