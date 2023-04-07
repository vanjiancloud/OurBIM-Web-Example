<!--
 * @Author: zk
 * @Date: 2021-03-10 14:08:18
 * @LastEditors: zk
 * @LastEditTime: 2021-11-26 00:53:34
 * @description: 
-->
<template>
  <div class="bim-main">
    <iframe
      class="bim-web"
      allowfullscreen="true"
      :class="runTimeCode === 0 ? '' : 'phone-bim'"
      v-if="webUrl"
      :src="webUrl"
      frameborder="0"
      id="show-bim"
    ></iframe>
    <!-- 遮罩层 -->
    <div
      class="hidden-bim"
      :class="runTimeCode === 0 ? '' : 'phone-hidden-bim'"
      v-if="isFade"
    >
      <div class="hidden-bim">
        <img src="@/assets/img/ourbim-logo.png" class="show-loading" alt="" />
        <div class="bim-progress" v-if="hiddenState === 0 || hiddenState === 3">
          <div class="load-tip">
            环境加载中…
            <div>{{ propsProgress.loadData }}%</div>
          </div>
          <el-progress
            type="line"
            :show-text="false"
            :percentage="propsProgress.loadData"
          ></el-progress>
        </div>
        <div
          class="hidden-text learn-text"
          v-if="hiddenState === 1"
          v-text="$t('webClient.loadBox.title[2]')"
        ></div>
        <div
          class="hidden-text learn-text"
          v-if="hiddenState === 2"
          v-text="$t('webClient.loadBox.title[3]')"
        ></div>
        <div
          class="hidden-text learn-text"
          v-if="hiddenState === 4"
          v-text="$t('webClient.loadBox.message[6]')"
        ></div>
        <div
          class="hidden-text learn-text"
          v-if="hiddenState === 5 && userType == '0'"
          v-text="$t('webClient.loadBox.message[7]')"
        ></div>
      </div>
    </div>

    <div class="systemDrawer">
      <el-drawer
          title="天气环境"
          :visible="weatherDrawer"
          @close="closeSystemDrawer"
          direction="rtl"
          :modal="false"
          :size="300"
          :wrapperClosable="false"
        >
          <weatherSystem :appId="appId" :taskId="taskId"></weatherSystem>
      </el-drawer>
    </div>
    
    <!-- runTimeCode 1:mobile  0 ：PC  -->
    <div v-if="runTimeCode === 0">
      <!-- 模型浏览器 -->
      <div class="mutual-bim">
        <div
          class="tree-main"
          v-show="
            controllerInfo.tagUiBar &&
            ((browserInfo &&
              browserInfo.type === 10 &&
              browserInfo.state === 1) ||
              controllerInfo.modelClient)
          "
        >
          <div class="tree-title">
            <div class="" v-text="$t('webClient.browser.title')"></div>
            <div class="close-part">
              <i
                class="el-icon-close"
                @click.stop="closePart(browserInfo.type)"
              ></i>
            </div>
          </div>
          <!-- 操作 -->
          <div class="handle-part">
            <el-input
              class="search-tag"
              placeholder="请输入你要搜索的内容"
              @click.native.stop
              @change="changeBrowser"
              @keyup.enter.native="changeBrowser"
              v-model="modelBrowser"
            >
              <i slot="prefix" class="el-input__icon el-icon-search"></i>
            </el-input>
          </div>
          <div class="tree-part">
            <div class="tree-content" id="tree-content">
              <!-- 构件树开始 -->
              <el-tree
                class="set-tree"
                ref="setTree"
                @check="checkTree"
                :empty-text="treeEmpty"
                @node-expand="ExpandNode"
                :props="propsMember"
                :expand-on-click-node="false"
                :load="loadNode"
                :filter-node-method="filterNode"
                show-checkbox
                highlight-current
                node-key="uuid"
                lazy
              >
                <span
                  class="custom-tree-node"
                  :class="
                    activeTree &&
                    node.data.uuid === activeTree.uuid &&
                    activeLeaf
                      ? 'tree-select'
                      : ''
                  "
                  slot-scope="{ node,data}"
                  @click="handleTree(node, 0)"
                >
                  <span class="label-span">{{ node.label }}</span>
                  <!-- 合模 -->
                  <img
                    src="@/assets/images/tag/6.png"
                    @click.stop="deleteCom(node)"
                    class="delect-com-icon"
                    v-if="
                      appType === '3' &&
                      node.data.typeId === 'comp' &&
                      checkedNodeVanjian(node)
                    "
                  />
                  <!-- 非合模 -->
                  <img
                    src="@/assets/images/tag/6.png"
                    @click.stop="deleteCom(node)"
                    class="delect-com-icon"
                    v-if="appType !== '3' && node.data.typeId === 'comp'"
                  />
                  <span v-if="node.level === 1 && (appType==='3' || appType==='0') && node.data.name != '自定义构件'">
                    <!-- 开锁和闭锁 -->
                    <i class="iconfont icon-24gl-lock2 lockLock" v-if="!data[`lockView${+node.id}`]" @click.stop="handleToggleLock(node, data, node.id)"></i>
                    <i v-else class="iconfont icon-24gl-unlock4 lockLock" @click.stop="handleToggleLock(node, data, node.id)"></i> 
                  </span> 
                  <span>
                    <!-- <span v-if="node.data.typeId !== 'comp'"> -->
                    <!-- 显示状态 -->
                    <i class="iconfont icon-xianshi2" v-if="!node.checked"></i>
                    <i v-else class="iconfont icon-yincang1"></i>
                  </span>
                </span>
              </el-tree>
              <!-- 构件树结束 -->
            </div>
          </div>
        </div>

        <!-- 材质编辑模块   (材质库)-->
        <div class="material-main" v-if="materialShow && topImgMaterial.length>0">
            <div class="material-title">
              <div class="" v-text="$t('webClient.materEdit.title')"></div>
              <div class="close-materialPart">
                <i
                  class="el-icon-close"
                  @click.stop="closeMaterialBtn"
                ></i>
              </div>
            </div>
            <div class="bottomTotal">
                <div class="material-img">
                  <div class="singleImg" v-for="(item,index) in topImgMaterial" :key="index">
                    <div class="imgPic" @click="photoSelect(item,index)" :class="{activeBorder: activeMater === index}">
                        <img :src="item.photoUrl||require('@/assets/caizhi.jpg')" alt="">
                        <div v-if="middleMaterInfo[0].nameInfo.length>0 && activeMater === index" class="resetMaterial" @click.stop="resetClick(item,index)"><i class="el-icon-refresh-left resetIcon"></i></div>
                    </div> 
                  </div>
                </div>
                <div class="materEditMain" v-if="matParam.colorList&&matParam.colorList.length&& activeMater !== ''">
                    <div class="topEditMain">
                        <div class="yanse">
                            <div class="yanseName">颜色</div>
                            <div class="yanseBody">
                              <el-color-picker class="colorSelect" show-alpha v-model="color1" @change="colorBeChange"></el-color-picker>
                              <i class="el-icon-arrow-down plusIcon" v-if="!color1"></i>
                            </div>
                        </div>
                        <div style="display:flex">                    
                            <div class="yanse">
                                <div class="yanseName">基础颜色贴图</div>
                                <div class="yanseBody stickPic" @click="photoStore('基础')" :style="{'cursor':'pointer'}" :class="{activeBorder: photoStoreFlag === '基础'}">
                                  <img v-if="getTextType('BaseColorMap')" :src="getTextType('BaseColorMap').paramValue" alt="" :style="{'width':'100%','height':'100%'}">
                                  <i v-else class="el-icon-plus plusIcon"></i>
                                  <div class="deleteIcon" @click.stop="deleteStickPic('BaseColorMap')" v-if="getTextType('BaseColorMap').paramValue"><i class="el-icon-delete"></i></div>
                                </div>
                            </div>
                            <div class="yanse">
                                <div class="yanseName">法线贴图</div>
                                <div class="yanseBody stickPic" @click="photoStore('法线')" :style="{'cursor':'pointer'}" :class="{activeBorder: photoStoreFlag === '法线'}">
                                  <img v-if="getTextType('NormalMap')" :src="getTextType('NormalMap').paramValue" alt="" :style="{'width':'100%','height':'100%'}">
                                  <i v-else class="el-icon-plus plusIcon"></i>
                                  <div class="deleteIcon" @click.stop="deleteStickPic('NormalMap')" v-if="getTextType('NormalMap').paramValue"><i class="el-icon-delete"></i></div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="bottomEditMain">
                        <el-collapse
                          v-model="spread"
                          v-for="(item,index) in middleMaterInfo"
                          :key="item.id"
                          class=""
                        >
                          <el-collapse-item :title="item.titleName" :name="index">                         
                                <div
                                  class="editInfoItem"
                                  v-for="(listItem, index1) in item.nameInfo"
                                  :key="listItem.index"
                                >  
                                <!-- enableEdit=false不显示不可编辑,目前看到json里面返回的显示没有这个字段 -->
                                <template v-if="!listItem.hasOwnProperty('enableEdit')||listItem.enableEdit!='false'">
                                  <div class="editInfoList" v-if="listItem.label === '等比缩放'">
                                      <div class="editInfoListName">{{ listItem.label }}</div>
                                      <div class="editInfoListNum">
                                        <el-switch
                                          @change="materialInfoChange"
                                          v-model="listItem.paramValue"
                                          inactive-color="#646464"
                                          active-value="1"
                                          inactive-value="0">
                                        </el-switch>
                                      </div>
                                      <div class="editInfoListPercent"></div>
                                  </div>       
                                  <div class="editInfoList" v-if="listItem.label !== '等比缩放'">
                                      <div class="editInfoListName">{{ listItem.label }}</div>
                                      <div class="editInfoListNum">
                                        <el-slider @change="materialSliderChange(listItem.paramValue1,index,index1)" v-model="listItem.paramValue1"
                                        input-size="mini"
                                        :max="Number(listItem.max)"
                                        :min="Number(listItem.min)"
                                        :step="(listItem.label==='横向偏移' || listItem.label==='纵向偏移' || listItem.label==='透明度') ? 0.1 :((listItem.label==='横向缩放' || listItem.label==='纵向缩放' || listItem.label==='缩放') ? 0.01 : 1)"
                                        ></el-slider>
                                        <input type="number" v-model.trim.number="listItem.paramValue" style="width:70px;height: 23px;" @change="materialInfoChange()" />
                                      </div>
                                      <div class="editInfoListPercent">{{listItem.label==='角度' ? '°' :  ''}}</div>
                                  </div>
                                </template>
                                </div>
                          </el-collapse-item>
                        </el-collapse>
                    </div>
                </div>
                <div class="mater-bottom" v-if="false">
                    <el-checkbox-group v-model="materilCheckList">
                      <el-checkbox label="1" v-if="false">金属</el-checkbox>
                      <el-checkbox label="2">替换所有相同实例</el-checkbox>
                      <el-checkbox label="3" v-if="false">双面材质</el-checkbox>
                    </el-checkbox-group>
                </div>
            </div>
            <div class="uploadImg" v-if="photoStoreFlag">
                <div class="titleUploadimg">
                  <span>贴图库</span>
                  <i
                    class="el-icon-close postStoreImgClose"
                    @click="canclePhotostore"
                  ></i>
                </div>
                <div class="middleUploadimg">
                     <el-tabs v-model="activeNamePic" type="card" @tab-click="texureClick">
                        <el-tab-pane label="公共库" name="first">
                        </el-tab-pane>
                        <el-tab-pane label="个人库" name="second">
                          <el-collapse
                              v-model="spreadPerson"
                              accordion
                              v-for="(item,index) in personalPicMaterInfo"
                              :key="index"
                              class=""
                            >
                              <el-collapse-item :title="item.groupName" :name="index">   
                                 <div class="flexDiv">          
                                    <div
                                      v-for="listItem in item.rsTextureList"
                                      :key="listItem.textureId"
                                      class="flexDivInde"
                                      :style="{'width':'90px','height':'11.3vh'}"
                                    >           
                                      <div @click="texturePhotoSelect(listItem)" :class="{activeBorder: activeTexTurePerson === listItem.textureId}" :style="{'width':'90px','height':'9.3vh'}"><img :src="listItem.imgPath" alt="" :style="{'width':'100%','height':'100%'}"></div>
                                      <div class="textureTitle"><span>{{listItem.textureName}}</span></div>
                                    </div>
                                  </div>  
                              </el-collapse-item>
                            </el-collapse>
                        </el-tab-pane>
                        <el-tab-pane name="zero">
                          <div slot="label">
                            <el-button type="primary" @click="postUploadPic" size="mini" :disabled="btnUpTexure ? false : true">上传贴图</el-button>
                          </div>
                        </el-tab-pane>
                     </el-tabs>
                </div>
            </div>
        </div>
        <!-- 二维码 -->
        <qrcode-part
          v-if="isQrcode"
          :leafInfo="leafInfo"
          @click.native.stop=""
          @setListenClick="setListenClick"
        ></qrcode-part>
      </div>

      <transition name="el-fade-in-linear">
        <progress-bar
          v-if="isProgress"
          :propsProgress="propsProgress"
        ></progress-bar>
      </transition>
