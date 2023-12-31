import "./assets/main.css";
import "@/assets/dist/build.css";

import { createApp } from "vue";
import App from "./App.vue";

import { library } from "@fortawesome/fontawesome-svg-core";

import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

import { faEye } from "@fortawesome/free-solid-svg-icons";
import {
  faGoogle,
  faFacebookF,
  faInstagram,
} from "@fortawesome/free-brands-svg-icons";

library.add(faEye, faGoogle, faFacebookF, faInstagram);

import router from "./router";

const app = createApp(App);

app.use(router).component("font-awesome-icon", FontAwesomeIcon);

app.mount("#app");
