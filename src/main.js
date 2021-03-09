import Vue from 'vue'
import App from './App.vue'
import router from './router'
// 引入element
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
// 引入全局样式
import './assets/css/global.css'
// // 引入less
import less from 'less'
// 加载axios组件
import axios from '@/utils/request.js'
// 自动计算rem大小
import 'lib-flexible'
// 引入国际化语言包
import VueI18n from 'vue-i18n'

Vue.use(VueI18n)
Vue.use(less)
Vue.use(ElementUI)

// 把axiox放到原型上
Vue.prototype.$axios = axios
// 把$EventBus放到原型上
Vue.prototype.$EventBus = new Vue()

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
      userCenter: '用户中心',
      quit: '退出',
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
      Node: '剩余节点',
      service: '服务有效期',
      to: '至',
      Extension: '延长有效期',
      // 我的应用
      app: '我的应用',
      Youhave: '您共有',
      Application: '个应用',
      node: '节点:',
      into: '进入应用',
      release: '我的发布',
      management: '应用管理',
      Create: '创建应用',
      Account: '账户管理',
      // 我的发布
      wholes: '全部',
      article: '文章',
      Models: '模型',
      // 应用管理
      project: '个项目',
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
      twoStep: '步骤二',
      threeStep: '步骤三',
      setUP: '创建应用项目信息',
      shangchuan: '上传BIM模型',
      finsh: '上传完成',
      Youcanalsoupload: '您还可上传',
      toCreate: '创建应用',
      Upload: '上传模型',
      format: '仅支持.jpg.jpeg.png格式!',
      UploadBIM: '仅上传BIM模型',
      Uploadto: '同时上传倾斜摄影模型',
      methods: '点击或将文件拖拽到这里上传',
      limit: '仅支持上传扩展名：.rvt',
      Totransform: '开始转换',
      application: '应用名称:',
      Required: '必填项',
      Uploadc: '上传封面:',
      youlogin: '如果没有封面不能登录',
      nextstep: '下一步',
      // 账户管理
      accountManage: '账户管理',
      information: '个人信息',
      Authorization: '授权码',
      nouse: '如授权码不可，用请联系售后。',
      submit: '提交',
      Authorizations: '授权码:',
      Serviceorder: '服务订单',
      team: '团队',
      ChangePassword: '修改密码',
      // 个人信息
      autograph: '签名:',
      username: '用户名:',
      email: '邮箱:',
      Mobilephone: '手机号:',
      company: '公司:',
      position: '职位:',
      UploadAvatar: '上传头像',
      extensions: '支持扩展名',
      modify: '修改',
      verification: '验证',
      // 服务订单
      servicesorder: '服务订单',
      number: '编号',
      time: '时间',
      services: '服务',
      state: '状态',
      authorizationcode: '授权码',
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
      Sendverificationcode: '发送验证码',
      servicehotline: '24小时客服热线',
      // 应用详情
      webClient: {
        setting: [{
            label: "单位",
            tips: "请选择单位"
          },
          {
            label: "精度",
            tips: "请选择精度"
          }
        ],
        weather: [{
            label: "天气",
            value: "请选择天气"
          },
          {
            label: "时间"
          }
        ],
        browser: {
          title: "模型浏览器",
          tips: "暂无数据"
        },
        attribute: {
          title: "属性"
        }
      }
    },
    en: {
      register: 'register',
      login: 'login',
      introduction: 'Function introduction',
      Solution: 'Solution',
      cases: 'cases',
      Pricing: 'Pricing',
      consultation: 'consultation',
      userCenter: 'userCenter',
      quit: 'quit',
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
      Node: 'Remaining node',
      service: 'Service validity',
      to: 'to',
      Extension: 'Extension of validity',
      // 我的应用
      app: 'My app',
      Youhave: 'You have',
      Application: 'application',
      node: 'node:',
      into: 'application',
      release: 'release',
      management: 'Application',
      Create: 'Create app',
      Account: 'Account',
      // 我的发布
      wholes: 'whole',
      article: 'article',
      Models: 'Model',
      // 应用管理
      project: 'project',
      link: 'Add team link',
      share: 'share',
      edit: 'edit',
      delete: 'delete',
      applicationid: 'applicationID',
      applyname: 'apply name',
      maximum: 'Maximum number of concurrency',
      state: 'state',
      uploaddate: 'Upload date',
      operation: 'operation',
      // 创建应用
      Step: 'Step one',
      twoStep: 'Step two',
      threeStep: 'Step three',
      setUP: 'Create application project information',
      shangchuan: 'upload BIM model',
      finsh: 'upload finshed',
      Youcanalsoupload: 'You can also upload',
      toCreate: 'Create application project information',
      Upload: 'Upload model',
      format: 'Only support .jpg .jpeg .png format!',
      UploadBIM: 'Upload BIM model',
      Uploadto: 'Upload the tilt photography model as well',
      methods: 'Click or drag the file here to upload',
      limit: 'Only the upload extension:.rvt is supported',
      Totransform: 'Totransform',
      application: 'application:',
      Required: 'Required',
      Uploadc: 'Upload cover:',
      youlogin: 'If you dont have a cover, you cant log in ',
      nextstep: 'Next step',
      // 账户管理
      accountManage: 'accountManage',
      information: 'personal information',
      Authorization: 'Authorization code',
      nouse: 'If the authorization code is not available, please contact the customer service.',
      submit: 'submit',
      Authorizations: 'Authorization code:',
      Serviceorder: 'Service order',
      team: 'team',
      ChangePassword: 'Change Password',
      // 个人信息
      autograph: 'autograph:',
      username: 'username:',
      email: 'email:',
      Mobilephone: 'Mobile:',
      company: 'company:',
      position: 'position:',
      UploadAvatar: 'Upload Avatar',
      extensions: 'Support extensions',
      modify: 'modify',
      verification: 'verification',
      // 服务订单
      servicesorder: 'servicesorder',
      number: 'number',
      time: 'time',
      services: 'service',
      authorizationcode: 'authorization code',

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
      Sendverificationcode: 'Send verification code',
      servicehotline: '24-hour customer service hotline',
      // 应用详情
      webClient: {
        setting: [{
            label: "unit",
            tips: "Please select a unit"
          },
          {
            label: "accuracy",
            tips: "Please select a accuracy"
          }
        ],
        weather: [{
            label: "weather",
            value: "Please select a weather"
          },
          {
            label: "time"
          }
        ],
        browser: {
          title: "Model browser",
          tips: "No data available"
        },
        attribute: {
          title: "attribute"
        }
      }
    }
  }
})

new Vue({
  router,
  i18n,
  render: h => h(App)
}).$mount('#app')
