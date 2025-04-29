<!--
 * @Autor: zk
 * @Date: 2024-08-23 19:46:00
 * @LastEditors: zk
 * @LastEditTime: 2024-09-22 19:39:24
 * @Description: 
-->
<template>
  <div>
    <el-dialog :title="title + 'GIS数据服务项目'" :visible.sync="dialogVisible" width="50%" :before-close="hide"
      :close-on-click-modal="false" top="10vh">
      <el-form :model="form" :rules="rules" ref="form" label-width="140px">
        <el-form-item label="项目名称：" prop="gisServerName">
          <el-input v-model="form.gisServerName" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="项目缩略图：">
          <SingleUpload v-model="form.thumbnail" url="/appli/uploadThumbnail" />
        </el-form-item>
        <el-row>
          <el-col :span="12">
            <el-form-item label="服务支持组件：" prop="gisPlugin" v-if="form.layerType === 'OurGIS' || title === '添加'">
              <el-select v-model="form.gisPlugin" placeholder="请选择" @change="form.ourGISLayerList = []">
                <el-option :value="item.key" :label="item.name" v-for="(item, index) in gisPluginList" :key="index"
                  :disabled="item.key === 'arcGIS'"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="服务类型：" prop="layerType">
              <el-select v-model="form.layerType" placeholder="请选择" style="width:100%">
                <el-option :value="item.key" v-for="(item, index) in layerTypeList" :key="index"
                  :label="item.name"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="服务地址：" prop="fileUrl">
          <el-input v-model="form.fileUrl" placeholder="请输入服务地址"></el-input>
        </el-form-item>
        <div style="display: flex;">
          <el-form-item label="GIS底图:" prop="gisSuperMapInfo">
            <el-select v-model="form.gisSuperMapInfo" placeholder="请选择" multiple style="width:100%">
              <el-option :value="item.key" :label="item.name" v-for="(item, index) in mapInfoList"
                :key="index"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="是否启动地形:" pro="gisTerrain">
            <el-radio-group v-model="form.gisTerrain">
              <el-radio label="true">是</el-radio>
              <el-radio label="false">否</el-radio>
            </el-radio-group>
          </el-form-item>
        </div>
        <el-form-item label="项目初始点坐标：" required>
          <el-col :span="7">
            <el-form-item prop="longitude">
              <el-input v-model="form.longitude" placeholder="经度"
                v-only-number="{ min: -180, max: 180, precision: 8 }"></el-input>
            </el-form-item>
          </el-col>
          <el-col class="GISMark" :span="1">°</el-col>
          <el-col :span="7">
            <el-form-item prop="latitude">
              <el-input v-model="form.latitude" placeholder="纬度"
                v-only-number="{ min: -90, max: 90, precision: 8 }"></el-input>
            </el-form-item>
          </el-col>
          <el-col class="GISMark" :span="1">°</el-col>
          <el-col :span="7">
            <el-form-item prop="altitude">
              <el-input v-model="form.altitude" placeholder="海拔高度"></el-input>
            </el-form-item>
          </el-col>
          <el-col class="GISMark" :span="1">m</el-col>
        </el-form-item>
        <el-form-item label="最大并发数：" v-if="title === '编辑'">
          <el-input v-model="form.maxInstance" v-only-number="{ min: 0, precision: 0 }" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="鼠标操作模式：" v-if="title === '编辑'">
          <el-select v-model="form.doMouse" placeholder="请选择" style="width:100%" v-if="title === '编辑'">
            <el-option :value="item.value" :label="item.note" v-for="(item, index) in doMouseList"
              :key="index"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="窗口显示模式：" v-if="title === '编辑'">
          <el-select v-model="form.displayWindow" placeholder="请选择" style="width:100%">
            <el-option :value="item.value" :label="item.note" v-for="item in displayWindowList"
              :key="item.value"></el-option>
          </el-select>
        </el-form-item>
        <div v-if="form.layerType !== 'terrain' && form.layerType">
          <el-collapse v-model="activeName" accordion>
            <el-collapse-item title="GIS服务设置" name="1">
              <!-- 3Dtiles -->
              <part-tiles ref="refTiles" v-if="form.layerType === '3dtiles'" />
              <!-- WMTS -->
              <part-WMTS ref="refWMTS" v-if="form.layerType === 'WMTS'" :receiveData="this.form" />
              <!-- TMS -->
              <part-tms ref="refTms" v-if="form.layerType === 'TMS'" :receiveData="this.form"/>
              <!-- WMS -->
              <part-WMS ref="refWms" v-if="form.layerType === 'WMS'" />
            </el-collapse-item>
          </el-collapse>
          <!-- <el-form-item label-width="0">
            <el-checkbox v-model="isGis">GIS服务设置</el-checkbox>
          </el-form-item> -->
        </div>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="hide">取 消</el-button>
        <el-button class="blueBtn" type="primary" @click="submit" :loading="loading">确 定</el-button>
      </span>
    </el-dialog>
    <DialogsLayser ref="DialogsLayser" @onLayerSuccess="onLayerSuccess" />
  </div>
