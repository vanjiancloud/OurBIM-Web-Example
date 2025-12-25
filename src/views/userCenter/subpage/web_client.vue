<!--
 * @Author: zk
 * @Date: 2021-03-10 14:08:18
 * @LastEditors: zk
 * @LastEditTime: 2024-10-27 13:37:06
 * @description: 
-->
<template>
  <div class="bim-main">
    <iframe allowfullscreen="true" :class="{ 'phone-bim': isMobile() }" v-if="webUrl" :src="webUrl" frameborder="0"
      id="show-bim" />

    <!-- 遮罩层 -->
    <div class="hidden-bim" v-if="mask"
      :style="{ background: `#000000 url(${logoImg.startUpBkgImg}) no-repeat center` }">
      <img v-if="logoImg.startUpLogo" :src="logoImg.startUpLogo" class="show-loading" alt="" />
      <div class="hidden-text">{{ baseExceptMessge }}</div>
    </div>

    <!-- 模型加载进度 -->
    <transition name="el-fade-in-linear">
      <progress-bar v-if="isProgress && propsProgress.data < 100" :propsProgress="propsProgress"
        :isMobile="isMobile() && islandscape && mobile"></progress-bar>
    </transition>

    <!-- UI包装容器 适配移动端横屏模式时ui旋转90度 -->
    <div class="ui-wrapper" :class="{ 'landscape': isMobile() && islandscape && mobile }">
      <div v-if="(isMobile() && islandscape) || !isMobile()">
        <!-- 右上角 -->
        <view-cube v-if="controllerInfo.viewCube && controllerInfo.tagUiBar && !isFade" :userType="userType"
          :taskId="taskId" ref="getCube"></view-cube>
        <!-- 协同模式弹窗 -->
        <teamwork-dialog ref="teamworkDialogRef" :shareCode="shareCode" :appId="appId"></teamwork-dialog>
        <div class="invite-team-friend" v-if="userType === '1'">
          <div class="invite-btn" @click="openTeamDialog">
            <img src="./friend.png" alt="" /> 邀请成员
          </div>
        </div>
        <EscDialogItem ref="EscDialogItem" :title="escTitle" />
        <!-- 构件操作图标 -->
        <OperatingTools ref="OperatingTools" v-if="showOperatingTools" :data="{ taskId }" class="operatingStyle" />

        <div v-show="controllerInfo.tagUiBar" v-if="isUiBar && !isFade">
          <!-- 漫游导航 -->
          <roamNavigate ref="roamNavigate" :taskId="taskId" v-show="checkShow('roaming')"></roamNavigate>
          <!-- 资源库 -->
          <ResourcePool ref="ResourcePool" :data="{ modelType, taskId, userId, selectPark, materialData, pakIdMapweb }"
            v-show="checkShow('resource')" />
          <!-- 构件信息 -->
          <ComponentInformation ref="ComponentInformation"
            :data="{ taskId, memberInfo, materialData, pakIdMapweb, selectPark, isGis, deletePolygon, copyingPictures }"
            v-show="checkShow('componentInformation')" />
          <!-- 天气 -->
          <Weather ref="Weather" :data="{ taskId, appId, isBuild }" v-show="checkShow('renderingEnvironment')" />
          <!-- 标签 -->
          <Label ref="Label" v-show="checkShow('label')" :data="{ taskId, appId, clickTagData, userId }" />
          <!-- 标签库 -->
          <TagLibrary ref="TagLibrary" v-show="checkShow('label')" :data="{ taskId, appId }" />
          <!-- (视图) -->
          <viewPhoto ref="viewPhoto" v-show="checkShow('view')" :viewPic="showViewPicture" :setProps="{ taskId }"
            :taskId="taskId" @closeClick="showViewPicture = '0'" @hideViewSubMenu="hideViewSubMenu"></viewPhoto>
          <!-- 模型浏览器 -->
          <ComponentTree ref="ComponentTree" v-show="checkShow('browser')" :memberInfo.sync="memberInfo"
            :data="{ taskId, appId, isGis }" />
          <!-- 过滤器 -->
          <ComponentFilter @onActor="onActor" ref="ComponentFilter" v-show="checkShow('componentFilter')"
            :data="{ taskId, appId, selectPark, multiComponents, memberInfo }" />
          <!-- 定位码 -->
          <LocationCode ref="LocationCode" v-show="checkShow('locationCode')" :data="{ taskId, appId }" />
          <!-- 动画 -->
          <ModelAnimation ref="ModelAnimationRef" v-show="checkShow('modelAnimation')"
            :data="{ modelType, taskId, appId, userId, selectPark, multiComponents, animationKeyframe }" />
          <!-- 底部工具栏 -->
          <Tool ref="Tool" v-model="activeToolArr"
            :data="{ taskId, appId, selectPark, multiComponents, isGis, hideTools: controllerInfo.hideTools, showTools: controllerInfo.showTools }"
            @onSuccess="toolSuccess" />
          <!-- 设置比例尺弹窗 -->
          <DialogScale ref="DialogScale" :data="{ taskId, userId, copyingPictures }" />
          <!-- 墙/样条线/面层顶部绘制菜单 -->
          <DrawMenu ref="DrawMenuRef" :data="{ taskId, userId, selectPark, materialData, pakIdMapweb }" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Drawer from '@/components/Drawer/index.vue'
