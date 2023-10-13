import Vue from 'vue'
import Router from 'vue-router'
// 引入路由组件
import Layout from '@/views/Layout/index.vue'



Vue.use(Router)

const routes = [
    // 登录页面
    {
        path: '/login',
        name: 'login',
        component: () =>
            import ('../views/login/index.vue'),
        meta: {
            title: 'OurBIM-性能遥遥领先的BIM引擎平台'
        },
        hidden: true
    },
    // Layout
    {
        path: '/',
        component: Layout,
        redirect: 'manage', //重定向到项目管理
        meta: { title: '项目中心', icon: 'menu1' },
        children: [
            {
                path: 'manage',
                component: () => import('@/views/projectManage/model/index.vue'),
                meta: {
                    title: '模型管理'
                }
            },
            {
                path: 'GISList',
                component: () => import('@/views/projectManage/GISList/index.vue'),
                meta: {
                    title: 'GIS数据服务'
                }
            },
            {
                path: 'CADList',
                component: () => import('@/views/projectManage/CADList/index.vue'),
                meta: {
                    title: '图纸管理'
                }
            },
            {
                path: 'office',
                component: () => import('@/views/projectManage/officeManage/index.vue'),
                meta: {
                    title: '文档管理'
                }
            },
            {
                path: 'resource',
                component: () => import('@/views/projectManage/resource/index.vue'),
                meta: {
                    title: '资源库管理'
                }
            },
        ]
    },{
        path: '/server',
        component: Layout,
        meta: { title: '云服务管理', icon: 'menu2' },
        children: [
            {
                path: 'progress',
                component: () => import('@/views/server/progress/index.vue'),
                meta: {
                    title: '进程管理'
                }
            },{
                path: 'terminal',
                component: () => import('@/views/server/terminal/index.vue'),
                meta: {
                    title: '终端管理'
                }
            },{
                path: 'prestart',
                component: () => import('@/views/server/prestart/index.vue'),
                meta: {
                    title: '预启动管理'
                }
            },{
                path: 'parameter',
                component: () => import('@/views/server/parameter/index.vue'),
                meta: {
                    title: '参数管理'
                }
            }
        ]
    },{
        path: '/expense',
        component: Layout,
        meta: { title: '费用管理', icon: 'menu3' },
        children: [
            {
                path: 'code',
                component: () => import('@/views/expense/code/index.vue'),
                meta: {
                    title: '授权码管理'
                }
            },{
                path: 'recharge',
                component: () => import('@/views/expense/recharge/index.vue'),
                meta: {
                    title: '购买充值'
                }
            },{
                path: 'order',
                component: () => import('@/views/expense/order/index.vue'),
                meta: {
                    title: '订单管理'
                }
            },{
                path: 'consumption',
                component: () => import('@/views/expense/consumption/index.vue'),
                meta: {
                    title: '消费账单管理'
                }
            }
        ]
    },{
        path: '/account',
        component: Layout,
        meta: { title: '账号管理', icon: 'menu4' },
        children: [
            {
                path: 'userAccount',
                component: () => import('@/views/account/userAccount/index.vue'),
                meta: {
                    title: '账号信息'
                }
            },{
                path: 'password',
                component: () => import('@/views/account/password/index.vue'),
                meta: {
                    title: '安全设置'
                }
            }
        ]
    },
    // 忘记密码
    {
        path: '/changePassword',
        name: 'changePassword',
        component: () =>
            import ('../views/changepassword/index.vue'),
        meta: {
            title: 'OurBIM重置密码'
        },
        hidden: true
    },
    // 注册页
    {
        path: '/register',
        name: 'register',
        component: () =>
            import ('../views/register/index.vue'),
        meta: {
            title: 'OurBIM注册'
        },
        hidden: true
    },
    // 协议书
    {
        path: '/protocol',
        name: 'protocol',
        component: () =>
            import ('../views/register/protocol.vue'),
        meta: {
            title: 'OurBIM用户须知'
        },
        hidden: true
    },
    // 注册成功
    {
        path: '/registerSucceed',
        name: 'registerSucceed',
        component: () =>
            import ('../views/register/registerSucceed.vue'),
        meta: {
            title: 'OurBIM注册成功'
        },
        hidden: true
    },
    // 修改密码成功
    {
        path: '/resetSucceed',
        name: 'resetSucceed',
        component: () =>
            import ('../views/resetSucceed/index.vue'),
        meta: {
            title: 'OurBIM重置密码成功'
        },
        hidden: true
    },
    // 应用详情
    {
        path: '/web_client',
        name: 'web_client',
        component: () =>
            import ('../views/userCenter/subpage/web_client.vue'),
        meta: {
            title: '应用详情'
        },
        hidden: true
    },
]


const createRouter = () => new Router({
    // mode: 'history', // require service support
    scrollBehavior: () => ({ y: 0 }),
    routes: routes
})
  
const router = createRouter()

// 路由前置守卫
router.beforeEach(function(to, from, next) {
    // 如果sessionStorage中没有userid，并且去的不是登录页面，
    // 直接返回登录页，否则放行
    if (!sessionStorage.getItem('userid')) {
        if (
            to.path !== '/login' &&
            to.path !== '/changePassword' &&
            to.path !== '/register' &&
            to.path !== '/resetSucceed' &&
            to.path !== '/protocol' &&
            to.path !== '/registerSucceed' &&
            to.path !== '/web_client' &&
            to.path !== '/'
        ) {
            next('/login')
        } else {
            next()
        }
    } else {
        next()
    }
})

router.afterEach((to, from) => {
    document.title = to.meta.title
})


export function resetRouter() {
    router.matcher = router.matcher // reset router
}

export default router