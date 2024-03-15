import Vue from 'vue'
import App from './App.vue'
import router from './router'
// 引入element
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
// 引入全局样式
import '@/assets/css/global.less'
// 引入less
import less from 'less'
// 引入复制链接插件
import VueClipboard from 'vue-clipboard2'

// 引入国际化语言包
import VueI18n from 'vue-i18n'
import common from './utils/common.js' // 公共方法
import VueCropper from 'vue-cropper'
// 引入echart
import * as echarts from "echarts"
import 'echarts-liquidfill'
// 引入 iconfont
import './assets/iconLock/iconfont.css'

Vue.use(VueI18n)
Vue.use(VueCropper)
Vue.use(less)
Vue.use(VueClipboard)
    // vue 使用element-ui的el-dialog时 由于滚动条隐藏和出现导致页面抖动问题的解决
ElementUI.Dialog.props.lockScroll.default = false
Vue.use(ElementUI)

// 引入vuex
import store from "./store/vuex.js"
import config from '../server.config'

Vue.prototype.$config = config
    // 把$EventBus放到原型上
Vue.prototype.$EventBus = new Vue()
    // 把公共方法放到原型上
Vue.prototype.$common = common
Vue.config.productionTip = false
    // 把echarts放到原型上
Vue.prototype.$echarts = echarts

import onlyNumber from '@/directive/num'
Vue.use(onlyNumber)
import '@/icons'


new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app')