import { doAction, setGizmoMode, getPakIdByAppId, requestOurBim, connectWebsocket } from "@/api/userCenter/index";
import { getLogo } from '@/api/server/parameter'
import { lockControl } from "@/api/userCenter/componentManage.js";
import viewCube from "@/components/web_client/view_cube";
import roamNavigate from "@/components/web_client/roam_navigate";
import viewPhoto from "@/components/web_client/view_photo";
import progressBar from "@/components/web_client/progress_bar";
import TeamworkDialog from "@/views/projectManage/model/TeamworkDialog.vue";
import EscDialogItem from "@/components/web_client/EscDialogItem.vue";
import { Getuserid } from "@/store/index.js"; // (自定义构件)
import Weather from "../weather/index.vue"; // 天气系统
import ResourcePool from "../resourcePool/index.vue"; // 资源库
import ComponentInformation from "../componentInformation/index.vue"; //构件信息
import Label from "../label/index.vue"; //标签
import TagLibrary from "../label/tagLibrary.vue"; //标签库
import ComponentTree from "../componentManage/componentTree.vue"; //构件树
import ComponentFilter from "../componentFilter/index.vue"; //过滤器
import LocationCode from "../locationCode/index.vue"; //定位码
import ModelAnimation from "../modelAnimation/index.vue"; //动画
import Tool from "../Tool/index.vue"; //底部工具栏
import DialogScale from "@/views/userCenter/resourcePool/DialogScale.vue"; //设置比例尺弹窗
import { EventBus } from '@/utils/bus.js'
import OperatingTools from "@/components/OperatingTools";
import DrawMenu from "@/views/userCenter/DrawMenu/index.vue";
import {
  backgroundSetting
} from '@/api/userCenter/weather.js'
import { updateBuildState, blueprintInit, setOutLineParams, getAreaByActor } from "@/api/projectManage/model.js";
import { setToken } from '@/utils/auth';

