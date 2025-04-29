<!--
 * @Autor: zk
 * @Date: 2024-08-23 19:46:00
 * @LastEditors: zk
 * @LastEditTime: 2024-10-11 21:32:21
 * @Description: 
-->
<template>
  <div>
    <el-dialog :title="title + 'GIS服务'" :visible.sync="dialogVisible" append-to-body width="50%" :before-close="hide"
      :close-on-click-modal="false" top="10vh">
      <el-form :model="form" :rules="rules" ref="form" label-width="140px">
        <el-form-item label="服务名称：" prop="gisServerName">
          <el-input v-model="form.gisServerName" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="服务类型：" prop="layerType">
          <el-select v-model="form.layerType" placeholder="请选择" style="width:100%">
            <el-option :value="item.key" v-for="(item, index) in layerTypeList" :key="index"
              :label="item.name"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="服务地址：" prop="fileUrl">
          <el-input v-model="form.fileUrl" placeholder="请输入服务地址"></el-input>
        </el-form-item>
        <div v-if="form.layerType !== 'terrain' && form.layerType">
          <el-collapse v-model="activeName" accordion>
            <el-collapse-item title="GIS服务设置" name="1">
              <!-- 3Dtiles -->
              <part-tiles ref="refTiles" v-if="form.layerType === '3dtiles'" />
              <!-- WMTS -->
              <part-WMTS ref="refWMTS" v-if="form.layerType === 'WMTS'" :receiveData="form" />
              <!-- TMS -->
              <part-tms ref="refTms" v-if="form.layerType === 'TMS'" :receiveData="form"/>
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
  </div>
</template>

<script>
import { gisPluginList, gisSuperMapList, gisLayer } from '../GISList/json'
import { getDict } from '@/api/dict.js'
import { Getuserid } from '@/store/index.js'
import { updateProject } from '@/api/projectManage/model.js'
import PartTiles from '../GISList/PartTiles.vue'
import PartWMTS from '../GISList/PartWMTS.vue'
import PartTms from '../GISList/PartTms.vue'
import PartWMS from '../GISList/PartWMS.vue'

export default {
  components: {
    PartTiles, PartWMTS,
    PartTms, PartWMS
  },
  props: {
    modelObj: {
      type: Object,
      default: () => { return {} }
    }
  },
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
        layerType: null,
        fileUrl: null,
        longitude: null,
        latitude: null,
        altitude: null
      },
      gisServerMsgList: [],
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
      mapInfoList: [],//底图,
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
    show(title, row, gisServerMsgList) {
      this.title = title
      this.isGis = false
      this.form = this.$options.data().form
      this.dialogVisible = true
      this.getGisPlugin()
      this.$nextTick(() => {
        this.$refs.form.clearValidate()
        if (row.gisId) {
          this.gisServerMsgList = gisServerMsgList
          this.form = row
          this.form.ourGISLayerList = (row.urlList && JSON.parse(row.urlList)) || []
          // if (row.gisSuperMapInfo) {
          //   this.form.gisSuperMapInfo = row.gisSuperMapInfo.split(",") || []
          // }
          if (Object.prototype.toString.call(row.gisSuperMapInfo) == '[object String]') {
            this.form.gisSuperMapInfo = row.gisSuperMapInfo.split(",") || []
          }
          this.isGis = true
        }
        this.$nextTick(() => {
          const { layerType } = row
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
          const formTms = this.$refs.refTms.form
          params = {
            ...formTms
          }
        }
        if (this.$refs.refWms) {
          const formWms = this.$refs.refWms.form
          params = {
            ...formWms
          }
        }
        if (this.form.gisId) {
          let msgList = this.gisServerMsgList.filter(item => item.gisId !== this.form.gisId)
          msgList.push({
            ...this.form,
            ...params,
          })
          // const data = {
          //     gisServerMsgList: msgList
          // }
          const formData = new FormData();
          formData.append('gisServerMsgList', JSON.stringify(msgList));
          const obj = {
            // appid: this.modelObj.appid
            ...this.modelObj,
            // 如果不是链接模型,这里的数据就需要传对象,链接模型则需要传数组
            gisInfo: this.modelObj.appType !== '3' ? JSON.stringify(this.modelObj.gisInfo?.[0]) : JSON.stringify(this.modelObj.gisInfo),
            combineId: this.modelObj.gisInfo && this.modelObj.gisInfo.map(e => e.appId).join(',') || '',
            gisServerList: this.modelObj.gisServerMap && Object.keys(this.modelObj.gisServerMap).join(',') || '',
            gisSuperMapInfo: this.modelObj?.gisSuperMapInfo.join(',') || '',
          }
          delete obj.gisServerMap
          delete obj.sonAppMap
          delete obj.gisServerMsgList
          updateProject(obj, formData).then(res => {
            this.$emit('editSucess')
            this.$message.success('编辑成功！')
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
