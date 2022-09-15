<template>
  <!-- 应用管理 -->
  <div class="box">
    <!-- 消息提示 -->
    <div class="record">
      <!-- 消息提示 -->
      <div class="left">
        {{ $t("Youhave") }}&nbsp;
        <span style="color: #00aaf0">{{ componentsList.length }} </span>&nbsp;
        {{ $t("project") }}
      </div>
      <!-- 按钮 -->
      <div class="right">   
        <el-button type="primary" @click="AddIntegrate" :style="{'display': breadArr.length===0 ? 'none' : ''}" class="upload-btn">
          上传构件
          <div class="uploadCom" v-show="uploadCom">
            {{ uploadCom }}
          </div>
        </el-button>
        <el-button type="primary" @click="AddGroup" :style="{'display': breadArr.length===0 ? '' : 'none'}">新建分组</el-button>
      </div>
    </div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item  @click.native="clickBreadFirst">构件首页</el-breadcrumb-item>
      <el-breadcrumb-item v-for="(item,index) in breadArr" :key="index">{{item.groupName}}</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 表格 -->
    <div class="table">
      <el-table :data="componentsList" style="width: 100%" class="sheet" @row-click="rowClick">
          <el-table-column prop="" :label="breadArr.length === 0 ? '分组名称' : $t('compApplyname')" width="170">
          <template slot-scope="scope">
            <el-tooltip
              popper-class="app-name-tip"
              placement="top"
              effect="dark"
            >
              <template slot="content">
                <div v-if="scope.row.isGroup === '1'">{{ scope.row.groupName }}</div>
                <div v-else>{{ scope.row.ourbimComponentInfo.comName }}</div>
              </template>
              <div v-if="scope.row.isGroup === '1'">
                <i class="el-icon-folder-opened" :style="{'color':'#00aaf0'}"></i>
                <span>{{scope.row.groupName}}</span>
              </div>
              <div v-else>{{ scope.row.ourbimComponentInfo.comName }}</div>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column prop="" :label="breadArr.length === 0 ? '分组ID' : $t('componentId')" width="190">
            <template slot-scope="scope">
                <span v-if="scope.row.isGroup === '1'">{{scope.row.id}}</span>
                <span v-else>{{ scope.row.ourbimComponentInfo.comId }}</span>
            </template>
        </el-table-column>
        <el-table-column :label="$t('uploaddate')" width="130">
          <template slot-scope="scope">
            <span v-if="scope.row.isGroup === '1'">-</span>
            <span v-else>{{ scope.row.ourbimComponentInfo.createTime }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="" label="项目类型" width="150">
          <template slot-scope="scope">
            <span v-if="scope.row.isGroup === '1'">{{$t('projectMore')}}</span>
            <span v-else-if="scope.row.isGroup !== '1'">{{$t('componentSingle')}}</span>
          </template>
        </el-table-column>
     
        <el-table-column :label="$t('state')" width="150">
          <template slot-scope="scope">
            <div v-if=" scope.row.isGroup=== '1'">-</div>
            <div v-else-if="scope.row.isGroup !== '1'">{{ formatStatus(scope.row.ourbimComponentInfo.comStatus) }}</div>
            <!-- 转换中 -->
            <el-progress
              :text-inside="true"
              :percentage="scope.row.ourbimComponentInfo.progress"
              :show-text="true"
              :stroke-width="13"
              :color="customColor"
              v-if="
               scope.row.ourbimComponentInfo !== null && scope.row.ourbimComponentInfo.comStatus === '1' && scope.row.ourbimComponentInfo.progress !== 100
                  ? true
                  : false
              "
            >
            </el-progress>
            <!-- 转换失败 -->
            <div  v-if="scope.row.ourbimComponentInfo !== null && scope.row.ourbimComponentInfo.comStatus === '3'">
               <img src="../manage/err.png" alt="" />
            </div>
          </template>
        </el-table-column>

        <el-table-column label="操作">
          <template slot-scope="scope" class="goapp-row">
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
                  command="delete"
                  >删除</el-dropdown-item>
                <el-dropdown-item
                  command="edit"
                  >编辑</el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown>
          </template>
        </el-table-column>
        
      </el-table>
    </div>
    <!-- 上传项目对话框 -->
    <el-dialog :visible.sync="addCompDialog" width="50%" center>
      <addComps :pageParentID="pageParentId"></addComps>
    </el-dialog>
    <!-- 新建分组 -->
     <el-dialog title="新建分组" :visible="addNewGroupDialog" @close="closeNewBuild" width="25%">
      <el-form :style="{'width':'90%'}" :model="formInline" :rules="rulesInline" ref="formInline">
        <el-form-item label="分组名称:" label-width="100px" prop="name">
          <el-input v-model="formInline.name"></el-input>
        </el-form-item>    
      </el-form>
      <div slot="footer" class="dialog-footer" :style="{'text-align':'center'}">
           <el-button @click="closeNewBuild" size="medium">取 消</el-button>
           <el-button type="primary" @click="submitAddGroup('formInline')" size="medium">确 定</el-button>
      </div>   
    </el-dialog>
    <!-- 编辑自定义构件 -->
    <div class="selfDialog">
      <el-dialog title="编辑" :visible="editComDialog" @close="closeEditCom" width="25%" class="editFirst">
      <el-form :style="{'width':'90%'}" :model="editForm" :rules="rulesEditForm" ref="editForm">
        <el-form-item label="名称:" label-width="100px" prop="name">
          <el-input v-model="editForm.name"></el-input>
        </el-form-item>
        <el-form-item label="缩略图:" label-width="100px" v-if="breadArr.length !== 0">
            <uploadComImg></uploadComImg>
        </el-form-item>
        <el-form-item label="换组:" label-width="100px" class="btnMore">
          <el-select v-model="selectVal" placeholder="请选择分组" size="mini" ref="select" @clear="clearValue"  @visible-change="canChange" clearable :disabled="breadArr.length === 0 ? true : false">
             <el-option hidden key="id" :value="selectVal" :label="selectName"></el-option>
             <el-tree
              :data="treeData"
              :props="defaultProps"
              @node-click="handleNodeClick"
              :expand-on-click-node="true"
              :check-on-click-node="true"
              ref="tree"
              node-key="id"
            >
              <span class="father" slot-scope="{ data }">  
                <span>{{ data.groupName }}</span>
              </span>
            </el-tree>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" :style="{'text-align':'center'}">
        <el-button @click="closeEditCom">取 消</el-button>
        <el-button type="primary" @click="editSubmit('editForm')">确 定</el-button>
      </div>
    </el-dialog>
    </div>
  </div>
</template>

<script type='text/html' style='display:block'>

import MODELAPI from "@/api/model_api";
import { Getuserid } from "@/store/index.js";
import axios from "@/utils/request";
import qs from "qs";
import { updateJudgeMsg } from '../../api/my';

import addComps from './components/addComps.vue'
import uploadComImg from './components/uploadComImg.vue'

export default {
  name: "manage",
  components: {
    addComps,
    uploadComImg
  },
  data() {
    return {  
        componentsList:[], // 自定义构件列表
        customColor:'#00aaf0',
        pollingComps:true, // 是否开启轮询自定义构件
        timerComp:null, // 轮询自定义构建的定时器
        addCompDialog:false, // 添加构件弹框
        selectRowInfo:{}, // 鼠标点击当前行的数据
        addNewGroupDialog:false, // 新建分组弹框
        formInline:{  // 新建分组弹框绑定数据
          name:'',
        },
        pageParentId:'god', // 当前页面的父id
        currentId:'',  // 当前点击的那一个分组的id
        breadArr:[], // 面包屑导航的数组
        editComDialog:false,   // 编辑自定义构件弹框
        editForm:{  // 编辑弹框数据
          name:'',
        },
        icon:'el-icon-arrow-down',
        selectVal:'',  // select框的绑定值
        selectName:'', // select框的显示的name
        // 树形数据
        treeData:[],
        defaultProps: {
          children: "data",
          label: "groupName",
        },
        rulesInline:{
          name:[
            {
              required: true, message: '必填项', trigger: 'blur'
            },
            // {
            //   validator:(rules,value,callback) =>{
            //     const resBol = this.componentsList.some(item=>{
            //       if(item.isGroup === '1'){
            //         return item.groupName === value
            //       }else{
            //         return item.ourbimComponentInfo.comName === value;
            //       }
            //     })
            //     resBol ? callback(new Error('名称重复')) : callback()
            //   },
            //   trigger:'change'            
            // }
          ]
        },
        rulesEditForm:{
          name:[{
            required:true,
            message:'请输入名称',
            trigger:'blur'
          },
          // {
          //   validator:(rules,value,callback) =>{
          //     const resBol = this.componentsList.some(item=>{
          //       if(item.isGroup === '1'){
          //         return item.groupName === value && item.id !== this.selectRowInfo.id;
          //       }else{
          //         return item.ourbimComponentInfo.comName === value && item.ourbimComponentInfo.comId !== this.selectRowInfo.comId;
          //       }
          //     })
          //     resBol ? callback(new Error('名称重复')) : callback()
          //   },
          //   trigger:'change'
          //  }
          ]
         },
         nextBread:'',   // 控制是否有下一级的面包屑 
         nextBreadFlag:false,
         idFirst:'',  // 新建分组要传递的父id
    };
  },
  computed: {
    uploadCom() {
      return this.$store.state.uploadCom;
    },
  },
  created() {
    this.getCompList();
    this.setPollingComp();
  },
  methods: {
    // ------------
    // 获取自定义构件列表
    getCompList(){
     let params = {
        userId: Getuserid(),
        parentId:this.pageParentId
     }
     MODELAPI.GETCOMLISTBYPARENTID(params).then((res)=>{
        this.componentsList = [];
        if(res.data.code === 0){
          if(this.pageParentId === 'god'){
            this.idFirst = res.data.data.parentId;
          }
          if(res.data.data === undefined){
            this.componentsList =[];
          }else{
            this.componentsList = res.data.data.ourbimComponentInfoList;
          }
          if(this.nextBreadFlag === true){
            this.breadArr.push(this.nextBread);
          }
        }
        this.nextBreadFlag = false;
     }).catch(()=>{
        this.nextBreadFlag = false;
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
        6: "升级中",
      };
      return statusObj[status];
    },
    // 上传构件
    AddIntegrate(){
      this.addCompDialog = true;
    },
    // 新建分组
    AddGroup(){
      this.addNewGroupDialog = true;
      this.formInline.name = '';
    },
    handleCommand(command){
      const item = this.selectRowInfo;
      switch (command) {
        case "delete":
          this.removeCom(item);
          break;
        case "edit":
          this.editCom(item);
          break;
        default:
          break;
      }
    },
    // 关闭新建分组
    closeNewBuild(){
      this.addNewGroupDialog = false;
      this.$refs["formInline"].resetFields();
      this.formInline.name = '';
    },
    // 点点点下拉框的出现/隐藏时触发
    visibleChange(e){
      this.selectRowInfo = e;
    },
    // 删除构件组
    removeCom(e){
      this.$confirm("此操作将删除该应用, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          let params = {
            userId:Getuserid(),
            comId: e.isGroup==='0' ? e.ourbimComponentInfo.comId : '',
            groupId:e.isGroup==='1' ? e.id : ''
          }
          MODELAPI.DELETEUSERCOM(params).then((res)=>{
            if(res.data.code === 0){
              this.$message.success(res.data.message);
              this.getCompList();
            }else{
              this.$message.warning(res.data.message);
            }
          }).catch((err)=>{this.$message.error("删除失败")});
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    // 编辑自定义构件
    editCom(e){
      console.log('edit',e);
      this.editComDialog = true;
      this.editForm.name = e.isGroup === '1' ? e.groupName : e.ourbimComponentInfo.comName;
    },
    // 关闭自定义构件弹框
    closeEditCom(){
        this.editComDialog = false;
        this.editForm.name = '';
        this.selectVal = '';
        this.selectName='';
        this.$refs["editForm"].resetFields();
    },
    // 编辑自定义构件确定
    editSubmit(editForm){
      // console.log('确定',this.editForm);
      if(this.breadArr.length !== 0){
        this.$refs[editForm].validate((valid) => {
          if(valid){
            let params = {
              userId:Getuserid(),
              comId: this.selectRowInfo.comId,
              comName:this.editForm.name,
              groupId:this.selectVal
            }
            MODELAPI.UPDATEUSERCOM(params).then((res)=>{
              this.editComDialog = false;
              this.$message({
                type: "success",
                message: res.data.message,
              });
              this.getCompList();
            }).catch(()=>{})
          }else{
            return false
          }
        });
      }else if(this.breadArr.length === 0){
        this.$refs[editForm].validate((valid) => {
          if (valid) {
            let params = {
              userId:Getuserid(),
              groupId: this.selectRowInfo.id,
              groupName:this.editForm.name,
              parentId:this.selectVal
          }
          MODELAPI.UPDATECOMGROUP(params).then((res)=>{
            if(res.data.code === 0){
              this.editComDialog = false;
              this.$message({
                type: "success",
                message: res.data.message,
              });
                this.getCompList();
            }
          })
         }else {
            return false;
          }
        });
      }
    },
    // 轮询自定义构件
    setPollingComp(){
      if(this.pollingComps === true){
        this.timerComp = setInterval(()=>{
          this.getCompList();
        },2500)
      }
    },
    rowClick(e){
      if(e.isGroup==='0'){
        return;
      }
      this.nextBread = e;
      this.nextBreadFlag = true;
      this.currentId = e.id;
      this.pageParentId = e.id;
      this.getCompList();
      console.log('bgbgb',this.nextBread,this.nextBreadFlag);
    },
    // 新建分组弹框确定
    submitAddGroup(formName){
      this.$refs[formName].validate((valid) => {
          if (valid) {
            let params = {
              userId:Getuserid(),
              groupId:this.idFirst,
              groupName:this.formInline.name
            }
            MODELAPI.ADDCOMGROUP(params).then((res)=>{
              if(res.data.code === 0){
                  this.getCompList();
                  this.$message.success(res.data.message);
                  this.addNewGroupDialog = false;
              }else{
                  this.$message.warning(res.data.message);
              }
            }).catch(()=>{})
          } else {
            console.log('error submit!!');
            return false;
          }
      });
    },
    // 点击面包屑
    // clickBread(e,index){
    //   if(index === this.breadArr.length -1){
    //     return;
    //   }
    //   let arr = this.breadArr.slice(0,index+1);
    //   this.breadArr = arr;
    //   this.pageParentId = e.id;
    //   this.getCompList();
    // },
    // 点击面包屑导航的第一个
    clickBreadFirst(){
      this.breadArr = [];
      // this.$router.push({path: '/found'});
      this.pageParentId = 'god';
      this.getCompList();
      console.log('999',this.breadArr);
    },
    // 点击选择框的叉
    clearValue(){
      console.log('888');
      this.selectVal = ''; 
      this.selectName = '';
    },
     // 树形结构 点击事件
    handleNodeClick(data) {
      this.selectVal = data.id; // select绑定值为点击的选项的value
      this.selectName = data.groupName; // input中显示值为label
      // this.treeFilter = ""; // 点击后搜索框清空
      this.$refs.select.blur(); // 点击后关闭下拉框，因为点击树形控件后select不会自动折叠
    },

    canChange(e){
      if(e === true){
        let params = {
          userId:Getuserid()
        }
        MODELAPI.GETALLCOM(params).then((res)=>{
          if(res.data.code === 0){
            this.treeData = this.delDataFn(res.data.data[0].data);
          }
        });
      }
    },
    // 树形数据结构过滤函数
    delDataFn(arr) {
          if (Array.isArray(arr)) {
            for (let i = 0; i < arr.length; i++) {
              const item = arr[i];
              if (item.isGroup === "0" || item.id === this.selectRowInfo.id) {
                arr.splice(i, 1);
                i--;
              } else {
                if (Array.isArray(item.data)) {
                  this.delDataFn(item.data);
                }
              }
            }
          }
        return arr;
      },

    // -----------

  },
  mounted() {
    
  },
  watch: {
    
  },
  beforeDestroy(){
    clearInterval(this.timerComp);
  }
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
    margin-bottom: 12px;
    .right {
      margin-left: auto;
    }
  }
  ::v-deep .el-breadcrumb .el-breadcrumb__item .el-breadcrumb__inner{
    cursor: pointer !important;
  }
  ::v-deep .el-breadcrumb .el-breadcrumb__item .el-breadcrumb__inner:hover{
    color: #00aaf0;
  }
  .table {
    margin-top: 20px;
    margin-bottom: 40px;
    ::v-deep .el-table__body-wrapper .el-table__body .el-table__row{
      cursor: pointer;
    }
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
  .uploadCom {
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
// --------
.sheet ::v-deep .el-table__body-wrapper tbody tr td .el-tooltip{
  display: flex;
  align-items: center;
    i{
      margin: 0 20px 0 20px;
    }
}
.selfDialog{
  ::v-deep .el-select {
  width: 100%;
}
  ::v-deep .el-input__inner{
    height: 40px !important;
  }
}
.father{
    width: 90%;
     span{
      font-size: 14px;
      width:150px;
      overflow:hidden;
      white-space:nowrap;/*限制不换行*/
      text-overflow:ellipsis;
     }
  }
.band{
  display: none !important;
}

// --------
</style>