export default {
  name: "look_app",
  components: {
    viewCube,
    progressBar,
    TeamworkDialog,
    EscDialogItem,
    roamNavigate,
    viewPhoto,
    Weather,
    ResourcePool,
    ComponentInformation,
    Tool,
    Label,
    TagLibrary,
    DialogScale,
    ComponentTree,
    LocationCode,
    Drawer,
    OperatingTools,
    ComponentFilter,
    ModelAnimation,
    DrawMenu,
  },
  data() {
    return {
      mask: true,
      logoImg: {
        startUpLogo: '',
        startUpBkgImg: ''
      },
      baseExceptMessge: "环境加载中…",
      userId: '',
      activeToolArr: [],//工具栏打开的内容
      isGis: false,
      showViewPicture: '0', // 传递给 viewPhoto 控制视图列表的显示 (视图)
      shareCode: null,
      propsProgress: {
        data: 0,
      },

      isProgress: false,
      //   uiBar： ，viewCube：导航里的viewCube，tagUiBar：底部栏显示隐藏，
      controllerInfo: {
        uiBar: true,
        viewCube: true,
        tagUiBar: true,
        hideTools: [],//选择性隐藏工具栏数组
        showTools: [],//选择性显示工具栏数组
      },
      webUrl: null,
      appId: null,
      isBuild: null,
      modelType: null,// 区分是模型(model) 还是 自定义构件(com)
      taskId: null,
      isFade: true,
      memberInfo: [], //属性信息
      deletePolygon: {},// 键盘delete删除的多边形uuid信息
      loadTimer: null,
      websock: null,
      socketTimer: null,
      isUiBar: true,
      userType: null,
      // （材质库）
      materialData: {},
      selectPark: null,//选择构件
      multiComponents: [],//多选构件
      // 贴图库 公共库的信息
      pakIdMapweb: '', // 区分点击的是自定义构件还是模型自带的构件
      pakAndAppid: [],
      escTitle: '',//esc显示名称
      copyingPictures: {},//临摹图信息
      client: null, //mqtt
      showOperatingTools: false,//是否打开操作轴
      clickTagData: null,//点击标签的数据id=9
      animationKeyframe: null,//动画关键帧信息
      mobile: false,
      // 移动端访问默认是否横屏模式 横屏模式无论旋转手机都显示工具栏并且横屏宽高比显示模型  自定义模式根据首次打开的视口宽高来初始化模型宽高比并且不显示工具栏
      islandscape: false,
      showLogoControls: false,//移动端访问是否显示触摸盘
    };
  },
  computed: {
    ...mapGetters(["componentAllInfo", "materialAllInfo", "isAnimationLinkage"]),
    designStore() {
      return this.$store.state.design
    }
  },
  watch: {},
  created() {
    // 移动端横竖屏配置
    if (this.$route.query.islandscape) this.islandscape = this.$route.query.islandscape === 'true' || this.$route.query.islandscape === true;
    if (this.$route.query.showLogoControls) this.showLogoControls = this.$route.query.showLogoControls === 'true' || this.$route.query.showLogoControls === true;
    // 
    this.userId = this.$route.query.userId || Getuserid() || 'travels';
    this.getLogo("startUpLogo");
    this.getLogo("startUpBkgImg");
    this.appId = this.$route.query.appid;
    this.isUiBar = this.$route.query.uibar === undefined || this.$route.query.uibar == true;
    this.isBuild = this.$route.query.isBuild;
    this.modelType = this.$route.query.modelType || 'model';
    // appType  0:普通模型(isGis: GIS模型)   1:漫游模型   3:链接模型(isGis: GIS链接模型)  4:示例模型    5:云应用
    this.isGis = (this.$route.query.isGis && eval(this.$route.query.isGis.toLowerCase())) || (this.$route.query.weatherBin && eval(this.$route.query.weatherBin.toLowerCase())) || false

    // 自定义模型-菜单隐藏控制
    if (this.modelType === 'com') {
      this.controllerInfo.hideTools = ['label','locationCode']
    }
    // 如果是云应用就去掉遮罩层和操作栏以及加载进度---
    if (this.$route.query.appType === '5') {
      this.isFade = false;
    }

    this.getModelUrl();
  },
  mounted() {
    this.setTimeLoad();
    this.addMessageEvent();
    this.getLinkModelAppid(); // 获取appid
    // window.addEventListener('orientationchange', () => {
    //   // 处理横竖屏变化的逻辑
    //   console.log(window.orientation)
    // });
    this.updateOrientation();
    window.addEventListener('resize', this.updateOrientation);
    this.setBus();
  },
  destroyed() {
    console.log('🚀🚀🚀destroyed------------');
    this.clearTimePass();
    this.closeWebSocket();
    // 重置打开的工具面板
    this.resetActiveToolArr()
    EventBus.$off('openToolPart', this.openToolPart)
    window.removeEventListener('resize', this.updateOrientation);
    // 清理旋转类名
    document.body.classList.remove('mobile-portrait-element-rotation')
  },
  deactivated() {
    console.log('🚀🚀🚀deactivated------------');
    this.clearTimePass();
    this.closeWebSocket();
    // 重置打开的工具面板
    this.resetActiveToolArr()
    EventBus.$off('openToolPart', this.openToolPart)
    window.removeEventListener('resize', this.updateOrientation);
    // 清理旋转类名
    document.body.classList.remove('mobile-portrait-element-rotation')
  },
  methods: {
    setBus() {
      EventBus.$on('openToolPart', this.openToolPart)
    },
    resetActiveToolArr() {
      this.activeToolArr = [];
    },
    updateOrientation() {
      if (this.isMobile()) {
        if (this.islandscape) {
          if (window.innerWidth > window.innerHeight) {
            // console.log('横屏')
            this.mobile = false;
            // 移除旋转类名
            document.body.classList.remove('mobile-portrait-element-rotation')
          } else {
            // console.log('竖屏')
            this.mobile = true
            // 添加旋转类名
            document.body.classList.add('mobile-portrait-element-rotation')
          }
        } else {
          this.mobile = false
          // 移除旋转类名
          document.body.classList.remove('mobile-portrait-element-rotation')
        }
      } else {
        this.mobile = false
        // 移除旋转类名
        document.body.classList.remove('mobile-portrait-element-rotation')
      }
    },
    // 获取中logo
    getLogo(type) {
      let url = `${this.$config.VUE_APP_REQUEST_URL}/cloudServiceImg/downloadImg?userId=${this.userId}&type=${type}&time=${new Date().getTime()}`
      let data = {
        userId: this.userId,
        type
      }
      let imgs = {
        startUpLogo: require('@/assets/images/logo/logo.png'),
        startUpBkgImg: require('@/assets/images/logo/loading.png')
      }
      getLogo(data).then(res => {
        if (res.message === "用户已上传图片") {
          this.$set(this.logoImg, type, url)
        } else {
          this.$set(this.logoImg, type, imgs[type])
        }
      }).catch(() => {
        this.$set(this.logoImg, type, imgs[type])
      })
    },
    // 监听ifrmae
    listenerIframe() {
      this.$nextTick(() => {
        const iframe = document.getElementById('show-bim')
        iframe.addEventListener('load', () => { this.mask = false }, true)
        // console.log('去掉外层mask');
      })
    },
    // 是否打开操作轴
    openOperatingTools(e) {
      this.showOperatingTools = e
      const params = {
        taskId: this.taskId,
        flag: e ? "on" : "off"
      }
      lockControl(params).then((res) => {
        if (params.flag === 'on') {
          let params = {
            taskId: this.taskId,
            mode: "translate"
          }
          setGizmoMode(params)
          if (this.$refs.OperatingTools) this.$refs.OperatingTools.checkOprate({ gizmoMode: 'translate' })
        }
      });
    },
    // 点击底部工具栏后操作
    toolSuccess(e) {
      // console.log(e)
      if (!this.taskId) return
      switch (e.key) {
        // 显示
        case 'show':

          break;
        // 框选
        case 'selection':

          break;
        // 漫游导航
        case 'roaming':
          this.$refs.roamNavigate.show()
          break;
        // 模型剖切
        case 'modelSectioning':

          break;
        // 测量
        case 'measure':

          break;
        // 标签
        case 'label':
          this.$refs.Label.show()
          this.$refs.TagLibrary.show()
          break;
        // 视图
        case 'view':
          this.$refs.viewPhoto.hide()
          break;
        // 模型动画
        case 'modelAnimation':
          this.$refs.ModelAnimationRef.show()
          break;
        // 分解模型
        case 'decompositionModel':

          break;
        // 渲染环境
        case 'renderingEnvironment':
          this.$refs.Weather.show()
          break;
        // 资源库
        case 'resource':
          this.$refs.ResourcePool.show()
          break;
        // 浏览器
        case 'browser':
          this.$refs.ComponentTree.show()
          break;
        // 构件信息memberInfo:属性信息
        case 'componentInformation':
          this.$refs.ComponentInformation.show()
          break;
        // 定位码
        case 'locationCode':
          this.$refs.LocationCode.show()
          break;
        //对象过滤器
        case 'componentFilter':
          this.$refs.ComponentFilter.show()
          break;

        default:
          break;
      }
    },
    // 是否显示弹窗
    checkShow(key) {
      return this.activeToolArr.includes(key)
    },
    // 操作esc的时候隐藏工具栏true隐藏，false显示
    hideTool(val = true) {
      this.controllerInfo.tagUiBar = !val;//底部栏隐藏
      if (!val) {
        this.escTitle = ''
      }
      this.$refs.EscDialogItem.changeVisible(val);
    },
    // outPic(url) {
    //   //实例化一个img对象
    //   const img = new Image();
    //   //设置img的图片路径
    //   img.src = url;
    //   //设置跨域解决
    //   img.setAttribute('crossOrigin', 'Anonymous');
    //   //img加载完后处理
    //   img.onload = function () {
    //     //创建一个canvas对象
    //     const canvas = document.createElement('canvas')
    //     //把图片的宽度设为canves的宽度
    //     canvas.width = 1200
    //     //把图片的高度设为canves的高度
    //     canvas.height = 700
    //     //创建一个2d画布
    //     const ctx = canvas.getContext('2d')
    //     // 将img中的内容画到画布上
    //     ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
    //     // 将画布内容转换为base64
    //     let base64 = canvas.toDataURL()
    //     // 创建a链接
    //     const a = document.createElement('a')
    //     a.href = base64
    //     a.download = ''
    //     // 触发a链接点击事件，浏览器开始下载文件
    //     a.click()
    //   }
    // },
    outPic(url) {
      //实例化一个img对象
      const img = new Image();
      //设置img的图片路径
      img.src = url;
      //设置跨域解决
      img.setAttribute('crossOrigin', 'Anonymous');
      //img加载完后处理
      img.onload = function () {
        //创建一个canvas对象
        const canvas = document.createElement('canvas')
        //使用原始图片的实际尺寸
        canvas.width = img.naturalWidth || img.width
        canvas.height = img.naturalHeight || img.height
        //创建一个2d画布
        const ctx = canvas.getContext('2d')
        // 将img中的内容画到画布上（保持原始尺寸）
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
        // 将画布内容转换为base64
        let base64 = canvas.toDataURL()
        // 创建a链接
        const a = document.createElement('a')
        a.href = base64
        a.download = ''
        // 触发a链接点击事件，浏览器开始下载文件
        a.click()
      }
    },
    // 用于给 viewphoto组件传值 （视图）
    showViewPic(valModel) {
      this.showViewPicture = valModel;
    },
    // 隐藏视图子菜单
    hideViewSubMenu(value) {
      this.$refs.Tool.hideViewSubMenu(value);
    },
    // 监听工具栏隐藏和显示
    addMessageEvent() {
      window.addEventListener("message", (e) => {
        let res = e.data
        if (res.prex === "ourbimBaseMessage") {
          if (res.type === 'error') {
            this.closeWebSocket();
            this.resetActiveToolArr();
            this.mask = true;
            this.baseExceptMessge = res.message
            // 发送错误消息
            // let messageInfo = {
            //   prex: "ourbimMessage",
            //   type: 'error',
            //   data: {},
            //   message: res.message,
            // };
            // this.sentParentIframe(messageInfo);
          }
        }
        if (e.data.prex === "ourbimMessage") {
          if (e.data.type === 10000) {
            EventBus.$emit('onBimMessage', e.data.data)
          }
          // 控制栏显示隐藏
          if (e.data.type === 1001) {
            this.isUiBar = e.data.data;
            this.controllerInfo.viewCube = e.data.data;
          } else if (e.data.type === 1015) {
            // viewCube的显示/隐藏
            this.controllerInfo.viewCube = e.data.data;
          } else if (e.data.type === 1002) {
            // 选择工具栏隐藏
            this.controllerInfo.hideTools = e.data.data || []
          } else if (e.data.type === 1003) {
            // 选择工具栏显示
            this.controllerInfo.showTools = e.data.data || []
          }
        }
      },
        false
      );
    },
    openTeamDialog() {
      this.$refs.teamworkDialogRef.openDialog({
        appid: this.appId,
      });
    },
    // 打开模块
    openToolPart(key) {
      if (this.$refs.Tool) {
        this.$refs.Tool.list.forEach(e => {
          if (e.key === key) {
            if (!e.check) {
              this.$refs.Tool.onTool(e)
            }
          }
        })
        // 同步工具栏打开的栏目
        // this.$refs.Tool.getChecks()
      } else {
        // this.$message.warning('工具栏加载中!')
      }
    },
    // 关闭模块
    closePart(type) {
      EventBus.$emit('eventTool', type)
    },
    // 手动更新构件树
    updateComTree() {
      if (this.$refs.ComponentTree) {
        this.$refs.ComponentTree.updateComTreeAfterAddComs();
      }
    },
    initWebSocket() {
      //初始化weosocket
      const wsuri = connectWebsocket(this.taskId);
      this.websock = new WebSocket(wsuri);
      this.websock.onmessage = (e) => {
        if (e.data.length > 20) {
          this.isFade = false
          this.isProgress = true;
          let realData = JSON.parse(e.data);
          console.log('ws', JSON.parse(JSON.stringify(realData)))
          // 添加外部网站和ourbim的全部通信，有些为了兼容之前的使用请不要删除其他的通信
          let allInfo = {
            prex: "ourbimMessage",
            type: 10000,
            data: realData,
            message: realData.name,
          };
          this.sentParentIframe(allInfo);
          if (realData.id === "1") {
            if (this.$refs.ComponentInformation) {
              this.$refs.ComponentInformation.activeMaterialIndex = 0 //切换点击构件默认选中为初始值
            }
            this.multiComponents = []
            this.selectPark = realData
            // 不知道构件为啥返回的格式不一样，有 dynamicData 的需要新增俩个属性放在最前面
            if (realData.data?.dynamicData?.length) {
              realData.data.dynamicData = [{ name: '构件名称', value: realData.data.name }, { name: '构件ID', value: realData.data.uuid }].concat(realData.data.dynamicData)
            }
            this.memberInfo = realData?.data?.dynamicData.length ? realData.data.dynamicData : realData.rsInfo || []
            let messageInfo = {
              prex: "ourbimMessage",
              type: 20001,
              data: realData.data ? { ...realData.data, pakId: realData.pakId } : { uuid: realData.mN, pakId: realData.pakId, dynamicData: realData.rsInfo },
              message: "",
            };
            this.sentParentIframe(messageInfo);
            this.changeMember(realData)
            // 图纸信息
            if (realData.object && realData.object.length > 0 && realData.object.find(e => e.key === 'type')?.value == "blueprint") {
              const bluePrintObj = {};
              realData.rsInfo.forEach(item => {
                if (item.key == 'id') {
                  bluePrintObj.uuid = item.value;
                  bluePrintObj.id = item.value;
                } else {
                  bluePrintObj[item.key] = item.value;
                }
              })
              this.copyingPictures = bluePrintObj;
            } else {
              this.copyingPictures = {};
            }
          }
          else if (realData.id === "3") {
            let messageInfo = {
              prex: "ourbimMessage",
              type: 20005,
              data: realData,
              message: "",
            };
            this.sentParentIframe(messageInfo);
          }
          else if (realData.id === "5") {
            // 多选构件
            this.selectPark = null
            this.multiComponents = this.convertToObjectArray(realData.object)
            this.sentParentIframe({ prex: "ourbimMessage", type: 20002, data: "", message: "" });
            // (引擎端已经推送了计算结果 不需要同时调用接口计算)
            // 表面积测量 框选测量 同时开启时弹出多选构件的表面积总和
            // if (this.$store.state.model.surfaceAreaMeasurement && this.$store.state.model.boxSelection) {
            //   // console.log('表面积测量 框选测量', this.multiComponents)
            //   let formData = new FormData();
            //   formData.append('taskId', this.taskId);
            //   let actorParam = this.multiComponents.map(item => {
            //     return {
            //       actorId: item.actorId,
            //       pakId: item.pakId
            //     }
            //   })
            //   formData.append('actorParam', JSON.stringify(actorParam))
            //   getAreaByActor(formData).then(res => {
            //     // console.log('表面积测量 框选测量', res)
            //   })
            // }
          }
          else if (realData.id === "6") {
            this.changeLogoControls();
          }
          else if (realData.id === "7") {
            // 点击空白地方初始化
            this.sentParentIframe({ prex: "ourbimMessage", type: 20003, data: "", message: "" });
            this.memberInfo = []
            this.selectPark = null
            this.multiComponents = []
            this.$store.dispatch('material/changeSetting', { key: "componentAllInfo", value: {} })
            this.$store.dispatch('material/changeSetting', { key: "materialAllInfo", value: {} })
            // 摩方绘制功能迁移
            this.$store.commit('design/checkMember', []);
            this.$store.dispatch('design/changeMaterInfo', null);
            this.$store.commit('design/changeMember', null);
            this.$store.commit('design/changeMemberId', null);
            this.$store.commit('design/changeEvent', null);
            this.$store.commit('top/changeFaceInfo', null)
            this.copyingPictures = {};
            // this.$store.dispatch('bim/changeControlMode', null)
            //this.changeControl('off')
            // 机电管线个性化参数初始化
            this.$store.commit('design/changePipeGeometryAttr', []);
          }
          else if (realData.id === "8") {
            this.changeLogoControls();
            // 加载过程
            let messageInfo = {
              prex: "ourbimMessage",
              type: 10003,
              data: {
                progress: Number(realData.progress),
              },
              message: "",
            };
            this.sentParentIframe(messageInfo);
            const progress = Number(
              String(Number(realData.progress) * 100).substring(0, 3)
            );
            // console.log(progress)
            if (
              progress >= 0 &&
              progress <= 100 &&
              this.propsProgress.data < 100
            ) {
              this.propsProgress.data = progress;
              // id为8的时候进度条大于0就隐藏第一层遮罩层
              if (progress === 100) {
                // this.sendToIframeMessage('加载完成', 200)
                // 定位主视图
                setTimeout(() => {
                  doAction({ taskId: this.taskId, action: "cameraPosAll" }).then(res => {
                    if (res?.data?.viewMode) this.$store.commit('model/changeViewMode', Number(res.data.viewMode))
                    if (res?.data?.projectionMode) this.$store.commit('model/changeProjectionMode', Number(res.data.projectionMode))
                  })
                }, 1000);
              }
            }
            if (Number(realData.progress) === 1) {
              this.initBuild();
              this.limitZoomSpeed();
              // this.initBlueprint()
              this.isProgress = false;
              this.$store.commit('design/changeModelState', true);
            }
          }
          // 标签-tag点击事件
          else if (realData.id === "9") {
            this.clickTagData = realData
            let messageInfo = {
              prex: "ourbimMessage",
              type: 30001,
              data: {
                state: true,
                tagId: realData.tagId,
                tagType: 0,
              },
              message: "",
            };
            this.sentParentIframe(messageInfo);
          }
          else if (realData.id === "10") {
            this.sentParentIframe({ prex: "ourbimMessage", type: 30002, data: { tagId: realData.tagId }, message: "" });
            this.showUiBar();
          }
          else if (realData.id === "11") {
            this.sentParentIframe({ prex: "ourbimMessage", type: 30003, data: { tagId: realData.tagId }, message: "" });
          }
          else if (realData.id === "14") {
            // 添加构件，但是按了 ESC
            if (this.controllerInfo.uiBar) {
              // this.updateComTree()
              this.controllerInfo.tagUiBar = true;
              this.hideTool(false)
            }
            // 迁移摩方绘制功能
            this.$store.commit('design/changeLibNode', null);
            // 面层设计-顶部菜单只能通过退出面层设计按钮来关闭 
            // 其他类型-顶部菜单默认情况下取消添加构件时关闭
            if (this.designStore.drawType !== 2) {
              this.$store.dispatch('design/changeDrawType', null);
            }
          }
          else if (realData.id === "15") {
            this.selectPark = realData //选择构件
            if (this.$refs.ResourcePool) {
              // 点击构件打开坐标轴
              this.$refs.ResourcePool.checkOprate(realData);
            }
          }
          else if (realData.id === "17") {
            if (this.$refs.ComponentTree) {
              realData.uuids.map((v) => {
                this.$refs.ComponentTree.updateTree(v);
              });
            }
          }
          else if (realData.id === "18") {
            // 构件创建成功,这个没有返回相关信息了
          }
          else if (realData.id === "19") {
            // 构件新建失败
            // 提示判断添加构建失败
            this.showUiBar();
            this.$message.error('指令下发失败');
          }
          else if (realData.id === "21") {
            // 测量结果
            // 资源库图纸打开情况下this.checkShow('resource') 数据返回成功弹出设置比例尺弹窗 并且是调整比例尺状态 isScale = true
            if (this.$refs.DialogScale && this.designStore.isScale) {
              this.copyingPictures['measureValue'] = realData.rsInfo.value
              if (!this.copyingPictures.id) {
                return this.$message.warning('请选择图纸测量！')
              }
              this.$refs.DialogScale.show()
            }
            // 表面积框选测量结果
            if (this.$store.state.model.surfaceAreaMeasurement && this.$store.state.model.boxSelection) {
              const totalArea = realData.result.reduce((sum, value) => sum + parseFloat(value), 0);
              // 获取转换后的面积值
              const convertedArea = this.$common.convertAreaUnit(totalArea, this.$store.state.model.unit);
              // 获取精度值并转换为数字
              const precision = parseFloat(this.$store.state.model.precision);
              // 根据精度进行四舍五入处理
              const formattedArea = Number(convertedArea).toFixed(precision.toString().split('.')[1]?.length || 0);
              this.$alert(`表面积总和：${formattedArea}${this.$store.state.model.unit}²`, '测量结果', {
                confirmButtonText: '确定',
                callback: action => {

                }
              });
            }
          }
          // 构件移动信息
          else if (realData.id === "25") {
            if (this.selectPark && this.selectPark.rsInfo && realData && realData.rsInfo) {
              this.selectPark.rsInfo = this.selectPark.rsInfo.map(item => {
                if (item.key === 'location') {
                  return { ...item, value: realData.rsInfo[0].location };
                } else if (item.key === 'rotation') {
                  return { ...item, value: realData.rsInfo[0].rotation };
                } else if (item.key === 'scale') {
                  return { ...item, value: realData.rsInfo[0].scale };
                }
                return item;
              });
            }
          }
          // 构件材质信息
          else if (realData.id === "28") {
            if (realData.rsInfo[0].pakId) {
              // 区分点击的是自定义构件还是模型自带的构件
              (realData.rsInfo[0].pakId === 'MAPWEB' || realData.rsInfo[0].pakId === 'gis') ? this.pakIdMapweb = 'public' : this.pakIdMapweb = '';
            }
            // 选中的构件信息
            // matList 材质球信息
            this.$set(this.materialData, 'matList', realData.rsInfo.length && realData.rsInfo[0].matList || [])
            // 设置材质球img
            this.materialData.matList?.length && this.materialData.matList.forEach(item => {
              try {
                this.materialData.rsInfo.forEach(e => {
                  if (item.matId === e.matId) {
                    this.$set(item, 'imgPath', e.imgPath)
                    // 中断循环
                    throw new Error()
                  }
                })
              } catch (error) { }
            })
            // 设置全局 当前选中的构件信息
            this.$store.dispatch('material/changeSetting', { key: "componentAllInfo", value: { ...realData.rsInfo.length && realData.rsInfo[0], matList: this.materialData.matList } || {} })
            // 设置全局 当前材质的信息
            this.$store.dispatch('material/changeSetting', { key: "materialAllInfo", value: this.materialData.matList[0] })
            // 如果当前开启了构件信息面板
            if (this.$refs.ComponentInformation) {
              // 默认获取第一个材质球的信息
              this.$refs.ComponentInformation.getMaterialInfo(this.materialData.matList[0].matId)
              // 显示构件信息和打开图标选中
              this.$refs.ComponentInformation.show()
            }
            // 资源库和动画模块未联动时打开构件信息
            if (!this.isAnimationLinkage) {
              // 打开构件信息
              this.openToolPart('componentInformation');
            }
          }
          // 材质图片信息
          else if (realData.id === "29") {
            this.$set(this.materialData, 'rsInfo', realData.rsInfo)
            // this.materialData.matList?.length && this.materialData.matList.forEach(item => {
            //   try {
            //     this.materialData.rsInfo.forEach(e => {
            //       if (item.matId === e.matId) {
            //         this.$set(item, 'imgPath', e.imgPath )
            //         throw new Error()
            //       }
            //     })
            //   }
            //   catch (error) { }
            // })
            let matList = this.componentAllInfo?.matList ? JSON.parse(JSON.stringify(this.componentAllInfo.matList)) : []
            matList.forEach(item => {
              try {
                this.materialData.rsInfo.forEach(e => {
                  if (item.matId === e.matId) {
                    this.$set(item, 'imgPath', e.imgPath)
                    throw new Error()
                  }
                })
              }
              catch (error) { }
            })
            // 设置全局 当前选中的构件信息
            this.$store.dispatch('material/changeSetting', { key: "componentAllInfo", value: { matList } || {} })
          }
          else if (realData.id === "30") {
            if (realData.object) {
              this.$message.success('开始下载');
              let url = realData.object;
              this.outPic(url);
            }
          }
          else if (realData.id === '31') {
            // 构件系统参数信息
            this.$store.dispatch('member/changeSystem', realData.rsInfo)
          }
          // 退出绘制消息 墙体、管线、踢脚线、挤塑
          else if (realData.id === '32') {
            // this.updateComTree()
            this.$store.commit('top/changeLineType', null)
            // 面层设计-顶部菜单只能通过退出面层设计按钮来关闭 
            // 其他类型-顶部菜单默认情况下取消添加构件时关闭
            if (this.designStore.drawType !== 2) {
              this.$store.dispatch('design/changeDrawType', null);
            }
          }
          else if (realData.id === "33") {
            // 视点动画播放
            if (this.$refs.viewPhoto) {
              this.$refs.viewPhoto.WebSocketData = realData
            }
          }
          // 面层信息
          else if (realData.id === '38') {
            this.$store.commit('top/changeFaceInfo', realData.object)
          }
          else if (realData.id === "41") {
            // 定位码放置完成
            if (this.$refs.LocationCode) {
              this.$refs.LocationCode.placeCode(realData.codeID)
            }
          }
          else if (realData.id === "52") {
            //GIS属性推送事件
            this.memberInfo = realData?.sendPrimitiveAttribute ? Object.entries(realData.sendPrimitiveAttribute).map(([name, value]) => ({ name, value })) : [];
          }
          else if (realData.id === "53") {
            //返回删除的多边形uuid
            this.deletePolygon = realData?.deletePolygon
          }
          // 之前接收ws42 现在改成55
          else if (realData.id === "55") {
            // 临摹图信息
            this.copyingPictures = realData
          }
          else if (["101", "102"].includes(realData.id)) {
            // 101 编辑关键帧返回参数
            // 102 联动事件
            // 动画关键帧信息
            this.animationKeyframe = realData
          }
          else if (realData.id === '110') {
            // console.log('110',realData)
            this.selectPark = realData //选择构件
            this.$refs.ComponentInformation.show();
            this.$refs.ComponentInformation.activeTab = 1 //切换点击构件默认选中为初始值
          }
          else if (realData.id === "111") {
            EventBus.$emit('waitReplaceByMatId', realData.rsInfo);
          }
        }
      };
      this.websock.onopen = (e) => {
        this.socketTimer = setInterval(() => {
          this.websock.send("Bang");
        }, 1000 * 30);
      };
      this.websock.onerror = (e) => {
        this.$message({
          type: "error",
          message: '🚀🚀🚀websock错误',
          duration: 0,
          showClose: true,
        })
        console.log('🚀🚀🚀websock错误', e);
      };
    },
    // 切换触摸盘显隐
    changeLogoControls() {
      if (this.isMobile()) {
        if (this.showLogoControls) {
          this.sendToIframe(10200, 'true');
        } else {
          this.sendToIframe(10200, 'false');
        }
      } else {
        this.sendToIframe(10200, 'false');
      }
    },
    changeMember(e) {
      if (!e) return
      const { object, mN, rsInfo, data } = e
      let newDynamicData = []
      if (data && data.dynamicData) {
        newDynamicData = data.dynamicData.map(e => { return { ...e, label: e.name } })
      }
      this.$store.commit('design/changeMemberId', mN);
      this.$store.commit('design/changeMember', object || rsInfo || newDynamicData);
      this.$store.commit('design/changeMemberInfo', rsInfo);
    },
    // 转换为数组对象的函数
    convertToObjectArray(obj) {
      var array = [];
      obj.forEach((innerArray) => {
        var innerObj = {};
        innerArray.forEach((item) => {
          innerObj[item.key] = item.value;
        });
        array.push(innerObj);
      });
      // console.log(array)
      return array;
    },
    limitZoomSpeed() {
      // 限制缩放速度
      if (this.isMobile()) {
        let params = {
          taskId: this.taskId,
          action: "initWorldParam",
          zoomSpeed: "0.02",
        };
        doAction(params)
      }
    },
    initBuild() {
      const params = {
        taskId: this.taskId,
      }
      updateBuildState(params).then(() => {
        if (this.isBuild == 'true') {
          this.setBackgroundSetting()
        }
      })
      // setOutLineParams({
      //   taskId: this.taskId,
      //   baseColor: 'DDA112',
      //   bActivate: 'false',
      // }).then(()=>{

      // })
    },
    // 图纸初始化
    initBlueprint() {
      const params = {
        taskId: this.taskId,
      }
      blueprintInit(params).then(() => {
        console.log('图纸初始化')
      })
    },
    // 设置环境背景
    setBackgroundSetting() {
      let params = {
        taskId: this.taskId,
        appId: this.appId
      }
      let data = {
        bshow: true,
        modelBackgroundType: 'gridLine',
        modelBackgroundRingType: 'city'
      }
      backgroundSetting(params, data).then((res) => {
        // console.log(res)
      })
    },
    showUiBar() {
      // 显示面板
      this.hideTool(false)
      if (this.controllerInfo.uiBar) {
        this.controllerInfo.tagUiBar = true;
      }
    },
    // 解析URL参数
    parseUrlParams(url) {
      const params = {};
      try {
        // 处理hash路由的情况，提取?后面的参数部分
        const queryString = url.split('?')[1];
        if (queryString) {
          const pairs = queryString.split('&');
          pairs.forEach(pair => {
            const [key, value] = pair.split('=');
            if (key) {
              params[key] = decodeURIComponent(value || '');
            }
          });
        }
      } catch (error) {
        console.error('解析URL参数失败:', error);
      }
      return params;
    },
    // 获取流地址
    getModelUrl() {
      let appId = this.$route.query.appid;
      let params = {
        appliId: appId,
        token: this.$route.query.token,
      };
      const { userType, nickName, code } = this.$route.query;
      if (userType !== undefined && userType !== null) {
        this.userType = userType;
        params.userType = userType;
      }
      if (userType == 0) {
        this.isFade = false;
      }
      if (nickName) {
        params.nickName = nickName;
      }
      if (code) {
        params.code = code;
      }
      requestOurBim(params).then((res) => {
        if (process.env.NODE_ENV === 'development') {
          let params = this.parseUrlParams(res.data.url);
          const { href } = this.$router.resolve({
            name: "stream",
            query: {
              ...params,
              islandscape: this.islandscape,
              showLogoControls: this.showLogoControls,
            },
          });
          this.webUrl = href;
        } else {
          this.webUrl = res.data.url + `&islandscape=${this.islandscape}&showLogoControls=${this.showLogoControls}`;
        }
        this.taskId = res.data.taskId;
        this.$store.commit('design/changeTaskId', res.data.taskId);
        this.listenerIframe()
        // this.$message.error(res.data.code + res.data)
        // 保存code
        if (res.data.code) {
          this.shareCode = res.data.code;
          let messageInfo = {
            prex: "ourbimMessage",
            type: "shareCode",
            data: this.shareCode,
            message: "",
          };
          this.sentParentIframe(messageInfo);
        }

        let messageInfo = {
          prex: "ourbimMessage",
          type: 10001,
          data: {
            taskId: res.data.taskId,
          },
          message: "",
        };
        this.sentParentIframe(messageInfo);
        this.initWebSocket();
        if (res.data.appliType !== "1") {
          if (this.isUiBar) {
            this.controllerInfo.uiBar = true;
          } else {
            this.controllerInfo.uiBar = false;
            this.controllerInfo.viewCube = false;
          }
        } else {
          this.controllerInfo.uiBar = false;
          this.controllerInfo.viewCube = false;
        }

        // 向微信小程序发送taskId
        if (this.isMiniProgramEnv()) {
          wx.miniProgram.postMessage({
            data: {
              taskId: res.data.taskId,
            }
          });
        }
        // console.log(wx)
        // setTimeout(() => {
        //   wx.miniProgram.navigateBack({ delta: 1 })
        //   wx.miniProgram.postMessage({
        //     data: {
        //       taskId: res.data.taskId,
        //     }
        //   });
        // }, 2000);
        // const h5ToMiniData = {
        //   taskId: res.data.taskId,
        // }
        // localStorage.setItem('h5ToMiniData', JSON.stringify(h5ToMiniData));
      }).catch((e) => {
        if (e?.message) {
          this.baseExceptMessge = e.message
        }
      })
    },
    isMobile() {
      let flag = navigator.userAgent.match(
        /(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i
      );
      return flag;
    },
    //判断环境是否为小程序
    isMiniProgramEnv() {
      // 通过navigator.userAgent 判断
      let userAgent = navigator.userAgent;
      let isMini = /miniProgram/i.test(userAgent);
      return isMini;
    },
    // 设置加载时间超时提醒
    setTimeLoad() {
      this.loadTimer = setTimeout(() => {
        if (this.isFade === true) {
          this.baseExceptMessge = '模型长时间未操作，已自动退出'
          this.closeWebSocket();
          this.clearTimePass();
        }
        clearTimeout(this.loadTimer);
      }, 1000 * 60 * 3);
    },
    // 清除定时器
    clearTimePass() {
      if (this.loadTimer) {
        clearTimeout(this.loadTimer);
      }
    },
    closeWebSocket() {
      // 清除定时器
      if (this.socketTimer) {
        clearInterval(this.socketTimer);
        this.socketTimer = null;
      }
      if (this.websock) {
        this.websock.close(); //离开路由之后断开websocket连接
        this.websock = null;
      }
    },
    sentParentIframe(e) {
      window.parent.postMessage(e, "*");
    },
    // 发送消息给子页面
    sendToIframe(type, data, message = '') {
      let realIframe = document.getElementById("show-bim");
      if (realIframe) {
        realIframe.contentWindow.postMessage({
          prex: "pxymessage", // 约定的消息头部
          type: type, // 消息类型
          data: data, // 具体数据
          message: message, // 附加信息
        }, "*");
      }
    },
    // 模拟pixel发送消息 关闭遮罩
    // sendToIframeMessage(message, type, data = {}) {
    //   let realIframe = document.getElementById("show-bim");
    //   if (realIframe) {
    //     let iframeMessage = {
    //       prex: "ourbimBaseMessage",
    //       type,
    //       data,
    //       message,
    //     };
    //     realIframe.contentWindow.postMessage(iframeMessage, '*');
    //   }
    // },
    // 获取pakid
    getLinkModelAppid() {
      getPakIdByAppId({ appId: this.appId }).then(res => {
        this.pakAndAppid = res.data;
      })
    },
    // 根据pakId 找到appId
    pakidToAppid(str) {
      let obj = this.pakAndAppid.find(e => { return e.pakId === str })
      return obj?.appId;
    },
    // 添加到构件过滤分组回调
    onActor() {
      this.selectPark = null
      this.multiComponents = []
    },
  },
};
</script>

<style lang="less" scoped>
.operatingStyle {
  left: 300px;
  right: initial;
}

.bim-main {
  height: 100vh;
  width: 100vw;
  overflow: hidden;
  position: relative;
  background: #010026;

  #show-bim {
    height: 100vh;
    width: 100vw;
    overflow: hidden;
  }

  .phone-bim {
    height: 100vh !important;
    width: 100vw !important;
  }

  // 添加UI包装容器
  .ui-wrapper {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;

    // 横屏时旋转90度
    &.landscape {
      transform: rotate(90deg);
      transform-origin: center center;
      width: 100vh;
      height: 100vw;
      top: 50%;
      left: 50%;
      margin-left: -50vh;
      margin-top: -50vw;
    }

    // 恢复子元素的指针事件
    >* {
      pointer-events: auto;
    }
  }
}
</style>


