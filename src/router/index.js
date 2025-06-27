// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'

// Define your routes
const routes = [
    {
        path: '/',
        name: 'Home',
        component: () => import('../components/Home.vue')
    },
    {
        path: '/about',
        name: 'About',
        component: () => import('../components/About.vue')
    }
]

// Create the router instance
const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router
