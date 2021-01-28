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
    // 注册页
    path: '/register',
    name: 'register',
    component: () => import('../views/register/index.vue')
  },
  {
    // 协议书
    path: '/protocol',
    name: 'protocol',
    component: () => import('../views/register/protocol.vue')
  },
  {
    // 注册成功
    path: '/registerSucceed',
    name: 'registerSucceed',
    component: () => import('../views/register/registerSucceed.vue')
  },
  {
    // 查看邮件
    path: '/lookEmail',
    name: 'lookEmail',
    component: () => import('../views/register/lookEmail.vue')
  },
  {
    // 激活成功
    path: '/activateSucceed',
    name: 'activateSucceed',
    component: () => import('../views/register/activateSucceed.vue')
  }
]

const router = new VueRouter({
  routes
})

export default router
