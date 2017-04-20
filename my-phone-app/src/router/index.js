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
          meta: {
            title: '音乐中心'
          },
          component: resolve => require(['../pages/center.vue'], resolve), // beforeRouteLeave
          beforeRouteLeave: (to, from, next) => {
            // next(vm => {
            //   // 通过 `vm` 访问组件实例
            //   clearInterval(vm.set)
            // })
            // // console.log(1)
            console.log('你好！')
          }
        },
        {
          path: 'money',
          // component: resolve => require(['../pages/money.vue'], resolve)
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
