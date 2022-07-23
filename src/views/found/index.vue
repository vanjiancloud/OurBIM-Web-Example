<template>
  <!-- 应用管理 -->
  <div class="box">
    <!-- 消息提示 -->
    <div class="record">
      <!-- 消息提示 -->
      <div class="left">
        {{ $t("Youhave") }}&nbsp;
        <span style="color: #00aaf0">{{ itemList.length }} </span>&nbsp;
        {{ $t("project") }}
      </div>
      <!-- 按钮 -->
      <div class="right">
        <el-button
          :type="timerFlag ? 'primary' : 'info'"
          @click="handleCreateProjectDialog"
          class="upload-btn"
          :disabled="!timerFlag"
          >上传模型
          <div class="uploadingNum" v-show="uploadingNum">
            {{ uploadingNum }}
          </div>
        </el-button>
        <el-button type="primary" @click="AddIntegrate">链接模型</el-button>
      </div>
    </div>
    <!-- 表格 -->
    <div class="table">
      <el-table :data="itemList" style="width: 100%" class="sheet">
        <el-table-column prop="appName" :label="$t('applyname')">
          <template slot-scope="scope">
            <el-tooltip
              popper-class="app-name-tip"
              placement="top"
              effect="dark"
            >
              <div slot="content">{{ scope.row.appName }}</div>
              <div>
                {{ scope.row.appName }}
              </div>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column prop="appid" :label="$t('applicationid')" width="120">
        </el-table-column>
        <el-table-column :label="$t('uploaddate')" width="110">
          <template slot-scope="scope">
            <div v-text="scope.row.createTime"></div>
            <!-- <div v-text="scope.row.createTime.slice(0, 10)"></div> -->
          </template>
        </el-table-column>

        <el-table-column prop="fileSize" label="模型大小">
          <template slot-scope="scope">
            {{ scope.row.fileSize !== "0" ? scope.row.fileSize : "-" }}
          </template>
        </el-table-column>
        <el-table-column prop="" label="项目类型" width="110">
          <template slot-scope="scope">
            <span v-if="scope.row.appType === '0' && scope.row.isGis ==='false'">普通模型</span>
            <span v-else-if="scope.row.appType === '1'">漫游模型</span>
            <el-tooltip
              effect="dark"
              :content="JSON.stringify(scope.row.sonAppMap)"
              placement="top"
              v-else-if="scope.row.appType === '3'  && scope.row.isGis ==='false'"
            >
              <div>链接模型</div>
            </el-tooltip>

            <!-- <span v-else-if="scope.row.appType === '3'">链接模型</span> -->
            <span v-else-if="scope.row.appType === '4'">示例模型</span>
            <span v-else-if="scope.row.appType === '5'">云应用</span>
            <span v-else-if="scope.row.appType === '0' && scope.row.isGis ==='true'">GIS模型</span>
            <el-tooltip
              effect="dark"
              :content="JSON.stringify(scope.row.sonAppMap)"
              placement="top"
              v-else-if="scope.row.appType === '3' && scope.row.isGis ==='true'"
            >
              <div>GIS链接模型</div>
            </el-tooltip>
            <!-- <span v-else-if="scope.row.appType === '3' && scope.row.isGis ==='true'">GIS链接模型</span> -->
            <span v-else>其他模型</span>
          </template>
        </el-table-column>
        <!-- <el-table-column prop="" label="并发节点">
          <template slot-scope="scope">
            {{ scope.row.currentInstance }}/{{ scope.row.maxInstance }}
          </template>
        </el-table-column> -->
        <el-table-column :label="$t('state')">
          <template slot-scope="scope">
            <!-- 做自定义操作 需要改成template的形式,scope.row代表的是表格数据itemList中的每一项 -->
            <el-tooltip
              effect="dark"
              placement="top"
              popper-class="trans-tooplip"
              v-if="scope.row.applidStatus === '3'"
            >
              <div slot="content" class="trans-tooplip-content">
                {{ scope.row.errMsg }}
              </div>
              <!-- 转化失败 -->
              <div
                style="
                  display: flex;
                  justify-content: center;
                  align-items: center;
                "
              >
                <span>{{ formatStatus(scope.row.applidStatus) }}</span>
                <div class="err-icon"><img src="../manage/err.png" alt="" /></div>
              </div>
            </el-tooltip>
            <div v-else>{{ formatStatus(scope.row.applidStatus) }}</div>

            <el-progress
              :text-inside="true"
              :percentage="scope.row.progress"
              :show-text="true"
              :stroke-width="13"
              :color="customColor"
              v-if="
                scope.row.applidStatus === '1' || scope.row.applidStatus === '6'
                  ? true
                  : false
              "
            >
            </el-progress>
          </template>
        </el-table-column>

        <!-- 操作 -->
        <el-table-column
          :label="$t('operation')"
          width="220"
          align="canter"
          v-if="false"
        >
          <template slot-scope="scope">
            <div class="handle-btn">
              <!-- 升级 -->
              <el-button
                @click="upgrade(scope.row)"
                type="text"
                v-if="
                  scope.row.currVersion !== 'V5' &&
                  scope.row.applidStatus === '2' &&
                  scope.row.appType === '0'
                "
                class="blue"
              >
                升级
              </el-button>

              <!-- 下载 -->
              <!-- <el-button
                @click="downloadFile(scope.row)"
                type="text"
                v-if="
                  scope.row.applidStatus === '2' && scope.row.appType !== '3'
                "
              >
                下载
              </el-button> -->

              <!-- 分享 -->
              <el-button
                @click="share(scope.row), (dialogFormVisibleOne = true)"
                type="text"
                v-if="scope.row.applidStatus === '2'"
                :class="scope.row.applidStatus === '2' ? 'blue' : 'gray'"
                :disabled="scope.row.applidStatus === '2' ? false : true"
              >
                分享
              </el-button>
              <!-- 编辑 -->
              <el-button
                @click="edit(scope.row);GetList()"
                type="text"
                class="btn-one"
                :disabled="scope.row.applidStatus === '4' ? true : false"
                v-if="scope.row.applidStatus === '5' ? false : true"
              >
                {{ $t("edit") }}
              </el-button>
              <!-- 报错 -->
              <!-- <el-button
                @click="reportErr(scope.row), (reportErrDialogVisible = true)"
                type="text"
                class="btn-one"
              >
                报错
              </el-button> -->
              <!-- 删除 -->
              <el-button
                @click="remove(scope.row)"
                type="text"
                v-if="scope.row.applidStatus === '5' ? false : true"
              >
                {{ $t("del") }}
              </el-button>
            </div>
          </template>
        </el-table-column>

        <el-table-column label="操作" width="300">
          <template slot-scope="scope" class="goapp-row">
            <el-button
              @click="GoApp(scope.row)"
              :disabled="scope.row.applidStatus === '2' ? false : true"
              :class="scope.row.applidStatus === '2' ? 'blue-btn' : 'gray-btn'"
            >
              {{ $t("into") }}
            </el-button>
            <el-button
              @click="teamWorkBtnClick(scope.row)"
              :disabled="
                scope.row.applidStatus === '2' && scope.row.appType !== '5'
                  ? false
                  : true
              "
              :class="
                scope.row.applidStatus === '2' && scope.row.appType !== '5'
                  ? 'blue-btn'
                  : 'gray-btn'
              "
            >
              协同模式
            </el-button>
            <!-- 点点点 -->
            <el-dropdown
              @command="handleCommand"
              @visible-change="visibleChange(scope.row)"
              trigger="hover"
              placement="bottom"
            >
              <div class="ellipsis">
                <div class="ellipsis-item"></div>
                <div class="ellipsis-item"></div>
                <div class="ellipsis-item"></div>
              </div>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item
                  command="upgrade"
                  v-if="
                    scope.row.currVersion !== 'V5' &&
                    scope.row.applidStatus === '2' &&
                    scope.row.appType === '0'
                  "
                  >升级</el-dropdown-item
                >
                <el-dropdown-item
                  command="share"
                  v-if="scope.row.applidStatus === '2'"
                  >分享</el-dropdown-item
                >
                <el-dropdown-item
                  command="edit"
                  v-if="scope.row.applidStatus !== '5' || scope.row.applidStatus !== '6'"
                  >编辑</el-dropdown-item
                >
                <el-dropdown-item
                  command="delete"
                  v-if="scope.row.applidStatus !== '5'"
                  >删除</el-dropdown-item
                >
              </el-dropdown-menu>
            </el-dropdown>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 分享dialog框 -->
    <el-dialog
      title="分享项目链接"
      :visible.sync="dialogFormVisibleOne"
      center
      :destroy-on-close="true"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :before-close="handleClose"
    >
      <div class="box-one" v-show="isShow == 1">
        <el-form :model="formShare">
          <el-form-item label="有效期" label-width="110px">
            <el-radio v-model="formShare.days" label="999">永久</el-radio>
            <el-radio v-model="formShare.days" label="30">30天</el-radio>
            <el-radio v-model="formShare.days" label="7">7天</el-radio>
            <el-radio v-model="formShare.days" label="1">1天</el-radio>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisibleOne = false" class="btn-one"
            >取 消</el-button
          >
          <el-button type="primary" @click="confirm()" class="btn-two"
            >确 认</el-button
          >
        </div>
      </div>
      <div class="box-two" v-show="isShow == 2">
        <div class="title">通过QQ、微信等分享给好友吧</div>
        <el-form :model="formShare">
          <el-form-item label="链接：">
            <el-input
              v-model="formShare.webShareUrl"
              autocomplete="off"
              :disabled="true"
              class="input"
            >
            </el-input>
            <el-button
              type="primary"
              class="btn"
              v-clipboard:copy="formShare.webShareUrl"
              v-clipboard:success="onCopyUrl"
              v-clipboard:error="onErrorUrl"
              >复制链接</el-button
            >
          </el-form-item>
          <el-form-item label="二维码：">
            <!-- 通过ref获取dom -->
            <div class="share" ref="foo">
              <img :src="formShare.qrurl" alt="" />
            </div>
            <div class="new">
              将二维码分享给好友，对方微信、<br />
              钉钉等扫一扫即可访问BIM场景
            </div>
            <el-button type="primary" class="botton" @click="copyImg">
              复制二维码
            </el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-dialog>
    <!-- 编辑dialog框 -->
    <el-dialog
      title="编辑项目"
      :visible="editDialogFormVisible"
      center
      :destroy-on-close="true"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      @close="closeEdit"
      custom-class="saveAsDialog"
    >
      <div :class="form.appType == '3' && form.isGis =='true' || form.appType == '3'&&value2 == 'GIS' || form.appType == '0' && value2 == 'GIS' ? '' : 'content' " >
        <el-form :model="form" :rules="rules" ref="form">
          <el-form-item label="项目名称：" label-width="110px" >
            <el-input v-model="form.name" autocomplete="off"></el-input>
          </el-form-item>

          <el-form-item
            label="基础程序路径："
            v-if="form.appType === '3' || form.appType === '0'"
            label-width="110px"
          >
            <el-select v-model="value2" @change="xiala2">
              <el-option
                v-for="item in optionss"
                :key="item.value2"
                :label="item.label"
                :value="item.value2">
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item
            label="主程序路径："
            v-if="form.appType === '5'"
            label-width="110px"
          >
            <el-select v-model="form.startup" placeholder="请选择主程序路径">
              <el-option
                :label="item"
                :value="item"
                v-for="item in selectStartups"
                :key="item"
              ></el-option>
            </el-select>
          </el-form-item>

          <el-form-item
            :label="this.value2==='GIS' ? 'GIS信息:' : '子模型列表:'"
            v-if="form.appType === '3' && form.isGis==='true' ||form.appType === '3' && form.isGis==='false' || form.appType === '0' && this.value2==='GIS'"
            label-width="100px"
            :style="value2 == 'BIM' ? 'width:300px' : ''"
          >
            <el-card class="box-card">
                <div v-for="(itemm,i) in sonAppValue" :key="i" class="text item clearfix">
                  <td class="wordEllipsis">{{itemm}}</td>
                  <td :class="sonAppValue.length <= 2 ? 'td yinc bind' : 'td yinc'" @click="delRow(sonAppKey[i])" >移除</td>
                  <td class="td"><span style="float:right;">m</span></td>
                  <td class="td"><el-input class="elinput" v-model="altitude[i]" type=number placeholder="海拔高度"></el-input></td>
                  <td class="td"><span style="float:right;">°</span></td>
                  <td class="td"><el-input class="elinput wei" @change="jin" v-model="latitude[i]" type=number :max="90" :min="-90" placeholder="纬度"></el-input></td>
                  <td class="td"><span style="float:right;">°</span></td>
                  <td class="td"><el-input class="elinput jing" @change="jin" v-model="longitude[i]" type=number :max="180" :min="-180" placeholder="经度"></el-input></td>
                </div>
                <div v-if="form.appType === '0' && form.isGis === 'true' || form.appType === '0' && value2 === 'GIS'" class="text item">
                  <td class="wordEllipsis" >{{form.name}}</td>
                  <td class="td yinc bind" >移除</td>
                  <td class="td"><span style="float:right;">m</span></td>
                  <td class="td"><el-input class="elinput" v-model="altitude" type=number placeholder="海拔高度"></el-input></td>
                  <td class="td"><span style="float:right;">°</span></td>
                  <td class="td"><el-input class="elinput wei" @change="jin" v-model="latitude" type=number :max="90" :min="-90" placeholder="纬度"></el-input></td>
                  <td class="td"><span style="float:right;">°</span></td>
                  <td class="td"><el-input class="elinput jing" @change="jin" v-model="longitude" type=number :max="180" :min="-180" placeholder="经度"></el-input></td>
                </div>
            </el-card>
          </el-form-item>

          <el-form-item
            label="最大并发数："
            label-width="110px"
            prop="maxInstance"
            
          >
            <el-input v-model="form.maxInstance" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="鼠标操作模式：">
            <el-select v-model="form.doMouse" placeholder="请选择操作模式">
              <el-option label="非锁定模式" value="0"></el-option>
              <el-option label="锁定模式" value="1"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="窗口显示模式：">
            <el-select
              v-model="form.displayWindow"
              placeholder="请选择显示模式"
            >
              <el-option label="完全填充" value="0"></el-option>
              <el-option label="尽量填充" value="1"></el-option>
              <el-option label="原始大小" value="2"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeEdit">取 消</el-button>
        <el-button type="primary" @click="amend()">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 链接模型 -->
    <el-dialog
      title="链接模型"
      custom-class="integrate-dialog"
      :visible="IsIntegrate"
      :width="value == 'GIS' ? '1090px' : '690px'"
      @close="closeLinkModel"
    >
      <div>
        <template>
          <el-select v-model="value" :placeholder="value" @change="xiala">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </template>
      </div>
      <br />
      <div>
        <el-transfer
          class="integrate-transfer"
          filterable
          :titles="['模型', '模型']"
          v-model="ActiveLinkModel"
          :data="ListLinkModel"
          :props="{
            key: 'appid',
            label: 'appName',
          }"
          @change="handleChange"
          :render-content="rendercontent"
        >
          <span slot-scope="{ option }">{{ option.appName }}</span>
        </el-transfer>
        <el-form
          :model="FormIntegrate"
          class="form-integrate"
          :rules="rulesIntegrate"
          ref="FormIntegrate"
          label-width="110px"
        >
          <el-form-item label="链接模型名称" prop="appName">
            <el-input v-model="FormIntegrate.appName"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeLinkModel">取 消</el-button>
        <el-button type="primary" @click="SubmitIntegrate">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 报错dialog -->
    <el-dialog title="提示" :visible.sync="reportErrDialogVisible" width="30%">
      <el-form
        :model="reportErrForm"
        :rules="reportErrRules"
        ref="reportErrFormRef"
        label-width="100px"
      >
        <el-form-item label="标题" prop="title">
          <el-input
            v-model="reportErrForm.title"
            maxlength="20"
            show-word-limit
          ></el-input>
        </el-form-item>
        <el-form-item label="问题类别" prop="type">
          <el-select v-model="reportErrForm.type" placeholder="请选择问题类别">
            <el-option label="区域一" value="shanghai"></el-option>
            <el-option label="区域二" value="beijing"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="问题描述" prop="detail">
          <el-input
            type="textarea"
            :autosize="{ minRows: 9 }"
            v-model="reportErrForm.detail"
            maxlength="200"
            show-word-limit
          ></el-input>
        </el-form-item>
      </el-form>
      <!-- 提交项目报错 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="reportErrDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="reportErrDialogVisible = false"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script type='text/html' style='display:block'>
