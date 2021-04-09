import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'
import SnpDescentPlots from '../components/SnpDescentPlots.vue'

Vue.use(VueRouter)

const routes: Array<RouteConfig> = [
  {
    path: '/',
    name: 'SnpDescentPlots',
    component: SnpDescentPlots
  }
]

const router = new VueRouter({
  routes
})

export default router
