<template>
    <div>
      <el-dialog
        :title="title+'GIS数据服务项目'"
        :visible.sync="dialogVisible"
        width="50%"
        :before-close="hide"
        :close-on-click-modal="false"
        top="10vh"
      >
        <el-form :model="form" :rules="rules" ref="form" label-width="130px">
          <el-form-item label="项目名称：" prop="gisServerName">
            <el-input v-model="form.gisServerName" placeholder="请输入"></el-input>
          </el-form-item>
          <el-form-item label="项目缩略图：">
            <SingleUpload v-model="form.thumbnail" url="/appli/uploadThumbnail"/>
          </el-form-item>
          <el-form-item label="服务支持组件：" prop="gisPlugin" v-if="form.layerType==='OurGIS'">
                <el-select v-model="form.gisPlugin" placeholder="请选择" @change="form.ourGISLayerList = []">
                    <el-option :value="item.key" :label="item.name" v-for="(item,index) in gisPluginList" :key="index" :disabled="item.key==='arcGIS'"></el-option>
                </el-select>
          </el-form-item>
          <!-- <el-form-item label="GIS坐标系：" v-if="title==='编辑'" prop="gisCoordinateType">
            <el-select v-model="form.gisCoordinateType " placeholder="请选择" style="width:100%" v-if="title==='编辑'">
              <el-option :value="item.value" :label="item.note" v-for="(item,index) in gisCoordinateTypeList" :key="index"></el-option>
              </el-select>
          </el-form-item> -->
          <el-form-item label="GIS图层：" prop="ourGISLayerList" v-if="form.layerType==='OurGIS'||title==='添加'">
            <el-button type="primary" @click="addLayer('添加')" plain class="bluePlainBtn1">添加图层</el-button>
            <el-table class="GISLayer" :data="form.ourGISLayerList" style="width: 100%" :show-header="false" border max-height="300">
              <el-table-column prop="gisServerName" />
              <el-table-column>
                <template slot-scope="scope">
                  <span v-if="scope.row.longitude">{{ scope.row.longitude }}° {{ scope.row.latitude }}° {{ scope.row.altitude }}m</span>
                  <span v-else>无</span>
                </template>
              </el-table-column>
              <el-table-column fixed="right" width="75">
                <template slot-scope="scope">
                  <i class="el-icon-edit editIcon" @click="addLayer('编辑',scope.row,scope.$index)"></i>
                  <i class="el-icon-delete deleteIcon" @click="deleteLayer(scope.row,scope.$index)"></i>
                </template>
              </el-table-column>
            </el-table>
          </el-form-item>
          <!-- <el-form-item label="GIS信息：" required v-if="form.layerType==='3dtiles'">
              <el-col :span="7">
                  <el-form-item prop="longitude">
                      <el-input v-model="form.longitude" placeholder="经度" v-only-number="{min:-180,max:180,precision:8}"></el-input>
                  </el-form-item>
              </el-col>
              <el-col class="GISMark" :span="1">°</el-col>
              <el-col :span="7">
                  <el-form-item prop="latitude">
                      <el-input v-model="form.latitude" placeholder="纬度" v-only-number="{min:-90,max:90,precision:8}"></el-input>
                  </el-form-item>
              </el-col>
              <el-col class="GISMark" :span="1">°</el-col>
              <el-col :span="7">
                  <el-form-item prop="altitude">
                      <el-input type="number" v-model.number="form.altitude" placeholder="海拔高度"></el-input>
                  </el-form-item>
              </el-col>
              <el-col class="GISMark" :span="1">m</el-col>
          </el-form-item> -->
          <el-form-item label="最大并发数：" v-if="title==='编辑'">
            <el-input v-model="form.maxInstance" v-only-number="{min:0,precision:0}" placeholder="请输入"></el-input>
          </el-form-item>
          <el-form-item label="鼠标操作模式：" v-if="title==='编辑'">
            <el-select v-model="form.doMouse " placeholder="请选择" style="width:100%" v-if="title==='编辑'">
              <el-option :value="item.value" :label="item.note" v-for="(item,index) in doMouseList" :key="index"></el-option>
              </el-select>
          </el-form-item>
          <el-form-item label="窗口显示模式：" v-if="title==='编辑'">
            <el-select v-model="form.displayWindow" placeholder="请选择" style="width:100%">
              <el-option :value="item.value" :label="item.note" v-for="item in displayWindowList" :key="item.value"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
  
        <span slot="footer" class="dialog-footer">
          <el-button @click="hide">取 消</el-button>
          <el-button class="blueBtn" type="primary" @click="submit">确 定</el-button>
        </span>
      </el-dialog>
      <DialogsLayser ref="DialogsLayser" @onLayerSuccess="onLayerSuccess"/>
    </div>
  </template>
  
  <script>
  import { gisPluginList } from "./json"
  import { getDict } from "@/api/dict.js"
  import { Getuserid } from '@/store/index.js'
  import { addGISLayerServer, editGISLayerServer } from "@/api/GISList.js"
  import SingleUpload from "@/components/Upload/singleUpload.vue"
  import DialogsLayser from "./dialogsLayser.vue"
  export default {
    components: { SingleUpload, DialogsLayser },
    props: {},
    data() {
      return {
        gisPluginList,
        dialogVisible: false,
        title: "新建",
        form: {
            gisPlugin: 'cesium',
            ourGISLayerList:[]
        },
        rules: {
          gisServerName: [{ required: true, message: "请输入项目名称", trigger: "blur" }],
          ourGISLayerList: [{ required: true, message: "请添加图层", trigger: "blur" }],
          gisPlugin: [{ required: true, message: "请选择服务支持组件", trigger: "blur" }],
        //   gisCoordinateType: [{ required: true, message: "请选择GIS坐标系", trigger: "blur" }],
        },
        doMouseList:[], //鼠标操作模式
        displayWindowList: [], //窗口显示模式
        // gisCoordinateTypeList: [],//GIS坐标系
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
        // this.gisCoordinateTypeList = (await getDict('gisCoordinateType')).data
      },
      //添加、编辑图层
      addLayer(title,row = {},i){
        this.$refs.DialogsLayser.show(title,{...row,index:i}, this.form.gisPlugin)
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
      // 删除图层
      deleteLayer(row,i){
        this.$confirm(`删除【${row.gisServerName}】后无法恢复，确认是否删除？`, '删除GIS图层', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          closeOnClickModal:false,
          type: 'warning'
        }).then(() => {
          this.form.ourGISLayerList.splice(i,1)
        }).catch(() => {});
      },
      submit(){
        this.$refs.form.validate((valid) => {
          if (!valid) return false;
          if(this.form.id){
              let data = {
                  ...this.form,
                  userId:Getuserid(),
                  urlList:this.form.ourGISLayerList.length?JSON.stringify(this.form.ourGISLayerList):''
              }
              let formData = new FormData();
              for (const key in data) {
                  formData.append([key],data[key])
              }
              editGISLayerServer(formData).then(res=>{
                  this.$parent.$parent.getList()
                  this.$message.success('编辑成功！')
                  this.hide()
              })
          }else{
              let data = {
                  userId:Getuserid(),
                  gisServerName:this.form.gisServerName,
                  thumbnail:this.form.thumbnail,
                  gisPlugin: this.form.gisPlugin
              }
              addGISLayerServer(data,JSON.stringify(this.form.ourGISLayerList)).then(res=>{
                  this.$parent.$parent.getList()
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