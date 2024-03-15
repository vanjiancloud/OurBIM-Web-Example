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
            import ('@/views/login/index.vue'),
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
        ]
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
            to.path !== '/web_client' &&
            to.path !== '/' &&
            to.path !== '/stream'
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