import Vue from 'vue'
import Router from 'vue-router'
import Harmony from './views/Harmony.vue'

Vue.use(Router)

const router =  new Router({
  routes: [
    {
      path: '/',
      redirect: '/harmony'
    },
    {
      path: '/harmony',
      name: 'Harmony',
      component: Harmony 
    }
  ]
})
export default router
