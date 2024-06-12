import { createWebHistory, createRouter } from 'vue-router'

import GraphComp from '../components/GraphsComp.vue'

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {path:"/", name:'GraphComp', component: GraphComp}
    ]
});

export default router;
