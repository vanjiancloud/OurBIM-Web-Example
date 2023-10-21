<template>
  <!-- 应用管理 -->
  <div class="box">
    <div class="boxHeader">
        <div class="boxHeaderTitle">您共有<span>{{docuList.length}}</span>个项目</div>
        <el-badge :value="uploadDoc" :hidden="!uploadDoc">
            <el-button icon="el-icon-upload" class="blueBtn" type="primary" @click="addDoc">上传文档</el-button>
        </el-badge>
    </div>
    <!-- 表格 -->
    <div class="table">
      <el-table :data="docuList" style="width: 100%">
          <el-table-column prop="" label="文档名称" width="190">
          <template slot-scope="scope">
            <el-tooltip
              popper-class="app-name-tip"
              placement="top"
              effect="dark"
            >
              <template slot="content">
                <div>{{ scope.row.fileName }}</div>
              </template>
              <span>{{ scope.row.fileName }}</span>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column prop="" label="文档ID">
            <template slot-scope="scope">
                <span>{{scope.row.userFileId}}</span>
            </template>
        </el-table-column>
        <el-table-column :label="$t('uploaddate')">
          <template slot-scope="scope">
            <span>{{ scope.row.addTime }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="" label="文档类型">
          <template slot-scope="scope">
            <span>{{ scope.row.extand }}</span>
          </template>
        </el-table-column>
    
        <el-table-column label="操作" width="122">
          <template slot-scope="scope" class="goapp-row">
              <div class="flexCenter">
                  <!-- 点点点 -->
                <el-button type="text" class="blueText" @click="goCloudDoc(scope.row)">打开文档</el-button>
            <el-dropdown
              @command="handleCommand"
              @visible-change="visibleChange(scope.row)"
              trigger="hover"
              placement="bottom"
            >
              <span class="el-dropdown-link">
                  <i class="el-icon-arrow-down el-icon-more"></i>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item
                  command="shareFile"
                  >分享</el-dropdown-item>
                <el-dropdown-item
                  command="editFile"
                  >在线编辑</el-dropdown-item>
                <el-dropdown-item
                  command="downloadFile"
                  >下载</el-dropdown-item>
                <el-dropdown-item
                  command="deleteFile"
                  >删除</el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown>
            </div>
          </template>
        </el-table-column>
        
      </el-table>
    </div>
    <!-- 上传项目对话框 -->
    <el-dialog :visible.sync="addCompDialog" width="50%" center>
      <addDocument></addDocument>
    </el-dialog>
    <!-- 分享dialog框 -->
    <el-dialog
      title="分享文档链接"
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
            <el-radio-group v-model="formShare.days">
              <el-radio label="0">永久</el-radio>
              <el-radio label="1">30天</el-radio>
              <el-radio label="2">7天</el-radio>
              <el-radio label="3">1天</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisibleOne = false" class="btn-one"
            >取 消</el-button
          >
          <el-button type="primary" @click="confirmShare" class="btn-two"
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
              钉钉等扫一扫即可访问文档
            </div>
            <el-button type="primary" class="botton" @click="copyImg">
              复制二维码
            </el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-dialog>
  </div>
</template>

<script type='text/html' style='display:block'>

import MODELAPI from "@/api/model_api";
import { Getuserid } from "@/store/index.js";
import axios from "@/utils/request";
import qs from "qs";
import { updateJudgeMsg } from '@/api/my';

import addDocument from './components/addDocument.vue'

export default {
  name: "office",
  components: {
    addDocument
  },
  data() {
    return {  
        docuList:[], // 自定义构件列表
        customColor:'#00aaf0',
        addCompDialog:false, // 上传弹框
        currentSelect:{},  // 选中的当前文档信息
        dialogFormVisibleOne:false, // 分享dialog
        isShow:'1', // 分享弹框出现的内容
        formShare:{
            userFileId:"",
            days:"999",
            qrurl: "", //二维码图片地址
            webShareUrl: "", //链接地址
        }
    };
  },
  computed: {
    uploadDoc() {
      return this.$store.state.uploadDoc;
    },
  },
  created() {
    this.getCloudDocList();
  },
  methods: {
    // ------------
    // 获取自定义构件列表
    getCloudDocList(){
     let params = {
        userId: Getuserid(),
     }
     MODELAPI.GETUSERALLCLOUDDOC(params).then((res)=>{
        this.docuList = [];
        if(res.data.code === 0){
            if(res.data.data === undefined){
               this.docuList = []; 
            }else{
               this.docuList = res.data.data;
               this.docuList = this.sortData(this.docuList)
            }
        }
     }).catch(()=>{})
    },
    handleCommand(command){
      const item = this.currentSelect;
      switch (command) {
        case "shareFile":
          this.shareFile(item);
          break;
        case "editFile":
          this.editFile(item);
          break;
        case "downloadFile":
          this.downloadFile(item);
          break;
        case "deleteFile":
          this.deleteFile(item);
          break;
        default:
          break;
      }
    },
    visibleChange(item){
        console.log('9090',item);
        this.currentSelect = item;
    },
    // 上传文档
    addDoc(){
        console.log('上传文档');
        this.addCompDialog = true;
    },
    // 打开文档
    goCloudDoc(itemDoc){
        console.log('打开文档',itemDoc);
        this.proAndEdit(itemDoc.userFileId,'0')
    },
     // 预览或者编辑接口
    proAndEdit(id,str){
        let params = {
            userId:Getuserid(),
            userFileId:id,
            type:str
        }
        MODELAPI.GETDOCURL(params).then((res)=>{
            if(res.data.code === 0){
                console.log('dfdd',res.data);
                const twoUrl = res.data.data;
                window.open(twoUrl);
            }else{
               this.$message.error(res.data.message);
            }
        }).catch(()=>{})
    },
    // 分享
    shareFile(item){
        this.dialogFormVisibleOne = true;
        this.formShare.userFileId = item.userFileId;
    },
    // 分享确定天数
    confirmShare(){
        // 引用的common.js的方法 开始加载
        this.$common.openLoading("正在加载中....");
        let params = {
            userId: Getuserid(),
            userFileId: this.formShare.userFileId,
            timeType: this.formShare.days,
        }
        MODELAPI.GETDOCSHAREUEL(params)
        .then((res) => {
          if (res.data.code === 0) {
            console.log('ioioi',res.data);
            this.isShow = 2;
            this.formShare.qrurl = res.data.data.qrImUrl;
            this.formShare.webShareUrl = res.data.data.url;
            this.$message.success(res.data.message);
          } else {
            this.$message.error(res.data.message);
          }
          // 引用的common.js的方法 停止加载
          this.$common.closeLoading();
        })
        .catch((err) => {
          this.$message.error("分享失败,请重新选择");
           // 引用的common.js的方法 停止加载
          this.$common.closeLoading();
          this.dialogFormVisibleOne = false;
        });
    },
    // 关闭分享dialog前的回调
    handleClose(done) {
      done();
      this.isShow = 1;
      this.formShare.days = "999";
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
     // 在线编辑
    editFile(item){
        this.proAndEdit(item.userFileId,'1');
    },
     // 下载
    downloadFile(item){
        this.$confirm("即将下载此文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          window.location.href = `https://office.ourbim.com/prod-api/office/downloadFile?userFileId=${item.userFileId}`
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消下载", 
          });
        });
    },
     // 删除
    deleteFile(item){
        this.$confirm("此操作将删除该应用, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          let params = {
            userId:Getuserid(),
            userFileId:item.userFileId
          }
          MODELAPI.DELETECLOUDDOC(params).then((res)=>{
            if(res.data.code === 0){
              this.getCloudDocList();
              this.$message.success(res.data.message);
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
    sortData(arr){ // 排序
      // this.timeData.sort(this.compare());
      arr.sort(function(a, b) {
        let obj1 = a['addTime']
        let obj2 = b['addTime']
        const val1 = Math.floor(new Date(obj1).getTime() / 1000)
        const val2 = Math.floor(new Date(obj2).getTime() / 1000)
        return val2 - val1
        // return val2 - val1
      });
      return arr
    }
  },
  mounted() {
    
  },
  watch: {
    
  },
  beforeDestroy(){}
};
</script>

<style lang="less" scoped>
.table{
    margin-top: 20px;
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
.box {
  ::v-deep .el-breadcrumb .el-breadcrumb__item .el-breadcrumb__inner{
    cursor: pointer !important;
  }
  ::v-deep .el-breadcrumb .el-breadcrumb__item .el-breadcrumb__inner:hover{
    color: #00aaf0;
  }
}
</style>
<style lang="less">

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

</style>

<style lang="less" scoped>
.box-one {
      display: flex;
      justify-content: center;
      position: relative;
      .el-form {
        margin-bottom: 50px;
      }
      .dialog-footer {
        position: absolute;
        top: 65%;
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

</style>