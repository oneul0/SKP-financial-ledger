import { createWebHistory, createRouter } from 'vue-router'

import Graphs from '../components/GraphsComp.vue'

const router = createRouter({
    history: createWebHistory(),
    routes: [
        { path: '/', component: Graphs },
    ]
});

export default router;
