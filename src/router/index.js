import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import ClubView from '../views/ClubView.vue'
import TeamsView from '../views/TeamsView.vue'
import PlayersView from '../views/PlayersView.vue'

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
    },
    {
      path: '/users',
      name: 'users',
      component: PlayersView
    }
  ]
})

export default router
