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
  // 登录页面
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/login/index.vue'),
    meta: {
      title: 'OurBIM请登录'
    }
  },
  // 忘记密码
  {
    path: '/changePassword',
    name: 'changePassword',
    component: () => import('../views/changepassword/index.vue'),
    meta: {
      title: 'OurBIM重置密码'
    }
  },
  // 注册页
  {
    path: '/register',
    name: 'register',
    component: () => import('../views/register/index.vue'),
    meta: {
      title: 'OurBIM请注册'
    }
  },
  // 协议书
  {
    path: '/protocol',
    name: 'protocol',
    component: () => import('../views/register/protocol.vue'),
    meta: {
      title: 'OurBIM用户须知'
    }
  },
  // 注册成功
  {
    path: '/registerSucceed',
    name: 'registerSucceed',
    component: () => import('../views/register/registerSucceed.vue'),
    meta: {
      title: 'OurBIM注册成功'
    }
  },
  // 激活成功
  {
    path: '/activateSucceed',
    name: 'activateSucceed',
    component: () => import('../views/register/activateSucceed.vue'),
    meta: {
      title: 'OurBIM激活账户'
    }
  },
  // 用户中心
  {
    path: '/userCenter',
    name: 'userCenter',
    component: () => import('../views/userCenter/index.vue'),
    meta: {
      title: '用户中心'
    }
  },
  // 应用管理
  {
    path: '/manage',
    name: 'manage',
    component: () => import('../views/manage/index.vue'),
    meta: {
      title: '应用管理'
    }
  },
  // 编辑应用
  {
    path: '/edit',
    name: 'edit',
    component: () => import('../views/manage/edit.vue'),
    meta: {
      title: '编辑应用'
    }
  },
  // 创建应用
  {
    path: '/found',
    name: 'found',
    component: () => import('../views/found/index.vue'),
    meta: {
      title: '创建应用'
    }
  },
  // 账户管理
  {
    path: '/bill',
    name: 'bill',
    component: () => import('../views/bill/index.vue'),
    meta: {
      title: '账户管理'
    }
  },
  // 个人信息
  {
    path: '/bill',
    name: 'bill',
    component: () => import('../views/bill/index.vue'),
    meta: {
      title: '个人信息'
    }
  },
  // 授权码
  {
    path: '/code',
    name: 'code',
    component: () => import('../views/bill/code.vue'),
    meta: {
      title: '授权码'
    }
  },
  // 服务订单
  {
    path: '/order',
    name: 'order',
    component: () => import('../views/bill/order.vue'),
    meta: {
      title: '服务订单'
    }
  },
  // 新密码
  {
    path: '/newPassword',
    name: 'newPassword',
    component: () => import('../views/newPassword/index.vue'),
    meta: {
      title: 'OurBIM找回密码'
    }
  },
  // 修改密码成功
  {
    path: '/resetSucceed',
    name: 'resetSucceed',
    component: () => import('../views/resetSucceed/index.vue'),
    meta: {
      title: 'OurBIM重置密码成功'
    }
  },
  // 应用详情
  {
    path: '/web_client',
    name: 'web_client',
    component: () => import('../views/userCenter/subpage/web_client.vue'),
    meta: {
      title: '应用详情'
    }
  }
]

const router = new VueRouter({
  routes
})

// 路由前置守卫
router.beforeEach(function (to, from, next) {
  // 如果本地没有userid，并且去的不是登录页面，
  // 直接返回登录页，否则放行
  if (!localStorage.getItem('userid')) {
    if (
      to.path !== '/login' &&
      to.path !== '/changePassword' &&
      to.path !== '/register' &&
      to.path !== '/newPassword' &&
      to.path !== '/resetSucceed'&&
      to.path !== '/protocol' &&
      to.path !== '/registerSucceed'&&
      to.path !== '/activateSucceed'
    ) {
      next('/login')
    }
  }
  next()
})

router.afterEach((to, from) => {
  document.title = to.meta.title
})

export default router
