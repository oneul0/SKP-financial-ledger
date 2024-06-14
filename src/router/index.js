import { createRouter, createWebHistory } from "vue-router";
import home from '../views/HomeView.vue';
import login from '../views/LoginView.vue';
import signUp from '../views/SignUpView.vue';
import setting from '../views/SettingView.vue';
import CalendarComp from '@/components/CalendarComp.vue'
import TotalView from "../views/TotalView.vue";
import GraphsComp from "../components/GraphsComp.vue";


const router = createRouter({
    history: createWebHistory(),
    routes: [
        { path: '/login', name:'login', component: login},
        { path: '/', name:'home', component: home},
        { path: '/signUp', name:'signUp', component: signUp},
        { path: '/setting', name:'setting', component: setting},
        { path: '/calendar', name:'calendar', component: CalendarComp},
        { path: "/total", component: TotalView },
        { path: "/graph", component: GraphsComp },
    ]

});

router.beforeEach((to, from, next) => {
    const loginId = localStorage.getItem('loginID');

    if (!loginId && to.name !== 'login' && to.name !== 'signUp') {
        next({ name: 'login' });
    } else {
        next(); 
    }
});

export default router;
