import './assets/main.css';
import 'bootstrap/dist/css/bootstrap.css';

import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import router from "./router";
import vSelect from "vue-select";
import "vue-select/dist/vue-select.css";

const app = createApp(App);
const pinia = createPinia();
app.use(pinia);
app.component("v-select", vSelect);
app.use(router);
app.mount('#app');
