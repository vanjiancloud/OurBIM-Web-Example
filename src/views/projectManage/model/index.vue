<template>
  <List @change="onChange">
    <template slot="title">
      <div class="boxHeader">
          <div class="boxHeaderTitle">您共有<span>{{total}}</span>个项目</div>
          <div>
            <el-form :inline="true" :model="searchForm" style="display: inline-block;" class="searchListForm">
                <el-form-item label="项目名称：">
                    <el-input v-model="searchForm.appName" placeholder="请输入"></el-input>
                </el-form-item>
                <el-form-item label="项目ID：">
                    <el-input v-model="searchForm.appId" placeholder="请输入"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" class="blueBtn" @click="onSearch">查询</el-button>
                </el-form-item>
            </el-form>
              <!-- <el-button type="primary" class="blueBtn" @click="createProject()">新建BIM项目</el-button> -->
              <!-- 上传GIS数据的关闭弹窗后显示正在上传的个数  -->
              <el-badge :value="uploadingNum" :hidden="!uploadingNum" style="margin:0 16px">
                  <el-button icon="el-icon-upload" class="blueBtn" type="primary" @click="handleCreateProjectDialog" :disabled="!timerFlag">上传BIM模型</el-button>
              </el-badge>
              <el-button type="primary" class="bluePlainBtn1" plain @click="showLinkModelDialog">链接模型</el-button>
          </div>
      </div>
    </template>
    <!-- 模型表格 -->
    <el-table :data="allModelData" v-if="isList">
        <el-table-column prop="appName" label="模型项目名称" show-overflow-tooltip />
        <el-table-column prop="appid" label="模型项目ID" />
        <el-table-column prop="createTime" label="上传日期" />
        <el-table-column prop="fileSize" label="模型大小" />
        <el-table-column label="类型">
          <template slot-scope="scope">
            <span class="can-click" v-if="scope.row.appType === '0' && scope.row.isGis ==='true'" @click="handleCommand('编辑',scope.row)">GIS模型</span>
            <el-tooltip effect="dark" :content="JSON.stringify(scope.row.sonAppMap)" placement="top" v-else-if="scope.row.appType === '3'">
              <div v-if="scope.row.isGis ==='false'">链接模型</div>
              <div class="can-click" v-else @click="handleCommand('编辑',scope.row)">GIS链接模型</div>
            </el-tooltip>
            <span v-else>{{ scope.row | modelType}}</span>
          </template>
        </el-table-column>
        <!-- <el-table-column label="并发节点">
          <template slot-scope="scope">
            {{ scope.row.currentInstance }}/{{ scope.row.maxInstance }}
          </template>
        </el-table-column> -->
        <el-table-column prop="status" label="状态" width="120px">
          <template slot-scope="scope">
            <el-tooltip effect="dark" placement="top" popper-class="trans-tooplip" v-if="scope.row.applidStatus === '3'">
              <div slot="content" class="trans-tooplip-content">
                {{ scope.row.errMsg }}
              </div>
              <!-- 转化失败 -->
              <div :style="{'display':'flex','justify-content':'center','align-items':'center'}">
                <span class="status" :class="{status1:['0','1','6'].includes(scope.row.applidStatus), status2:['3','4','5'].includes(scope.row.applidStatus)}">{{ formatStatus(scope.row.applidStatus) }}</span>
                <div class="err-icon"><img src="@/assets/err.png" alt="" /></div>
              </div>
            </el-tooltip>
            <div v-else class="status" :class="{status1:['0','1','6'].includes(scope.row.applidStatus), status2:['3','4','5'].includes(scope.row.applidStatus)}">{{ formatStatus(scope.row.applidStatus) }}</div>
            <el-progress
              :text-inside="true"
              :percentage="scope.row.progress"
              :show-text="true"
              :stroke-width="13"
              color="#00AAF0"
              v-if="['1','6'].includes(scope.row.applidStatus)"
            >
            </el-progress>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="200">
            <template slot-scope="scope">
                <div class="flexBetween">
                  <el-button type="text" class="blueText" @click="GoApp(scope.row)" :disabled="scope.row.applidStatus !== '2'||scope.row.currVersion!=='V50'">打开模型</el-button>
                  <el-button type="text" class="blueText" @click="teamWorkBtnClick(scope.row)" :disabled="!(scope.row.applidStatus === '2' && scope.row.appType !== '5')||scope.row.currVersion!=='V50'">协同模式</el-button>
                  <!-- <el-button type="text" class="blackText">互动模式</el-button> -->
                    <el-dropdown>
                        <span class="el-dropdown-link">
                            <i class="el-icon-arrow-down el-icon-more"></i>
                        </span>
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item v-if="scope.row.applidStatus === '2'" @click.native="handleCommand('分享',scope.row)">分享</el-dropdown-item>
                            <el-dropdown-item v-if="!['1','5','6'].includes(scope.row.applidStatus)" @click.native="handleCommand('编辑',scope.row)">编辑</el-dropdown-item>
                            <el-dropdown-item v-if="scope.row.applidStatus === '2' && (scope.row.appType === '0' && scope.row.isGis === 'false') && scope.row.fileSize!='0'" @click.native="handleCommand('下载',scope.row)">下载</el-dropdown-item>
                            <el-dropdown-item v-if="scope.row.currVersion!=='V50'" @click.native="handleCommand('重新转换',scope.row)">重新转换</el-dropdown-item>
                            <el-dropdown-item v-if="scope.row.applidStatus !== '5'" @click.native="handleCommand('删除',scope.row)">删除</el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                </div>
            </template>
        </el-table-column>
    </el-table>
    <!-- 盒子 -->
    <div class="listBox" v-if="!isList">
        <div class="listItem" v-for="(item,index) in allModelData" :key="index">
            <el-image :src="item.screenImg" class="defaultImg">
                <div slot="error" class="image-slot">
                    <img :src="require('@/assets/default/list.png')"/>
                </div>
            </el-image>
            <div class="title">{{ item.appName }}</div>
            <div class="flexBetween">
                <div class="type">类型：{{ item | modelType}}</div>
                <div class="status" :class="{status1:['0','1','6'].includes(item.applidStatus), status2:['3','4','5'].includes(item.applidStatus)}">
                  {{ formatStatus(item.applidStatus) }}
                </div>
            </div>
            <div class="flexBetween">
                <div>
                  <el-button size="small" class="blueBtn" @click="GoApp(item)" :disabled="item.applidStatus !== '2'">打开模型</el-button>
                  <el-button size="small" class="bluePlainBtn1" @click="teamWorkBtnClick(item)" :disabled="!(item.applidStatus === '2' && item.appType !== '5')">协同模式</el-button>
                  <!-- <el-button type="text" class="blackText">互动模式</el-button> -->
                </div>
                <el-dropdown>
                    <span class="el-dropdown-link">
                        <i class="el-icon-arrow-down el-icon-more"></i>
                    </span>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item v-if="item.applidStatus === '2'" @click.native="handleCommand('分享',item)">分享</el-dropdown-item>
                        <el-dropdown-item v-if="!['1','5','6'].includes(item.applidStatus)" @click.native="handleCommand('编辑',item)">编辑</el-dropdown-item>
                        <el-dropdown-item v-if="item.applidStatus === '2' && (item.appType === '0' && item.isGis === 'false') && item.fileSize!='0'" @click.native="handleCommand('下载',item)">下载</el-dropdown-item>
                        <el-dropdown-item v-if="item.currVersion!=='V50'" @click.native="handleCommand('重新转换',item)">重新转换</el-dropdown-item>
                        <el-dropdown-item v-if="item.applidStatus !== '5'" @click.native="handleCommand('删除',item)">删除</el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
            </div>
        </div>
    </div>
    <el-empty v-if="!isList&&!allModelData.length" :image="require('@/assets/noData.png')" :image-size="100"></el-empty>
    <Pagination :total="total" :page.sync="pages.pageNo" :limit.sync="pages.pageSize" @pagination="handlePageChange" />


    <!-- 分享dialog框 -->
    <Share ref="Share"></Share>
    <!-- 重新转换 -->
    <DialogsConversion ref="DialogsConversion"/>
    <!-- 链接模型 -->
    <el-dialog
      title="链接模型"
      custom-class="integrate-dialog"
      :visible="linkModelDialog"
      width="705px"
      @close="closeLinkModel"
    >
    <el-form :model="FormIntegrate" class="form-integrate" :rules="rulesIntegrate" ref="FormIntegrate" label-width="120px">
        <div class="flexStart">         
            <el-form-item label-width="0">
                <el-select v-model="FormIntegrate.type">
                    <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="服务支持组件:" prop="gisPlugin" v-if="FormIntegrate.type === 'gis'">
                <el-select v-model="FormIntegrate.gisPlugin" placeholder="请选择" @change="changeGisPlugin">
                    <el-option :value="item.key" :label="item.name" v-for="(item,index) in gisPluginList" :key="index" :disabled="item.key==='arcGIS'"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="GIS坐标系:" v-if="FormIntegrate.type === 'gis'">
                <el-select v-model="FormIntegrate.gisCoordinateType" placeholder="请选择GIS坐标系">
                    <el-option value="WGS-84" label="WGS-84"></el-option>
                    <el-option value="GCJ-02" label="GCJ-02"></el-option>
                    <el-option value="BD-09" label="BD-09"></el-option>
                </el-select>
            </el-form-item>
        </div>
         
        <el-form-item label="项目GIS原点:" required v-if="FormIntegrate.type === 'gis'">
            <el-col :span="7">
                <el-form-item prop="gisLongitude">
                    <el-input v-model="FormIntegrate.gisLongitude" placeholder="经度" v-only-number="{min:-180,max:180,precision:8}"></el-input>
                </el-form-item>
            </el-col>
            <el-col class="GISMark" :span="1">°</el-col>
            <el-col :span="7">
                <el-form-item prop="gisLatitude">
                    <el-input v-model="FormIntegrate.gisLatitude" placeholder="纬度" v-only-number="{min:-90,max:90,precision:8}"></el-input>
                </el-form-item>
            </el-col>
            <el-col class="GISMark" :span="1">°</el-col>
            <el-col :span="7">
                <el-form-item prop="gisAltitude">
                    <el-input v-model="FormIntegrate.gisAltitude" placeholder="海拔高度"></el-input>
                </el-form-item>
            </el-col>
            <el-col class="GISMark" :span="1">m</el-col>
        </el-form-item>
        <el-form-item label="GIS底图:" prop="gisSuperMapInfo" v-if="FormIntegrate.type === 'gis'">
            <el-select v-model="FormIntegrate.gisSuperMapInfo" placeholder="请选择" multiple style="width:100%">
                <el-option :value="item.key" :label="item.name" v-for="(item,index) in mapInfoList" :key="index"></el-option>
            </el-select>
        </el-form-item>
        <Transfer
          class="integrate-transfer"
          filterable
          ref="linkModel"
          :titles="['模型', '模型2']"
          v-model="ActiveLinkModel"
          :data="ListLinkModel"
          :props="{
            key: 'appid',
            label: 'appName',
          }"
          @getData="handleChange"
        >
        </Transfer>
        <Transfer
          v-if="FormIntegrate.type === 'gis'"
          class="integrate-transfer"
          filterable
          :titles="['GIS数据服务', 'GIS数据服务']"
          v-model="ActiveLinkGISModel"
          :data="ListLinkGISModel"
          :isGIS="true"
          :props="{
            key: 'gisId',
            label: 'gisServerName',
          }"
        >
        </Transfer>
          <el-row>
            <el-col :span="12">
              <el-form-item label="链接模型名称" prop="appName">
                <el-input v-model="FormIntegrate.appName"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="项目缩略图" prop="screenImg">
                <SingleUpload v-model="FormIntegrate.screenImg" url="/appli/uploadThumbnail"/>
              </el-form-item>
            </el-col>
          </el-row>
    </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeLinkModel">取 消</el-button>
        <el-button type="primary" @click="SubmitIntegrate">确 定</el-button>
      </span>
    </el-dialog>

    <DialogsDrag ref="DialogsDrag" numType="uploadingNum" accept=".rvt,.ifc,.zip,.rfa,.ipt,.dgn,.dwg,.step,.fbx,.FBX,.obj,.stp,.xyz,.txt,.pts,.las,.nwd"
    @getFile="getFileDrag" @onSuccess="getAllModelList" @beforeUpload="beforeUpload">
        <template v-slot:append>
            <el-form :model="conversionForm" :rules="conversionRules" ref="conversionForm" label-width="0" class="conversionForm">
                <el-form-item prop="modelActorLimitNum">
                    <el-checkbox label="模型体量优化" v-model="conversionForm.modelActor"></el-checkbox>
                    <span v-if="conversionForm.modelActor" class="text">模型构件数阈值</span>
                    <el-input v-if="conversionForm.modelActor" v-model="conversionForm.modelActorLimitNum" placeholder="请输入" style="width:150px;" v-only-number="{min:0}"></el-input>
                </el-form-item>
                <el-form-item prop="singleActorLimitNum">
                    <el-checkbox label="模型材质优化" v-model="conversionForm.singleActor"></el-checkbox>
                    <span v-if="conversionForm.singleActor" class="text">单构件面数阈值</span>
                    <el-input v-if="conversionForm.singleActor" v-model="conversionForm.singleActorLimitNum" placeholder="请输入" style="width:150px;" v-only-number="{min:0}"></el-input>
                </el-form-item>
                <el-form-item prop="platform" label-width="110px" label="解析模型版本">
                    <el-radio-group v-model="conversionForm.platform" disabled>
                        <el-radio label="Windows">服务端版</el-radio>
                        <el-radio label="Android">Android版</el-radio>
                        <el-radio label="IOS">IOS版</el-radio>
                    </el-radio-group>
                </el-form-item>
            </el-form>
        </template>
        <template v-slot:tip>
          <span class="tipRed">* </span>
          文件默认打开初始的三维视图，请将文件在对应视图打开状态下保存，再上传。上传的BIM文件需要与中心文件分离，否则可能无法转换。
        </template>
    </DialogsDrag>
    <!-- 编辑 -->
    <DialogsEdit ref="DialogsEdit" :ListLinkModel="ListLinkModel" :GISModel="ListLinkGISModel"/>
  </List>
