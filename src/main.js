import Vue from 'vue'
import App from './App.vue'
import router from './router'
// 引入element
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
// 引入less
import less from 'less'
// 加载axios组件
import axios from '@/utils/request.js'
Vue.use(less)
Vue.use(ElementUI)
// 把axiox放到原型上
Vue.prototype.$axios = axios

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
