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
      login: '登录',
      introduction: '功能介绍',
      Solution: '解决方案',
      cases: '成功案例',
      Pricing: '产品订价',
      consultation: '最新咨询',
      developer: '开发者',
      APIdov: 'API文档',
      project: '示例项目',
      Mcenter: '模型中心',
      Service: '服务中心',
      log: '更新日志',
      whole: '全部',
      info: '资讯',
      case: '案例',
      activity: '活动',
      Model: '模型',
      content: '请输入搜索内容',
      occupancy: '资源占用',
      storage: '剩余储存',
      node: '剩余应用：无限 剩余节点 3/3',
      service: '服务有效期',
      daty: '2021-01-01至2026-01-01',
      Extension: '延长有效期',
      app: '我的应用',
      release: '我的发布',
      management: '应用管理',
      Create: '创建应用',
      Account: '账单管理',
      // 我的发布
      wholes: '全部',
      article: '文章',
      Models: '模型',
      // 应用管理
      link: '添加团队链接',
      share: '分享',
      edit: '编辑',
      delete: '删除',
      applicationid: '应用ID',
      applyname: '应用名称',
      maximum: '最大并发数量',
      state: '状态',
      uploaddate: '上传日期',
      operation: '操作',
      // 创建应用
      Step: '步骤一',
      toCreate: '创建应用项目信息',
      twoStep: '步骤二',
      Upload: '上传BIM模型',
      application: '应用名称:',
      Required: '必填项',
      Uploadc: '上传封面:',
      youlogin: '如果没有封面不能登录',
      nextstep: '下一步',
      // 账户管理
      information: '个人信息',
      Authorization: '授权码',
      Authorizations: '授权码:',
      Serviceorder: '服务订单',
      team: '团队',
      ChangePassword: '修改密码',
      // 个人信息
      autograph: '签名',
      email: '邮箱',
      Mobilephone: '手机号',
      company: '公司',
      position: '职位',
      UploadAvatar: '上传头像',
      extensions: '支持扩展名',
      modify: '修改',
      verification: '验证',
      // 服务订单
      number: '编号',
      time: '时间',
      services: '服务',
      amountofmoney: '金额',
      // 团队
      organized: '我组织的',
      joined: '我加入的',
      applications: '应用',
      establishment: '成立时间',
      role: '角色',
      sign: '退出',
      dissolution: '解散',
      remove: '移除',
      // 修改密码
      ChangePasswor: '修改密码:',
      Original: '原密码',
      Newpassword: '新密码',
      Confirmpassword: '确认密码',
      VerificationCode: '验证码',
      Sendverificationcode: '发送验证码'
    },
    en: {
      register: 'register',
      login: 'login',
      introduction: 'Function introduction',
      Solution: 'Solution',
      cases: 'cases',
      Pricing: 'Pricing',
      consultation: 'consultation',
      developer: 'developer',
      APIdov: 'APIdocumentation',
      project: 'project',
      Mcenter: 'Model center',
      Service: 'Service center',
      log: 'log',
      whole: 'whole',
      info: 'real-time info',
      case: 'case',
      activity: 'activity',
      Model: 'model',
      content: 'Please enter search content',
      occupancy: 'Resource occupancy',
      storage: 'Remaining storage',
      node: 'Residual application: infinite residual node 3 / 3',
      service: 'Service validity',
      daty: 'January 1, 2021 to January 1, 2026',
      Extension: 'Extension of validity',
      app: 'My app',
      release: 'release',
      management: 'Application management',
      Create: 'Create app',
      Account: 'Account management',
      // 我的发布
      wholes: 'whole',
      article: 'article',
      Models: 'Model',
      // 应用管理
      link: 'Add team link',
      share: 'share',
      edit: 'edit',
      delete: 'delete',
      applicationid: 'applicationID',
      applyname: 'apply name',
      maximum: 'Maximum concurrent quantity',
      state: 'state',
      uploaddate: 'Upload date',
      operation: 'operation',
      // 创建应用
      Step: 'Step one',
      toCreate: 'Create application project information',
      twoStep: 'Step two',
      Upload: 'Upload BIM model',
      application: 'application:',
      Required: 'Required',
      Uploadc: 'Upload cover:',
      youlogin: 'If you dont have a cover, you cant log in ',
      nextstep: 'Next step',
      // 账户管理
      information: 'personal information',
      Authorization: 'Authorization code',
      Authorizations: 'Authorization code:',
      Serviceorder: 'Service order',
      team: 'team',
      ChangePassword: 'Change Password',
      // 个人信息
      autograph: 'autograph',
      email: 'email',
      Mobilephone: 'Mobile phone number',
      company: 'company',
      position: 'position',
      UploadAvatar: 'Upload Avatar',
      extensions: 'Support extensions',
      modify: 'modify',
      verification: 'verification',
      // 服务订单
      number: 'number',
      time: 'time',
      services: 'service',
      amountofmoney: 'amount of money',
      // 团队
      organized: 'I organized it',
      joined: 'I joined',
      applications: 'application',
      establishment: 'Time of establishment',
      role: 'role',
      sign: 'sign out',
      dissolution: 'dissolution',
      remove: 'remove',
      // 修改密码
      ChangePasswor: 'Change Password:',
      Original: 'Original password',
      Newpassword: 'New password',
      Confirmpassword: 'Confirm password',
      VerificationCode: 'Verification Code',
      Sendverificationcode: 'Send verification code'
    }
  }
})
new Vue({
  router,
  i18n,
  render: h => h(App)
}).$mount('#app')