</template>

<script>
import { gisPluginList, gisSuperMapList } from "@/views/projectManage/GISList/json"
import { getList as getGISProjectList } from "@/api/projectManage/GISList.js";
import { addCombineApp, getEnterToken, getProjectList, deleteProject } from "@/api/projectManage/model.js";
import qs from "qs";
import Pagination from "@/components/Pagination"
import Share from "./share.vue"
import Transfer from "./transfer/main.vue"
import SingleUpload from "@/components/Upload/singleUpload.vue"
import DialogsConversion from "./dialogsConversion.vue"
import DialogsDrag from "@/components/Upload/DialogsDrag.vue";
import List from "@/components/List/index.vue";
import DialogsEdit from "./dialogsEdit.vue";

export default {
  components: {
    Pagination,
    SingleUpload,
    Transfer,
    Share,
    DialogsConversion,
    DialogsDrag,
    List,
    DialogsEdit
  },
  filters:{
      modelType(e){
          if(e.appType === '0' && e.isGis ==='false'){
            return '普通模型'
          }else if(e.appType === '0' && e.isGis ==='true'){
            return 'GIS模型'
          }else if(e.appType === '1'){
            return '漫游模型'
          }else if(e.appType === '3' && e.isGis ==='false'){
            return '链接模型'
          }else if(e.appType === '3' && e.isGis ==='true'){
            return 'GIS链接模型'
          }else if(e.appType === '4'){
            return '示例模型'
          }else if(e.appType === '5'){
            return '云应用'
          }
          return '其他模型'
      }
  },
  data() {
    var validateModelActorLimitNum = (rule, value, callback) => {
        if (this.conversionForm.modelActor&&!value) {
            callback(new Error('请输入模型构件数阈值'));
        } else {
            callback();
        }
    };
    var validateSingleActorLimitNum = (rule, value, callback) => {
        if (this.conversionForm.singleActor&&!value) {
            callback(new Error('请输入单构件面数阈值'));
        } else {
            callback();
        }
    };
    const validGisSuperMapInfo = (rule, value, callback) => {
        if(value && value.length === 1 && value[0] === 'cta'){
            callback(new Error('天地图地形注记不能单独添加'));
        }else{
            callback();
        }
    };
    return {
        gisPluginList,
      isList: true,
      GISInfo: '',
      options: [
        {
          value: "gis",
          label: "OurGISEngine",
        },
        {
          value: "bim",
          label: "OurBIMEngine",
        },
      ],
      timerFlag: true, //是否开启定时器轮询
      searchForm:{},
      FormIntegrate: {
        appName: null,
        type:'bim',
        gisCoordinateType: 'WGS-84',
        gisPlugin: 'cesium',
        gisSuperMapInfo: []
      },
      rulesIntegrate: {
        appName: [
          { required: true, message: "请输入链接模型名称", trigger: "blur" },
        ],
        gisLongitude: [
            {
                required: true,
                message: '请输入经度(-180°~180°)',
                trigger: 'blur'
            }
        ],
        gisLatitude: [
            {
                required: true,
                message: '请输入纬度(-90°~90°)',
                trigger: 'blur'
            }
        ],
        gisAltitude: [
            {
                required: true,
                message: '请输入海拔高度',
                trigger: 'blur'
            }
        ],
        gisPlugin: { required: true, message: '请选择服务支持组件', trigger: 'blur' },
        gisSuperMapInfo: { required: false, validator: validGisSuperMapInfo, trigger: 'blur' }
      },
      ActiveLinkModel: [],
      ActiveLinkGISModel: [],
      ListLinkModel: [],
      ListLinkGISModel: [],
      linkModelDialog: false,
      allModelData: [], //数据列表
      timer: null, // 模型列表接口请求定时器
      editDialogFormVisible: false,
      total: 0,
      pages: {
        pageNo: 1,
        pageSize: 20
      },
    //   上传模型转换
        conversionForm: {
            modelActor:true,
            singleActor:true,
            platform: 'Windows',
            modelActorLimitNum:'15000',
            singleActorLimitNum:'500'
        },
        conversionRules: {
            modelActorLimitNum: [
                {
                    required: true,
                    validator: validateModelActorLimitNum,
                    trigger: 'blur'
                }
            ],
            singleActorLimitNum: [
                {
                    required: true,
                    validator: validateSingleActorLimitNum,
                    trigger: 'blur'
                }
            ],
            platform: [
                {
                    required: true,
                    message:'请选择解析模型版本',
                    trigger: 'blur'
                }
            ],
        },
        mapInfoList: []
    }
  },
  computed: {
    userId() {
        return this.$store.state.user.userId
    },
    uploadingNum() {
      return this.$store.state.uploadingNum
    }
  },
  created() {
    this.getAllModelList()
    this.setGetModelListTimer()
    this.getModelList()
    this.getGISProject()
    this.changeGisPlugin()
  },
  methods: {
    onSearch(){
        this.pages = this.$options.data().pages
        this.getAllModelList();
    },
    changeGisPlugin() {
        this.FormIntegrate.gisSuperMapInfo = []
        this.mapInfoList = gisSuperMapList.filter(e => { return e.type === this.FormIntegrate.gisPlugin })
    },
    getGISProject() {
        getGISProjectList({ userId: this.userId }).then(res => {
            // 只显示status为2的数据
            this.ListLinkGISModel = res.data?.list && res.data.list.filter(item => item.status === '2') || []
        })
    },
    onChange(e){
        this.isList = e
    },
    // 更多按钮操作
    handleCommand(command,row) {
      let newRow = JSON.parse(JSON.stringify(row))
      switch (command) {
        case "分享":
          this.$refs.Share.show(newRow.appid)
          break;
        case "编辑":
          this.$refs.DialogsEdit.show(newRow)
          break;
        case "下载":
          this.downloadModel(newRow);
          break;
        case "重新转换":
          this.$refs.DialogsConversion.show(newRow)
          break;
        case "删除":
          this.remove(newRow);
          break;
        default:
          break;
      }
    },

    handleChange (data) {
      this.GISInfo = data
    },

    closeLinkModel () {
        this.linkModelDialog = false
        this.ActiveLinkModel = []
        this.FormIntegrate.appName=''
    },

    handleCreateProjectDialog () {
        this.conversionForm = this.$options.data().conversionForm
        this.$refs.DialogsDrag.show('上传模型')
    },

    SubmitIntegrate () {
      if (this.ActiveLinkModel.length === 0) {
        this.$message({
          message: "请选择模型",
          type: "warning"
        })
        return false
      }
      const gisMessageValid = this.$refs.linkModel.checkGIS()
      if (!gisMessageValid) {
        this.$message({
          message: "请填写正确的gis信息",
          type: "warning"
        })
        return
      }
      this.$refs["FormIntegrate"].validate(valid => {
        if (valid) {
            let params = {
                userId: this.userId,
                appName: this.FormIntegrate.appName,
                screenImg: this.FormIntegrate.screenImg,
                bimList: this.ActiveLinkModel.join(','),
                isGis: this.FormIntegrate.type === 'gis',
                gisCoordinateType: this.FormIntegrate.type ==='bim' ? 'WGS-84' : this.FormIntegrate.gisCoordinateType,
            }
            if (this.FormIntegrate.type === 'gis') {
                let gisinfoList = this.GISInfo.map(item => {
                    const { appid, altitude, latitude, longitude }  = item
                    return { appId: appid, altitude, latitude, longitude }
                })
                params = {
                    ...params,
                    ...this.FormIntegrate,
                    gisSuperMapInfo: this.FormIntegrate?.gisSuperMapInfo.join(',') || '',
                    gisInfo: JSON.stringify(gisinfoList),
                    gisList: this.ActiveLinkGISModel.join(',')
                }
            }
            addCombineApp(params).then((res) => {
              this.getAllModelList();
              this.ActiveLinkModel = [];
              this.$refs["FormIntegrate"].resetFields();
              this.linkModelDialog = false
          });
        } else {
          return false;
        }
      });
    },
    teamWorkBtnClick(e) {
      const userInfo = JSON.parse(sessionStorage.getItem("userInfo"));
      this.GoApp(e, {
        userType: 1,
        nickName:
          userInfo.name || userInfo.mobile || userInfo.email || "默认昵称",
      });
    },

    showLinkModelDialog() {
      this.linkModelDialog = true
    },
    // 获取模型列表
    getModelList(){
        getProjectList({
            userid: this.userId,
            isHandle: 1,
            appType: 0
        }).then(res => {
            let resData = res.data.list
            this.ListLinkModel = resData.filter(item => item.appType !== '4')
        })
    },

    // 这里增加定时器轮询是为了获取最新的数据状态
    // 比如：删除模型和上传模型操作比较耗时，需要轮询来获取最新的操作状态
    setGetModelListTimer () {
      this.timer = setInterval(() => {
        if (this.timerFlag) {
            let hasChange = this.allModelData.some(e=>e.applidStatus==='1')
            if(hasChange){
                this.getAllModelList();
            }
        }
      }, 20000);
    },

    // 分页
    handlePageChange (data) {
      this.pages.pageNo = data.pageIndex
      this.pages.pageSize = data.pageSize
      this.getAllModelList()
    },

    // 获取应用数据列表
    getAllModelList() {
      const params = {
        pageNo: this.pages.pageNo,
        pageSize: this.pages.pageSize,
        userid: this.userId,
        ...this.searchForm
      }
      getProjectList(params).then(res => {
        this.total = res.data.total
        this.allModelData = res.data.list
      })
      .catch((err) => {
        this.timerFlag = false
        this.allModelData = []
      })
    },

    // 根据传入的status做适配
    formatStatus(status) {
      const statusObj = {
        0: "正在同步",
        1: "转换中",
        2: "转换完成",
        3: "转换失败",
        4: "文件损坏",
        5: "删除中",
        6: "升级中"
      };
      return statusObj[status]
    },
    // 下载
    downloadModel(row){
      this.$confirm("即将下载此源文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.$message({
            type: "warning",
            message: "开始下载",
          });
          let params = {
            userId: this.userId,
            appId: row.appid,
          };
          let urlDownload =
          this.$config.VUE_APP_REQUEST_URL +
            "/FileStorge/downloadModelFile?" +
            qs.stringify(params)
          window.open(urlDownload)
          return;
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消下载",
          });
        });
    },

    validaGISInputForm () {
      if (!this.$refs.editorGISInfo || this.$refs.editorGISInfo.length === 0) return true
      const dataArr = this.$refs.editorGISInfo
      let validStatus = true
      dataArr.forEach(item => {
        item.validate(valid => {
          if (!valid) {
            validStatus = false
          }
        })
      })
      return validStatus
    },
    // 删除按钮
    remove(e) {
      this.$confirm("此操作将删除该应用, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.del(e);
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    //删除应用
    del(e) {
      deleteProject({
        appliId: e.appid,
        userid: this.userId,
      })
        .then((res) => {
            this.$message.success(res.data.message);
            this.getAllModelList();
        })
    },

    //进入应用
    GoApp(e, teamInfo) {
      let isiPad =
        navigator.userAgent.match(/(iPad)/) ||
        (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
      let isMac = /macintosh|mac os x/i.test(navigator.userAgent);
      getEnterToken({
        appid: e.appid,
      }).then((res) => {
          let query = {
            appid: e.appid,
            locale: this.$i18n.locale,
            appType: e.appType,
            token: res.data.token,
            isGis: e.isGis,  // 用于控制 gis模型  时  渲染环境 图标隐藏
            reserveId: e.reserveId || '', // 有reserveId就是预启动项目 没有就不是
            userId:this.userId
          };
          if (teamInfo) {
            query.userType = teamInfo.userType;
            query.nickName = teamInfo.nickName;
          }
          if (isiPad !== false || isMac !== false) {
            // 移动端
            if (e.appType == "5") {
              window.open(res.data.url);
              return;
            }
            this.$router.push({
              name: "web_client",
              query: query,
            });
          } else {
            // PC端
         
            if (e.appType == "5") {
              window.open(res.data.url, "_blank");
              return;
            }
            const { href } = this.$router.resolve({
              name: "web_client",
              query: query,
            });
            window.open(href, "_blank");
          }
      });
    },
    // 上传模型参数
    getFileDrag(file, callback) {
        callback({
            platform: this.conversionForm.platform,
            modelActorLimitNum: this.conversionForm.modelActorLimitNum,
            singleActorLimitNum: this.conversionForm.singleActorLimitNum,
            fileUpload: file,
            userId: this.userId,
            url: "/appli/addProject",
            modelActor: this.conversionForm.modelActor,
            singleActor: this.conversionForm.singleActor,
        });
    },
    // 上传GIS数据验证
    beforeUpload(callback){
        this.$refs.conversionForm.validate((valid) => {
            if (!valid){
                callback(true)
                return false;
            }
        })
    },
    // 新建项目
    createProject(){
      this.$refs.DialogsDrag.show('新建项目')
    }
  },
  mounted() {},
  watch: {},

  beforeDestroy () {
    // 清除列表接口请求定时器
    clearInterval(this.timer)
    this.timer = null
  },
};
</script>

<style lang="less" scoped>

.status1{
  color: #FF7F28!important;
    &::before{
        background: #FF7F28!important;
    }
}
.status2{
    color: #FF7F7F!important;
    &::before{
        background: #FF7F7F!important;
    }
}

.err-icon {
  margin-top: 7px;
  margin-left: 2px;
}

.can-click {
  color: #409eff;
  cursor: pointer;
}


/deep/.el-progress-bar__innerText{
  vertical-align: baseline;
}

.el-dropdown {
    .el-dropdown-link {
        cursor: pointer;
        margin: 0 10px;
        i {
            font-size: 22px;
            color: #999999;
        }
    }
}
.form-integrate {
  margin-top: 20px;
}
.integrate-transfer {
  margin: 0 0 20px 0;
  /deep/ .el-transfer__buttons {
    padding: 0 10px;
  }
  /deep/ .el-transfer__button {
    display: block;
    margin-left: 0;
    padding: 7px;
    background-color: #ecf5ff;
    border: none;
    color: #606266;
    &:hover {
      background-color: #ecf5ff8f;
      border-color: #ecf5ff8f;
      color: #606266;
    }
  }
}

.conversionForm{
    border-bottom: 1px solid #f5f5f5;
    border-top: 1px solid #f5f5f5;
    padding-top: 20px;
    margin: 20px 0;
    .text {
        padding: 0 30px;
    }
}
</style>
<style lang="less">
.integrate-transfer {
  .el-transfer-panel:nth-of-type(3) {
    width: 300px;
    .el-checkbox__label{
      width: 629px;
    }
  }
  .el-transfer-panel:nth-of-type(1) {
    width: 300px;
  }
}
.integrate-dialog {
  .el-dialog__body {
    padding: 20px !important;
  }
  .el-dialog__footer {
    padding-top: 0;
  }
}

.trans-tooplip-content {
  font-size: 14px;
  width: 100%;
  height: 100%;
  color: #ff3333;
}


</style>
