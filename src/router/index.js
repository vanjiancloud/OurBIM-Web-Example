import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    // 5.配置路由
    path: '/login',
    name: 'login',
    // 6.懒加载只用打开该网页加载
    component: () => import('../views/login/index.vue')
  },
  {
    // 5.配置路由
    path: '/register',
    name: 'register',
    // 6.懒加载只用打开该网页加载
    component: () => import('../views/register/index.vue')
  }
]

const router = new VueRouter({
  routes
})

export default router