import {
  getProjectList,
  deleteProject,
  updateProject,
  getWebUrl,
  upgradeModle,
} from "@/api/my.js";
import MODELAPI from "@/api/model_api";
import { Getuserid } from "@/store/index.js";
import axios from "@/utils/request";
import qs from "qs";
import { updateJudgeMsg } from '../../api/my';

export default {
  name: "manage",
  components: {},
  data() {
    return {  

      sonAppObj:{}, // 所有的链接模型 后台返回的都有 sonApp这个对象，里面是 { 模型ID:模型名，...}   sonAppObj就是这个对象里面的东西
      sonAppKey:[],  // 这个存放着 sonAppObj的 key
      sonAppValue:[], // 这里存放着 sonAppObj的 value
      isGis:'',
      type:null,
      chang:0,
      altitude:[],  //海拔高度
      longitude:[], //经度
      latitude:[],  //纬度
      options: [
        {
          value: "GIS",
          label: "OurGISEngine.exe",
        },
        {
          value: "BIM",
          label: "OurBIMEngine.exe",
        },
      ],
      optionss: [
        {
          value2: "GIS",
          label: "OurGISEngine.exe",
        },
        {
          value2: "BIM",
          label: "OurBIMEngine.exe",
        },
      ],
      value: "BIM",
      value2: "",
      timerFlag: true, //是否开启定时器轮询
      selectOprationItem: {}, //表格 点击的当前行的数据
      FormIntegrate: {
        appName: null,
      },
      rulesIntegrate: {
        appName: [
          { required: true, message: "请输入链接模型名称", trigger: "blur" },
        ],
      },
      reportErrDialogVisible: false,
      ActiveLinkModel: [],
      ListLinkModel: [],
      IsIntegrate: false,
      btnCopy: "",
      itemList: [], //数据列表
      appid: "", //应用ID
      appName: "", //应用名称
      fileSize: "", //文件大小
      maxInstance: "", //最大并发数
      currentInstance: "", //当前并发数
      applidStatus: null, //状态
      createTime: "", //上传日期
      timer: null, //定时器
      display: false, //转换进度条默认隐藏
      customColor: "#00AAF0", //进度条颜色
      baseURL: axios.defaults.baseURL,
      appliId: "",
      fileUpload: "",
      fileList: [{ url: "" }], //上传图片列表显示
      editDialogFormVisible: false,
      dialogFormVisibleOne: false,
      isShow: "1",
      //分享应用表单
      formShare: {
        days: "999", //链接有效期
        appid: "",
        qrurl: "", //二维码图片地址
        webShareUrl: "", //链接地址
      },
      //编辑应用表单
      form: {
        appType:"",
        startup:"",
        applid:[],
        appName:[],
        displayName: "",
        gisinfo:[],
        name: "",
        maxInstance: "",
        appid: "",
        screenImg: "",
        appModel: "",
        dialogImageUrl: "",
        applidStatus: null,
        isGis:'',
        modelIds:'',
        displayWindow: [
          {
            value: "0",
            label: "完全填充",
          },
          {
            value: "1",
            label: "尽量填充",
          },
          {
            value: "2",
            label: "原始大小",
          },
        ],
        doMouse: [
          {
            value: "0",
            label: "非锁定模式",
          },
          {
            value: "1",
            label: "锁定模式",
          },
        ],
      },
      // 校验规则
      rules: {
        // 最大并发的校验
        maxInstance: [
          {
            pattern: /^([1-9]\d{0,3})$/,
            message: "请输入1-9999的正整数",
            trigger: "blur",
          },
        ],
      },
      // 报错表单
      reportErrForm: {
        title: "",
        type: "",
        detail: "",
      },
      // 报错表单验证规则
      reportErrRules: {
        title: [
          { required: true, message: "请输入标题!", trigger: "blur" },
          { min: 1, max: 20, message: "字数不能超过20!", trigger: "blur" },
        ],
        type: [
          { required: true, message: "请选择活动区域", trigger: "change" },
        ],
        detail: [
          { required: true, message: "请输入问题描述!", trigger: "blur" },
          { min: 1, max: 200, message: "字数不能超过200!", trigger: "blur" },
        ],
      },
      selectStartups: null,
    };
  },
  computed: {
    uploadingNum() {
      return this.$store.state.uploadingNum;
    },
  },
  created() {
    this.GetList();
    this.setGetdataIn();
  },
  methods: {
    // 关闭 编辑弹框
    closeEdit(){
      this.editDialogFormVisible = false;
      this.longitude = [];
        this.latitude = [];
        this.altitude = [];
    },
    // 关闭链接模型弹框
    closeLinkModel(){
        this.IsIntegrate = false;
        this.ActiveLinkModel=[];
        this.FormIntegrate.appName='';
    },
    delRow(id){
       this.$confirm('确定移除吗', '提示')
        .then(() => {
          let modelStr = '';
          for(let i in this.sonAppObj){
            if(i === id){
              modelStr = this.sonAppObj[i]
              break;
            }
          }
          this.sonAppValue = this.sonAppValue.filter(item=>{
           return item != modelStr;
          })
          let newArr = []; // 用来 存储的是 移除某个模型后  剩下的模型id
          for(let k in this.sonAppObj){
            if(this.sonAppValue.includes(this.sonAppObj[k])){
                newArr.push(k);
            }
          }
          this.sonAppKey = newArr;
          this.form.modelIds=newArr.join(',');         
         })
        .catch(() => {
        })
    },
    reportErr(row) {
      console.log(11, row);
    },
    async downloadFile(row) {
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
            userId: Getuserid(),
            appId: row.appid,
          };
          let urllll =
            process.env.VUE_APP_REQUEST_URL +
            "/FileStorge/downloadModelFile?" +
            qs.stringify(params);
          // window.location.href=urllll
          window.open(urllll);
          return;
          this.startDownLoad(row);
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消下载",
          });
        });
    },
    handleCreateProjectDialog() {
      this.$emit("handleCreateProjectDialog", true);
    },
   SubmitIntegrate() {
      /**
       * @Author: zk
       * @Date: 2021-06-05 11:20:15
       * @description: 确认集成
       */
      var jing = [];
      var wei = [];
      for (let i = 1; i <= this.chang; i++) {
        jing[i-1] = document.querySelector(".el-transfer-panel:nth-of-type(3) .el-transfer-panel__body .el-transfer-panel__list .el-checkbox:nth-of-type("+i+") .appna .zzwinput:nth-of-type(3)").value
        wei[i-1] = document.querySelector(".el-transfer-panel:nth-of-type(3) .el-transfer-panel__body .el-transfer-panel__list .el-checkbox:nth-of-type("+i+") .appna .zzwinput:nth-of-type(2)").value
        if(jing[i-1] > 180){
          document.querySelector(".el-transfer-panel:nth-of-type(3) .el-transfer-panel__body .el-transfer-panel__list .el-checkbox:nth-of-type("+i+") .appna .zzwinput:nth-of-type(3)").value = 180
          this.$message({
            message: "经度范围为-180~180",
            type: "warning",
          });
          return
        }else if(jing[i-1] < -180){
          document.querySelector(".el-transfer-panel:nth-of-type(3) .el-transfer-panel__body .el-transfer-panel__list .el-checkbox:nth-of-type("+i+") .appna .zzwinput:nth-of-type(3)").value = -180
          this.$message({
            message: "经度范围为-180~180",
            type: "warning",
          });
          return
        }
        if(wei[i-1] > 90){
          document.querySelector(".el-transfer-panel:nth-of-type(3) .el-transfer-panel__body .el-transfer-panel__list .el-checkbox:nth-of-type("+i+") .appna .zzwinput:nth-of-type(2)").value = 90
          this.$message({
            message: "纬度范围为-90~90",
            type: "warning",
          });
          return
        }else if(wei[i-1] < -90){
          document.querySelector(".el-transfer-panel:nth-of-type(3) .el-transfer-panel__body .el-transfer-panel__list .el-checkbox:nth-of-type("+i+") .appna .zzwinput:nth-of-type(2)").value = -90
          this.$message({
            message: "纬度范围为-90~90",
            type: "warning",
          });
          return
        }
      }
      if (this.ActiveLinkModel.length === 0) {
        this.$message({
          message: "请选择模型",
          type: "warning",
        });
        return false;
      }
      this.$refs["FormIntegrate"].validate((valid) => {
        if (valid) {
          var gisinfoList = [];
          var userId = Getuserid();
          var appName= this.FormIntegrate.appName;
          if(this.value == "GIS"){
            this.type = "gis";
            this.isGis = true;
             for (var i = 1; i <= this.chang; i++) {
              gisinfoList[i-1] = {
                appId: this.ActiveLinkModel[i-1],
                altitude:document.querySelector(".el-transfer-panel:nth-of-type(3) .el-transfer-panel__body .el-transfer-panel__list .el-checkbox:nth-of-type(" +i +") .appna .zzwinput:nth-of-type(1)").value,
                latitude:document.querySelector(".el-transfer-panel:nth-of-type(3) .el-transfer-panel__body .el-transfer-panel__list .el-checkbox:nth-of-type(" +i +") .appna .zzwinput:nth-of-type(2)").value,
                longitude:document.querySelector(".el-transfer-panel:nth-of-type(3) .el-transfer-panel__body .el-transfer-panel__list .el-checkbox:nth-of-type(" +i +") .appna .zzwinput:nth-of-type(3)").value
              };
           }
          }else{
            this.type = "bim";
             this.isGis = false;
             gisinfoList = '';
          }
          var params = {
            userId,
            appName,
            type : this.type,
            bimList:this.ActiveLinkModel.join(),
            gisInfo:JSON.stringify(gisinfoList),
            isGis:this.isGis
          }
          MODELAPI.ADDINTEGRARE(params).then((res) => {
            if (res.data.code === 0) {
              this.GetList();
              this.ActiveLinkModel = [];
              this.$refs["FormIntegrate"].resetFields();
              this.IsIntegrate = false;
            } else {
              this.$message({
                message: res.data.message,
                type: "warning",
              });
            }
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
    GetIntegrate() {
      getProjectList({
        userid: Getuserid(),
        isHandle: 1,
        appType: 0,
      }).then((res) => {
        if (res.data.code === 0) {
          let resData = res.data.data.filter((item) => {
            if (item.appType !== "4") {
              return item;
            } else {
            }
          });
          this.ListLinkModel = resData;
        } else {
          this.ListLinkModel = [];
        }
      });
    },
    AddIntegrate() {
      /**
       * @Author: zk
       * @Date: 2021-06-05 10:14:30
       * @description: 新增集成
       */
      this.GetIntegrate();
      this.IsIntegrate = true;
      //  链接模型 弹框 一打开就要给 this.isGis赋值
      // this.$nextTick(()=>{
      //   if(this.value === 'GIS'){
      //     this.isGis =true;
      //   }else{
      //     this.isGis = false;
      //   }
      // });

    },
    noneTips(obj, row) {
      row.showTooltip = false;
    },
    showTips(obj, row) {
      /*obj为鼠标移入时的事件对象*/
      /*currentWidth 为文本在页面中所占的宽度，创建标签，加入到页面，获取currentWidth ,最后在移除*/
      let TemporaryTag = document.createElement("span");
      TemporaryTag.innerText = row.appName;
      TemporaryTag.className = "getTextWidth";
      document.querySelector("body").appendChild(TemporaryTag);
      let currentWidth = document.querySelector(".getTextWidth").offsetWidth;
      document.querySelector(".getTextWidth").remove();
      /*cellWidth为表格容器的宽度*/
      const cellWidth = obj.target.offsetWidth;
      /*当文本宽度小于||等于容器宽度两倍时，代表文本显示未超过两行*/
      currentWidth <= 2 * cellWidth
        ? (row.showTooltip = false)
        : (row.showTooltip = true);
    },
    // 定时器每隔一秒获取数据
    setGetdataIn() {
      this.timer = setInterval(() => {
        if (this.timerFlag) {
          this.GetList();
        }
      }, 2500);
    },
    // 获取应用数据列表
    GetList() {
      getProjectList({
        userid: Getuserid(),
      })
        .then((res) => {
          if(this.form.applid.length != "0"){
            for (let i = 0; i < this.sonAppKey.length; i++) {
              for (let j = 0; j < res.data.data.length; j++) {
                if(this.sonAppKey[i] == res.data.data[j].appid){
                  this.form.appName[i] = res.data.data[j].appName
                }
              }
            }
          }
          if (res.data.code == "0") {
            this.itemList = res.data.data;
            this.reverse();
            this.appid = res.data.data.appid;
            this.maxInstance = res.data.data.maxInstance;
            this.currentInstance = res.data.data.currentInstance;
            this.appName = res.data.data.appName;
            this.fileSize = res.data.data.fileSize;
            this.applidStatus = res.data.data.applidStatus;
            this.createTime = res.data.data.createTime;
          } else if (res.data.code < 0) {
            this.timerFlag = false;
            this.$message.warning(res.data.message);
            this.itemList = [];
          } else {
            this.itemList = [];
          }
        })
        .catch((err) => {
          // this.$message.error('请求失败')
        });
    },
    //翻转数组
    reverse() {
      this.itemList.reverse();
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
        6: "升级中",
      };
      return statusObj[status];
    },
    upgrade(row) {
      this.$confirm("此操作将升级该应用, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async (res) => {
          const { data: upRes } = await upgradeModle({
            userId: Getuserid(),
            appId: row.appid,
          });
          if (upRes.code === 0) {
            this.$message.success(upRes.message);
          } else {
            this.$message.error(upRes.message);
          }
        })
        .catch((res) => {});
    },
    // 分享按钮
    share(e) {
      this.formShare.appid = e.appid;
      this.form.isGis = e.isGis;
    },
    // 关闭分享dialog
    handleClose(done) {
      done();
      this.isShow = 1;
      this.formShare.days = "999";
      // this.$confirm("确认关闭？")
      //   .then((_) => {})
      //   .catch((_) => {});
    },
    //确定分享
    confirm() {
      this.$common.openLoading("正在加载中....");
      getWebUrl({
        appid: this.formShare.appid,
        days: this.formShare.days,
        userid: Getuserid(),
      })
        .then((res) => {
          if (res.data.code === 0) {
            this.isShow = 2;
            this.formShare.qrurl = res.data.data.qrurl;
            this.formShare.webShareUrl = res.data.data.webShareUrl + '&weatherBin='+ this.form.isGis;
            this.$message.success(res.data.message);
          } else {
            this.$message.error(res.data.message);
          }
          this.$common.closeLoading();
        })
        .catch((err) => {
          this.$message.error("分享失败,请重新选择");
          this.$common.closeLoading();
          this.dialogFormVisibleOne = false;
        });
    },
    //复制链接成功
    onCopyUrl: function (e) {
      this.$message.success("链接复制成功！");
    },
    //复制链接失败
    onErrorUrl: function (e) {
      this.$message.error("复制失败！");
    },
    // 复制二维码图片
    copyImg(e) {
      //nextTick,当前dom渲染完毕的回调
      this.$nextTick(function () {
        const selection = window.getSelection();
        const range = document.createRange();
        //复制前先清除粘贴板上的缓存
        selection.removeAllRanges();
        range.selectNode(this.$refs.foo); //传入dom
        selection.addRange(range);
        document.execCommand("copy"); //copy是复制
        //复制后再清除缓存
        selection.removeAllRanges();
      });
      this.$message.success("二维码复制成功！");
    },
    visibleChange(e) {
      this.selectOprationItem = e;
    },
    handleCommand(command) {
      const item = this.selectOprationItem;
      switch (command) {
        case "upgrade":
          this.upgrade(item);
          break;
        case "share":
          this.dialogFormVisibleOne = true;
          this.share(item);
          break;
        case "edit":
          this.edit(item);
          break;
        case "delete":
          this.remove(item);
          break;
        default:
          break;
      }
    },
    // 编辑按钮 3334678
    edit(e) {
      // console.log('45',e);
      this.sonAppObj = e.sonAppMap || {};

      this.form.appType = e.appType;
      this.form.name = e.appName;
      this.form.appid = e.appid;
      this.form.displayName = e.displayName;
      this.form.displayWindow = e.displayWindow;
      this.form.doMouse = e.doMouse;
      this.form.maxInstance = e.maxInstance;
      this.form.applidStatus = e.applidStatus;
      this.form.screenImg = e.screenImg;
      this.form.startup = e.startup;
      this.form.isGis = e.isGis;
      this.form.modelIds = e.combineId;
      // this.form.gisinfo = [];

      // 状态 只有是  转换完成  的情况下才可以编辑
      if(this.form.applidStatus !== '2'){
         this.$message.error("当前状态不可编辑");
         return;
      }
      
      if(e.appType == "3" && e.isGis=='true'){
        this.value2 = "GIS"
        this.form.gisinfo = JSON.parse(e.gisInfo);
        for (let i = 0; i < this.form.gisinfo.length; i++) {
          this.form.applid[i] = this.form.gisinfo[i]
          this.longitude[i] = this.form.gisinfo[i].longitude
          this.latitude[i] = this.form.gisinfo[i].latitude
          this.altitude[i] = this.form.gisinfo[i].altitude
        }
      }else if(e.appType == "0" && e.isGis=='true'){
          this.value2 = "GIS"
          this.form.gisinfo = JSON.parse(e.gisInfo);
           this.longitude = this.form.gisinfo.longitude
          this.latitude = this.form.gisinfo.latitude
          this.altitude = this.form.gisinfo.altitude
      }else{
        this.value2 = "BIM"
        this.form.gisinfo = JSON.parse(e.gisInfo);
        this.longitude = [];
        this.latitude = [];
        this.altitude = [];
      }
      // ---555
      if(this.form.appType === '3' && this.form.isGis==='false'){
        this.$nextTick(() => {
          this.xiala2();
        })
      
      }
      
      if (e.startups) {
        this.selectStartups = e.startups.split(",");
      }
      for (let index = 0; index < this.fileList.length; index++) {

        this.fileList[index].url = e.screenImg;
      }
      this.editDialogFormVisible = true;
      
      // console.log('565',this.form);
    },
    //确定修改
    amend() {
      
      // 点击确认修改时 先给 this.form.isGis赋值。
      if(this.value2 === "BIM"){
        this.form.isGis = false;
      }else{
        this.form.isGis = true;
      }

      let param = this.form;
      // 1 验证必填项
      const verify = {
        name: "项目名称",
        maxInstance: "最大并发数",
      };
      for (const k in verify) {
        const val = Array.isArray(param[k]) ? param[k][0] : param[k];
        if (!this.$common.noNull(val)) {
          this.$common.message(verify[k] + " 不能为空", "warning"); // 提示信息
          return;
        }
      }
     
      // 验证 gis信息 不能为空555
      if(this.value2 === 'GIS'){
         let onBlackNum = 0;
         let onBlackNumber = 0;
         let noBlack = this.sonAppValue.length == 0 ? 1 : this.sonAppValue.length;
         for(var i = 1; i <= noBlack; i++){
           for(let k = 4; k <= 8; k+=2){
             let inputValue = document.querySelector('.saveAsDialog .el-dialog__body .el-form .el-form-item:nth-of-type(3) .text:nth-of-type('+i+') .td:nth-of-type('+k+') .el-input__inner');
             inputValue.value ==='' ? onBlackNum = 1 : onBlackNumber = 2;
           }
         }
          if(onBlackNum === 1){
             this.$message.error('缺少必要参数');
            // 这里不太清除，为什么  后台返回的 isGis是 字符串型的，但是这里会变成 布尔型，所以要把他变成字符串型，才可以让 gis信息 显示出来
             this.form.isGis = 'true';
             return;
           }
      }
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.$common.openLoading("正在加载中....");
          // var gisinfoLis = this.form.gisinfo.length === 0 || this.form.appType === '0' ? {} : [];
          var gisinfoLis = this.form.appType === '3' ? [] : {};
            
         if( this.value2 === 'GIS'){
           
            // if(this.form.gisinfo.length === 0 || this.form.appType === '0'){
            if(this.form.appType === '0'){
              gisinfoLis = {
                longitude: document.querySelector(".el-form-item:nth-of-type(3) .el-form-item__content .el-card .el-card__body .text  .jing .el-input__inner").value,
                latitude: document.querySelector(".el-form-item:nth-of-type(3) .el-form-item__content .el-card .el-card__body .text  .wei .el-input__inner").value,
                altitude: document.querySelector(".el-form-item:nth-of-type(3) .el-form-item__content .el-card .el-card__body .text .elinput .el-input__inner").value
              }
            }else{
             for (let i = 1; i <= this.sonAppKey.length; i++) {
             gisinfoLis[i-1] = {
              appId:this.sonAppKey[i-1],
              longitude:document.querySelector(".el-form-item:nth-of-type(3) .el-form-item__content .el-card .el-card__body .text:nth-of-type("+i+") .td:nth-of-type(8) .jing .el-input__inner").value,
              latitude:document.querySelector(".el-form-item:nth-of-type(3) .el-form-item__content .el-card .el-card__body .text:nth-of-type("+i+") .td:nth-of-type(6) .wei .el-input__inner").value,
              altitude:document.querySelector(".el-form-item:nth-of-type(3) .el-form-item__content .el-card .el-card__body .text:nth-of-type("+i+") .td:nth-of-type(4) .elinput .el-input__inner").value
            }
           }
          }
         }
          var gisinfoList = JSON.stringify(gisinfoLis)
          updateProject({
            appid: this.form.appid,
            appName: this.form.name,
            doMouse: this.form.doMouse,
            displayWindow: this.form.displayWindow,
            appType:this.form.appType,
            screenImg: this.form.screenImg,
            maxInstance: this.form.maxInstance,
            startup: this.form.startup,
            gisInfo:gisinfoList,
            isGis:this.form.isGis,
            combineId:this.form.modelIds
          })
            .then((res) => {
              if (res.data.code === 0) {
                this.$message.success(res.data.message);
                this.$common.closeLoading();
                this.GetList();
                this.editDialogFormVisible = false;
              } else if (res.data.code === 1) {
                this.$message.error("修改失败，" + res.data.message);
                this.$common.closeLoading();
                // this.editDialogFormVisible = false;
              }
            })
            .catch((err) => {
              this.$message.error("修改信息失败,请重新修改");
              this.$common.closeLoading();
            });
        }
      });
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
        userid: Getuserid(),
      })
        .then((res) => {
          if (res.data.code === 0) {
            this.$message.success(res.data.message);
            this.GetList();
          } else if (res.data.code === 1) {
            this.$message.warning(res.data.message);
          }
        })
        .catch((err) => {
          this.$message.error("删除失败");
        });
    },

    //进入应用
    GoApp(e, teamInfo) {
      let isiPad =
        navigator.userAgent.match(/(iPad)/) ||
        (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
      let isMac = /macintosh|mac os x/i.test(navigator.userAgent);
      MODELAPI.GETBIMTOKEN({
        appid: e.appid,
      }).then((res) => {
        if (res.data.code === 0) {
          let query = {
            appid: e.appid,
            locale: this.$i18n.locale,
            appType: e.appType,
            token: res.data.data.token,
            weatherBin:e.isGis  // 用于控制 gis模型  时  渲染环境 图标隐藏
          };
          if (teamInfo) {
            query.userType = teamInfo.userType;
            query.nickName = teamInfo.nickName;
          }
          if (isiPad !== false || isMac !== false) {
            // 移动端
            if (e.appType == "5") {
              window.open(res.data.data.url);
              return;
            }
            this.$router.push({
              name: "web_client",
              query: query,
            });
          } else {
            // PC端
         
            if (e.appType == "5") {
              window.open(res.data.data.url, "_blank");
              return;
            }
            const { href } = this.$router.resolve({
              name: "web_client",
              query: query,
            });
            window.open(href, "_blank");
          }
        } else {
          this.$message({
            type: "error",
            message: err.data.message,
          });
        }
      });
    },
    // 上传封面图
    upLoadImg(response, file, fileList) {
      this.form.screenImg = response.data;
    },
    // 上传模型
    upLoadModel(response, file, fileList) {
      this.$message.success("模型上传成功");
      this.form.appModel = response.data;
      this.disabl = false;
    },
    // 上传封面图失败
    errorImg(err, file, fileList) {},
    // 删除图片
    handleRemove(file) {
      this.$confirm("此操作将删除该图片, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.form.screenImg = "";
          // 删除文件
          this.$refs.upload.clearFiles();
          this.$message({
            type: "success",
            message: "删除成功",
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },

    // 限制上传封面次数
    handleExceed() {
      this.$message.warning(`亲，只能上传一张图片哦！`);
    },
    // 限制上传封面格式
    beforeUpload(file) {
      var testmsg = file.name.substring(file.name.lastIndexOf(".") + 1);
      const one = testmsg === "jpg";
      const two = testmsg === "jpeg";
      const three = testmsg === "png";
      if (!one && !two && !three) {
        this.$message.error("上传封面只能是.jpg .jpeg .png格式!");
      }
      return one || two || three;
    },
    // 限制上传模型次数
    exceed() {
      this.$message.warning(`您只能上传一个模型`);
    },
    // 限制上传模型格式
    beforeModelUpload(file) {
      var testmsg = file.name.substring(file.name.lastIndexOf(".") + 1);
      // const extension = testmsg === "rvt";
      // if (!extension) {
      //   this.$message.error("上传模型只能是.rvt格式!");
      // }
      // return extension;
    },
    xiala(){
       if(this.value == "BIM"){
        //  this.isGis = false;
         document.querySelector(".el-transfer-panel:nth-of-type(3)").style.width = "300px";
         if(this.ActiveLinkModel.length!=0){
            for (var i = 1; i <= this.chang; i++) {
           for (let j = 1; j <= 3; j++) {
             if(
               document.querySelector(".el-transfer-panel:nth-of-type(3) .el-transfer-panel__body .el-transfer-panel__list .el-checkbox:nth-of-type(" +i +") .appna .zspan:nth-of-type(" +j +")").style.display!="none"
             ){
               document.querySelector(".el-transfer-panel:nth-of-type(3) .el-transfer-panel__body .el-transfer-panel__list .el-checkbox:nth-of-type(" +i +") .appna .zspan:nth-of-type(" +j +")").style.display="none";
               document.querySelector(".el-transfer-panel:nth-of-type(3) .el-transfer-panel__body .el-transfer-panel__list .el-checkbox:nth-of-type(" +i +") .appna .zinput:nth-of-type(" +j +")").style.display="none";
             }
           }
          }
         }
       }else if(this.value == "GIS"){
        //  this.isGis = true;
         document.querySelector(".el-transfer-panel:nth-of-type(3)").style.width = "700px";
         if(this.ActiveLinkModel.length!=0){
            for (var i = 1; i <= this.chang; i++) {
             for (let j = 1; j <= 3; j++) {
             if(
               document.querySelector(".el-transfer-panel:nth-of-type(3) .el-transfer-panel__body .el-transfer-panel__list .el-checkbox:nth-of-type(" +i +") .appna .zspan:nth-of-type(" +j +")").style.display=="none"
             ){
              document.querySelector(".el-transfer-panel:nth-of-type(3) .el-transfer-panel__body .el-transfer-panel__list .el-checkbox:nth-of-type(" +i +") .appna .zspan:nth-of-type(" +j +")").style.display="block";
               document.querySelector(".el-transfer-panel:nth-of-type(3) .el-transfer-panel__body .el-transfer-panel__list .el-checkbox:nth-of-type(" +i +") .appna .zinput:nth-of-type(" +j +")").style.display="block";
              
             }
           }
          }
         }
       }
    },
    xiala2(){
       if(this.value2 == "BIM"){
         console.log("bin");

         for (var i = 1; i <= this.sonAppKey.length; i++) {
           for (let j = 3; j <= 8; j++) {
             if(
               document.querySelector(".el-form-item:nth-of-type(3) .el-form-item__content .el-card .el-card__body .text:nth-of-type("+i+") .td:nth-of-type("+j+")").style.display!="none"
             ){
                document.querySelector(".el-form-item:nth-of-type(3) .el-form-item__content .el-card .el-card__body .text:nth-of-type("+i+") .td:nth-of-type("+j+")").style.display="none"
           }
           }
         }
       }else{
         console.log("gei");  
            for (var i = 1; i <= this.sonAppKey.length; i++) {
              for (let j = 3; j <= 8; j++) {
               if(
                 document.querySelector(".el-form-item:nth-of-type(3) .el-form-item__content .el-card .el-card__body .text:nth-of-type("+i+") .td:nth-of-type("+j+")").style.display!=""
                ){
                document.querySelector(".el-form-item:nth-of-type(3) .el-form-item__content .el-card .el-card__body .text:nth-of-type("+i+") .td:nth-of-type("+j+")").style.display=""
             }
             }
            }
            
          }
       },
    rendercontent(h,option){
      return <span label="option.appName" class="appna"><em class="optionName">{option.appName}</em>
        <span class="zspan" style="display:none;float:right;">m</span>
        <input class="zzwinput zinput gao" type="number" style="display:none;float:right;" placeholder="海拔高度"></input>
        <span class="zspan" style="display:none;float:right;">°</span> 
        <input  type="number" class="zzwinput zinput wei" style="display:none;float:right;" placeholder="纬度"></input>
        <span class="zspan" style="display:none;float:right;">°</span> 
        <input  type="number" class="zzwinput zinput jing" style="display:none;float:right;" placeholder="经度"></input>
        </span>
    },
    handleChange(value, direction, movedKeys) {
      if(this.value == "BIM"){
         var goLang = value.length;
         this.chang =goLang;
         // 为了解决 链接模型时，右侧的选框使用搜索后 不能输入 gis信息的问题
         let gisBind = document.querySelector(".el-transfer .el-transfer-panel:nth-of-type(3) .el-transfer-panel__body .el-input__inner")
          gisBind.addEventListener('input',function(){
           if(gisBind.value===''){
              for (var i = 1; i <= goLang; i++) {
               for (let j = 1; j <= 3; j++) {
                if(
                  document.querySelector(".el-transfer-panel:nth-of-type(3) .el-transfer-panel__body .el-transfer-panel__list .el-checkbox:nth-of-type("+i+") .appna .zspan:nth-of-type("+j+")").style.display=="none"
                ){
                  document.querySelector(".el-transfer-panel:nth-of-type(3) .el-transfer-panel__body .el-transfer-panel__list .el-checkbox:nth-of-type("+i+") .appna .zspan:nth-of-type("+j+")").style.display="block",
                  document.querySelector(".el-transfer-panel:nth-of-type(3) .el-transfer-panel__body .el-transfer-panel__list .el-checkbox:nth-of-type("+i+") .appna .zinput:nth-of-type("+j+")").style.display="block";
                }
               }
              }
            }
        });
        let gisClear = document.querySelector(".el-transfer-panel:nth-of-type(3) .el-transfer-panel__body .el-icon-search" )
          gisClear.addEventListener('click',function(){
          if(gisBind.value===''){
              for (var i = 1; i <= goLang; i++) {
           for (let j = 1; j <= 3; j++) {
             if(
               document.querySelector(".el-transfer-panel:nth-of-type(3) .el-transfer-panel__body .el-transfer-panel__list .el-checkbox:nth-of-type("+i+") .appna .zspan:nth-of-type("+j+")").style.display=="none"
             ){
               document.querySelector(".el-transfer-panel:nth-of-type(3) .el-transfer-panel__body .el-transfer-panel__list .el-checkbox:nth-of-type("+i+") .appna .zspan:nth-of-type("+j+")").style.display="block",
               document.querySelector(".el-transfer-panel:nth-of-type(3) .el-transfer-panel__body .el-transfer-panel__list .el-checkbox:nth-of-type("+i+") .appna .zinput:nth-of-type("+j+")").style.display="block";
             }
           }
          }
         }
        });
      }
      if (direction == "right" && this.value == "GIS") {
        var leng = value.length;
        this.chang = leng;
        // 为了解决 链接模型时，右侧的选框使用搜索后 不能输入 gis信息的问题
        let gisBind = document.querySelector(".el-transfer .el-transfer-panel:nth-of-type(3) .el-transfer-panel__body .el-input__inner")
         gisBind.addEventListener('input',function(){
           if(gisBind.value===''){
            for (var i = 1; i <= leng; i++) {
            for (let j = 1; j <= 3; j++) {
              if(
                document.querySelector(".el-transfer-panel:nth-of-type(3) .el-transfer-panel__body .el-transfer-panel__list .el-checkbox:nth-of-type("+i+") .appna .zspan:nth-of-type("+j+")").style.display=="none"
              ){
                document.querySelector(".el-transfer-panel:nth-of-type(3) .el-transfer-panel__body .el-transfer-panel__list .el-checkbox:nth-of-type("+i+") .appna .zspan:nth-of-type("+j+")").style.display="block",
                document.querySelector(".el-transfer-panel:nth-of-type(3) .el-transfer-panel__body .el-transfer-panel__list .el-checkbox:nth-of-type("+i+") .appna .zinput:nth-of-type("+j+")").style.display="block";
              }
            }
          }
        }
        });
        let gisClear = document.querySelector(".el-transfer-panel:nth-of-type(3) .el-transfer-panel__body .el-icon-search" )
          gisClear.addEventListener('click',function(){
         if(gisBind.value===''){
              for (var i = 1; i <= leng; i++) {
                for (let j = 1; j <= 3; j++) {
                  if(
                    document.querySelector(".el-transfer-panel:nth-of-type(3) .el-transfer-panel__body .el-transfer-panel__list .el-checkbox:nth-of-type("+i+") .appna .zspan:nth-of-type("+j+")").style.display=="none"
                  ){
                    document.querySelector(".el-transfer-panel:nth-of-type(3) .el-transfer-panel__body .el-transfer-panel__list .el-checkbox:nth-of-type("+i+") .appna .zspan:nth-of-type("+j+")").style.display="block",
                    document.querySelector(".el-transfer-panel:nth-of-type(3) .el-transfer-panel__body .el-transfer-panel__list .el-checkbox:nth-of-type("+i+") .appna .zinput:nth-of-type("+j+")").style.display="block";
                  }
                }
            }
           }
        });
        this.$nextTick(() => {
         for (var i = 1; i <= leng; i++) {
           for (let j = 1; j <= 3; j++) {
             if(
               document.querySelector(".el-transfer-panel:nth-of-type(3) .el-transfer-panel__body .el-transfer-panel__list .el-checkbox:nth-of-type("+i+") .appna .zspan:nth-of-type("+j+")").style.display=="none"
             ){
               document.querySelector(".el-transfer-panel:nth-of-type(3) .el-transfer-panel__body .el-transfer-panel__list .el-checkbox:nth-of-type("+i+") .appna .zspan:nth-of-type("+j+")").style.display="block",
               document.querySelector(".el-transfer-panel:nth-of-type(3) .el-transfer-panel__body .el-transfer-panel__list .el-checkbox:nth-of-type("+i+") .appna .zinput:nth-of-type("+j+")").style.display="block";
             }
           }
         }
        });
      }
    },
    
    jin(){
      let gisLength = this.sonAppKey.length == 0 ? 1 : this.sonAppKey.length;
      for (let i = 1; i <= gisLength ; i++) {
        if(
          document.querySelector(
            ".el-form-item:nth-of-type(3) .el-form-item__content .el-card .el-card__body .text:nth-of-type("+i+") .td:nth-of-type(8) .jing .el-input__inner"
            ).value > 180
          ){
        document.querySelector(
          ".el-form-item:nth-of-type(3) .el-form-item__content .el-card .el-card__body .text:nth-of-type("+i+") .td:nth-of-type(8) .jing .el-input__inner"
          ).value = '';
          this.$message.warning('经度取值范围为正负180度')
      }else if(
        document.querySelector(
            ".el-form-item:nth-of-type(3) .el-form-item__content .el-card .el-card__body .text:nth-of-type("+i+") .td:nth-of-type(8) .jing .el-input__inner"
            ).value < -180
            ){
          document.querySelector(
          ".el-form-item:nth-of-type(3) .el-form-item__content .el-card .el-card__body .text:nth-of-type("+i+") .td:nth-of-type(8) .jing .el-input__inner"
          ).value = '';
          this.$message.warning('经度取值范围为正负180度')
      }
      if(document.querySelector(
            ".el-form-item:nth-of-type(3) .el-form-item__content .el-card .el-card__body .text:nth-of-type("+i+") .td:nth-of-type(6) .wei .el-input__inner"
            ).value > 90){
        document.querySelector(
          ".el-form-item:nth-of-type(3) .el-form-item__content .el-card .el-card__body .text:nth-of-type("+i+") .td:nth-of-type(6) .wei .el-input__inner"
          ).value = '';
          this.$message.warning('纬度取值范围为正负90度');
      }else if(document.querySelector(
            ".el-form-item:nth-of-type(3) .el-form-item__content .el-card .el-card__body .text:nth-of-type("+i+") .td:nth-of-type(6) .wei .el-input__inner"
            ).value < -90){
        document.querySelector(
          ".el-form-item:nth-of-type(3) .el-form-item__content .el-card .el-card__body .text:nth-of-type("+i+") .td:nth-of-type(6) .wei .el-input__inner"
          ).value = '';
            this.$message.warning('纬度取值范围为正负90度');
      }
      }
    }
  },
  mounted() {
    //禁用返回键
    if (window.history && window.history.pushState) {
      history.pushState(null, null, document.URL);
      window.addEventListener(
        "popstate",
        function () {
          history.pushState(null, null, document.URL);
        },
        false
      );
    }
  },
  watch: {
    $route(to, from) {
      this.GetList();
      this.$router.go(0);
    },
    // 监听 后台返回的sonApp
    sonAppObj:{
       handler(newValue, oldValue) {
        this.sonAppKey = Object.keys(newValue);
        this.sonAppValue = Object.values(newValue);
      },
      deep:true,
      immediate: true,
     }
    },
  // ===== 页面实例销毁 =====
  beforeDestroy() {
    // 清除定时器
    clearInterval(this.timer);
  },
};
</script>

<style lang="less" scoped>
.handle-btn {
  text-align: center;
}
.box {
  overflow: hidden;
  width: 96%;
  padding: 20px 2%;
  /deep/ .el-button--primary {
    background-color: #00aaf0;
  }
  .record {
    display: flex;
    align-items: center;
    font-size: 16px;
    position: relative;
    .right {
      margin-left: auto;
    }
  }
  .table {
    margin-top: 20px;
    margin-bottom: 40px;
    .name-two {
      background-color: red !important;
    }
    .sheet {
      font-size: 16px;
    }
    // 进度条里的文字
    /deep/ .el-progress-bar__innerText {
      color: #000;
      margin-top: -6px;
    }
    /deep/ .el-table thead {
      color: #fff;
    }
    /deep/ .el-table th {
      background-color: #00aaf0;
      text-align: center;
      font-size: 17px;
      font-weight: normal;
    }
    /deep/ .el-table td {
      text-align: center;
    }
    // 表头字体颜色
    /deep/ .el-table th > .cell {
      color: #fff;
    }
    //表格去横线
    // /deep/ .el-table__row > td {
    //   border: none;
    // }
    //表格去横线之去掉最下面的那一条线
    // /deep/ .el-table::before {
    //   height: 0px;
    // }
    // 第一列字体颜色
    // /deep/ .el-table_1_column_1 {
    //   color: #00aaf0;
    // }
    .btn-one {
      font-size: 14px;
      color: #00aaf0;
    }
    .gray-btn {
      background-color: #bbb;
      color: #fff;
    }
    .blue-btn {
      background-color: #00aaf0;
      color: #fff;
    }
    .red {
      font-size: 16px;
      color: #ff6600;
    }
    .gray {
      font-size: 14px;
      color: gray;
    }
    .blue {
      color: #00aaf0;
      font-size: 14px;
    }
  }
  .el-dialog {
    .content {
      display: flex;
      justify-content: center;
      .el-form {
        .el-input {
          width: 150px;
        }
        .el-select {
          width: 150px;
        }
      }
    }
    .box-one {
      display: flex;
      justify-content: center;
      position: relative;
      .el-form {
        margin-bottom: 50px;
      }
      .dialog-footer {
        position: absolute;
        // left: 42%;
        top: 65%;
        // .btn-one {
          // margin-right: 60px;
          // margin-left: -30px;
        // }
      }
    }
    .box-two {
      position: relative;
      .title {
        text-align: center;
        margin-top: -20px;
        margin-bottom: 30px;
      }
      .el-form {
        margin-left: 100px;
        .input {
          width: 250px;
        }
        /deep/ .el-input.is-disabled .el-input__inner {
          background-color: #f0f5fe;
        }
        .btn {
          margin-left: 30px;
        }
        .share {
          width: 150px;
          height: 150px;
          margin-left: 50px;
          img {
            width: 100%;
            height: 100%;
          }
        }
        .new {
          margin-left: 240px;
          margin-top: -100px;
        }
        .botton {
          margin-top: 15px;
          margin-left: 240px;
        }
      }
    }
    .hidden {
      width: 0;
      height: 0;
      opacity: 0;
      position: absolute;
      top: -1000%;
      left: -1000%;
      z-index: -9999999;
    }
  }
}
.form-integrate {
  margin-top: 20px;
}
.integrate-transfer {
  /deep/ .el-transfer__buttons {
    padding: 0 10px;
  }
  /deep/ .el-transfer__button {
    display: block;
    margin-left: 0;
    padding: 7px;
    background-color: #ecf5ff;
    border-color: #ecf5ff;
    color: #606266;
    &:hover {
      background-color: #ecf5ff8f;
      border-color: #ecf5ff8f;
      color: #606266;
    }
  }
}
</style>
<style lang="less">
/* 背景 */
.app-name-tip {
  background-color: #00aaf0 !important;
  /* 箭头 */
  &[x-placement^="top"] .popper__arrow:after {
    border-top-color: #00aaf0 !important;
  }
  &[x-placement^="bottom"] .popper__arrow:after {
    border-bottom-color: #00aaf0 !important;
  }
  /* 箭头边框 */
  &[x-placement^="bottom"] .popper__arrow {
    border-bottom-color: #00aaf0 !important;
  }
  &[x-placement^="top"] .popper__arrow {
    border-top-color: #00aaf0 !important;
  }
}

/* 转换失败 */
.trans-tooplip {
  background-color: #ffe8e8 !important;
  /* 箭头 */
  &[x-placement^="top"] .popper__arrow:after {
    border-top-color: #ffe8e8 !important;
  }
  &[x-placement^="bottom"] .popper__arrow:after {
    border-bottom-color: #ffe8e8 !important;
  }
  /* 箭头边框 */
  &[x-placement^="bottom"] .popper__arrow {
    border-bottom-color: #ffe8e8 !important;
  }
  &[x-placement^="top"] .popper__arrow {
    border-top-color: #ffe8e8 !important;
  }
}

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
.sheet {
  .el-table__body,
  .el-table__header {
    width: 100% !important;
    table-layout: auto;
  }
}

.trans-tooplip-content {
  // color: #ff3333;
  font-size: 14px;
  // background-color: #ffe8e8;
  width: 100%;
  height: 100%;
  color: #ff3333;
}

.err-icon {
  margin-top: 7px;
  margin-left: 2px;
}

.aaaaaaaa {
  width: 100%;
  background-color: #ddd;
  box-sizing: border-box;
}

/deep/ .el-notification__group {
  width: 100%;
  background-color: red;
}
.skills {
  text-align: right;
  padding-right: 20px;
  line-height: 40px;
  color: white;
  box-sizing: border-box;
}

/deep/ .el-notification__content {
  background-color: pink;
  width: 100px;
  p {
    display: block;
  }
}

.ellipsis {
  cursor: pointer;
  display: flex;
  display: inline-block;
  margin-left: 10px;
  .ellipsis-item {
    display: inline-block;
    width: 4px;
    height: 4px;
    border-radius: 50%;
    background-color: #999;
    margin: 0 3px;       
  }
}

.zzwinput{
  width: 100px;
  border: 2px solid #dcdfe6;
  border-radius:5px;
  margin-top: 5px;
  outline-color:#666666; 
}

</style>

<style lang="less" scoped>
::v-deep .saveAsDialog{
  width: 700px !important;
}
.wordEllipsis{
  width: 100px;
  white-space: nowrap; //强制在一行显示
  overflow: hidden; //溢出隐藏
  text-overflow: ellipsis; //显示省略号
  float: left;
}
.clearfix::before,
.clearfix::after{
  content:'';
  display: table;
}
.clearfix::after{
  clear:both;
}
// .text{
//   overflow: hidden;
// }
::v-deep .el-card__body {
    padding: 0.25rem 1.25rem;
}
.elinput ::v-deep .el-input__inner{
  width: 96px;
  height: 20px;
  padding: 0 10px;
}

.yinc{
  padding-left: 10px;
  color: #00aaf0;
}
.bind{
  display: none;
}
.yinc:hover{
  cursor:pointer;
}
.td{
  float:right;
  position: relative;
  top:0px;
}
.upload-btn {
  position: relative;
  .uploadingNum {
    position: absolute;
    top: -13px;
    right: -10px;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background-color: red;
    font-size: 14px;
    color: #fff;
    font-weight: 500;
    padding: 6px;
  }
}
// 为了解决 链接模型弹框 右侧名字太长导致的布局问题
::v-deep .el-transfer .el-transfer-panel .optionName{
  font-style: normal !important;
}
// 为了解决 链接模型弹框 右侧名字太长导致的布局问题
::v-deep .el-transfer-panel:nth-of-type(3) .el-transfer-panel__body .el-checkbox-group .el-checkbox .el-checkbox__label .appna .optionName{
  display: inline-block;
    width: 150px;
  white-space: nowrap; //强制在一行显示
  overflow: hidden; //溢出隐藏
  text-overflow: ellipsis; //显示省略号
}
.box-card{
  margin-left: 9px;
}

</style>