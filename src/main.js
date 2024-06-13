import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import "./style.css"; // 스타일 파일을 가져옵니다.

createApp(App).use(router).mount("#app");
