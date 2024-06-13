import home from '../views/HomeView.vue';
import login from '../views/LoginView.vue';
import signUp from '../views/SignUpView.vue';
import setting from '../views/SettingView.vue';
import CalenderComp from '@/components/CalenderComp.vue'
import { createRouter, createWebHistory } from "vue-router";
import TotalView from "../views/TotalView.vue";


const router = createRouter({
    history: createWebHistory(),
    routes: [
        { path: '/login', name:'login', component: login},
        { path: '/', name:'home', component: home},
        { path: '/signUp', name:'signUp', component: signUp},
        { path: '/setting', name:'setting', component: setting},
        { path: '/calender', name:'calender', component: CalenderComp},
        { path: "/total", component: TotalView },
    ]

});

export default router;
