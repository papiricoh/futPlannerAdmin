import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import ClubView from '../views/ClubView.vue'
import TeamsView from '../views/TeamsView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/club',
      name: 'club',
      component: ClubView
    },
    {
      path: '/teams',
      name: 'teams',
      component: TeamsView
    }
  ]
})

export default router
