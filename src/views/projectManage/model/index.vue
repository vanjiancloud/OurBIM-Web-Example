<template>
  <div class="box">
    <div class="record">
      <div class="left">
        {{ $t("Youhave") }}&nbsp;
        <span style="color: #00aaf0">{{ total }} </span>&nbsp;
        {{ $t("project") }}
      </div>
      <div class="right">
        <!-- <el-button type="primary" @click="createProject()">新建项目</el-button> -->
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
        <el-button type="primary" @click="showLinkModelDialog">链接模型</el-button>
      </div>
    </div>

    <!-- 模型表格 -->
    <div class="table">
      <el-table :data="allModelData" style="width: 100%" class="sheet">
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
            <span v-else-if="scope.row.appType === '0' && scope.row.isGis ==='true'" class="can-click" @click="edit(scope.row)">GIS模型</span>
            <el-tooltip
              effect="dark"
              :content="JSON.stringify(scope.row.sonAppMap)"
              placement="top"
              v-else-if="scope.row.appType === '3' && scope.row.isGis ==='true'"
            >
              <div class="can-click" @click="edit(scope.row)">GIS链接模型</div>
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
              <div :style="{'display':'flex','justify-content':'center','align-items':'center'}"
              >
                <span>{{ formatStatus(scope.row.applidStatus) }}</span>
                <div class="err-icon"><img src="@/assets/err.png" alt="" /></div>
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

        <!-- 报错 -->
        <!-- <el-button
          @click="reportErr(scope.row)"
          type="text"
          class="btn-one"
        >
          报错
        </el-button> -->

        <el-table-column label="操作" width="300">
          <template slot-scope="scope">
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
                  command="downloadModel"
                  v-if="scope.row.applidStatus === '2' && (scope.row.appType === '0' && scope.row.isGis === 'false') && scope.row.fileSize!='0'"
                  >下载</el-dropdown-item
                >
                <!-- <el-dropdown-item command="reconversion" v-if="scope.row.appType === '0'&&scope.row.applidStatus === '2'&&scope.row.fileSize!='0'">重新转换</el-dropdown-item> -->
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
      <Pagination :total="total" :page.sync="pages.pageNo" :limit.sync="pages.pageSize" @pagination="handlePageChange" />
    </div>
    <!-- 分享dialog框 -->
    <Share :visible.sync="dialogFormVisibleOne" :appid="formShare.appid" :isGis="form.isGis"></Share>
    <DialogsConversion ref="DialogsConversion"/>
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
          <el-form-item label="项目名称：" label-width="110px">
            <el-input v-model="form.name"></el-input>
          </el-form-item>
          <el-form-item label="项目缩略图：" label-width="110px">
            <SingleUpload v-model="form.screenImg" url="/appli/uploadThumbnail"/>
          </el-form-item>

          <el-form-item
            label="基础程序路径："
            v-if="form.appType === '3' || form.appType === '0'"
            label-width="110px"
          >
            <el-select v-model="value2" @change="changeEditorEngine">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
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
            label="GIS坐标系："
            v-if="(form.appType === '3' && form.isGis==='true' && value2 !=='BIM') || (form.appType === '0' && form.isGis==='true' && value2 !=='BIM') || value2==='GIS'"
            label-width="110px"
          >
            <el-select v-model="form.gisCoordinateType" placeholder="请选择GIS坐标系">
              <el-option value="WGS-84" label="WGS-84"></el-option>
              <el-option value="GCJ-02" label="GCJ-02"></el-option>
              <el-option value="BD-09" label="BD-09"></el-option>
            </el-select>
          </el-form-item>

          <!-- appType  0:普通模型(isGis: GIS模型)   1:漫游模型   3:链接模型(isGis: GIS链接模型)  4:示例模型    5:云应用 -->
          <!-- value2: 编辑框基础程序路径的绑定值 -->

          <!-- GIS模型 或者 GIS链接模型 或者 链接模型 或者 普通模型改为GIS模型时展示 -->
          <el-form-item
            :label="this.value2==='GIS' ? 'GIS信息:' : '子模型列表:'"
            v-if="(form.appType === '3' && form.isGis==='true') || (form.appType === '3' && form.isGis==='false') || (form.appType === '0' && this.value2==='GIS')"
            label-width="100px"
            :style="value2 == 'BIM' ? 'width:300px' : ''"
          >
            <el-card class="box-card">
                <div v-for="(GISitem, index) in editShowGisInfoData" :key="index" class="text item clearfix">
                  <el-tooltip class="item" effect="dark" :content="GISitem.name" placement="top">
                    <div class="wordEllipsis"> {{ GISitem.name }} </div>
                  </el-tooltip>
                  <!-- 链接模型最低要2个模型 -->
                  <div v-if="editShowGisInfoData.length > 2" class="td yinc" @click="delRow(index)"> 移除 </div>

                  <!-- GIS模型 或者 改为GIS模型的时候显示 -->
                  <div v-if="(form.isGis === 'true' && value2 ==='GIS') || value2 ==='GIS'">
                    <el-form
                      :model="GISitem"
                      :rules="gisInfoRules"
                      class="gis-form"
                      ref="editorGISInfo"
                    >
                      <el-form-item label="" prop="longitude" class="gis-form-box">
                        <el-input size="small" placeholder="请输入经度" v-model="GISitem.longitude"></el-input>
                        <span class="gis-input-label">°</span>
                      </el-form-item>
                      <el-form-item label="" prop="latitude" class="gis-form-box">
                        <el-input size="small" placeholder="请输入纬度" v-model="GISitem.latitude"></el-input>
                      <span class="gis-input-label">°</span>
                      </el-form-item>
                      <el-form-item label="" prop="altitude" class="gis-form-box">
                        <el-input size="small" placeholder="请输入海拔高度" v-model="GISitem.altitude"></el-input>
                      <span class="gis-input-label">m</span>
                      </el-form-item>
                    </el-form>
                  </div>
                </div>

                <!-- 链接模型展示 -->
                <div class="addNewModel" v-if="form.appType === '3'">
                  <span v-if="modelListFlag" @click="addModelClick">添加模型</span>
                  <el-select v-model="modelListValue" clearable placeholder="请选择" size="mini" @change="modelListValChange" v-else>
                    <el-option
                      v-for="item in modelList"
                      :key="item.appid"
                      :label="item.appName"
                      :value="item.appid">
                    </el-option>
                  </el-select>
                </div>
            </el-card>
          </el-form-item>

          <el-form-item
            label="链接GIS数据服务："
            label-width="110px"
            v-if="value2==='GIS'"
          >
            <el-card class="box-card">
              <div v-for="(item, index) in editShowGisServeData" class="gis-serve-box" :key="item.gisId">
                <el-tooltip class="item" effect="dark" :content="item.gisServerName" placement="top">
                  <div class="textEllipsis gis-serve"> {{ item.gisServerName }} </div>
                </el-tooltip>
                <span class="gis-serve-delete" @click="deleteGisServe(index)">移除</span>
              </div>

              <span class="add-gis-serve" v-if="selectGisList.length === 0" @click="showSelectGis">添加GIS服务</span>
              <el-select v-model="selectedGisServe" placeholder="请选择" size="mini" @change="addGisServe" v-else>
                <el-option
                  v-for="item in selectGisList"
                  :key="item.gisId"
                  :label="item.gisServerName"
                  :value="item.gisId">
                </el-option>
              </el-select>
            </el-card>
          </el-form-item>

          <el-form-item
            label="最大并发数："
            label-width="110px"
            prop="maxInstance"
            
          >
            <el-input v-model="form.maxInstance" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item class="startNumber" label="启动参数:" v-if="form.appType === '5'" label-width="100px">
            <el-input v-model="form.startNum"></el-input>
          </el-form-item>
          <el-form-item class="orStart" label="是否预启动:" v-if="form.appType !== '5'" label-width="100px">
              <el-radio-group v-model="radioStart" @change="readStart">
                <el-radio :label="1">是</el-radio>
                <el-radio :label="2">否</el-radio>
              </el-radio-group>
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
        <el-button type="primary" @click="editComfirm">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 链接模型 -->
    <el-dialog
      title="链接模型"
      custom-class="integrate-dialog"
      :visible="linkModelDialog"
      :width="value == 'GIS' ? '1090px' : '705px'"
      @close="closeLinkModel"
    >
      <div>
        <template>
          <el-select v-model="value" :placeholder="value">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
          <el-select v-model="linkGisCoordinateType" placeholder="请选择GIS坐标系" :style="{'margin-left':'132px'}" v-if="value === 'GIS'">
              <el-option value="WGS-84" label="WGS-84"></el-option>
              <el-option value="GCJ-02" label="GCJ-02"></el-option>
              <el-option value="BD-09" label="BD-09"></el-option>
           </el-select>
        </template>
      </div>
      <br />
      <div>
        <Transfer
          class="integrate-transfer"
          filterable
          ref="linkModel"
          :titles="['模型', '模型2']"
          v-model="ActiveLinkModel"
          :data="ListLinkModel"
          :isCustomRight="value === 'GIS'"
          :props="{
            key: 'appid',
            label: 'appName',
          }"
          @getData="handleChange"
        >
        </Transfer>
        <Transfer
          v-if="value === 'GIS'"
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
        <el-form
          :model="FormIntegrate"
          class="form-integrate"
          :rules="rulesIntegrate"
          ref="FormIntegrate"
          label-width="110px"
        >
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
    <DragUpload ref="DragUpload" numType="uploadingNum" accept=".rvt,.ifc,.zip,.rfa,.ipt,.dgn,.dwg,.step,.fbx,.FBX,.obj,.stp,.xyz,.txt,.pts,.las"
    @getFile="getFileDrag" @onSuccess="getAllModelList" @beforeUpload="beforeUpload">
        <!-- <template v-slot:append>
            <el-form :model="conversionForm" :rules="conversionRules" ref="conversionForm" label-width="0" class="conversionForm">
                <el-form-item prop="modelActorLimitNum">
                    <el-checkbox label="模型体量优化" v-model="conversionForm.NumChecked"></el-checkbox>
                    <span class="text">模型构件数阈值</span>
                    <el-input v-model="conversionForm.modelActorLimitNum" placeholder="请输入" style="width:150px;" v-only-number="{min:0}"></el-input>
                </el-form-item>
                <el-form-item prop="singleActorLimitNum">
                    <el-checkbox label="模型材质优化" v-model="conversionForm.ActorChecked"></el-checkbox>
                    <span class="text">单构件面数阈值</span>
                    <el-input v-model="conversionForm.singleActorLimitNum" placeholder="请输入" style="width:150px;" v-only-number="{min:0}"></el-input>
                </el-form-item>
                <el-form-item prop="platform" label-width="110px" label="解析模型版本">
                    <el-radio-group v-model="conversionForm.platform" disabled>
                        <el-radio label="Windows">服务端版</el-radio>
                        <el-radio label="Android">Android版</el-radio>
                        <el-radio label="IOS">IOS版</el-radio>
                    </el-radio-group>
                </el-form-item>
            </el-form>
        </template> -->
    </DragUpload>
  </div>