<!-- 底部的工具栏 -->
      <!-- <todo-footer
        v-if="controllerInfo.singleList.length !== 13 && controllerInfo.uiBar && !isFade"
        v-show="controllerInfo.tagUiBar"
        ref="getFooter"
        @listenTodo="listenTodo"
        @listenPerson="listenPerson"
        @listenMode="listenMode"
        @listenFollow="listenFollow"
        @updataModle="updataModle"
        @comIconChang="comIconChang"
        :setProps="propsFooter"
        :singleList="controllerInfo.singleList"
        :appId="appId"
        :taskId="taskId"
        :socketData="socketData"
        :showTodoIconObj="showTodoIconObj"
        @passContentLogo="passContentLogo"
        @passBrowerLogo="passBrowerLogo"
        :lockState="lockState" 
        @showViewPhoto="showViewPic"
      ></todo-footer> -->
      <view-cube
        v-if="controllerInfo.viewCube"
        v-show="controllerInfo.tagViewCube"
        :userType="userType"
        @handleOrder="handleOrder"
        @goFront="goFront"
        @handleType="handleType"
        ref="getCube"
      ></view-cube>
      <!-- 标签树 -->
      <tag-tree
        @click.native.stop=""
        @closeTag="closeTag"
        @setListenClick="setListenClick"
        @setAddTag="setAddTag"
        @setTagClick="setTagClick"
        :setProps="propsFooter"
        ref="tagTree"
      ></tag-tree>
    </div>
    <!-- 漫游导航 -->
    <roamNavigate
    :taskId="taskId"
    @listenTodo="listenTodo"
    @closePart="closePart"
    v-if="viewAngle &&
              viewAngle.type === 0 &&
              viewAngle.state === 1"
    ></roamNavigate>
    <!-- (视图) -->
    <viewPhoto ref="viewPhoto" :viewPic="showViewPicture" :setProps="propsFooter" :taskId="taskId" @closeClick="showViewPicture='0'"></viewPhoto>
    <!-- 上传贴图弹框 （材质库） -->
    <el-dialog :visible="addViewUpImgPost" @close="closeTexureDialog('none')" width="30%" center>
      <viewUpimg :personalTexureGroup="personalTexureGroup" @texureClose="closeTexureDialog"></viewUpimg>
    </el-dialog>
    <!-- 协同模式弹窗 -->
    <teamwork-dialog
      ref="teamworkDialogRef"
      :shareCode="shareCode"
      :appId="appId"
    ></teamwork-dialog>
    <div class="invite-team-friend" v-if="userType === '1'">
      <div class="invite-btn" @click="openTeamDialog">
        <img src="./friend.png" alt="" /> 邀请成员
      </div>
    </div>
    <EscDialogItem ref="EscDialogItem" />
    <!-- 资源库 -->
    <ResourcePool ref="ResourcePool" :data="{taskId,userId,selectPark}" v-if="taskId" v-show="controllerInfo.tagUiBar"/>
    <!-- 构件信息 -->
    <ComponentInformation ref="ComponentInformation" :taskId="taskId" :data="memberInfo" v-if="taskId"/>
    <!-- 底部工具栏 -->
    <Tool ref="Tool" @onSuccess="toolSuccess" @close="closeDrawer"/>
  </div>
</template>

<script>
import { EventBus } from '@/utils/bus.js'
import MODELAPI from "@/api/model_api";
import CHAILIAOAPI from "@/api/material_api";   // 新增的材质库相关API （材质库）
import TAGTREE from "@/api/tag_tree";
import COMPONENTLIBRARY from "@/api/component-library";
// import todoFooter from "@/components/web_client/todo_footer";
import viewCube from "@/components/web_client/view_cube";
import tagTree from "@/components/web_client/tag_tree";
import roamNavigate from "@/components/web_client/roam_navigate";
import viewPhoto from "@/components/web_client/view_photo";
import progressBar from "@/components/web_client/progress_bar";
import qrcodePart from "@/components/web_client/qrcode-part.vue";

import resMessage from "../../../utils/res-message";

import TeamworkDialog from "../../manage/TeamworkDialog.vue";

import EscDialogItem from "@/components/web_client/EscDialogItem.vue";

import { Getuserid } from "@/store/index.js"; // (自定义构件)
import viewUpimg from "@/components/web_client/view_upImg.vue"; // （材质库）
import weatherSystem from "@/components/web_client/weather_system.vue"; // 天气系统
import ResourcePool from "../resourcePool/index.vue"; // 资源库
import ComponentInformation from "../componentInformation/index.vue"; //构件信息
import Tool from "../Tool/index.vue"; //底部工具栏