<!-- 添加全局样式块处理Element UI组件旋转 -->
<style lang="less">
// 移动端竖屏时Element UI组件旋转样式
.mobile-portrait-element-rotation {

  // Element UI弹窗旋转样式 - 居中显示
  .el-dialog {
    transform: rotate(90deg) !important;
    transform-origin: center center !important;
    position: fixed !important;
    top: 50% !important;
    left: 50% !important;
    margin-top: -25vw !important;
    margin-left: -25vh !important;
  }

  // Element UI消息通知旋转样式 - 顶部5px，水平居中
  .el-message {
    transform: rotate(90deg) !important;
    transform-origin: center center !important;
    position: fixed !important;
    top: 50% !important;
    left: 40% !important;
    right: auto !important;
    margin-top: -25vh !important;
    margin: 0 !important;
  }

  // Element UI提示框旋转样式 - 根据触发位置定位
  .el-tooltip__popper {
    display: none;
  }

  // Element UI通知旋转样式 - 顶部5px，水平居中
  .el-notification {
    transform: rotate(90deg) !important;
    transform-origin: center center !important;
    position: fixed !important;
    top: 5px !important;
    left: 50% !important;
    margin-left: -25vh !important;
  }

  // Element UI确认框旋转样式 - 居中显示
  .el-message-box {
    transform: rotate(90deg) !important;
    transform-origin: center center !important;
    position: fixed !important;
    top: 50% !important;
    left: 50% !important;
    margin-top: -25vw !important;
    margin-left: -25vh !important;
  }

  // Element UI下拉菜单旋转样式 - 根据触发位置定位
  .el-dropdown-menu {
    transform: rotate(90deg) !important;
    transform-origin: center center !important;
  }

  // Element UI选择器下拉框旋转样式 - 根据触发位置定位
  .el-select-dropdown {
    transform: rotate(90deg) !important;
    transform-origin: center center !important;
  }

  // Element UI日期选择器旋转样式 - 根据触发位置定位
  .el-picker-panel {
    transform: rotate(90deg) !important;
    transform-origin: center center !important;
  }

  // Element UI加载中旋转样式 - 居中显示
  .el-loading-mask {
    transform: rotate(90deg) !important;
    transform-origin: center center !important;
    position: fixed !important;
    top: 50% !important;
    left: 50% !important;
    margin-top: -25vw !important;
    margin-left: -25vh !important;
  }
}
</style>

<style lang="less" scoped>
@import './index.less';

.set-index-message {
  z-index: 5000 !important;
}

.invite-team-friend {
  padding-left: 0 !important;

  .invite-btn {
    border: 2px solid #284dba;
    display: flex;
    align-items: center;
    background-color: rgba(41, 82, 199, 1);
    height: 60%;
    width: 166px;
    justify-content: center;
    cursor: pointer;
    border-radius: 2px;
  }

  position: fixed;
  top: 0;
  right: 0;
  width: 228px;
  height: 30px;
  display: flex;
  align-items: center;
  color: #7184bb;
  padding-left: 15px;
  font-size: 14px;
  box-sizing: border-box;

  img {
    width: 20px;
    height: 20px;
  }
}
</style>