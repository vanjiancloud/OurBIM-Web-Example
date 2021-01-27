import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  // 路由重定项
  {
    path: '/',
    name: 'login',
    component: () => import('../views/login/index.vue')
  },
  // 登录成功显示主页
  {
    path: '/home',
    name: 'home',
    component: () => import('../views/home/index.vue')
  },
  {
    // 登录页面
    path: '/login',
    name: 'login',
    component: () => import('../views/login/index.vue')
  },
  {
    // 忘记密码
    path: '/changepassword',
    name: 'changepassword',
    component: () => import('../views/changepassword/index.vue')
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