</template>

<script type='text/html' style='display:block'>
import {
  getProjectList,
  getGISProjectList,
  deleteProject,
  updateProject,
} from "@/api/my.js";
import MODELAPI from "@/api/model_api";
import { Getuserid } from "@/store/index.js";
import newRequest from "@/utils/newRequest.js";
import { urlToblob } from "@/utils/file.js";
import qs from "qs";
import Pagination from "@/components/Pagination"
import Share from "./share.vue"
import Transfer from "./transfer/main.vue"
import SingleUpload from "@/components/Upload/singleUpload.vue"
import DialogsConversion from "./dialogsConversion.vue"
import DragUpload from "@/components/Upload/dragUpload.vue";

export default {
  name: "manage",
  components: {
    Pagination,
    SingleUpload,
    Transfer,
    Share,
    DialogsConversion,
    DragUpload
  },
  data() {
    const validaLongitude = (rule, value, callback) => {
      if (!value || value === '') {
        callback(new Error('经度不能为空'))
      }
      if (Number(value) > 180 || Number(value) < -180) {
        callback(new Error('经度范围为-180~180'))
      } else {
        callback()
      }
    }
    const validaLatitude = (rule, value, callback) => {
      if (!value || value === '') {
        callback(new Error('纬度不能为空'))
      }
      if (Number(value) > 90 || Number(value) < -90) {
        callback(new Error('纬度范围为-90~90'))
      } else {
        callback()
      }
    }
    var validateModelActorLimitNum = (rule, value, callback) => {
        if (this.conversionForm.NumChecked&&!value) {
            callback(new Error('请输入模型构件数阈值'));
        } else {
            callback();
        }
    };
    var validateSingleActorLimitNum = (rule, value, callback) => {
        if (this.conversionForm.ActorChecked&&!value) {
            callback(new Error('请输入单构件面数阈值'));
        } else {
            callback();
        }
    };
    return {
      gisInfoRules: {
        longitude: [{ required: true, validator: validaLongitude, trigger: ['change', 'blur'] }],
        latitude: [{ required: true, validator: validaLatitude, trigger: ['change', 'blur'] }],
        altitude: [{ required: true, message: "海拔高度不能为空", trigger: ['change', 'blur'] }]
      },
      GISInfo: '',
      radioStart:2, // 是否预启动      
      isGis:'',
      type:null,
      editShowGisInfoData: [],
      editShowGisServeData: [],
      options: [
        {
          value: "GIS",
          label: "OurGISEngine",
        },
        {
          value: "BIM",
          label: "OurBIMEngine",
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
      ActiveLinkGISModel: [],
      ListLinkModel: [],
      ListLinkGISModel: [],
      linkModelDialog: false,
      allModelData: [], //数据列表
      timer: null, // 模型列表接口请求定时器
      display: false, //转换进度条默认隐藏
      customColor: "#00AAF0", //进度条颜色
      fileList: [{ url: "" }], //上传图片列表显示
      editDialogFormVisible: false,
      dialogFormVisibleOne: false,
      //分享应用表单
      formShare: {
        appid: "",
      },
      // 编辑应用表单
      form: {
        appType:"",
        startup:"",
        gisCoordinateType:"WGS-84",
        applid:[],
        appName:[],
        displayName: "",
        gisinfo:[],
        name: "",
        maxInstance: "",
        appid: "",
        screenImg: "",
        applidStatus: null,
        isGis:'',
        modelIds:'',
        startNum:'', // 启动参数
        startVal: null, // 是否预启动
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
      rules: {
        // 最大并发的校验
        maxInstance: [
          {
            pattern: /^([1-9]\d{0,3})$/,
            message: "请输入1-9999的正整数",
            trigger: "blur",
          }
        ]
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
          { min: 1, max: 20, message: "字数不能超过20!", trigger: "blur" }
        ],
        type: [
          { required: true, message: "请选择活动区域", trigger: "change" }
        ],
        detail: [
          { required: true, message: "请输入问题描述!", trigger: "blur" },
          { min: 1, max: 200, message: "字数不能超过200!", trigger: "blur" }
        ]
      },
      selectStartups: null,
      modelList: [], // 编辑中添加模型时的下拉框数据
      selectGisList: [], // 可选的gis服务数据
      selectedGisServe: '',
      modelListValue:'', //  编辑中添加模型时的下拉框的v-model
      modelListFlag: true,
      linkGisCoordinateType:'WGS-84', // 链接模型时选择坐标系
      
      total: 0,
      pages: {
        pageNo: 1,
        pageSize: 20
      },
    //   上传模型转换
        conversionForm: {
            NumChecked:true,
            ActorChecked:true,
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
    }
  },
  computed: {
    uploadingNum() {
      return this.$store.state.uploadingNum
    }
  },
  created() {
    this.getAllModelList()
    this.setGetModelListTimer()
    // 获取gis服务数据
    this.getGISProject()
  },
  methods: {
    handleChange (data) {
      this.GISInfo = data
    },

    readStart (val) {
      if (val === 1) {
         this.form.startVal = true
      } else {
        this.form.startVal = false
      }
    },

    closeEdit () {
      this.editDialogFormVisible = false
      this.editShowGisInfoData = []
    },

    closeLinkModel () {
        this.linkModelDialog = false
        this.ActiveLinkModel = []
        this.FormIntegrate.appName=''
    },

    delRow (index) {
      this.$confirm('确定移除吗', '提示').then(() => {
        // 将添加模型下拉框清空
        this.modelListValue = ''

        // 更新modelIds
        let combineIds = this.form.modelIds.split(',')
        const data = combineIds.filter(item => item !== this.editShowGisInfoData[index].appId)
        this.form.modelIds = data.join(',')

        this.editShowGisInfoData.splice(index, 1)
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
          window.open(urllll);
          return;
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消下载",
          });
        });
    },

    deleteGisServe (index) {
      this.$confirm('确定移除吗', '提示').then(() => {
        this.editShowGisServeData.splice(index, 1)
      })
    },

    reportErr (row) {
      reportErrDialogVisible = true
    },

    handleCreateProjectDialog () {
        this.conversionForm = this.$options.data().conversionForm
        this.$refs.DragUpload.show('上传模型')
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
          let gisinfoList = [];
          const userId = Getuserid();
          const appName= this.FormIntegrate.appName;
          if (this.value == "GIS") {
            this.type = "gis";
            this.isGis = true;
            gisinfoList = this.GISInfo.map(item => {
              const { appid, altitude, latitude, longitude }  = item
              return { appId: appid, altitude, latitude, longitude }
            })
          } else {
            this.type = "bim";
            this.isGis = false;
            gisinfoList = '';
          }
          let params = {
            userId,
            appName,
            type : this.type,
            bimList: this.ActiveLinkModel.join(','),
            gisInfo: JSON.stringify(gisinfoList),
            screenImg: this.FormIntegrate.screenImg, // 项目缩略图
            isGis: this.isGis,
            gisCoordinateType: this.value ==='BIM' ? 'WGS-84' : this.linkGisCoordinateType,
          }
          if (this.ActiveLinkGISModel.length !== 0) {
            params.gisList = this.ActiveLinkGISModel.join(',')
          }
          
          console.log('参数打印', params)
          MODELAPI.ADDINTEGRARE(params).then((res) => {
            if (res.data.code === 0) {
              this.getAllModelList();
              this.ActiveLinkModel = [];
              this.$refs["FormIntegrate"].resetFields();
              this.linkModelDialog = false
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

    getGISProject() {
      const params = {
        userId: Getuserid()
      }
      getGISProjectList(params).then(res => {
        if (res.data.code === 0) {
          // 只显示status为2的数据
          this.ListLinkGISModel = res.data.data.list.filter(item => item.status === '2')
        } else {
          this.ListLinkGISModel = []
        }
      })
    },

    showLinkModelDialog() {
      this.linkModelDialog = true
      this.getModelList()
    },
    // 获取模型列表
    getModelList(){
        getProjectList({
            userid: Getuserid(),
            isHandle: 1,
            appType: 0
        }).then(res => {
            if (res.data.code === 0) {
            let resData = res.data.data.list
            this.ListLinkModel = resData.filter(item => item.appType !== '4')
            } else {
            this.ListLinkModel = []
            }
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
        userid: Getuserid()
      }
      getProjectList(params).then(res => {
        if (res.data.code == "0") {
          this.total = res.data.data.total
          this.allModelData = res.data.data.list
        } else if (res.data.code < 0) {
          this.timerFlag = false
          this.$message.warning(res.data.message)
          this.allModelData = []
        } else {
          this.allModelData = []
        }
      })
      .catch((err) => {
        // this.$message.error('请求失败')
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
            this.formShare.webShareUrl = res.data.data.webShareUrl
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
    async copyImg() {
      // 剪切板只有image/png格式才行，其他图片格式报错
      urlToblob(this.formShare.qrurl,async (blob)=>{
        const item = new ClipboardItem({
          [blob.type]: blob
        })
        navigator.clipboard.write([item]).then(res=>{
          this.$message.success("二维码复制成功！");
        },err=>{
          this.$message.error("二维码复制失败！",err);
        })
      })
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
        case "downloadModel":
          this.downloadModel(item);
          break;
        case "delete":
          this.remove(item);
          break;
        case "reconversion":
            this.$refs.DialogsConversion.show(item)
            break;
        default:
          break;
      }
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
            userId: Getuserid(),
            appId: row.appid,
          };
          let urlDownload =
            process.env.VUE_APP_REQUEST_URL +
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

    changeEditorEngine (value) {
      if (value === 'GIS' && this.editShowGisInfoData.length === 0) {
        this.editShowGisInfoData.push({
          name: this.form.name,
          appId: this.form.appid,
          longitude: '',
          latitude: '',
          altitude: ''
        })
      } 
    },

    // 编辑按钮
    edit(e) {
      this.editShowGisInfoData = []
      this.editShowGisServeData = []
      this.selectGisList = []
      // 将添加模型按钮显示出来
      this.modelListFlag = true

      let data = JSON.parse(JSON.stringify(e))
      this.form = data
    //   this.form.name = data.appName;
    //   this.form.appid = data.appid;
    //   this.form.modelIds = data.combineId;
    //   this.form.gisCoordinateType = data.gisCoordinateType || 'WGS-84';
    //   this.form.startNum = data.param || '';
      this.$set(this.form,'name',data.appName)
      this.$set(this.form,'appid',data.appid)
      this.$set(this.form,'modelIds',data.combineId)
      this.$set(this.form,'gisCoordinateType',data.gisCoordinateType || 'WGS-84')
      this.$set(this.form,'startNum',data.param || '')
      if (e.isReserve === 'true') {
        this.radioStart = 1;
        this.form.startVal = true;
      } else {
        this.radioStart = 2;
         this.form.startVal = false;
      }

      // 获取gis服务数据
      if (e.gisServerMap) {
        for (let item in e.gisServerMap) {
          this.editShowGisServeData.push({
            gisId: item,
            gisServerName: e.gisServerMap[item]
          })
        }
      }

      // 状态 只有是  转换完成  的情况下才可以编辑
      if (this.form.applidStatus !== '2') {
         this.$message.error("当前状态不可编辑");
         return;
      }

      // appType  0:普通模型(isGis: GIS模型)   1:漫游模型   3:链接模型(isGis: GIS链接模型)  4:示例模型    5:云应用
      if (e.appType == "3" && e.isGis=='true') { // GIS链接模型
        this.value2 = "GIS"
        this.form.gisinfo = JSON.parse(e.gisInfo);
        this.editShowGisInfoData = this.form.gisinfo
        // e.sonAppMap: 是个对象里面存的是gis的id和模型名字
        // e.gisinfo数组,有经纬度和appid
        this.editShowGisInfoData.forEach(item => {
          item.name = e.sonAppMap[item.appId]
        })
      } else if (e.appType == "0" && e.isGis=='true') { // GIS模型
        this.value2 = "GIS"
        this.form.gisinfo = JSON.parse(e.gisInfo);

        this.editShowGisInfoData.push(this.form.gisinfo)
        this.editShowGisInfoData[0].name = e.appName
        this.editShowGisInfoData[0].appId = e.appid
      } else if (e.appType == "3" && e.isGis == 'false') { // 链接模型
        this.value2 = "BIM"
        this.form.gisinfo = JSON.parse(e.gisInfo);
        for (let item in e.sonAppMap) {
          this.editShowGisInfoData.push({
            name: e.sonAppMap[item],
            appId: item,
            longitude: '',
            latitude: '',
            altitude: ''
          })
        }
      } else {
        this.value2 = "BIM"
        this.form.gisinfo = JSON.parse(e.gisInfo);
      }
      
      if (e.startups) {
        this.selectStartups = e.startups.split(",");
      }
      for (let index = 0; index < this.fileList.length; index++) {
        this.fileList[index].url = e.screenImg;
      }
      this.editDialogFormVisible = true;
      this.getModelList()
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

    editComfirm () {
      let param = this.form
      // 1 验证必填项
      const verify = {
        name: "项目名称",
        maxInstance: "最大并发数"
      }
      for (const k in verify) {
        const val = Array.isArray(param[k]) ? param[k][0] : param[k]
        if (!this.$common.noNull(val)) {
          this.$common.message(verify[k] + " 不能为空", "warning") // 提示信息
          return
        }
      }
     
      // 验证 gis信息 不能为空
      const gisMessageValid = this.validaGISInputForm()
      if (!gisMessageValid) {
        this.$message({
          message: "请填写正确的gis信息",
          type: "warning"
        })
        return
      }

      this.$refs.form.validate(valid => {
        if (valid) {
          this.$common.openLoading("正在加载中....")
          
          // 整理gis信息数据
          // 如果不是链接模型,这里的数据就需要传对象,链接模型则需要传数组
          let gisinfoLis = this.form.appType === '3' ? [] : {}
          if (this.form.appType === '3' && this.editShowGisInfoData.length !== 0) {
            gisinfoLis = this.editShowGisInfoData.map(item => {
              const { appId, longitude, altitude, latitude } = item
              return {
                appId,
                longitude,
                altitude,
                latitude
              }
            })
          } else if (this.editShowGisInfoData.length !== 0) {
            const { appId, longitude, altitude, latitude } = this.editShowGisInfoData[0]
            gisinfoLis = {
              appId,
              longitude,
              altitude,
              latitude
            }
          }

          // 整理gis服务数据
          const gisServerList = this.editShowGisServeData.map(item => item.gisId).join(',')
          const params = {
            appid: this.form.appid,
            appName: this.form.name,
            doMouse: this.form.doMouse,
            displayWindow: this.form.displayWindow,
            appType: this.form.appType,
            screenImg: this.form.screenImg,
            maxInstance: this.form.maxInstance,
            startup: this.form.startup,
            gisInfo: JSON.stringify(gisinfoLis),
            gisServerList: gisServerList,
            isGis: this.value2 === 'BIM' ? 'false' : 'true',
            combineId: this.form.modelIds,
            gisCoordinateType: this.form.gisCoordinateType,
            param: this.form.startNum, // 启动参数
            isReserve: this.form.startVal // 是否预启动
          }

          console.log('请求参数', params)
          updateProject(params).then(res => {
            if (res.data.code === 0) {
              this.$message.success(res.data.message)
              this.$common.closeLoading()
              this.getAllModelList()
              this.editDialogFormVisible = false
            } else if (res.data.code === 1) {
              this.$message.error("修改失败，" + res.data.message)
              this.$common.closeLoading()
            }
          })
          .catch(err => {
            this.$message.error("修改信息失败,请重新修改")
            this.$common.closeLoading()
          })
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
            this.getAllModelList();
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
            isGis: e.isGis,  // 用于控制 gis模型  时  渲染环境 图标隐藏
            reserveId: e.reserveId || '', // 有reserveId就是预启动项目 没有就不是
            userId:Getuserid()
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
    
    // 点击添加模型按钮
    addModelClick () {
      this.modelListFlag = false
      this.modelListValue = ''

      const combineIds = this.form.modelIds.split(',')
      this.modelList = this.ListLinkModel.filter(item => !combineIds.includes(item.appid))
    },

    showSelectGis () {
      this.selectedGisServe = ''
      const selectedGisServeIds = this.editShowGisServeData.map(item => item.gisId)
      // 找出未被选中的gis服务数据
      this.selectGisList = this.ListLinkGISModel.filter(item => !selectedGisServeIds.includes(item.gisId))
      if (this.selectGisList.length === 0) {
        this.$message.warning('已添加全部gis服务，没有更多gis服务可供添加')
      }
    },

    addGisServe (data) {
      const index = this.selectGisList.findIndex(item => item.gisId === data)
      const { gisId, gisServerName } = this.selectGisList[index]
      this.editShowGisServeData.push({
        gisId,
        gisServerName
      })
      this.selectGisList = []
    },

    // 添加的模型变化时
    modelListValChange (appId) {
      const index = this.modelList.findIndex(item => item.appid === appId)
      if (appId) {
        // 更新modelIds
        const combineIds = this.form.modelIds.split(',')
        combineIds.push(appId)
        this.form.modelIds = combineIds.join(',')

        const { appName, appid } = this.modelList[index]
        this.editShowGisInfoData.push({
          name: appName,
          appId: appid,
          longitude: '',
          latitude: '',
          altitude: ''
        })
        this.modelListFlag = true
      }
    },
    // 上传模型参数
    getFileDrag(file, callback) {
        callback({
            // platform: this.conversionForm.platform,
            // modelActorLimitNum: this.conversionForm.modelActorLimitNum,
            // singleActorLimitNum: this.conversionForm.singleActorLimitNum,
            fileUpload: file,
            userId: Getuserid(),
            url: "/appli/addProject",
        });
    },
    // 上传GIS数据验证
    beforeUpload(callback){
        // this.$refs.conversionForm.validate((valid) => {
        //     if (!valid){
        //         callback(true)
        //         return false;
        //     }
        // })
    },
    // 新建项目
    createProject(){
      this.$refs.DragUpload.show('新建项目')
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
      this.getAllModelList();
      this.$router.go(0);
    }
  },

  beforeDestroy () {
    // 清除列表接口请求定时器
    clearInterval(this.timer)
    this.timer = null
  },
};
</script>

<style lang="less" scoped>
/deep/ .el-dialog__wrapper {
  overflow: hidden;
}
/deep/ .gis-form-box .el-form-item__content {
  display: flex;
}

.can-click {
  color: #409eff;
  cursor: pointer;
}

.gis-form {
  display: flex;
  align-items: flex-start;
  height: 58px;
}
.gis-form-box {
  flex: 1;
  margin: 0 5px 0 5px;
  display: flex;
  .gis-input-label {
    margin: 0 0 0 5px;
  }
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
  font-size: 14px;
  width: 100%;
  height: 100%;
  color: #ff3333;
}

.err-icon {
  margin-top: 7px;
  margin-left: 2px;
}

/deep/ .el-notification__group {
  width: 100%;
  background-color: red;
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

.gis-serve-box {
  position: relative;
  .gis-serve {
    margin: 0 80px 0 0;
  }
  .gis-serve-delete {
    position: absolute;
    right: 20px;
    top: 0;
    color: #00aaf0;
    &:hover {
      cursor: pointer;
    }
  }
}
.add-gis-serve {
  color: #00aaf0;
  font-size: 14px;
  cursor: pointer;
}

.clearfix::before,
.clearfix::after{
  content:'';
  display: table;
}
.clearfix::after{
  clear:both;
}

::v-deep .el-card__body {
    padding: 0.25rem 1.25rem;
}
.elinput ::v-deep .el-input__inner{
  width: 96px;
  height: 20px;
  padding: 0 10px;
}

.yinc {
  padding-left: 10px;
  color: #00aaf0;
}
.bind {
  display: none;
}
.yinc:hover {
  cursor: pointer;
}
.td {
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

.box-card {
  margin-left: 9px;
  .addNewModel{
    span {
      color: #00aaf0;
      font-size: 14px;
      cursor: pointer;
    }
  }
}
::v-deep .orStart .el-radio-group {
   margin-left: 9px;
}
::v-deep .reaNum .el-input {
  margin-left: 9px;
}
::v-deep .startNumber .el-input {
  margin-left: 9px;
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