</template>

<script>
import { gisPluginList, gisSuperMapList, gisLayer } from './json'
import { getDict } from '@/api/dict.js'
import { Getuserid } from '@/store/index.js'
import { addGISLayerServer, editGISLayerServer } from '@/api/projectManage/GISList.js'
import SingleUpload from '@/components/Upload/singleUpload.vue'
import DialogsLayser from './dialogsLayser.vue'
import PartTiles from './PartTiles.vue'
import PartWMTS from './PartWMTS.vue'
import PartTms from './PartTms.vue'
import PartWMS from './PartWMS.vue'

export default {
  components: {
    SingleUpload, DialogsLayser,
    PartTiles, PartWMTS,
    PartTms, PartWMS
  },
  props: {},
  data() {
    return {
      activeName: '',
      gisPluginList,
      dialogVisible: false,
      title: '新建',
      isGis: false,
      form: {
        gisPlugin: 'cesium',
        ourGISLayerList: [],
        gisSuperMapInfo: null,
        gisTerrain: null,
        layerType: null,
        fileUrl: null,
        longitude: null,
        latitude: null,
        altitude: null
      },
      layerTypeList: [],
      rules: {
        gisServerName: [{ required: true, message: '请输入项目名称', trigger: 'blur' }],
        gisPlugin: [{ required: true, message: '请选择服务支持组件', trigger: 'blur' }],
        fileUrl: [
          {
            required: true,
            message: '请选择服务地址',
            trigger: 'blur'
          }
        ],
        layerType: [
          {
            required: true,
            message: '请选择服务类型',
            trigger: 'blur'
          }
        ],
        longitude: [
          {
            required: true,
            message: '请输入经度(-180°~180°)',
            trigger: 'blur'
          }
        ],
        latitude: [
          {
            required: true,
            message: '请输入纬度(-90°~90°)',
            trigger: 'blur'
          }
        ],
        altitude: [
          {
            required: true,
            message: '请输入海拔高度',
            trigger: 'blur'
          }
        ],
      },
      doMouseList: [], //鼠标操作模式
      displayWindowList: [], //窗口显示模式
      // gisCoordinateTypeList: [],//GIS坐标系
      loading: false,
      mapInfoList: [],//底图
    }
  },
  watch: {},
  computed: {},
  created() { },
  mounted() {
    this.getType()
    this.changeGisPlugin(this.form.gisPlugin)
  },
  methods: {
    // 切换服务组件
    changeGisPlugin(val) {
      this.form.layerType = ''
      this.layerTypeList = gisLayer.filter(e => { return e.type === val })
    },
    show(title, row) {
      console.log(title, JSON.parse(JSON.stringify(row)))
      this.title = title
      this.isGis = false
      this.form = this.$options.data().form
      this.dialogVisible = true
      this.getGisPlugin()
      this.$nextTick(() => {
        this.$refs.form.clearValidate()
        if (row.id) {
          this.form = { ...this.form, ...row }
          this.form.ourGISLayerList = (row.urlList && JSON.parse(row.urlList)) || []
          if (row.gisSuperMapInfo) {
            this.form.gisSuperMapInfo = row.gisSuperMapInfo.split(",")
          }
          this.isGis = true;
          this.$nextTick(() => {
            const { layerType } = row;
            if (layerType === 'WMTS') {
              // this.$refs.refWMTS.form = row
            }
            if (layerType === 'TMS') {
              // this.$refs.refTms.form = row
            }
            if (layerType === 'WMS') {
              this.$refs.refWms.form = row
            }
            if (layerType === '3dtiles') {
              const { transform } = row
              let realList = transform.split('|')
              const realObj = {}
              realList.forEach((ele, index) => {
                let realArr = ele.split(',')
                if (index === 0) {
                  realObj.q = realArr[0]
                  realObj.w = realArr[1]
                  realObj.e = realArr[2]
                } else if (index === 1) {
                  realObj.a = realArr[0]
                  realObj.s = realArr[1]
                  realObj.d = realArr[2]
                } else {
                  realObj.z = realArr[0]
                  realObj.x = realArr[1]
                  realObj.c = realArr[2]
                }
              });
              // console.log(realObj);
              this.$refs.refTiles.form = realObj
            }
          })
        }
      })
    },
    hide() {
      this.dialogVisible = false
    },
    async getType() {
      this.doMouseList = (await getDict('doMouse')).data
      this.displayWindowList = (await getDict('displayWindow')).data
      // this.gisCoordinateTypeList = (await getDict('gisCoordinateType')).data
    },
    getGisPlugin() {
      this.mapInfoList = gisSuperMapList.filter(e => { return e.type === this.form.gisPlugin })
    },
    //添加、编辑图层
    addLayer(title, row = {}, i) {
      this.$refs.DialogsLayser.show(title, { ...row, index: i }, this.form.gisPlugin)
    },
    // 图层添加到列表里面
    onLayerSuccess(data) {
      if (data.index >= 0) {
        this.$set(this.form.ourGISLayerList, data.index, data)
        this.$forceUpdate()
      } else {
        this.form.ourGISLayerList.push(data)
      }
    },
    // 删除图层
    deleteLayer(row, i) {
      this.$confirm(`删除【${row.gisServerName}】后无法恢复，确认是否删除？`, '删除GIS图层', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        closeOnClickModal: false,
        type: 'warning'
      })
        .then(() => {
          this.form.ourGISLayerList.splice(i, 1)
        })
        .catch(() => { })
    },
    submit() {
      this.$refs.form.validate(valid => {
        if (!valid) return false
        this.loading = true
        let params = {}
        if (this.$refs.refTiles) {
          console.log('refTiles')
          const { q, w, e, a, s, d, z, x, c } = this.$refs.refTiles.form
          params.transform = `${q},${w},${e}|${a},${s},${d}|${z},${x},${c}`
        }
        if (this.$refs.refWMTS) {
          const formWmts = this.$refs.refWMTS.form
          params = {
            ...formWmts
          }
        }
        if (this.$refs.refTms) {
          console.log('refTms')
          const formTms = this.$refs.refTms.form
          params = {
            ...formTms
          }
        }
        if (this.$refs.refWms) {
          console.log('refWms')
          const formWms = this.$refs.refWms.form
          params = {
            ...formWms
          }
        }
        if (this.form.id) {
          const data = {
            ...this.form,
            ...params,
            userId: Getuserid(),
          }
          console.log('this.form', this.form)
          console.log('params', params)
          console.log('data', data)
          let formData = new FormData()
          for (const key in data) {
            formData.append([key], data[key])
          }
          editGISLayerServer(formData).then(res => {
            this.$parent.$parent.getList()
            this.$message.success('编辑成功！')
            this.hide()
            this.loading = false
          }).catch(() => {
            this.loading = false
          })
        } else {
          let data = {
            userId: Getuserid(),
            gisServerName: this.form.gisServerName,
            thumbnail: this.form.thumbnail,
            gisPlugin: this.form.gisPlugin,
            layerType: this.form.layerType,
            gisSuperMapInfo: this.form.gisSuperMapInfo,
            gisTerrain: this.form.gisTerrain,
            fileUrl: this.form.fileUrl,
            longitude: this.form.longitude,
            latitude: this.form.latitude,
            altitude: this.form.altitude,
            ...params
          }
          addGISLayerServer(data).then(res => {
            this.$parent.$parent.getList()
            this.$message.success('创建成功！')
            this.hide()
            this.loading = false
          }).catch(() => {
            this.loading = false
          })
        }
      })
    }
  }
}
</script>
<style lang="less" scoped>
.GISLayer {
  margin-top: 20px;
}

/deep/ .el-table .el-table__cell {
  text-align: left;
}

/deep/ .el-table tr {
  background: #fcfcfc;
}
</style>
