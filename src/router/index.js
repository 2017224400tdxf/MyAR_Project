import Vue from 'vue'
import Router from 'vue-router'
import VrGame from '@/components/VrGame'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'VrGame',
      component: VrGame
    }
  ]
})
