import { createRouter, createWebHashHistory } from 'vue-router'
import Home from '@/popup/views/home/home.vue'

const routes = [
 
    // 匹配 #/，指向Entry页面
    {
        path: '/',
        component: Home,
        exact: true
    },
]

const router = createRouter({
    history: createWebHashHistory(),
    routes,
})

export default router