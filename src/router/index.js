import { createWebHistory, createRouter } from 'vue-router'

import home from '../views/HomeView.vue';
import login from '../views/LoginView.vue';
import signUp from '../views/SignUpView.vue';
import setting from '../views/SettingView.vue';



const router = createRouter({
    history: createWebHistory(),
    routes: [
        { path: '/login', name:'login', component: login},
        { path: '/', name:'home', component: home},
        { path: '/signUp', name:'signUp', component: signUp},
        { path: '/setting', name:'setting', component: setting}
    ]
});

export default router;
