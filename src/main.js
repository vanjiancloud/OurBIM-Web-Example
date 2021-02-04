import Vue from 'vue'
import App from './App.vue'
import router from './router'
// 引入element
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
// 引入全局样式
import './assets/css/global.css'
// 引入less
import less from 'less'
// 加载axios组件
import axios from '@/utils/request.js'
// import store from './store'
// 自动计算rem大小
import 'amfe-flexible'
import VueI18n from 'vue-i18n'
Vue.use(VueI18n)
Vue.use(less)
Vue.use(ElementUI)
// 把axiox放到原型上
Vue.prototype.$axios = axios

Vue.config.productionTip = false
const i18n = new VueI18n({
  locale: 'zh',
  messages: {
    zh: {
      register: '注册',
      login: '登录'
    },
    en: {
      register: 'register',
      login: 'login'
    }
  }
})
new Vue({
  router,
  i18n,
  render: h => h(App)
}).$mount('#app')
