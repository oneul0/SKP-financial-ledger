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
    const loginId = localStorage.getItem('loginID'); // 예시로 localStorage에서 로그인 ID를 가져옴

    if (!loginId && to.name !== 'login' && to.name !== 'signUp') {
        next({ name: 'login' }); // 로그인 ID가 없고 로그인 페이지나 회원가입 페이지가 아닌 경우 로그인 페이지로 이동
    } else {
        next(); // 그 외의 경우 그냥 다음으로 진행
    }
});

export default router;
