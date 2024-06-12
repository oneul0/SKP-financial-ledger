import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import LoginView from "../views/LoginView.vue";
import SettingView from "../views/SettingView.vue";
import SignUpView from "../views/SignUpView.vue";
import TotalView from "../views/TotalView.vue";

const routes = [
  { path: "/", component: HomeView },
  { path: "/login", component: LoginView },
  { path: "/settings", component: SettingView },
  { path: "/signup", component: SignUpView },
  { path: "/total", component: TotalView },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
