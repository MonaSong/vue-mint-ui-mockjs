import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      redirect: 'hello'
    },
    {
      path: '/home',
      component: resolve => require(['../components/Home.vue'], resolve),
      children: [
        {
          path: '/',
          component: resolve => require(['../pages/index.vue'], resolve)
        },
        {
          path: 'information',
          component: resolve => require(['../pages/information.vue'], resolve)
        },
        {
          path: 'center',
          component: resolve => require(['../pages/center.vue'], resolve)
        },
        {
          path: 'money',
          component: resolve => require(['../pages/money.vue'], resolve)
        }
      ]
    },
    {
      path: '/hello',
      component: resolve => require(['../components/Hello.vue'], resolve)
    }
  ]
})