export default {
  name: "look_app",
  layout: "reset",
  components: {
    viewCube,
    tagTree,
    progressBar,
    qrcodePart,
    TeamworkDialog,
    EscDialogItem,
    roamNavigate,
    viewPhoto,
    viewUpimg,
    weatherSystem,
    ResourcePool,
    ComponentInformation,
    Tool
  },
  data() {
    return {
        userId: this.$route.query.userId || JSON.parse(sessionStorage.getItem("userid")),//用户id：链接可能没有用户id取缓存的
        activeTool: null,//点击tool
      showViewPicture:'0', // 传递给 viewPhoto 控制视图列表的显示 (视图)
      maxNodes:false,
      envProgress:0,   // 环境加载
      lockState:false,   // 最后点击的小锁的状态
      browerLogo:false,  // 浏览器亮 true
      contentLogo:false, // 构件库亮 true
      lockObj:{},   // 锁开那一项的信息
      lockView:'', // 锁的显示
      shareCode: null,
      showTodoIconObj: {},
      socketData: {},
      windowChangeFlag: true,
      componentCollapse: "1",
      modelBrowser: null,
      openNode: null,
      actionList: [],
      propsFooter: {
        taskId: null,
      },
      propsProgress: {
        data: 0,
        loadData: 0,
      },

      isProgress: true,
      propsMember: {
        label: "name",
        isLeaf: (e) => {
          if (e.haveChild === "1") {
            return false;
          }
          if (e.haveChild === "0") {
            return true;
          }
        },
      },
    //   uiBar： ，viewCube：，tagUiBar：底部栏显示隐藏，tagViewCube：，modelClient：，memberAvttribute：，componentLibrary：，singleList：
      controllerInfo: {
        uiBar: true,
        viewCube: true,
        tagUiBar: true,
        tagViewCube: true,
        modelClient: false,
        memberAvttribute: false,
        componentLibrary: false,
        singleList: [],
      },
      webUrl: null,
      appId: null,
      appToken: null,
      locale: "zh",
      taskId: null,
      ourbimInfo: null,
      isFade: true,
      isFollow: false,
      isTag: false,
      isQrCodeClick: false,
      handleState: 0,
      activeTree: null,
      leafInfo: null,
      listenInfo: null,
      cubeState: 6,
      runTimeCode: 0,
      timerInfo: null,
      memberInfo: [], //属性信息
      activeLeaf: false,
      loadTimer: null,
      timerCount: 0,
      hiddenState: 0,
      websock: null,
      isSocket: false,
      socketTimer: null,
      browserInfo: null, //模型浏览器
      viewAngle:null,  // 漫游导航
      natureInfo: null,
      shadowType: null,
      listenTodoInfo: null,
      isUiBar: true,
      pageSizeInfo: {
        width: null,
        height: null,
      },
      uaInfo: null,
      gaugeInfo: {
        unit: "m",
        accuracy: 0.01,
      },
      treeEmpty: this.$t("webClient.browser.tips[0]"),
      TreePageNo: 2,
      ScrollDistance: 0,
      isQrcode: false,
      iTime: {},
      comSaveNode: null,
      godNode: null,
      appType: null,
      userType: null,
      inputTwo:'',  // 材质库搜索绑定值 （材质库）
      activeMater:'', // 选中材质编辑中的 构件材质图片
      // （材质库）
      topImgMaterial:[],
      // 材质要修改的信息（材质库）
      middleMaterInfo:[
        {
          id:0,
          titleName:'贴图位置',
          nameInfo:[]
        },
          {
          id:2,
          titleName:'材质效果属性',
          nameInfo:[]
        }
      ],
      materilCheckList:[],  // 材质编辑底部复选框 （材质库）
      activeNamePic:'first', // 贴图弹框的 el-tabs  （材质库）
      color1:null,   // 材质编辑 颜色选择器  （材质库）
      photoStoreFlag:'', // 贴图库显示隐藏   （材质库）
      addViewUpImgPost:false, // 上传贴图弹框
      projectMaterList:[],  // 项目材质列表
      exchangeData:{      // 指令更换材质的参数
        matId:'',
        isPublic:'',
        actorId:'',
        comType:''
      },
      // 贴图库 公共库的信息
      errorImg:'this.src="' + require('@/assets/failed.png') + '"',
      personalPicMaterInfo:[], // 贴图库 个人库
      btnUpTexure:false, // 控制上传按钮
      personalTexureGroup:[], // 贴图 个人库分组
      materialShow:false, // 材质编辑 弹窗显示与隐藏
      modelIsLink:null, // 是否是链接模型
      pakIdMapweb:'', // 区分点击的是自定义构件还是模型自带的构件
      matParam:{}, // 材质的部分信息
      activeTexTurePerson:'', // 贴图库个人库
      spread:[], // 材质参数折叠面板展开
      spreadPerson:[], // 贴图库折叠面板展开
      materialAllInfo:{}, // 构件某材质全部信息
      matEditIndex:null, // 选中的材质编辑图片的下标
      defaultUrl:null, // 识别本地与线上
      comPakId:'', // 材质编辑点击的构件的pakId
      pakAndAppid:[], 
      weatherDrawer:false, // 天气抽屉
      drawerLeftSize: 300, // 抽屉宽度
      selectPark: null,//选择构件
    };
  },

  watch: {
    // 监听 浏览器 是否处于关闭状态 是 就将小锁关闭 并 关闭轴
    browerLogo:{
      handler(newVal,oldVal){
        if(newVal === false && this.lockObj.num !== undefined){
           const params = {
              taskId: this.taskId,
              flag: "off"
            }
           MODELAPI.LOCKOPENORCLOSE(params).then((res)=>{
            if(res.data.code === 0){
              // console.log('res');
            }
           })
        }
        if(this.lockObj.num !== undefined){
          if(newVal === false){
            this.$set(this.lockObj.data, [`lockView${this.lockObj.num}`], false);
             // 锁的状态(false)
            this.lockState = false;
          }
        }
      }
    },
    // 监听 构件库关闭 关闭小锁
    contentLogo:{
       handler(newVal,oldVal){
         if(newVal === false && this.lockObj.num !== undefined){
            this.$set(this.lockObj.data, [`lockView${this.lockObj.num}`], false);
            // 锁的状态(false)
            this.lockState = false;
         }
        //  构件库关闭的同时要关闭材质编辑按钮
         if(newVal === false){
            this.closeMaterialBtn();
         }
       }
    }
  },
  created() {
    // 用定时器给 环境加载中进度条 赋假值 让其(不再只有0和100)
    let timerTime = null;
    timerTime = setInterval(()=>{
      // 大于85 和 节点已达到最大时 就停止定时器---
      if(this.propsProgress.loadData > 90 || this.maxNodes === true){
        clearInterval(timerTime);
      }
      if(this.propsProgress.loadData <= 90 && this.maxNodes === false){
        this.propsProgress.loadData += 5;
      }
     },300);                
    this.lockView = this.$route.query.isGis || this.$route.query.weatherBin; 
    this.uaInfo = navigator.userAgent.toLowerCase();
    this.setOrderList();
    this.appId = this.$route.query.appid;
    this.appToken = this.$route.query.token;
    this.isUiBar =
      this.$route.query.uibar === undefined || this.$route.query.uibar === true
        ? true
        : false;

    this.handleTodoIcon(this.$route.query);
    if (this.$route.query.width && this.$route.query.height) {
      this.pageSizeInfo = {
        width: this.$route.query.width,
        height: this.$route.query.height,
      };
    } else {
      this.pageSizeInfo = {
        width: 1920,
        height: 1080,
      };
    }
    if (this.$route.query.appType) {
      this.appType = this.$route.query.appType;
      // 如果是云应用就去掉遮罩层和操作栏以及加载进度---
      if(this.$route.query.appType === '5'){
        this.isFade = false;
        this.isProgress =false;
      }
    }
    // 如果是 预启动项目就去掉遮罩层和加载进度
  //   if (this.$route.query.reserveId){
  //        this.isFade = false;
  //        this.isProgress =false;
  //   }
  },
  mounted() {
    this.defaultUrl = process.env.VUE_APP_REQUEST_URL;
    document
      .querySelector("#tree-content")
      .addEventListener("scroll", this.throttle(this.handleScroll));
    if (this.$route.query.locale) {
      this.locale = this.$route.query.locale;
      this.$i18n.locale = this.locale;
    } else {
      this.$i18n.locale = this.locale;
    }
    this.setTimeLoad();
    if (this.isMobile()) {
      this.runTimeCode = 1;
    } else {
      this.runTimeCode = 0;
    }
    this.getModelUrl();
    //判断是否使用的是ipad
    let isiPad =
      navigator.userAgent.match(/(iPad)/) ||
      (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
    let isMac = /macintosh|mac os x/i.test(navigator.userAgent);
    if (isiPad !== false || isMac !== false) {
      this.hiddenState = 3;
    }
    this.addMessageEvent();
    this.getLinkModelAppid(); // 获取appid
  },
  destroyed() {
    this.clearTimePass();
    this.closeWebSocket();
  },
  methods: {
    // 点击底部工具栏后操作
    toolSuccess(e){
        console.log('🚀🚀🚀',e);
        // this.activeTool = e
        // EventBus.$emit('onToTool', e)//传给Drawer组件关闭的时候使用
        if(e.check) return
        switch (e.key) {
            // 显示
            case 'show':
                
                break;
            // 框选
            case 'selection':
                
                break;
            // 漫游导航
            case 'roaming':
                
                break;
            // 模型剖切
            case 'modelSectioning':
                
                break;
            // 测量
            case 'measure':
                
                break;
            // 标签
            case 'label':
                
                break;
            // 视图
            case 'view':
                
                break;
            // 模型动画
            case 'modelAnimation':
                
                break;
            // 分解模型
            case 'decompositionModel':
                
                break;
            // 渲染环境
            case 'renderingEnvironment':
                
                break;
            // 资源库
            case 'resource':
                this.$refs.ResourcePool.show({activeTool:e,taskId:this.taskId,userId:this.userId,selectPark:this.selectPark})
                break;
            // 浏览器
            case 'browser':
                
                break;
            // 构件信息
            case 'componentInformation':
                this.$refs.ComponentInformation.show({activeTool:e,taskId:this.taskId,memberInfo:this.memberInfo})
                break;
        
            default:
                break;
        }
    },
    // 隐藏弹窗
    closeDrawer(e){
        switch (e.key) {
            // 显示
            case 'show':
                
                break;
            // 框选
            case 'selection':
                
                break;
            // 漫游导航
            case 'roaming':
                
                break;
            // 模型剖切
            case 'modelSectioning':
                
                break;
            // 测量
            case 'measure':
                
                break;
            // 标签
            case 'label':
                
                break;
            // 视图
            case 'view':
                
                break;
            // 模型动画
            case 'modelAnimation':
                
                break;
            // 分解模型
            case 'decompositionModel':
                
                break;
            // 渲染环境
            case 'renderingEnvironment':
                
                break;
            // 资源库
            case 'resource':
                this.$refs.ResourcePool.hide()
                break;
            // 浏览器
            case 'browser':
                
                break;
            // 构件信息
            case 'componentInformation':
                this.$refs.ComponentInformation.hide()
                break;
        
            default:
                break;
        }
    },
    // 操作的时候隐藏工具栏true隐藏，false显示
    hideTool(val = true){
        this.controllerInfo.tagUiBar = !val;//底部栏隐藏
        this.$refs.EscDialogItem.changeVisible(val);
    },
    outPic(url){
            //实例化一个img对象
            const img = new Image();
            //设置img的图片路径
            img.src = url;
            //设置跨域解决
            img.setAttribute('crossOrigin', 'Anonymous');
            //img加载完后处理
            img.onload = function() {
                //创建一个canvas对象
                const canvas = document.createElement('canvas')
                //把图片的宽度设为canves的宽度
                canvas.width = 1200
                //把图片的高度设为canves的高度
                canvas.height = 700
                //创建一个2d画布
                const ctx = canvas.getContext('2d')
                // 将img中的内容画到画布上
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
    showViewPic(valModel){
      this.showViewPicture = valModel;
    },
    // 点击锁
    handleToggleLock(node, data, i){
        // 最多只开一把锁的，打开某一个锁，其他锁要关闭
        const result = node.parent.childNodes;
        if(result){
          for (let index = 0; index < result.length; index++) {
            if(result[index].data.uuid !== data.uuid) {
              this.$set(result[index].data, `lockView${result[index].data.uuid.slice(-1)}`, false)
            }else {
              this.$set(data, [`lockView${i}`], !data[`lockView${i}`])
            }
          }
        }
        // 将点击锁的那一项的信息赋予 lockObj
        this.lockObj.node = node;
        this.lockObj.data = data;
        this.lockObj.num = i;
        // 锁的状态
        this.lockState = data[`lockView${i}`];
        const params = {
          taskId: this.taskId,
          flag: data[`lockView${i}`] ? "on" : "off"
        }
        MODELAPI.LOCKOPENORCLOSE(params).then((res) => {
          if(res.data.code == 0) {
            const infoParam = {
              taskId: this.taskId,
              actorOrAppId: data.projectId
            }
            if(params.flag === 'on'){
               MODELAPI.LOCKAFTERINFO(infoParam).then((res) => {
                 if(res.data.code === 0){
                  this.$message({
                    message: this.$t("webClient.loadBox.message[2]"),
                    type: "success",
                  });
                 }
              });
            }
          }else{
            this.$message({
              message: res.data.message,
              type: "error",
           });
          }
        });        
      },
      // 构件库 明 暗
      passContentLogo(val){
        this.contentLogo = val;
      },
      // 浏览器 明 暗
      passBrowerLogo(val){
        this.browerLogo = val;
      },
     addMessageEvent() {
      window.addEventListener(
        "message",
        (e) => {
          if (e.data.prex === "pxymessage") {
            this.getError(e.data);
          }
          if (e.data.prex === "ourbimMessage") {
            // 控制栏显示隐藏
            if (e.data.type === 1001) {
              this.controllerInfo.uiBar = e.data.data;
              this.controllerInfo.viewCube = e.data.data;
            } else if (e.data.type >= 1002 && e.data.type <= 1014) {
              if (this.actionList.indexOf(e.data.type) > -1) {
                if (e.data.data === false) {
                  this.controllerInfo.singleList.push(e.data.type);
                } else {
                  this.controllerInfo.singleList.indexOf(e.data.type) > -1
                    ? this.controllerInfo.singleList.splice(
                        this.controllerInfo.singleList.indexOf(e.data.type),
                        1
                      )
                    : "";
                }
              }
            } else if (e.data.type === 1015) {
              this.controllerInfo.viewCube = e.data.data;
            } else if (e.data.type === 2001) {
              // 构件树的显示隐藏
              this.controllerInfo.modelClient = e.data.data;
            } else if (e.data.type === 2002) {
              this.controllerInfo.memberAvttribute = e.data.data;
            } else if (e.data.type === 2003) {
              this.$refs.tagTree.closePart(e.data.data);
              this.$refs.tagTree.closeIcon();
            } else if (e.data.type === 2004) {
              this.controllerInfo.componentLibrary = e.data.data;
            }
          }
        },
        false
      );
    },
    comIconChang(val) {
    //   this.comVisible = val;
    },
    handleTodoIcon(query) {
      const arr = [
        "show",
        "select",
        "view",
        "speed",
        "slice",
        "measure",
        "tag",
        "map",
        "camera",
        "animation",
        "decompose",
        "weather",
        "componentList",
        "componentTree",
        "attribute",
      ];
      let obj = {};
      arr.map((v) => {
        if (query[v] == "false") {  
          obj[v] = false;
        } else {
          obj[v] = true;
        }
      });
      // gis 和 分享 要隐藏天气渲染
      // if(this.lockView === 'true' || this.lockView === undefined){
      //   obj.weather = false;
      // }
      this.showTodoIconObj = obj;
    },
    listenWindowSize() {
      // 监听窗口大小变化 id=14 height
      this.handleWindowSize();
      window.onresize = () => {
        clearTimeout(this.iTime);
        this.iTime = setTimeout(() => {
          this.handleWindowSize();
        }, 200);
      };
    },
    handleWindowSize() {
      const viewWidth = window.innerWidth; //获取可视区域宽度
      const viewHeight = window.innerHeight; //获取可视区域高度
      let height = "";
      let width = "";
      if (viewWidth > viewHeight) {
        // 宽大于高 横屏
        height = document.body.clientHeight;
        width = document.body.clientWidth;
      } else {
        height = document.body.clientWidth;
        width = document.body.clientHeight;
      }
      let params = {
        taskid: this.taskId,
        action: "platform",
        plateType: this.isMobile() ? 1 : 0,
        height: height,
        width: width,
      };
      MODELAPI.UPDATEORDER(params);
    },
    async updataModle(params) {
      params.taskid = this.taskId;
      const { data: res } = await MODELAPI.UPDATEORDER(params);
      if (res.code === 0) {
        this.$message.success(res.message);
      } else {
        this.$message.error(res.message);
      }
    },
    filterNode(value, data) {
      /**
       * @Author: zk
       * @Date: 2021-09-01 10:49:56
       * @description: 筛选模型浏览器
       */
      if (!value) return true;
      const reamVal = data.name.indexOf(value) !== -1;
      if (!reamVal) {
        this.treeEmpty = this.$t("webClient.browser.tips[1]");
      }
      return reamVal;
    },
    changeBrowser() {
      /**
       * @Author: zk
       * @Date: 2021-09-01 10:46:13
       * @description: 搜索
       */
      this.$refs.setTree.filter(this.modelBrowser);
    },

    AddQrCode() {
      /**
       * @Author: zk
       * @Date: 2021-07-30 14:25:42
       * @description: 新增二维码
       */
      return;
      let params = {
        taskId: this.taskId,
      };
      COMPONENTLIBRARY.ADDCOMPONENT(params).then((res) => {
        if (this.controllerInfo.uiBar) {
          this.controllerInfo.tagUiBar = false;
          this.controllerInfo.tagViewCube = false;
        }
      });
    },

    ExpandNode(e, data) {
      /**
       * @Author: zk
       * @Date: 2021-06-18 17:06:25
       * @description: 节点展开
       */
      this.TreePageNo = 2;
      this.openNode = data;

      if (this.appType === "3") {
        // 合模
      } else {
        // 不是合模
        // 展开根节点，保存根节点信息
        if (data.level === 1) {
          this.godNode = data || {};
        }

        // 保存自定义构件信息（普通模型）
        if (data.data.name === "自定义构件") {
          this.comSaveNode = data || {};
        }
      }
    },
    throttle(fn, delay = 500) {
      /**
       * @Author: zk
       * @Date: 2021-06-18 16:50:53
       * @description: 节流优化
       */
      // 设置变量默认为true
      let flag = true;
      // 为了保证this指向，返回一个箭头函数
      return (...args) => {
        // 判断如果已经在执行就直接return
        if (!flag) return;
        // 否则就是没有执行，将状态赋值为false
        flag = false;
        // 设置定时器，设置时间
        let timer = setTimeout(() => {
          // 调用apply方法确保this指向问题
          fn.apply(this, args);
          // 最后将状态重新更改为true，以便程序下次执行
          flag = true;
          clearTimeout(timer);
        }, delay);
      };
    },
    handleScroll() {
      /**
       * @Author: zk
       * @Date: 2021-06-18 16:22:59
       * @description: 监听滚动
       */
      let offsetHeight = document.querySelector(".tree-part").offsetHeight;
      let scrollTop = document.querySelector("#tree-content").scrollTop;
      let scrollHeight = document.querySelector("#tree-content").scrollHeight;
      let scrollBottom = scrollHeight - (offsetHeight + scrollTop);
      const ScrollDistance = scrollTop - this.ScrollDistance;
      this.ScrollDistance = scrollTop;
      if (ScrollDistance > 0) {
        this.ListScrollTree();
      }
    },
    // 更新添加的自定义构件库
    updateComTree() {
      if (!this.comSaveNode) {
        return;
      }
      this.getMyComList(this.comSaveNode).then((res) => {
        this.$refs.setTree.updateKeyChildren(this.comSaveNode.data.uuid, res);
      });
    },
    updateGodChildNode() {
      // 没有根节点，返回
      if (!this.godNode) {
        return;
      }
      // 检查第二层有无自定义构件
      const flag = this.godNode.childNodes.some((item) => {
        return item.data.name === "自定义构件";
      });
      // 如果有
      if (flag) {
        this.updateComTree();
      } else {
        let node = this.$refs.setTree.getNode(this.godNode);

        // 如果没有，添加自定义构件组
        this.getMyComList(this.godNode).then((res) => {
          const data = res[res.length - 1];
          this.$refs.setTree.append(data, node);
        });
      }
    },
    ListScrollTree() {
      /**
       * @Author: zk
       * @Date: 2021-06-18 17:03:03
       * @description: 滚动加载构件树
       */
      this.LisetMemberPage(this.openNode).then((res) => {
        this.TreePageNo++;
        if (res.length > 0) {
          res.forEach((item) => {
            let noneNode = this.$refs.setTree.getNode(item);
            if (!noneNode) {
              this.$refs.setTree.append(item, this.openNode.key);
              this.$refs.setTree.setChecked(item, this.openNode.checked);
            }
          });
        } else {
          if (this.openNode.parent.data) {
            this.TreePageNo = 1;
            this.openNode = this.openNode.parent;
            this.ListScrollTree();
          }
        }
      });
    },
    setOrderList() {
      /**
       * @Author: zk
       * @Date: 2021-05-10 17:54:24
       * @description: 初始化指令对照表
       */
      for (let index = 0; index < 13; index++) {
        this.actionList.push(1002 + index);
      }
    },
    listenFollow(e) {
      /**
       * @Author: zk
       * @Date: 2021-04-08 15:30:38
       * @description: 监听关注视角是否打开
       */
      this.isFollow = e;
    },
    listenMode(e) {
      /**
       * @Author: zk
       * @Date: 2021-03-17 16:01:54
       * @description: 切换投影模式
       */
      this.handleState = e;
      this.$refs.getCube.resetActive(e);
    },
    getError(e) {
      /**
       * @Author: zk
       * @Date: 2021-03-16 13:55:19
       * @description: 处理异常
       */
      let errorList = [
        101, 102, 103, 201, 202, 203, 301, 401, 402, 403, 404, 501, 502, 503,
        504, 601, 602, 603, 1001, 1002, 1003, 1004,
      ];
      if (e.type === 200) {
        this.getMonitor();
      }
      if (errorList.indexOf(e.type) !== -1) {
        if (this.userType == "0") {
          this.hiddenState = 5;
          this.isFade = true;
          this.closeWebSocket();
        } else {
          this.hiddenState = 4;
          this.isFade = true;
          this.closeWebSocket();
          this.$message({
            message: this.$t("webClient.loadBox.message[6]"),
            type: "warning",
            customClass: "set-index-message",
          });
        }
      }
    },
    handleType(e) {
      /**
       * @Author: zk
       * @Date: 2021-03-12 11:34:19
       * @description: 选择类型 e 0: 重置主视图 1: 透视投影 2: 正交投影 3 自定义主视图
       */
      if (e === 2 && this.$refs.getFooter) {
        // 上帝视角
        this.$refs.getFooter.resetPerson(1);
      }
      this.shadowType = e;
      if (e === 0) {
        this.handleState = 7;
      } else if (e === 3) {
        this.handleState = 2;
      } else {
        this.handleState = 1;
      }
      this.updateOrder();
    },
    goFront() {
      /**
       * @Author: zk
       * @Date: 2021-04-08 11:47:29
       * @description: 定位主视图
       */
      this.handleState = 10;
      this.updateOrder();
    },
    // 判断父级或者父父级node名字有没有vanjian
    checkedNodeVanjian(node) {
      if (node.level === 1) {
        return true;
      } else if (node.level === 2) {
        if (node.parent.data.uuid.indexOf("vanjian") !== -1) {
          return false;
        } else {
          return true;
        }
      } else if (node.level === 3) {
        if (node.parent.parent.data.uuid.indexOf("vanjian") !== -1) {
          return false;
        } else {
          return true;
        }
      }
    },
    updateComTreeAfterDeleteByUuid(uuid) {
      // 获取自定义构件父级node
      const nodeParent = this.$refs.setTree.getNode(uuid).parent;
      this.$refs.setTree.remove(uuid);
      if (nodeParent.childNodes.length === 0) {
        this.$refs.setTree.remove(nodeParent.data.uuid);
      }
    },
    deleteCom(node) {
      const { name, uuid } = node.data;
      this.$confirm("此操作删除此构件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          COMPONENTLIBRARY.deleteCom({
            taskId: this.taskId,
            comId: uuid,
          }).then((res) => {
            resMessage(res.data);
            // 获取自定义构件父级node
            if (res.data.code === 0) {
              this.updateComTreeAfterDeleteByUuid(node.data.uuid);
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    openTeamDialog() {
      this.$refs.teamworkDialogRef.openDialog({
        appid: this.appId,
      });
    },
    componentShowHide(uuid) {
      /* 
        自定义构件显示隐藏
      */
      const lableVisibility = this.leafInfo.activeState == 1 ? false : true;
      COMPONENTLIBRARY.controlComShowOrHide({
        comId: uuid,
        taskId: this.taskId,
        lableVisibility,
      }).then(({ data: res }) => {
        resMessage(res);
      });
    },
    checkTree(data, e) {
      /**
       * @Author: zk
       * @Date: 2021-04-16 11:56:27
       * @description: 显示隐藏
       */
      this.leafInfo = data;

      if (e.checkedKeys.includes(data.uuid)) {
        this.handleState = 8;
        data.activeState = 1;
        // 如果是自定义构件
        if (data.typeId === "comp") {
          this.componentShowHide(data.uuid);
          return;
        }
        this.updateOrder();
      } else {
        this.handleState = 8;
        data.activeState = 0;
        // 如果是自定义构件
        if (data.typeId === "comp") {
          this.componentShowHide(data.uuid);
          return;
        }
        this.updateOrder();
      }
    },
    handleTree(e, index) {
      /**
       * @Author: zk
       * @Date: 2021-03-08 14:39:51
       * @description: 构件树的指令
       */
      let messageInfo = {
        prex: "ourbimMessage",
        type: 20001,
        data: e.data,
        message: "",
      };
      this.sentParentIframe(messageInfo);
      if (this.activeTree && this.activeTree.uuid === e.data.uuid) {
        if (e.data.activeSelect === 1) {
          this.activeLeaf = false;
        } else {
          this.activeLeaf = true;
        }
        e.data.activeSelect = e.data.activeSelect === 0 ? 1 : 0;
        this.leafInfo = e;
      } else {
        this.activeLeaf = true;
        this.leafInfo = e;
        e.data.activeSelect = 1;
      }
      // 新增俩个属性放在最前面
      if(e.data?.dynamicData?.length){
        e.data.dynamicData = [{name:'构件ID',value:e.data.revitCode},{name:'构件名称',value:e.data.name}].concat(e.data.dynamicData)
      }
      this.memberInfo = e.data
      this.leafInfo = e;
      this.handleState = 9;

      this.activeTree = e.data;

      if (e.data.typeId === "comp") {
        // 如果是构件库
        this.leafInfo = e;
        this.isQrCodeClick = true;
        this.handleFocusTag(e.data);
      } else {
        this.updateOrder();
      }
    },
    handleFocusTag(e) {
      /**
       * @Author: zk
       * @Date: 2021-08-17 16:00:55
       * @description: 定位二维码
       */
      let flag = null;
      flag = this.leafInfo.data.activeSelect ? true : false;
      let params = {
        taskId: this.taskId,
        comId: e.uuid,
        flag,
      };

      COMPONENTLIBRARY.focusComponent(params)
        .then((res) => {
          if (res.data.code === 0) {
            this.$message({
              message: res.data.message,
              type: "success",
            });
          } else {
            this.$message({
              message: res.data.message,
              type: "error",
            });
          }
        })
        .catch((res) => {
          this.$message({
            message: res.data.message,
            type: "error",
          });
        });
    },
    handleQrcode(e) {
      /**
       * @Author: zk
       * @Date: 2021-07-30 16:28:24
       * @description: 打开二维码框
       */
      this.$refs.getFooter.resetState();
      this.isQrcode = e;
    },
    handleOrder(e) {
      /**
       * @Author: zk
       * @Date: 2021-03-08 10:40:10
       * @description: cube指令
       */
      if (this.listenInfo === 0 && this.$refs.getFooter) {
        this.$refs.getFooter.resetPerson(1);
      }
      this.handleState = 6;
      this.cubeState = e;
      this.updateOrder();
    },
    async updateOrder() {
      /**
       * @Author: zk
       * @Date: 2020-09-14 15:16:16
       * @description: 操作指令
       */
      if (!this.taskId) {
        this.$message({
          message: this.$t("webClient.loadBox.message[1]"),
          type: "error",
          customClass: "set-index-message",
        });
        return;
      }
      let params = {
        taskid: this.taskId,
      };
      switch (this.handleState) {
        case 0:
          // 一三人称
          params.action = "switchViewMode";
          params.viewMode = this.listenInfo === 0 ? 1 : 2;
          if (this.listenInfo === 0) {
            this.shadowType = 1;
            this.$refs.getCube.resetActive(1);
          }
          params.projectionMode =
            this.shadowType === 1 || this.shadowType === 2
              ? this.shadowType
              : 1;
          break;
        case 1:
          // 模式切换
          params.action = "switchViewMode";
          // 投影类型切换
          if (this.shadowType === 2) {
            // 正交 必须为上帝视角
            params.projectionMode = 2;
            params.viewMode = 2;
          }
          if (this.shadowType === 1) {
            // 透视投影
            params.projectionMode = 1;
            if (this.listenInfo) {
              params.viewMode = this.listenInfo.state === 0 ? 1 : 2;
            } else {
              params.viewMode = 2;
            }
          }
          break;
        case 2:
          // 自定义主视图
          params.action = "setGodPos";
          break;
        case 3:
          // 移动速度
          params.action = "setSpeedLevel";
          params.speedLevel = this.listenTodoInfo.data;
          break;
        case 4:
          if (
            this.listenTodoInfo.data === 0 ||
            this.listenTodoInfo.data === 1 ||
            this.listenTodoInfo.data === 2
          ) {
            // 测量前先关闭其他测量（排他思想）
            params.action = "endMeasure";
            await MODELAPI.UPDATEORDER(params);
          }
          // 测量
          if (this.listenTodoInfo.data === 0) {
            // 坐标
            params.action = "coordinate";
            // params.status="begin"
          } else if (this.listenTodoInfo.data === 1) {
            // 距离
            params.action = "distance";
          } else if (this.listenTodoInfo.data === 2) {
            // 角度
            params.action = "angle";
          } else if (this.listenTodoInfo.data === 3) {
            // 设置单位
            params.action = "changePrecisionOrUnit";

            params.unit = this.listenTodoInfo.set;
            params.precision = this.gaugeInfo.accuracy;
          } else if (this.listenTodoInfo.data === 4) {
            // 设置精度

            params.action = "changePrecisionOrUnit";
            params.precision = this.listenTodoInfo.set;
            params.unit = this.gaugeInfo.unit;
          }
          break;
        case 5:
          // 关闭测量
          params.action = "endMeasure";
          break;
        case 6:
          // 六面体
          params.action = "cameraPosSpecial";
          params.sjid = this.cubeState;
          break;
        case 7:
          // 重置主视图
          params.action = "clearGodCamerashot";
          break;
        case 8:
          // 构件显示 隐藏 半透明
          params.mn = this.leafInfo.uuid;
          params.projectId = this.leafInfo.projectId;
          if (this.leafInfo.activeState === 0) {
            params.action = "showComponents";
          } else if (this.leafInfo.activeState === 1) {
            params.action = "hideComponents";
          } else {
            params.action = "setTransparency";
            params.Opacity = 0.5;
          }
          break;
        case 9:
          // 当前 focus + 高亮 /取消
          params.projectId = this.leafInfo.data.projectId;
          params.mn = this.leafInfo.key;
          this.leafInfo.data.activeSelect === 0
            ? (params.action = "cancelSelectComponent")
            : (params.action = "selectComponent");
          break;
        case 10:
          // 定位主视图
          params.action = "cameraPosAll";
          break;
        case 11:
          // 剖切
          if (this.listenTodoInfo.state === 0) {
            params.action = "end";
          }
          if (
            this.listenTodoInfo.state === 1 &&
            this.listenTodoInfo.data === undefined
          ) {
            params.action = "start";
          }
          if (
            this.listenTodoInfo.state === 1 &&
            this.listenTodoInfo.data !== undefined
          ) {
            switch (this.listenTodoInfo.data.id) {
              case 0:
                if (this.listenTodoInfo.data.state === "on") {
                  params.action = "move";
                } else {
                  params.action = "cutBox";
                }
                break;
              case 1:
                if (this.listenTodoInfo.data.state === "on") {
                  params.action = "rotate";
                } else {
                  params.action = "cutBox";
                }
                break;
              case 2:
                params.action = "invert";
                params.Switch = this.listenTodoInfo.data.state;
                break;
              case 3:
                params.action = "startItem";
                break;
              case 4:
                params.action = "restoration";
                break;
              default:
                break;
            }
          }
          break;
        case 12:
          // 分解模型
          params.action = "splitModel";
          params.splitValue = this.listenTodoInfo.data;
          break;
        // case 13:
        //   // 启动应用
        //   params.action = "platform";
        //   params.plateType = this.isMobile() ? 1 : 0;
        //   params.width = document.body.clientWidth;
        //   params.height = document.body.clientHeight;
        //   break;
        case 14:
          // 框选
          params.action = "componentBoxSelection";
          params.Switch = this.listenTodoInfo.state === 1 ? "on" : "off";
          break;
        case 15:
          // 渲染环境
          // params.action = "Weather";
          // params.weahterId = this.listenTodoInfo.data.id;
          params.action = "switchWeather ";
          params.weahterId = this.listenTodoInfo.data.id;
          break;
        case 16:
          // 渲染环境
          params.action = "minimapSethidden";
          params.Switch = this.listenTodoInfo.state === 0 ? "off" : "on";
          break;
        case 17:
          // 渲染环境
          params.action = 51;
          params.rate = this.listenTodoInfo.data ? this.listenTodoInfo.data : 6;
          break;
        default:
          break;
      }
      if (this.isAngle) {
        params = {
          taskid: this.taskId,
          id: 20,
        };
      }
      if (this.handleState == 13) {
        return;
      }
      //模型操作
      await MODELAPI.UPDATEORDER(params)
        .then((res) => {
          if (res.data.code === 0) {
            // 剖切 重置恢复
            this.resetSection();

            if (params.action === "cameraPosAll" && res.data && res.data.data) {
              // 切换到主视图 重置状态
              if (this.$refs.getFooter) {
                let realView = res.data.data.viewMode === "1" ? 0 : 1;
                this.$refs.getFooter.resetPerson(realView);
              }
              if (this.$refs.getCube) {
                let realProject = res.data.data.projectionMode === "1" ? 1 : 2;
                this.$refs.getCube.resetActive(realProject);
              }
            }
            this.$message({
              message: this.$t("webClient.loadBox.message[2]"),
              type: "success",
            });
          } else {
            this.$message({
              message: res.data.message,
              type: "error",
            });
          }
        })
        .catch(() => {
          // 剖切 重置恢复
          this.resetSection();
          this.$message({
            message: this.$t("webClient.loadBox.message[3]"),
            type: "error",
          });
        });
    },
    resetSection() {
      /**
       * @Author: zk
       * @Date: 2021-09-03 17:40:45
       * @description: 剖切 重置恢复
       * @param {*} this
       */
      const realId =
        this.listenTodoInfo &&
        this.listenTodoInfo.data &&
        this.listenTodoInfo.data.id
          ? this.listenTodoInfo.data.id
          : "";
      if (this.handleState === 11 && realId === 4) {
        this.$refs.getFooter.resetSection();
      }
    },

    async getMyComList(node) {
      let params = {
        appliId:
          node.data && node.data.projectId ? node.data.projectId : this.appId,
        pageNo: 1,
        pageSize: 999,
      };
      node.key ? (params.uuid = node.key) : "";
      let realMember = await MODELAPI.LISTMEMBERTREE(params).then((res) => {
        if (res.data.code === 0) {
          return res.data.data;
        } else {
          return [];
        }
      });
      return realMember;
    },

    async LisetMemberPage(node) {
      let params = {
        appliId:
          node.data && node.data.projectId ? node.data.projectId : this.appId,
        pageNo: this.TreePageNo,
        pageSize: 20,
      };
      node.key ? (params.uuid = node.key) : "";
      let realMember = await MODELAPI.LISTMEMBERTREE(params).then((res) => {
        if (res.data.code === 0) {
          return res.data.data;
        } else {
          return [];
        }
      });
      return realMember;
    },
    async getMemberList(node) {
      let params = {
        appliId:
          node.data && node.data.projectId ? node.data.projectId : this.appId,
        pageNo: 1,
        pageSize: 20,
      };
      node.key ? (params.uuid = node.key) : "";
      let realMember = await MODELAPI.LISTMEMBERTREE(params).then((res) => {
        if (res.data.code === 0) { 
          return res.data.data;
        } else {
          return [];
        }
      });

      return realMember;
    },
    loadNode(node, resolve) {
      if (node.level === 0) {
        this.getMemberList(node).then((res) => {
          if (res.length > 0) {
            res.forEach((item) => {
              item.activeState = 0;
              item.activeSelect = 0;
            });
            return resolve(res);
          } else {
            this.treeEmpty = this.$t("webClient.browser.tips[1]");
          }
        });
      }
      if (node.level >= 1) {
        this.getMemberList(node).then((res) => {
          if (res.length > 0) {
            res.forEach((item) => {
              item.activeState = 0;
              item.activeSelect = 1;
            });

            return resolve(res);
          } else {
            this.treeEmpty = this.$t("webClient.browser.tips[1]");
            return resolve([]);
          }
        });
      }
    },
    // 关闭模块
    closePart(e) {
      if (e === 10) {
        this.browserInfo = null;
      }
      if (e === 11) {
        this.natureInfo = null;
      }
      if (e === 14) {
        this.listenTodoInfo = null;
      }
      // 漫游导航---
      if(e === 0){
        this.viewAngle = null;
      }
      if (this.$refs.getFooter) {
        this.$refs.getFooter.editTool(e);
      }
    },
    closeTag() {
      /**
       * @Author: zk
       * @Date: 2021-05-06 10:13:08
       * @description: 关闭标签组件
       */
      this.isTag = false;
      this.listenTodoInfo = {
        type: 4,
        state: 0,
      };
      this.handleTagShow();
      if (this.$refs.getFooter) {
        this.$refs.getFooter.editTool(4);
      }
    },
    setListenClick(e) {
      /**
       * @Author: zk
       * @Date: 2021-05-07 09:54:23
       * @description: 设置监听点击状态
       */
      if (this.$refs.getFooter) {
        this.$refs.getFooter.setListenClick(e);
      } else {
        if (e) {
          this.isTag = false;
          window.addEventListener("click", this.clickOthers);
        } else {
          this.isTag = true;
          window.removeEventListener("click", this.clickOthers);
        }
      }
    },
    clickOthers() {
      return;
    },
    setTagClick(e) {
      /**
       * @Author: zk
       * @Date: 2021-05-12 16:49:12
       * @description: 标签树是否选中
       */
      let messageInfo = {
        prex: "ourbimMessage",
        type: 30001,
        data: e,
        message: "",
      };
      this.sentParentIframe(messageInfo);
    },
    setAddTag() {
      /**
       * @Author: zk
       * @Date: 2021-05-19 10:45:00
       * @description: 添加标签
       */
      if (this.controllerInfo.uiBar) {
        this.controllerInfo.tagUiBar = false;
        this.controllerInfo.tagViewCube = false;
      }
    },
    listenPerson(e) {
      /**
       * @Author: zk
       * @Date: 2021-03-16 18:06:24
       * @description: 人称切换
       */
      this.handleState = 0;
      this.listenInfo = e;
      this.updateOrder();
    },
    listenTodo(e) {
      /**
       * @Author: zk
       * @Date: 2021-03-04 14:06:09
       * @description: 监听操作栏
       */
      // 漫游导航内 控制 viewCube ---
      if(e.name==='viewCube'){
        this.controllerInfo.viewCube = e.flag;
      }
      this.$refs.getCube.closeView();
      if (e.type === 14 || e.type === 11) {
        this.isQrcode = false;
      }
      // 构件库
      if (e.type === 14) {
        this.listenTodoInfo = e;
        document.querySelector('.systemDrawer').style.display = 'none'; // 关闭天气弹框
        if(this.taskId && this.controllerInfo.tagUiBar && ((this.listenTodoInfo && this.listenTodoInfo.type === 14 && this.listenTodoInfo.state === 1) || this.controllerInfo.componentLibrary)){
          this.$refs.ResourcePool.show()
        }
      }
      // 浏览器
      if (e.type === 10) {
        this.browserInfo = e;
      }
      // 构件属性
      if (e.type === 11) {
        this.natureInfo = e;
        document.querySelector('.systemDrawer').style.display = 'none'; // 关闭天气弹框
        this.$refs.getFooter.editTool(9); // 关闭天气图标
        this.$refs.ComponentInformation.show()
      }
      // 框选
      if (e.type === 12) {
        this.handleState = 14;
        this.listenTodoInfo = e;
        this.updateOrder();
      }
      // 移动速度
      if (e.type === 1 && e.data) {
        this.handleState = 3;
        this.listenTodoInfo = e;
        this.updateOrder();
      }
      // 标签
      if (e.type === 4) {
        this.isTag = e.state === 0 ? false : true;
        this.$refs.tagTree.closePart(e.state === 0 ? false : true);
        this.listenTodoInfo = e;
        this.handleTagShow();
      } else {
        if (this.isTag && e.type !== 11) {
          if(e.flag === 'material') return; // 开启标签并关闭材质编辑时，防止标签消失
          this.$refs.tagTree.closePart(false);
          // 如果不是标签并且标签已经开启
          // this.listenTodoInfo = {
          //   type: 4,
          //   state: 0,
          // };
          this.handleTagShow(false);   
          this.isTag = false;
        }
      }
      // 模型剖切
      if (e.type === 2) {
        this.handleState = 11;
        this.listenTodoInfo = e;
        this.updateOrder();
      }
      // 测量
      /*
        state: 0,
        type: 3,
        data: 0 1 2,
        set: null,
       */
      if (e.type === 3) {
        if (e.state === 1 && e.data !== undefined) {
          this.handleState = 4;
          this.listenTodoInfo = e;
          if (e.data === 3) {
            this.gaugeInfo.unit = e.set;
          } else if (e.data === 4) {
            this.gaugeInfo.accuracy = e.set;
          }
          this.updateOrder();
        }
        if (e.state === 0) {
          this.handleState = 5;
          this.updateOrder();
        }
      }
      // 分解模型
      if (e.type === 8 && e.data !== undefined) {
        this.handleState = 12;
        this.listenTodoInfo = e;
        this.updateOrder();
      }
      // 渲染环境
      // if (e.type === 9 && e.data !== undefined) {
      //   this.handleState = 15;
      //   this.listenTodoInfo = e;
      //   this.updateOrder();
      // }
      // 天气系统
      if(e.type === 9){
        this.listenTodoInfo = e;
        if(e.state === 1){
          document.querySelector('.systemDrawer').style.display = 'block';
          this.weatherDrawer = true
          this.natureInfo = null; // 关闭属性弹框
          this.$refs.getFooter.editTool(11); // 关闭属性图标
        }else{
          this.weatherDrawer = false
          document.querySelector('.systemDrawer').style.display = 'none';
        }
      }
      // 小地图
      if (e.type === 5) {
        this.handleState = 16;
        this.listenTodoInfo = e;
        this.updateOrder();
      }
      // 构件显示隐藏
      // 渲染环境
      if (e.type === 13) {
        this.listenTodoInfo = e;
        // this.UpdateMemeberState();
      }
      // 渲染环境修改时间
      if (e.type === 15) {
        this.handleState = 17;
        this.listenTodoInfo = e;
        this.updateOrder();
      }
      //漫游导航---
       if (e.type === 0) {
         this.viewAngle = e
       }
      // 点击 材质编辑 开关
      if(e.flag==='material'){
        this.materialShow = e.state;
      }
    },
    UpdateMemeberState() {
      /**
       * @Author: zk
       * @Date: 2021-06-09 11:02:14
       * @description: 更改选中构件状态
       */
      let params = {
        taskid: this.taskId,
        visible: this.listenTodoInfo.state === 0 ? true : false,
      };

      MODELAPI.UPDATEMEMBER(params).then((res) => {
        this.$message({
          message: this.$t("webClient.loadBox.message[2]"),
          type: "success",
        });
      });
    },
    handleTagShow(flag) {
      /**
       * @Author: zk
       * @Date: 2021-05-12 16:05:22
       * @description: 标签显示/隐藏
       */
      let params = {
        taskId: this.taskId,
        lableVisibility: this.listenTodoInfo.state === 0 ? false : true,
      };
      if (flag !== undefined) {
        params.lableVisibility = flag;
      }
      TAGTREE.UPDATASHOWTAG(params)
        .then(() => {
          this.$message({
            message: this.$t("webClient.loadBox.message[2]"),
            type: "success",
          });
        })
        .catch(() => {
          this.$message({
            message: this.$t("webClient.loadBox.message[3]"),
            type: "error",
          });
        });
    },
    updateComTreeAfterAddComs() {
      if (this.appType === "3") {
        // 合模
        this.handleMultModle();
      } else {
        let params = {
          appliId: this.appId,
          pageNo: 1,
          pageSize: 99,
          uuid: "vanjian",
        };
        MODELAPI.LISTMEMBERTREE(params).then((res) => {
          this.$refs.setTree.updateKeyChildren(params.uuid, res.data.data);
        });
      }
    },
    async handleMultModle() {
      // 查看有没有合模的自定义构件
      // 合模必然有 uuid vanjian1
      const godNodeList =
        this.$refs.setTree.getNode("vanjian1").parent.childNodes;

      const mult = godNodeList.find((item) => {
        return item.data.name === "自定义构件";
      });

      let multUuid = mult ? mult.data.uuid : null;
      let multBeforeUuid = null;
      // 如果没有自定义构件，保存最后一个节点，用来insertAfter节点
      if (!multUuid) {
        multBeforeUuid = godNodeList[godNodeList.length - 1].data.uuid;
      }

      // 处理合模添加构件后更新列表
      if (multUuid) {
        // 如果有了自定义构件列表
        let params = {
          appliId: this.appId,
          pageNo: 1,
          pageSize: 888,
          uuid: multUuid,
        };
        MODELAPI.LISTMEMBERTREE(params).then((res) => {
            if(res.data.data){
          this.$refs.setTree.updateKeyChildren(multUuid, res.data.data);
        }
        });
      } else {
        // 合模如果没有自定义构件列表
        // 请求根节点
        // insertAfter自定义构件列表
        let params = {
          appliId: this.appId,
          pageNo: 1,
          pageSize: 999,
        };
        MODELAPI.LISTMEMBERTREE(params).then((res) => {
          const list = res.data.data;
          this.$refs.setTree.insertAfter(list[list.length - 1], multBeforeUuid);
        });
      }
    },

    flatten(arr) {
      // 数组扁平化
      return !Array.isArray(arr)
        ? arr
        : [].concat.apply([], arr.map(this.flatten));
    },
    initWebSocket() {
      //初始化weosocket
      /**
       * @Author: zk
       * @Date: 2021-02-24 13:42:13
       * @description: 初始化socket通信
       * 1 单击构件
       * 2.场景部分加载
       * 3 返回关注视角
       * 4 返回主视图信息
       * 5 多选构件
       * 6 启动事件
       * 7 点击空白
       * 8 初始化成功 加载进度
       */
      const wsuri = MODELAPI.CREATESOCKET(this.taskId);
      this.websock = new WebSocket(wsuri);
      this.websock.onmessage = (e) => {      
        // 没有遮罩或者加载进度的时候 发指令去掉toll
        if(this.isFade === false || this.isProgress === false){
          this.sendToIframe(10200,'false',"");
        }
        if (e.data.length > 20) {
          this.isFade = false 
          let realData = JSON.parse(e.data);
          this.socketData = realData;
          if (realData.id === "1") {
            // 不知道构件为啥返回的格式不一样，有dynamicData的需要新增俩个属性放在最前面
            if(realData.data?.dynamicData?.length){
              realData.data.dynamicData = [{name:'构件名称',value:realData.data.name},{name:'构件ID',value:realData.data.revitCode}].concat(realData.data.dynamicData)
            }
            this.memberInfo = realData.rsInfo || realData?.data?.dynamicData || []
            let messageInfo = {
              prex: "ourbimMessage",
              type: 20001,
              data: realData.data,
              message: "",
            };
            this.sentParentIframe(messageInfo);
          } else if (realData.id === "3") {
            let messageInfo = {
              prex: "ourbimMessage",
              type: 20005,
              data: realData,
              message: "",
            };
            this.sentParentIframe(messageInfo);
            if (this.$refs.getFooter) {
              this.$refs.getFooter.resetPointList(realData.object);
            }
          } else if (realData.id === "5") {
            // 多选构件
            this.sentParentIframe({prex: "ourbimMessage",type: 20002,message: ""});
          } else if(realData.id === "6"){
            this.isFade = false
          } 
          else if (realData.id === "7") {
            this.activeLeaf = false;
            let messageInfo = {
              prex: "ourbimMessage",
              type: 20003,
              data: "",
              message: "",
            };
            this.sentParentIframe(messageInfo);
          } else if (realData.id === "8") {
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
            this.hiddenState = 0;
            const progress = Number(
              String(Number(realData.progress) * 100).substring(0, 3)
            );
            if (
              progress >= 0 &&
              progress <= 100 &&
              this.propsProgress.data < 100
            ) {
              this.propsProgress.data = progress;
              // id为8的时候进度条大于0就隐藏第一层遮罩层
              this.isFade = false               
              if (progress === 100) {
                // 定位主视图
                setTimeout(() => {
                  MODELAPI.UPDATEORDER({
                    taskid: this.taskId,
                    action: "cameraPosAll",
                  });
                }, 1000);
                // let params = {
                //   taskId: this.taskId,
                // };
                // COMPONENTLIBRARY.initComponent(params)
                //   .then((res) => {})
                //   .catch((res) => {
                //     this.$message.error(res.data.message);
                //   });
              }
            }
            if (Number(realData.progress) === 1) {
              this.limitZoomSpeed();
              // 加载完成
              this.listenWindowSize();
              let noneTimer = setTimeout(() => {
                this.isProgress = false;
                clearTimeout(noneTimer);
              }, 1000);
            }
          } else if (realData.id === "9") {
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
          } else if (realData.id === "10") {
            this.showUiBar();
            let messageInfo = {
              prex: "ourbimMessage",
              type: 30002,
              data: {
                tagId: realData.tagId,
              },
              message: "",
            };
            this.sentParentIframe(messageInfo);
            // 判断原本标签有没有开启
            if (
              this.listenTodoInfo &&
              this.listenTodoInfo.type === 4 &&
              this.listenTodoInfo.state === 1
            ) {
              this.$refs.tagTree.closePart(true);
            }
          } else if (realData.id === "11") {
            let messageInfo = {
              prex: "ourbimMessage",
              type: 30003,
              data: {
                tagId: realData.tagId,
              },
              message: "",
            };
            this.sentParentIframe(messageInfo);
          } else if (realData.id === "12") {
            // 判断是否是链接模型
            if(realData.isLink === "true"){
              this.modelIsLink = true;
            }else{
              this.modelIsLink = false;
            }
            if (
              Number(this.propsProgress.loadData) >= 0 &&
              Number(this.propsProgress.loadData) <= 100
            ) {
              this.envProgress = Number(realData.progress) * 100;
              this.propsProgress.loadData = Number(
                String(Number(realData.progress) * 100).substring(0, 3)
              );
              // 加载完再发 10200---
              this.sendToIframe(10200,'false',"");
            }
            let messageInfo = {
              prex: "ourbimMessage",
              type: 10002,
              data: {
                progress: Number(realData.progress),
              },
              message: "",
            };
            this.sentParentIframe(messageInfo);
            if (Number(realData.progress) === 1) {
              this.handleState = 13;
              this.updateOrder();
              if (this.uaInfo.match(/MicroMessenger/i) != "micromessenger") {
                this.delMaskTimer(500);
              } else {
                this.delMaskTimer(1000 * 5);
              }
            } // 13cube返回数据
          } else if (realData.id === "14") {
            // 添加构件，但是按了 ESC
            if (this.controllerInfo.uiBar) {
            //   this.updateComTreeAfterAddComs();
              this.controllerInfo.tagUiBar = true;
            //   this.controllerInfo.tagViewCube = true;
              this.$refs.EscDialogItem.changeVisible(false);
            }
          } else if (realData.id === "15") {
            this.selectPark = realData //选择构件
              if(this.$refs.getFooter){
                this.$refs.getFooter.handleComOperateIcon(realData);
              }else{
                return false;
              }
          } else if (realData.id === "16") {
            // 距离上一次操作时长
            this.exitMiniprogram(realData.lastOperationTime);
          } else if (realData.id === "17") {
            realData.uuids.map((v) => {
              this.updateComTreeAfterDeleteByUuid(v);
            });
          } else if (realData.id === "18") {
            // 显示面板
            this.showUiBar();
            // 构件创建成功
            // 更新自定义构件列表
            if (this.appType === "3") {
              // 合模
              this.handleMultModle();
            } else {
              this.updateGodChildNode();
            }
          } else if (realData.id === "19") {
            // 构件新建失败
            // 提示判断添加构建失败
            this.showUiBar();
            // this.$message.error(realData.name);
            this.$message.error('指令下发失败');
          }else if(realData.id === "21"){  // 坐标位置 (增)
            let messageInfo = {
              prex:"ourbimMessage",
              type: 30004,
              data:{
                tagId:realData.tagId,
                data:realData.data,
              },
              message:"",
            };
            this.sentParentIframe(messageInfo);
          }else if(realData.id === "30"){
              if(realData.object){
                this.$message.success('开始下载');
                let url = realData.object;
                this.outPic(url);
              }
          }else if(realData.id === "28"){
              if(realData.rsInfo[0].pakId){
                (realData.rsInfo[0].pakId === 'MAPWEB' || realData.rsInfo[0].pakId === 'gis')  ? this.pakIdMapweb = 'public' : this.pakIdMapweb = '';
              }
              this.comPakId = realData.rsInfo[0].pakId;
              let newArr = [];
              realData.rsInfo.forEach((item,index)=>{
                 newArr = [...newArr,...item.matList];
              });
              // newArr = realData.rsInfo[0].matList;
              this.topImgMaterial = newArr;
              this.activeMater = 0; // 默认选中第一张图片
              this.matEditIndex = 0;
              this.materialAllInfo = this.topImgMaterial[0]; // 构件的第一个材质信息
              this.exchangeData.actorId = realData.rsInfo[0].actorId;
              this.getMaterialInfomation(this.getActiveMatid(this.activeMater)); // 默认先获取第一张图片材质信息
          }else if(realData.id === "29"){
            if(this.topImgMaterial.length !== 0){
              this.topImgMaterial.forEach(item => {
                let flag = realData.rsInfo.some(e=>{
                  if(item.matId === e.matId){
                    item.photoUrl = e.imgPath;
                  }
                  return item.matId === e.matId;
                })
              })
            }
          }else if(realData.id === "33"){
            // 视点动画播放
            this.$refs.viewPhoto.WebSocketData = realData
          }
        }
      };
      this.websock.onopen = (e) => {
        this.isSocket = true;
        this.socketTimer = setInterval(() => {
          this.websock.send("Bang");
        }, 1000 * 60);
      };
      this.websock.onerror = (e) => {};
    },
    limitZoomSpeed() {
      // 限制缩放速度
      if (this.runTimeCode) {
        let params = {
          taskid: this.taskId,
          action: "initWorldParam",
          zoomSpeed: "0.02",
        };
        MODELAPI.UPDATEORDER(params);
      }
    },
    showUiBar() {
      // 显示面板
      this.$refs.EscDialogItem.changeVisible(false);
      if (this.controllerInfo.uiBar) {
        this.controllerInfo.tagUiBar = true;
        this.controllerInfo.tagViewCube = true;
      }
    },
    exitMiniprogram(time) {
      // 微信小程序长时间未操作，返回项目列表页
      if (time > 60) {
        wx.miniProgram.getEnv((res) => {
          if (res.miniprogram) {
            this.isFade = true;
            this.hiddenState = 1;
            this.clearTimePass();
            this.closeWebSocket();
            // wx.miniProgram.redirectTo({ url: "/pages/home/home" });
          }
        });
      }
    },
    delMaskTimer(e) {
      /**
       * @Author: zk
       * @Date: 2021-06-02 18:08:55
       * @description: 去除遮罩时限
       * @param {*} setTimeout
       */
      let loadTimer = setTimeout(() => {
        this.isFade = false;
        clearTimeout(loadTimer);
      }, e);
    },
    getModelUrl() {
      let appId = this.$route.query.appid;

      let params = {
        appliId: appId,
        token: this.appToken,
      };
      const { userType, nickName, code } = this.$route.query;
      if (userType !== undefined && userType !== null) {
        this.userType = userType;
        params.userType = userType;
      }
      if (userType == 0) {
        this.runTimeCode = 1;
        this.isFade = false;
      }
      if (nickName) {
        params.nickName = nickName;
      }
      if (code) {
        params.code = code;
      }
      MODELAPI.GETMODELINFO(params)
        .then((res) => {
          if (res.data.code === 0 && res.data.data) {
            this.webUrl = res.data.data.url;
            this.taskId = res.data.data.taskId;
            this.ourbimInfo = res.data.data;
            this.propsFooter.taskId = res.data.data.taskId;
            // 保存code
            if (res.data.data.code) {
              this.shareCode = res.data.data.code;
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
                taskId: res.data.data.taskId,
              },
              message: "",
            };
            this.sentParentIframe(messageInfo);
            this.initWebSocket();
            if (res.data.data.appliType !== "1") {
              this.controllerInfo.uiBar = true;
              if (this.isUiBar) {
                this.controllerInfo.uiBar = true;
              } else {
                this.controllerInfo.uiBar = false;
                this.controllerInfo.viewCube = false;
                if (this.$refs.tagTree) {
                  this.$refs.tagTree.closePart(false);
                }
              }
            } else {
              this.controllerInfo.uiBar = false;
              this.controllerInfo.viewCube = false;
              if (this.$refs.tagTree) {
                this.$refs.tagTree.closePart(false);
              }
            }
          } else {
            this.$message({
              type: "warning",
              message: res.data.message,
              customClass: "set-index-message",
            });
            // 最大节点已达到上限时
            this.maxNodes = true;
          }
        })
        .catch((err) => {
          this.$message({
            type: "error",
            message: this.$t("webClient.loadBox.message[4]"),
            customClass: "set-index-message",
          });
        });
    },
    isMobile() {
      let flag = navigator.userAgent.match(
        /(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i
      );
      return flag;
    },
    // 设置加载时间超时提醒
    setTimeLoad() {
      this.loadTimer = setTimeout(() => {
        if (this.isFade === true) {
          this.hiddenState = 2;
          this.closeWebSocket();
        }
        clearTimeout(this.loadTimer);
      }, 1000 * 60 * 3);
    },
    // 清除定时器
    clearTimePass() {
      if (this.timerInfo) {
        clearInterval(this.timerInfo);
      }
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
        this.isSocket = false;
        this.websock.close(); //离开路由之后断开websocket连接
        this.websock = null;
        this.webUrl = null;
      }
    },
    getMonitor() {
      /**
       * @Author: zk
       * @Date: 2020-09-27 17:56:43
       * @description: 监听事件
       */
      let realTimer = setTimeout(() => {
        // 鼠标移出
        document.getElementById("show-bim").onmouseout = () => {
          // this.sendToIframe(
          //   10002,
          //   {
          //     button: "left",
          //     x: 500,
          //     y: 500,
          //   },
          //   ""
          // );
          // this.sendToIframe(
          //   10002,
          //   {
          //     button: "right",
          //     x: 500,
          //     y: 500,
          //   },
          //   ""
          // );
        };
        // 移动滚轮
        document.getElementById("show-bim").onmousewheel = () => {
          this.sendToIframe(
            10003,
            {
              x: 500,
              y: 500,
              wheel: -100,
            },
            ""
          );
        };
        // 关闭tool
        this.sendToIframe(10200, "false", "");
        document.addEventListener("keydown", (e) => {
          if (this.isFollow || this.isTag || this.isQrCodeClick) {
            return;
          }
          this.sendToIframe(
            10010,
            {
              key: e.code,
              isRepeat: e.repeat,
            },
            ""
          );
        });
        document.addEventListener("keyup", (e) => {
          if (this.isFollow || this.isTag || this.isQrCodeClick) {
            return;
          }
          this.sendToIframe(
            10011,
            {
              key: e.code,
            },
            ""
          );
        });
        window.clearTimeout(realTimer);
      }, 1000 * 2);
    },
    sentParentIframe(e) {
      /**
       * @Author: zk
       * @Date: 2021-04-27 11:42:25
       * @description:
       * 参考readme
       */
      window.parent.postMessage(e, "*");
    },
    sendToIframe(type, data, message) {
      /**
       * @Author: zk
       * @Date: 2020-09-29 10:18:33
       * @description: postmessage通信
       */
      let realIframe = document.getElementById("show-bim");
      if (realIframe) {
        realIframe.contentWindow.postMessage(
          {
            prex: "pxymessage", // 约定的消息头部
            type: type, // 消息类型
            data: data, // 具体数据
            message: message, // 附加信息
          },
          "*"
        );
      } else {
      }
    },
    // 点击贴图 (材质库)
    photoStore(type){
      this.photoStoreFlag = type
    },
    spreadCircle(arr,str){
      let open = [];
      for(let i=0;i<arr.length;i++){
        open.push(i)
      }
      if(str === '0'){
        this.spread = open;
      }else if(str === '1'){
        this.spreadPerson = open;
      }
    },
    // 点击贴图库 取消 (材质库)
    canclePhotostore(){
      this.photoStoreFlag = '';
    },
    // 点击上传贴图
    postUploadPic(){
      this.addViewUpImgPost = true;
    },
    // 点击 材质编辑弹框 叉号
    closeMaterialBtn(){
      this.activeMater = '';
      this.materialShow = false;
      this.$refs['getFooter'].clickBtnMaterial('close');
      this.topImgMaterial = [];
    },
    // 选中材质编辑中的 构件材质图片
    photoSelect(e,num){
        this.matEditIndex = num; // 选中的材质编辑图片的下标
        this.materialAllInfo = e; 
        if(this.activeMater === num){
          this.activeMater = ''
        }else{
          this.activeMater = num;
          this.getMaterialInfomation(e.matId); // 获取材质信息
        }
        this.canclePhotostore(); // 关闭贴图弹框
    },
    // 获取材质编辑选中的材质的matid
    getActiveMatid(str){
        return this.topImgMaterial[str].matId;
    },
    // 替换材质
    exchangeMater(materialId){
        const allChange = this.materilCheckList.some(res=>{
           return res === '2'
        })
        let params = {
          taskId:this.taskId,
          appId: this.pakidToAppid(this.comPakId),
          matId:materialId,
          isPublic: false,
          isUpdateSameMaterial:allChange,
        }
        let temp = {
          matAndActorInfos:[
            {
              actorId:this.exchangeData.actorId,
              meshIndex:this.materialAllInfo.meshIndex,
              matIndex:this.materialAllInfo.matIndex,
              comType: this.pakIdMapweb,
              pakId:this.comPakId
            }
          ]
        }
        CHAILIAOAPI.CHANGEMATERIALBYINSTRUCTION(params,JSON.stringify(temp.matAndActorInfos)).then((res)=>{
            if(res.data.code===0){
              this.$message.success('材质替换成功');
              this.activeTexTurePerson = ''; // 个人贴图
              this.getMaterialInfomation(materialId,'change'); // 获取刚替换好的材质的信息
            }
        }).catch(()=>{})
    },
    // 获取 个人库 贴图
    getPersonPhoto(str){
      const {userId} = this.$route.query;
      let params = {
          userId:userId
      }
      CHAILIAOAPI.GETMATERIALALLTEXTUREINFO(params).then((res)=>{
          if(res.data.code === 0){
            this.personalPicMaterInfo = res.data.data || [];
            if(str === 'groupOrNot' && this.personalPicMaterInfo.length<=0){
              this.createTextureGroup(); // 新用户没有分组 默认创建一个分组
            }
            if(this.personalTexureGroup.length<=0){
              res.data.data.forEach(item=>{
                let obj = {};
                obj.value = item.groupId;
                obj.label = item.groupName;
                this.personalTexureGroup.push(obj);
              })
            }
          }
      }).catch(()=>{})
    },
    // 创建个人库贴图分组
    createTextureGroup(){
      const {userId} = this.$route.query;
      let params = {
        userId:userId,
        groupName:'我的分组'
      }
      CHAILIAOAPI.CREATEMATERIALTEXTUREGROUP(params).then(res=>{
        if(res.data.code === 1){
          this.getPersonPhoto();
        }
      }).catch(()=>{})
    },
    // 贴图库点击 公共库和个人库时触发
    texureClick(e){
      if(e._props.name === 'second'){
        this.btnUpTexure = true;
        this.getPersonPhoto('groupOrNot');
        this.spreadCircle(this.personalPicMaterInfo,'1'); // 折叠面板
      }else if(e._props.name === 'first'){
        this.btnUpTexure = false;
      }
    },
    // 关闭上传贴图弹框
    closeTexureDialog(e){
      this.addViewUpImgPost = false;
      if(e === 'success'){
        this.getPersonPhoto();
      }
    },
    // 获取贴图数据
    getTextType(type){
        let res = this.matParam.texturesList.filter(e=>{return e.paramName===type})
        return res.length&&res[0]
    },
    // 获取材质信息
    getMaterialInfomation(e,str){
      if(e === 'RESET'){  // 重置过的材质就不要再获取材质信息了
        this.middleMaterInfo.forEach(mat=>{
          mat.nameInfo = [];
        })
        return false;
      }
      let params = {
        matId:e,
        isPublic:str==='public' ? true : false
      }
      CHAILIAOAPI.GETMATERIALBYMATID(params).then(res=>{
        if(res.data.code === 0){
          this.matParam = JSON.parse(res.data.data.matParam);
          // this.materialMatId = res.data.data.matId; // 选中材质编辑的材质的matId
          this.$set(this.middleMaterInfo[0],'nameInfo',this.strToNumber(this.matParam.textureParamsList),'texture')
          this.$set(this.middleMaterInfo[1],'nameInfo',this.strToNumber(this.matParam.baseParamsList))
          this.color1 = this.arrToRgb(this.matParam.colorList.length>0 ? this.matParam.colorList[0].paramValue : []);
          this.spreadCircle(this.middleMaterInfo,'0'); // 折叠面板
        //   if(this.activePub !== ''){
        //     this.addMaterialToUser(res.data.data.matId); // 添加材质到用户库
        //   }
        //   arr.photoUrl：添加这段代码为了解决接口返回的图片显示不对，更新后后端返回错误还不解决由前端修改了，🤦‍
        let arr = this.topImgMaterial[this.matEditIndex]
          if(str === 'public'){
              arr.photoUrl = res.data.data.matImgPath;
          }
          if(str === 'change'){
            let arr = this.topImgMaterial[this.matEditIndex]
            arr.matId = res.data.data.matId;
            // arr.photoUrl = res.data.data.matImgPath;
            this.$set(this.topImgMaterial,this.matEditIndex,arr);
            this.activeMater = this.matEditIndex;
          }
        }else if(res.data.code === 1){
            this.$message.error(res.data.message)
        }
      }).catch(()=>{})
    },
    rgbaToArr(color) {
        var arr = []
        if(color){
            const str = color.slice(5)
            const str1 = str.slice(0, str.length - 1)
            arr = str1.replace(/\s*/g,"").split(',')
        }
        return arr
    },
    // 修改材质参数
    updateMateInfo(flag){
      let params = {
        taskId:this.taskId,
        appId: this.pakidToAppid(this.comPakId),
        baseColorTextureId:'',
        normalMapTextureId:''
      }
      let colorList = JSON.parse(JSON.stringify(this.matParam.colorList)) || []
      if(colorList.length){
        try {
            // 不同材质不同取值
            colorList.forEach(e=>{
                if(e.paramName==='BaseColor' || e.paramName==='Color' || e.paramName==='GlowColor' || e.paramName==='BaseColor1' || e.paramName==='BaseColor2'){
                    e.paramValue = this.rgbaToArr(this.color1)
                    throw new Error()
                }
            })           
        } catch (error) {}
      }
      let temp = [
        {
          matId: this.getActiveMatid(this.activeMater),
          pakId: this.comPakId,
          matParam:
          {
            matId:this.getActiveMatid(this.activeMater),
            ...this.matParam,
            colorList,
          }
        }
      ]
      CHAILIAOAPI.UPDATEMATERIAL(params,JSON.stringify(temp)).then((res)=>{
            if(res.data.code === 0){
              this.$message.success('材质替换成功')
              this.getMaterialInfomation(this.getActiveMatid(this.activeMater)); // 获取材质信息
              if(flag === 'reset'){
                this.$message.success('删除成功')
              }
            }
      }).catch(()=>{})
    },
    // 添加材质到用户材质库
    addMaterialToUser(id,str){
      const {userId} = this.$route.query;
      let params = {
        userId:userId || 'travels',
        matId:id,
        isPublic: str ==='textureChange' ? false : true,
        baseColorTextureId:this.photoStoreFlag==='基础'?this.activeTexTurePerson:'',
        normalMapTextureId:this.photoStoreFlag==='法线'?this.activeTexTurePerson:''
      }
      CHAILIAOAPI.ADDMATERIALFORUSER(params,JSON.stringify(this.matParam)).then((res)=>{
            if(res.data.code === 0){
              this.exchangeMater(res.data.data); // 替换材质
            }
      }).catch(()=>{})
    },
    // 重置材质贴图
    deleteStickPic(type){
        this.photoStoreFlag = type
      this.$confirm('您要删除此贴图, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
            this.matParam.texturesList.forEach(e=>{
                if(e.paramName === type){
                    e.paramValue = ''
                }
            })
          this.$forceUpdate()
          this.updateMateInfo('reset');
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
    },
    // 恢复材质按钮
    resetClick(item,num){
        this.$confirm('您将重置此材质, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.resetMat(item.matId,num);
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
    },
    // 恢复材质
    resetMat(flagId,num){
        let params = {
          taskId:this.taskId,
          appId: this.pakidToAppid(this.comPakId),
          matId:flagId,
          isPublic: false
        }
        let temp = {
          matAndActorInfos:[
            {
              actorId:this.exchangeData.actorId,
              meshIndex:this.materialAllInfo.meshIndex,
              matIndex:this.materialAllInfo.matIndex,
              comType: this.pakIdMapweb,
              pakId:this.comPakId
            }
          ]
        }
        CHAILIAOAPI.RESETMATERIAL(params,JSON.stringify(temp.matAndActorInfos)).then((res)=>{
            if(res.data.code===0){
              this.middleMaterInfo.forEach(mat=>{
                mat.nameInfo = [];
              })
              this.topImgMaterial[num].matId = 'RESET' // 修改被重置的材质的id
              this.$set(this.topImgMaterial[num],'photoUrl',require('@/assets/caizhi.jpg')) // 修改被重置的材质的图片
              this.$message.success('材质重置成功')
            }
        }).catch(()=>{})
    },
    // 点击贴图库的个人库图片
    texturePhotoSelect(e){
        if(this.activeTexTurePerson === e.textureId){
          this.activeTexTurePerson = ''
        }else{
          this.activeTexTurePerson = e.textureId;
          this.addMaterialToUser(this.getActiveMatid(this.activeMater),'textureChange');// 添加贴图到用户
        }
    },
    // 材质编辑 颜色改变
    colorBeChange(e){
      this.updateMateInfo();
    },
    // 数组变rgb
    arrToRgb(arr){
      let str = '';
      if(arr.length>0){
        str = `rgba(${arr[0]},${arr[1]},${arr[2]},${arr[3]})`
      }else{
        str = null
      }
      return str;
    },
    strToNumber(arr,str){
        if(arr.length<0){
          return [];
        }
        let flag = '';
        let newArr = [];
        arr.forEach(item=>{
          if(item.label !== '等比缩放'){
            item.paramValue = Number(item.paramValue); // 字符串转数值
            this.$set(item, 'paramValue1', item.paramValue)
          }else{
            flag = item.paramValue; // 拿到等比缩放的值
          }
        })
        if(str === 'texture'){
          if(flag==='1'){
            newArr = arr.filter(item=>{
                let fake = (item.label === '横向缩放' || item.label === '纵向缩放') ? false : true;
                return fake;
            })
          }else{
            newArr = arr.filter(item=>{
                return item.label !== '缩放';
            })
          }
            // 排序
            let sortArr = []
            let obj = null;
            newArr.forEach((com)=>{
              if(com.label==='横向缩放' || com.label==='纵向缩放' || com.label==='缩放'){
                sortArr.unshift(com);
              }else{
                if(com.label==='等比缩放'){
                  obj = com
                }
                sortArr.push(com);
              }
            })
            let finalArr = sortArr.filter(items=>{
              return items.label !== '等比缩放'
            })
            if(obj){
              finalArr.unshift(obj)
            }
            arr = finalArr
        }
        return arr;
    },
    // 获取pakid
    getLinkModelAppid(){
      let params = {
        appId:this.appId
      }
      CHAILIAOAPI.GETPAKIDBYAPPID(params).then(item=>{
          if(res.data.code === 0){
            this.pakAndAppid = res.data.data;
          }
      }).catch(()=>{})
    },
    // 根据pakId 找到appId
    pakidToAppid(str){
      let componentAppId = '';
      this.pakAndAppid.forEach(item=>{
        if(item.pakId === str){
          componentAppId = item.appId;
        }
      })
      return componentAppId;
    },
    // 材质信息改变
    materialSliderChange(val,prI,i){
        this.middleMaterInfo[prI].nameInfo[i].paramValue = val
        this.updateMateInfo();
    },
    materialInfoChange(){
        this.updateMateInfo();
    },
    // 材质库 相关方法 end --------
    // 关闭天气系统抽屉
    closeSystemDrawer(){
      this.weatherDrawer = false;
      this.closePart(9);
    }
  },
};
</script>

<style lang="less" scoped>
@font-c: center;
@-webkit-keyframes fadeIt {
  0% {
    background-color: #092b4c;
  }

  50% {
    background-color: #2a4663;
  }

  100% {
    background-color: none;
  }
}

@-moz-keyframes fadeIt {
  0% {
    background-color: #092b4c;
  }

  50% {
    background-color: #2a4663;
  }

  100% {
    background-color: none;
  }
}

@-o-keyframes fadeIt {
  0% {
    background-color: #092b4c;
  }

  50% {
    background-color: #2a4663;
  }

  100% {
    background-color: none;
  }
}

@keyframes fadeIt {
  0% {
    background-color: #092b4c;
  }

  50% {
    background-color: #2a4663;
  }

  100% {
    background-color: none;
  }
}

.bim-main {
  height: 100vh;
  width: 100vw;
  overflow: hidden;
  position: relative;
  .time-log {
    pointer-events: none;
    position: absolute;
    z-index: 3000;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;

    .log-main {
      pointer-events: auto;
      width: 360px;
      padding: 30px;
      border-radius: 3px;
      background-color: rgba(0, 0, 0, 0.36);
      text-align: center;
      color: #ffffff;

      .show-logo {
        width: 80px;
        height: 80px;
        margin-bottom: 30px;
      }
    }

    .phone-log-main {
      transform: rotate(90deg);
      -ms-transform: rotate(90deg);
      /* IE 9 */
      -moz-transform: rotate(90deg);
      /* Firefox */
      -webkit-transform: rotate(90deg);
      /* Safari 和 Chrome */
      -o-transform: rotate(90deg);
    }
  }

  .hidden-bim {
    position: absolute;
    z-index: 300;
    top: 0;
    left: 0;
    height: 100vh;
    width: 100vw;
    background-color: #000;
    display: flex;
    align-items: center;
    justify-content: center;

    @-webkit-keyframes bgp {
      0% {
        background-position: 0 0;
      }

      100% {
        background-position: -100% 0;
      }
    }

    .load-text {
      letter-spacing: 5px;
      display: flex;

      .model-loading {
        margin-left: 20px;
        margin-right: 10px;
      }
    }
    @keyframes dot {
      0% {
        left: -30px;
      }

      25% {
        left: -30px;
      }

      50% {
        left: -20px;
      }
      75% {
        left: -10px;
      }
      100% {
        left: 0px;
      }
    }
    @-webkit-keyframes dot {
      0% {
        left: -30px;
      }

      25% {
        left: -30px;
      }

      50% {
        left: -20px;
      }
      75% {
        left: -10px;
      }
      100% {
        left: 0px;
      }
    }
    .wait-main {
      width: 30px;
      position: relative;
      left: 0px;
      background: #000;
      animation: dot 3s infinite step-start;
    }
    .learn-text {
      letter-spacing: 1px;
      // font-size: 30px;
    }
    .hidden-text {
      margin-top: 130px;
      position: absolute;
      font-size: 20px;
      // color: #fff;
      background-image: linear-gradient(
        to right,
        #b9fffc,
        #a2d8f4,
        #9ab3f5,
        #7579e7,
        #9ab3f5,
        #a2d8f4,
        #b9fffc
      );
      -webkit-text-fill-color: transparent;
      -webkit-background-clip: text;
      -webkit-background-size: 200% 100%;
      animation: bgp 3s infinite linear;
    }

    .loading:after {
      overflow: hidden;
      display: inline-block;
      vertical-align: bottom;
      animation: ellipsis 1.5s infinite;
      content: "\2026";
      /* ascii code for the ellipsis character */
    }

    @keyframes ellipsis {
      from {
        width: 2px;
      }

      to {
        width: 25px;
      }
    }

    .show-loading {
      width: 80px;
      height: 80px;
      margin-bottom: 30px;
    }
  }

  .phone-hidden-bim {
    .load-text {
      letter-spacing: 5rpx;
      font-size: 23px;
      display: flex;
      text-align: center;
      letter-spacing: 5rpx;
    }
    @-webkit-keyframes dotPhone {
      0% {
        left: -25px;
      }

      33% {
        left: -20px;
      }

      66% {
        left: -15px;
      }

      100% {
        left: -0px;
      }
    }

    .wait-main {
      width: 30px;
      position: relative;
      left: -30px;
      background: #000;
      animation: dotPhone 3s infinite step-start;
    }
  }
  // 天气抽屉
  .systemDrawer{
    display: none;
    width: 300px;
    height: 100%;
    position: absolute;
    top: 0;
    right: 0;
    ::v-deep .el-drawer__wrapper{
      width: 300px;
      position: absolute !important;
      .drawer__container{
        width: 300px;
      }
      .el-drawer__header{
        color: #fff;
        padding: 16px 16px 0;
        margin-bottom: 11px;
      }
    }
    ::v-deep .el-drawer{
      background: rgba(0, 0, 0, 0.9);
    }
  }
  // 视图层
  .mutual-bim {
    position: absolute;
    z-index: 9;
    top: 0;
    left: 0;
    height: 100vh;
    width: 100vw;
    pointer-events: none;

    .leaf-slide {
      position: absolute;
      width: 10vw;
      bottom: 8vh;
      left: 45vw;
      pointer-events: auto;
    }

    .tree-main {
      pointer-events: auto;
      height: 50vh;
      width: 400px;
      margin: 2vh 0 0 20px;
      border-radius: 10px;
      background-color: rgba(17, 17, 17, 0.88);

      .tree-title {
        display: flex;
        padding: 20px 15px 0 15px;
        color: #ffffff;
        .close-part {
          margin-left: auto;
          cursor: pointer;
        }
      }
      .handle-part {
        padding: 1vh 15px 10px 15px;
      }
      .tree-part {
        height: calc(100% - 110px);
        overflow: hidden;
      }
      .tree-content {
        margin-top: 1vh;
        width: 99.5%;
        height: calc(100% - 1vh);
        overflow-x: hidden;
        overflow-y: auto;
        &::-webkit-scrollbar {
          /*滚动条整体样式*/
          width: 6px;
          /*高宽分别对应横竖滚动条的尺寸*/
          height: 1px;
        }

        &::-webkit-scrollbar-thumb {
          /*滚动条里面小方块*/
          border-radius: 10px;
          background: rgba(0, 0, 0, 0.3);
        }

        &::-webkit-scrollbar-track {
          /*滚动条里面轨道*/
          border-radius: 10px;
          background: rgba(255, 255, 255, 0.295);
        }
        .custom-tree-node {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-right: 8px;
          width: calc(100% - 50px);
          .label-span {
            padding-left: 5px;
            width: calc(100% - 30px);
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
          }
        }
      }
    }

    // 材质编辑开始   （材质库）
    .material-main{
      position: relative;
      pointer-events: auto;
      height: 50vh;
      width: 350px;
      margin: 2vh 0 0 20px;
      border-radius: 10px;
      background-color: rgba(17, 17, 17, 0.88);
      .material-title {
        display: flex;
        padding: 2vh 15px 0 15px;
        color: #ffffff;
        margin-bottom: 1vh;
        .close-materialPart {
          margin-left: auto;
          cursor: pointer;
        }
      }
      .bottomTotal{
          height: 44vh;
          width: 100%;
          overflow: hidden;
          overflow-y: auto;
          border-top: 1px solid #41444D;
          &::-webkit-scrollbar {
          /* 对应纵向滚动条的宽度 */
          width: 10px;
          /* 对应横向滚动条的宽度 */
          height: 10px;
          }

          /* 滚动条上的滚动滑块 */
          &::-webkit-scrollbar-thumb {
              background-color: #515560;
              border-radius: 5px;
          }

          /* 滚动条轨道 */
          &::-webkit-scrollbar-track {
              background-color: #16191f;
              border: 1px solid #41444D;
              border-radius:2px;
          }
        .material-img{
          width: 100%;
          padding-top: 1vh;
          display: flex;
          flex-wrap: wrap;
          border-bottom: 1px solid #41444D;
          .singleImg{
            width: 90px;
            height: 9.3vh;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            align-items: center;
            margin: 0 10px 10px 10px;
            .imgPic{
              position: relative;
              width: 90px;
              height: 9.3vh;
              cursor: pointer;
              img{
                width: 100%;
                height: 100%;
              }
              .resetMaterial{
                position: absolute;
                top:0;
                right: 0;
                width: 20px;
                height: 20px;
                border-radius: 10px;
                background-color: rgba(0,0,0,.4);
                text-align: center;
                display: none;
                .resetIcon{
                  font-size: 18px;
                  color: #fff;
                  line-height: 16px;
                }
              }
              &:hover .resetMaterial{
                display: block;
              }
            }
          }
        }
        .materEditMain{
          padding-top: 1vh;
          .topEditMain{
            width: 100%;
            padding-left: 20px;
            margin-bottom: 2vh;
            // display: flex;
            .yanse{
            //   width: 80px;
              height: 100%;
              display: flex;
            //   justify-content: space-between;
              margin-right: 32px;
              margin-top: 10px;
              .yanseName{
                font-size: 14px;
                color: #ffff;
                margin-right: 10px;
              }
              .yanseBody{
                position: relative;
                width: 40px;
                height: 40px;
                background-color: #ccc;
                // border-radius: 2px;
                ::v-deep .el-color-picker__trigger{
                  padding: 0;
                  border: none;
                  .el-color-picker__icon, .el-icon-close{
                    display: none;
                  }
                  .el-color-picker__color{
                    border: none;
                  }
                }
                .plusIcon, .deleteIcon{
                  font-size: 16px;
                  color: #fff;
                  position: absolute;
                  top: 12px;
                  left: 12px;
                }
                .deleteIcon{
                  top: -8px;
                  left: 30px;
                  width: 20px;
                  height: 20px;
                  text-align: center;
                  line-height: 20px;
                  border-radius: 10px;
                  background-color: rgba(255,255,255,.3);
                  display: none;
                }
              }
              .stickPic{
                &:hover .deleteIcon{
                  display: block;
                }
              }
            }
          }
          .bottomEditMain{
            padding-left: 20px;
            width: 95%;
            // height: 17vh;
            overflow: hidden;
            ::v-deep .el-collapse{
              border: none;
            }
            ::v-deep .el-collapse-item__header{
              background-color: rgba(16,16,16,0.1);
              color: #fff;
              border-bottom: none;
              .el-icon-arrow-right{
                color: #fff;
              }
            }
            ::v-deep .el-collapse-item .el-collapse-item__wrap{
              background-color: rgba(16,16,16,0.1);
              border-bottom: none;
            .el-collapse-item__content{
                  padding-bottom: 0px !important;
                }
            }
            .editInfoList{
              height: 20px;
              width: 95%;
              display: flex;
              justify-content: space-between;
              margin-bottom: 2vh;
              .editInfoListName{
                width: 60px;
                color: #fff;
              }
              .editInfoListNum{
                width: 200px;
                display: flex;
                /deep/ .el-slider{
                    flex: 1;
                    margin-right: 15px;
                }
                ::v-deep .el-slider__runway{
                  top: -13px;
                  height: 20px;
                  background-color: #252525;
                  border: 1px solid #4D4B4B;
                  border-radius: 5px;
                }
                ::v-deep .el-slider__bar{
                  height: 20px;
                  background-color: #646464;
                  z-index: 1111;
                }   
                ::v-deep .el-slider__button-wrapper {
                  top: -8px;
                }     
                ::v-deep .el-slider__button{
                  width: 10px;
                  height: 18px;
                  border: 1px solid #646464;
                  background-color: #646464;
                }
                /deep/ .el-input-number--mini {
                    width: 60px;
                    margin: 0 3px 0 6px;

                    .el-input__inner {
                        padding-right: 14px;
                        padding-left: 5px;
                    }

                    .el-input-number__decrease,
                    .el-input-number__increase {
                        width: 12px;
                        background: none;
                        border: none;
                        color: #646464;
                        right: 4px;
                    }
                }
                /deep/ .el-slider{
                    .el-slider__runway.show-input{
                        margin-right: 75px;
                    }
                }
              }
              .editInfoListPercent{
                width: 26px;
                color: #fff;
              }
            }
          }
        }
        .mater-bottom{
          width: 100%;
          height: 5vh;
          border-top: 1px solid rgba(255,255,255,0.22);
          padding: 1.5vh 0 0 0;
          ::v-deep .el-checkbox-group{
            margin-left: 20px;
          }
        }
      }
      // 贴图
      .uploadImg{
        position: absolute;
        top: 51vh;
        left: 0;
        pointer-events: auto;
        height: 38vh;
        width: 350px;
        border-radius: 10px;
        background-color: rgba(17, 17, 17, 0.88);
        .titleUploadimg{
          box-sizing:border-box;
          display: flex;
          justify-content: space-between;
          width: 100%;
          height: 5vh;
          padding: 1.8vh 1.8vh 0 1.8vh;
          border-bottom: 1px solid rgba(255,255,255,0.2);
          span{
            color: #fff;
            font-size: 16px;
          }
          .postStoreImgClose{
            color: #fff;
            font-size: 16px;
            cursor: pointer;
            margin-top: 3px;
          }
        }
        .middleUploadimg{
          box-sizing: border-box;
          width: 100%;
          height: 34vh;
          ::v-deep .el-tabs .el-tabs__content{
            overflow-y: hidden;
          }
          ::v-deep .el-tabs .el-tabs__content{    // （材质库）
            position: absolute;
            overflow-y: auto;
            height: 74%;
            right: 0px;
            left: 16px;
            &::-webkit-scrollbar {
            /* 对应纵向滚动条的宽度 */
            width: 10px;
            /* 对应横向滚动条的宽度 */
            height: 10px;
            }
    
            /* 滚动条上的滚动滑块 */
            &::-webkit-scrollbar-thumb {
                background-color: #515560;
                border-radius: 5px;
            }
    
            /* 滚动条轨道 */
            &::-webkit-scrollbar-track {
                background-color: #16191f;
                border: 1px solid #41444D;
                border-radius:2px;
            }
          }
          ::v-deep .el-tabs__item{ // （材质库）
            color:#fff;
            border: none !important;
            height: 42px;
            line-height: 42px;
            padding: 0 14px;
          }
          ::v-deep .el-tabs__item.is-active { // （材质库）
              color: #409EFF;
              background-color: rgba(255, 255, 255, 0);
          }
          
          ::v-deep .el-tabs--card>.el-tabs__header .el-tabs__nav{ // （材质库）
            border: none;
          }
          ::v-deep .el-tabs__header{  // （材质库）
            margin: 1px 0 0 0;
          }
          ::v-deep .el-tabs--card>.el-tabs__header{       // （材质库）
            border-bottom: 1px solid rgba(255,255,255,0);
            border-top: 1px solid rgba(255,255,255,0);
          }
          ::v-deep #tab-zero{
            margin-left: 60px;
          }
          // el-collapse的样式修改
          ::v-deep .el-collapse{
            border: none;
          }
          ::v-deep .el-collapse-item__header{
            background-color: rgba(16,16,16,0.1);
            color: #fff;
            border-bottom: none;
            .el-icon-arrow-right{
              color: #fff;
            }
          }
          ::v-deep .el-collapse-item .el-collapse-item__wrap{
            background-color: rgba(16,16,16,0.1);
            border-bottom: none;
           .el-collapse-item__content{
                padding-bottom: 0px !important;
              }
          }
          .flexDiv{
            display: flex;
            flex-wrap: wrap;
            .flexDivInde{
              margin: 0 13px 5px 0;
              .textureTitle{
                width: 100%;
                height: 2.3vh;
                line-height: 2.3vh;
                text-align: center;
                /*1. 先强制一行内显示文本*/
                    white-space: nowrap;
                /*2. 超出的部分隐藏*/
                    overflow: hidden;
                /*3. 文字用省略号替代超出的部分*/
                    text-overflow: ellipsis;
                span{
                  font-size: 14px;
                  color: #fff;
                }
              }
            }
          }
        }
      }
    }
    // 材质编辑结束
    .handle-body {
      pointer-events: auto;
      position: absolute;
      top: 3vh;
      right: 3vh;
    }

    .show-footer {
      position: absolute;
      pointer-events: auto;
      padding: 10px 0;
      width: 100%;
      display: flex;
      align-items: center;
      left: 0;
      bottom: 0;
      color: #ffffff;

      .foot-title {
        width: 100%;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }

      .footer-main {
        margin: 0 auto;
        width: 680px;
        background-color: rgba(0, 0, 0, 0.5);
        display: flex;
        flex-wrap: wrap;
        justify-content: @font-c;
        align-items: @font-c;
        text-align: @font-c;

        .main-content {
          flex: 0 0 16.66%;
          width: 16.66%;
        }
      }
    }
  }

  #show-bim {
    height: 100vh;
    width: 100vw;
    overflow: hidden;
  }

  .phone-bim {
    height: 100vh !important;
    width: 100vw !important;
  }
}
.activeBorder{
   border: 2px solid #9bdbdd;
}
</style>
<style lang="less" >
@import './index.less';
.tree-content {
  .el-tree {
    background: none;
    color: #fff;
    .el-tree-node {
      .el-tree-node__content {
        line-height: 200%;
        background: none;
        &:hover {
          background: none;
        }
      }
      .el-tree-node__expand-icon {
        color: #fff;
      }
      .is-leaf {
        color: transparent;
      }
      // .is-current {
      //   .tree-select {
      //     background: rgba(255, 255, 255, 0.2);
      //   }
      // }
      .el-checkbox {
        position: absolute;
        right: 0;
      }
      .el-checkbox__inner {
        background-color: transparent;
        border-color: transparent;
      }
    }
    .tree-select {
      background: rgba(255, 255, 255, 0.2);
    }
  }
}
.set-index-message {
  z-index: 5000 !important;
}
.bim-progress {
  position: absolute;
  margin-top: 120px;
  width: 260px;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  .el-progress {
    margin: 0 auto;
    width: 100%;
    .el-progress-bar__outer {
      // height: 6px!important;
      background-color: #00a8f054;
    }
    .el-progress-bar__inner {
      line-height: 0;
      background-color: #00aaf0;
    }
  }
  .load-tip {
    width: 100%;
    display: flex;
    margin: 20px 0;
    letter-spacing: 2px;
    color: #00aaf0;
    div {
      margin-left: auto;
    }
  }
}

.dasdasdsad {
  position: fixed;
  top: 0;
  left: 0;
}

.moreList {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
}
.publicList{
  padding-top: 10px;
}
.publicComListItem {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  margin-bottom: 10px;
  cursor: pointer;
  .img {
    margin: 0 2px;
    height: 115px;
    width: 115px;
    img {
      border-radius: 5px;
      width: 100%;
      height: 100%;
    }
  }
  .name {
    width: 100px;
    // display: flex;
    // align-items: center;
    // justify-content: center;
    color: #fff;
    text-align: center;
    white-space: nowrap; //强制在一行显示
    overflow: hidden; //溢出隐藏
    text-overflow: ellipsis; //显示省略号
  }
}

.delect-com-icon {
  padding: 0 10px;
  width: 15px;
  height: 15px;
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
  // color: #fff;
  padding-left: 15px;
  font-size: 14px;
  box-sizing: border-box;

  img {
    width: 20px;
    height: 20px;
  }
}
.lockLock{
  margin-right: 5px;
}

</style>