import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  // 路由重定项
  {
    path: '/',
    name: 'login',
    component: () => import('../views/login/index.vue'),
    meta: {
      title: 'OurBIM请登录'
    }
  },
  // 登录成功显示主页
  {
    path: '/home',
    name: 'home',
    component: () => import('../views/home/index.vue'),
    meta: {
      title: 'OurBIM用户中心'
    }
  },
  {
    // 登录页面
    path: '/login',
    name: 'login',
    component: () => import('../views/login/index.vue'),
    meta: {
      title: 'OurBIM请登录'
    }
  },
  {
    // 忘记密码ppp
    path: '/changepassword',
    name: 'changepassword',
    component: () => import('../views/changepassword/index.vue'),
    meta: {
      title: 'OurBIM忘记密码'
    }
  },
  {
    // 注册页
    path: '/register',
    name: 'register',
    component: () => import('../views/register/index.vue'),
    meta: {
      title: 'OurBIM请注册'
    }
  },
  {
    // 协议书
    path: '/protocol',
    name: 'protocol',
    component: () => import('../views/register/protocol.vue'),
    meta: {
      title: 'OurBIM用户须知'
    }
  },
  {
    // 注册成功
    path: '/registerSucceed',
    name: 'registerSucceed',
    component: () => import('../views/register/registerSucceed.vue'),
    meta: {
      title: 'OurBIM注册成功'
    }
  },
  {
    // 查看邮件
    path: '/lookEmail',
    name: 'lookEmail',
    component: () => import('../views/register/lookEmail.vue'),
    meta: {
      title: 'OurBIM产看邮件'
    }
  },
  {
    // 激活成功
    path: '/activateSucceed',
    name: 'activateSucceed',
    component: () => import('../views/register/activateSucceed.vue'),
    meta: {
      title: 'OurBIM激活成功'
    }
  },
  {
    // 用户中心
    path: '/userCenter',
    name: 'userCenter',
    component: () => import('../views/userCenter/index.vue'),
    meta: {
      title: 'OurBIM用户中心'
    }
  },
  {
    // demo
    path: '/demo',
    name: 'demo',
    component: () => import('../views/demo/index.vue'),
    meta: {
      title: 'demo'
    }
  },
  {
    // 平台预览
    path: '/preview',
    name: 'preview',
    component: () => import('../views/preview/index.vue'),
    meta: {
      title: 'OurBIM平台预览'
    }
  },
  {
    // 新密码
    path: '/newPassword',
    name: 'newPassword',
    component: () => import('../views/newPassword/index.vue'),
    meta: {
      title: 'OurBIM找回密码'
    }
  },
  {
    // 修改密码成功
    path: '/resetSucceed',
    name: 'resetSucceed',
    component: () => import('../views/resetSucceed/index.vue'),
    meta: {
      title: 'OurBIM重置密码成功'
    }
  }
]

const router = new VueRouter({
  routes
})
router.afterEach((to, from) => {
  document.title = to.meta.title
})
export default router
