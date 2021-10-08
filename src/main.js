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
// 引入复制链接插件
import VueClipboard from 'vue-clipboard2'

// 加载axios组件
import axios from '@/utils/request.js'
// 自动计算rem大小
// import 'lib-flexible'
// 引入国际化语言包
import VueI18n from 'vue-i18n'
import common from './utils/common.js' // 公共方法
import VueCropper from 'vue-cropper'
// 引入echart
import * as echarts from "echarts"
import 'echarts-liquidfill'

Vue.use(VueI18n)
Vue.use(VueCropper)
Vue.use(less)
Vue.use(VueClipboard)
// vue 使用element-ui的el-dialog时 由于滚动条隐藏和出现导致页面抖动问题的解决
ElementUI.Dialog.props.lockScroll.default = false
Vue.use(ElementUI)

// 把axiox放到原型上
Vue.prototype.$axios = axios
// 把$EventBus放到原型上
Vue.prototype.$EventBus = new Vue()
// 把公共方法放到原型上
Vue.prototype.$common = common
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
      Pricing: '产品定价',
      consultation: '最新资讯',
      userCenter: '用户中心',
      quit: '退出',
      developer: '开发者',
      APIdov: 'API文档',
      projects: '示例项目',
      Mcenter: '模型中心',
      Service: '服务中心',
      log: '更新日志',
      whole: '全部',
      info: '资讯',
      case: '案例',
      activity: '活动',
      Model: '模型',
      content: '请输入搜索内容',
      Noupload: '未上传昵称',
      noupload: '未上传签名',
      occupancy: '资源占用',
      storage: '已用储存',
      Node: '已用节点',
      service: '服务有效期',
      to: '至',
      Extension: '延长有效期',
      // 我的应用
      app: '我的项目',
      Youhave: '您共有',
      Application: '个应用',
      node: '节点:',
      into: '进入项目',
      release: '我的发布',
      management: '项目管理',
      Create: '创建项目',
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
      applicationid: '项目ID',
      applyname: '项目名称',
      maximum: '最大并发数量',
      state: '状态',
      uploaddate: '上传日期',
      operation: '操作',
      edit: '编辑',
      del: '删除',
      // 创建应用
      Step: '步骤一',
      twoStep: '步骤二',
      threeStep: '步骤三',
      setUP: '创建项目信息',
      shangchuan: '上传BIM模型',
      finsh: '上传完成',
      Youcanalsoupload: '您还可上传',
      toCreate: '创建项目',
      Upload: '上传模型',
      format: '仅支持.jpg.jpeg.png格式!',
      UploadBIM: '仅上传BIM模型',
      Uploadto: '同时上传倾斜摄影模型',
      methods: '点击或将文件拖拽到这里上传',
      uploadLimit: '文件上传限制200MB',
      uploadGoBeyond: '超出200MB请联系我们',
      xianzhi: '每次只能上传一个模型',
      limit: '支持上传扩展名：.rvt, .ifc',
      Render: '开始转换',
      application: '项目名称：',
      Required: '必填项',
      Uploadc: '上传封面：',
      youlogin: '如果没有封面不能登录',
      nextstep: '下一步',
      manage: '转到项目管理',
      // 账户管理
      accountManage: '账户管理',
      information: '个人信息',
      Authorization: '授权码',
      nouse: '如授权码不可用，请联系售后。',
      submit: '提交',
      Authorizations: '授权码：',
      Serviceorder: '服务订单',
      team: '团队',
      ChangePassword: '修改密码',
      // 个人信息
      autograph: '签名：',
      username: '用户名：',
      email: '邮箱：',
      Mobilephone: '手机号：',
      company: '公司：',
      position: '职位：',
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
        setting: [
          {
            label: '单位',
            tips: '请选择单位'
          },
          {
            label: '精度',
            tips: '请选择精度'
          }
        ],
        weather: [
          {
            label: '天气',
            value: '请选择天气'
          },
          {
            label: '时间'
          }
        ],
        browser: {
          title: '模型浏览器',
          tips: ['加载中', '暂无数据']
        },
        tag: {
          title: '标签树',
          tips: ['加载中', '暂无数据']
        },
        attribute: {
          title: '属性'
        },
        labelBox: {
          title: '标签'
        },
        componentLibrary: {
          title: '构件库'
        },
        qrcodePart: {
          title: '二维码',
        },
        loadBox: {
          title: [
            '长时间未交互，已自动断开，刷新即可重连。',
            '加载中',
            '长时间未交互，已自动断开，刷新即可重连。',
            '模型长时间未响应，请刷新重试。'
          ],
          message: [
            '免费体验3分钟',
            '场景未加载，请刷新',
            '指令下发成功',
            '指令下发失败',
            '请求失败',
            '正在执行添加视角，请稍候……',
            '长时间未操作，已自动关闭，刷新即可重新进入。'
          ]
        },
        cubeBox: {
          direction: ['前', '后', '上', '下', '左', '右'],
          handle: ['正交投影', '透视投影', '自定义主视图', '重置主视图']
        },
        tooltipList: {
          toolPerson: ["第一人称", "上帝视角", "第三人称"],
          tool: ["视角", "移动速度", "模型剖切", "测量", "标签", "小地图", "关注视点", "模型动画", "分解模型", "渲染环境", "浏览器", "属性"],
          subtool: ["坐标", "距离", "角度", "设置"],
          sliceTool: ["移动", "旋转", "反选", "指定", "重置"],
        },
        deleteList: [
          {
            title: '提示',
            content: '此操作将永久删除该记录, 是否继续?',
            confirm: '确定',
            cancel: '取消',
            successMessage: '删除成功！',
            cancelMessage: '已取消删除'
          }
        ],
        dialogList: [
          {
            title: '提示',
            label: '名称',
            confirm: '确认',
            cancel: '取消',
            successMessage: '修改成功！',
            saveMessage: '添加成功！'
          }
        ]
      }
    },
    en: {
      register: 'register',
      login: 'login',
      introduction: 'Function introduction',
      Solution: 'Solution',
      cases: 'Cases',
      Pricing: 'Pricing',
      consultation: 'Consultation',
      userCenter: 'userCenter',
      quit: 'quit',
      developer: 'Developer',
      APIdov: 'APIdocumentation',
      projects: 'project',
      Mcenter: 'Model center',
      Service: 'Service center',
      log: 'log',
      whole: 'whole',
      info: 'real-time info',
      case: 'case',
      activity: 'activity',
      Model: 'model',
      content: 'Please enter search content',
      Noupload: 'Upload name',
      noupload: 'Upload sign',
      occupancy: 'Resource occupancy',
      storage: 'Have used storage',
      Node: 'Have used node',
      service: 'Service validity',
      to: 'to',
      Extension: 'Extension of validity',
      // 我的应用
      app: 'My app',
      Youhave: 'You have',
      Application: 'application',
      node: 'node:',
      into: 'Application',
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
      applicationid: 'Application ID',
      applyname: 'Apply name',
      maximum: 'Maximum number of concurrency',
      state: 'State',
      uploaddate: 'Upload date',
      operation: 'Operation',
      edit: 'Edit',
      del: 'Delete',
      // 创建应用
      Step: 'Step one',
      twoStep: 'Step two',
      threeStep: 'Step three',
      setUP: 'Create application project information',
      shangchuan: 'Upload BIM model',
      finsh: 'Upload finshed',
      Youcanalsoupload: 'You can also upload',
      toCreate: 'Create application project information',
      Upload: 'Upload model',
      format: 'Only support .jpg .jpeg .png format!',
      UploadBIM: 'Upload BIM model',
      Uploadto: 'Upload the tilt photography model as well',
      methods: 'Click or drag the file here to upload',
      xianzhi: 'Only one model can be uploaded at a time',
      limit: 'Only the upload extension:.rvt is supported',
      Render: 'Transform',
      application: 'Application:',
      Required: 'Required',
      Uploadc: 'Upload cover:',
      youlogin: 'If you dont have a cover, you cant log in ',
      nextstep: 'Next step',
      manage: 'To manage',
      // 账户管理
      accountManage: 'Account Manage',
      information: 'Personal information',
      Authorization: 'Authorization code',
      nouse:
        'If the authorization code is not available, please contact the customer service.',
      submit: 'Submit',
      Authorizations: 'Authorization code:',
      Serviceorder: 'Service order',
      team: 'team',
      ChangePassword: 'Change Password',
      // 个人信息
      autograph: 'Autograph:',
      username: 'Username:',
      email: 'Email:',
      Mobilephone: 'Mobile:',
      company: 'Company:',
      position: 'Position:',
      UploadAvatar: 'Upload Avatar',
      extensions: 'Support extensions',
      modify: 'Modify',
      verification: 'Verification',
      // 服务订单
      servicesorder: 'Servicesorder',
      number: 'Number',
      time: 'Time',
      services: 'Service',
      authorizationcode: 'Authorization code',
      amountofmoney: 'Amount of money',
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
        setting: [
          {
            label: 'unit',
            tips: 'Please select a unit'
          },
          {
            label: 'accuracy',
            tips: 'Please select a accuracy'
          }
        ],
        weather: [
          {
            label: 'weather',
            value: 'Please select a weather'
          },
          {
            label: 'time'
          }
        ],
        browser: {
          title: 'Model browser',
          tips: 'No data available'
        },
        attribute: {
          title: 'attribute'
        },
        componentLibrary: {
          title: 'component library'
        },
        qrcodePart: {
          title: 'QR code',
        },
        loadBox: {
          title: [
            'After 3 seconds, it will exceed the free experience time. You can refresh and re-enter.',
            'Model Loading',
            'After the free experience time, you can refresh and re-enter.',
            'The model has not responded for a long time, please refresh and try again.'
          ],
          message: [
            'Free experience for 3 minutes',
            'Scene not loaded, please refresh',
            'Command issued successfully',
            'Command issue failed',
            'request was aborted'
          ]
        },
        cubeBox: {
          direction: ['front', 'back', 'up', 'down', 'left', 'right'],
          handle: [
            'Orthogonal projection',
            'perspective projection',
            'Reduction model'
          ]
        },
        tooltipList: {
          toolPerson: ['first person', 'third person', 'Follow the characters'],
          tool: [
            'visual angle',
            'Moving speed',
            'Model slicing',
            'measure',
            'label',
            'Mini Map',
            'Focus on Perspective',
            'Model animation',
            'Decomposition model',
            'Rendering environment',
            'browser',
            'attribute'
          ],
          subtool: ['coordinate', 'distance', 'angle', 'set']
        },
        deleteList: [
          {
            title: 'Tips',
            content:
              'This operation will permanently delete the record. Do you want to continue?',
            confirm: 'confirm',
            cancel: 'cancel',
            successMessage: 'Delete successfully!',
            cancelMessage: 'Deletion canceled'
          }
        ],
        dialogList: [
          {
            title: 'Tips',
            label: 'name',
            confirm: 'confirm',
            cancel: 'cancel',
            successMessage: 'Modified successfully!',
            saveMessage: 'Successfully added!'
          }
        ]
      }
    }
  }
})
// 把echarts放到原型上
Vue.prototype.$echarts = echarts

console.log("当前请求的基本地址", process.env.REQUEST_URL);


new Vue({
  router,
  i18n,
  render: h => h(App)
}).$mount('#app')
