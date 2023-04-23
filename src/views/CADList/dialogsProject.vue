<template>
    <div>
      <el-dialog
        :title="title"
        :visible.sync="dialogVisible"
        width="50%"
        :before-close="hide"
        :close-on-click-modal="false"
        top="10vh"
      >
        <el-form :model="form" :rules="rules" ref="form" label-width="130px">
          <el-form-item label="图纸名称：" prop="fileName">
            <el-input v-model="form.fileName" placeholder="请输入"></el-input>
          </el-form-item>
          <el-form-item label="图纸ID：" prop="userFileId">
            <el-input v-model="form.userFileId" placeholder="请输入"></el-input>
          </el-form-item>
          <el-form-item label="上传日期：" prop="addTime">
            <el-input v-model="form.addTime" placeholder="请输入"></el-input>
          </el-form-item>
          <el-form-item label="大小：" prop="fileSize">
            <el-input v-model="form.fileSize" placeholder="请输入"></el-input>
          </el-form-item>
          <el-form-item label="图纸类型：" prop="extand">
            <el-input v-model="form.extand" placeholder="请输入"></el-input>
          </el-form-item>
        </el-form>
  
        <span slot="footer" class="dialog-footer">
          <el-button @click="hide">取 消</el-button>
          <el-button class="blueBtn" type="primary" @click="submit">确 定</el-button>
        </span>
      </el-dialog>
    </div>
  </template>
  
  <script>
  import { getDict } from "@/api/dict.js"
  import { Getuserid } from '@/store/index.js'
  import { addGISLayerServer, updateCADFileInfo } from "@/api/CADList.js"
  export default {
    props: {},
    data() {
      return {
        dialogVisible: false,
        title: "新建",
        form: {ourGISLayerList:[]},
        rules: {
          // gisServerName: [{ required: true, message: "请输入项目名称", trigger: "blur" }],
          // ourGISLayerList: [{ required: true, message: "请添加图层", trigger: "blur" }],
          // gisCoordinateType: [{ required: true, message: "请选择GIS坐标系", trigger: "blur" }],
        },
        doMouseList:[], //鼠标操作模式
        displayWindowList: [], //窗口显示模式
        gisCoordinateTypeList: [],//GIS坐标系
      };
    },
    watch: {},
    computed: {},
    created() {},
    mounted() {
      this.getType()
    },
    methods: {
      show(title,row) {
        this.title = title
        this.form = this.$options.data().form
        this.dialogVisible = true;
        this.$nextTick(()=>{
          this.$refs.form.clearValidate();
          if(row.id){
              this.form = row
              this.form.ourGISLayerList = row.urlList&&JSON.parse(row.urlList) || []
          }
        })
      },
      hide() {
        this.dialogVisible = false;
      },
      async getType(){
        this.doMouseList = (await getDict('doMouse')).data
        this.displayWindowList = (await getDict('displayWindow')).data
        this.gisCoordinateTypeList = (await getDict('gisCoordinateType')).data
      },
      //添加、编辑图层
      addLayer(title,row = {},i){
        this.$refs.DialogsLayser.show(title,{...row,index:i})
      },
      // 图层添加到列表里面
      onLayerSuccess(data){
        if(data.index>=0){
          this.$set(this.form.ourGISLayerList,data.index,data)
          this.$forceUpdate()
        }else{
          this.form.ourGISLayerList.push(data)
        }
      },

      submit(){
        this.$refs.form.validate((valid) => {
          if (!valid) return false;
          if(this.form.id){
              updateCADFileInfo(this.form).then(res=>{
                  this.$parent.getList()
                  this.$message.success('编辑成功！')
                  this.hide()
              })
          }else{
              let data = {
                  userId:Getuserid(),
                  gisServerName:this.form.gisServerName,
                  thumbnail:this.form.thumbnail
              }
              addGISLayerServer(data,JSON.stringify(this.form.ourGISLayerList)).then(res=>{
                  this.$parent.getList()
                  this.$message.success('创建成功！')
                  this.hide()
              })
          }
        });
      },
    },
  };
  </script>
  <style lang="less" scoped>
  .GISLayer{
    margin-top: 20px;
  }
  /deep/ .el-table .el-table__cell{
    text-align: left;
  }
  /deep/ .el-table tr{
    background: #FCFCFC;
  }
  </style>