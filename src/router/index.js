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
    path: '/changePassword',
    name: 'changePassword',
    component: () => import('../views/changePassword/index.vue')
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
  },
  {
    // 用户中心
    path: '/userSetting',
    name: 'userSetting',
    component: () => import('../views/userSetting/index.vue')
  },
  {
    // 平台预览
    path: '/preview',
    name: 'preview',
    component: () => import('../views/preview/index.vue')
  },
  {
    // 新密码
    path: '/newPassword',
    name: 'newPassword',
    component: () => import('../views/newPassword/index.vue')
  },
  {
    // 修改密码成功
    path: '/sucPassword',
    name: 'sucPassword',
    component: () => import('../views/sucPassword/index.vue')
  }
]

const router = new VueRouter({
  routes
})

export default router
