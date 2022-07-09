import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'
import Slide from '../views/slide/index.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Slide',
    component: Slide
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
