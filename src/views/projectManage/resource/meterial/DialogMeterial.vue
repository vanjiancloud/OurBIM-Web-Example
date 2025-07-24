<!-- 上传\编辑材质 -->
<template>
  <el-dialog :title="title + '材质球'" :visible.sync="dialogVisible" :close-on-click-modal="false" append-to-body
    width="580px" :before-close="hide">
    <el-form ref="form" class="form" :model="form" :rules="rules" label-width="118px" size="mini">
      <el-row>
        <!-- 基础信息 -->
        <el-form-item label="材质名称:" prop="matName">
          <el-input v-model="form.matName" @keydown.native.stop></el-input>
        </el-form-item>
        <el-form-item label="材质分组:" prop="parentId" v-if="form.matId">
          <el-select v-model="form.parentId" placeholder="请选择分组" style="width:100%" clearable>
            <el-option v-for="(item, index) in parentData" :key="index" :label="item.groupName"
              :value="item.groupId"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="选择材质模板:" prop="materialTemplate">
          <el-select v-model="form.materialTemplate" placeholder="请选择材质模板" style="width:100%"
            @change="materialTemplateChange" clearable>
            <el-option v-for="(item, index) in materialTemplateList" :key="index" :label="item.label"
              :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="材质缩略图:" prop="fileUpload">
          <SingleUpload v-model="form.fileUpload" :autoUpload="false" accept="image/png"></SingleUpload>
        </el-form-item>
        <!-- 颜色部分 -->
        <el-col :span="24"
          v-if="form.matParam.colorList && form.matParam.colorList.some(a => ['BaseColor', 'EmissionColor'].includes(a.paramName))">
          <el-form-item label="颜色" class="block_title">
          </el-form-item>
        </el-col>
        <el-col :span="12" v-for="(color, index) in form.matParam.colorList" :key="color.paramName"
          v-if="['BaseColor', 'EmissionColor'].includes(color.paramName) && typeof color.paramValue === 'string'">
          <el-form-item :prop="color.paramName">
            <div slot="label">
              <span v-if="color.paramName == 'BaseColor'">基础颜色:</span>
              <span v-if="color.paramName == 'EmissionColor'">自发光颜色:</span>
            </div>
            <el-color-picker class="color_picker" v-model="color.paramValue" color-format="rgb"
              show-alpha></el-color-picker>
          </el-form-item>
        </el-col>
        <!-- 贴图部分 -->
        <el-col :span="24"
          v-if="form.matParam.texturesList && form.matParam.texturesList.some(a => ['BaseColorMap', 'MetallicMap', 'RoughnessMap', 'EmissionMap', 'NormalMap'].includes(a.paramName))">
          <el-form-item label="贴图" class="block_title">
          </el-form-item>
        </el-col>
        <el-col :span="12" class="chartlet" v-for="(texture, index) in form.matParam.texturesList"
          :key="texture.paramName"
          v-if="['BaseColorMap', 'MetallicMap', 'RoughnessMap', 'EmissionMap', 'NormalMap'].includes(texture.paramName)">
          <el-form-item :prop="texture.paramName">
            <div slot="label">
              <span v-if="texture.paramName == 'BaseColorMap'" class="label">基础颜色贴图:</span>
              <span v-if="texture.paramName == 'MetallicMap'" class="label">金属度贴图:</span>
              <span v-if="texture.paramName == 'RoughnessMap'" class="label">粗糙度贴图:</span>
              <span v-if="texture.paramName == 'EmissionMap'" class="label">自发光贴图:</span>
              <span v-if="texture.paramName == 'NormalMap'" class="label">法线贴图:</span>
            </div>
            <MapsPop v-model="texture.paramValue" />
          </el-form-item>
        </el-col>
        <!-- 贴图位置部分 -->
        <el-col :span="24" v-if="form.matParam.textureParamsList && form.matParam.textureParamsList.length > 0">
          <el-form-item label="贴图位置" class="block_title">
          </el-form-item>
        </el-col>
        <el-col :span="24" v-for="(item, index) in form.matParam.textureParamsList" :key="item.paramName">
          <div v-if="!item.hasOwnProperty('enableEdit') || item.enableEdit != 'false'">
            <el-form-item v-if="item.label === '等比缩放'" label="等比缩放" :prop="item.paramName">
              <el-switch v-model="item.paramValue" :active-value="1" :inactive-value="0" active-color="#409EFF"
                inactive-color="#727272">
              </el-switch>
            </el-form-item>
            <el-form-item
              v-else-if="((filterTexturesList('等比缩放') == 1 && item.label !== '纵向缩放' && item.label !== '横向缩放') || (filterTexturesList('等比缩放') == 0 && item.label !== '缩放'))"
              :label="item.label" :prop="item.paramName">
              <div class="slider-input-group">
                <el-slider v-model="item.paramValue1" :max="Number(item.max)" :min="Number(item.min)"
                  :step="Number(item.min) <= 0 ? 0.1 : ((Number(item.min) <= 0.01) ? 0.01 : 1)"
                  @change="syncSliderToParam(item)">
                </el-slider>
                <el-input v-model="item.paramValue" type="number" style="width: 80px; margin-left: 10px;"
                  @change="syncParamToSlider(item)"></el-input>
              </div>
            </el-form-item>
          </div>
        </el-col>
        <!-- 材质效果属性 -->
        <el-col :span="24" v-if="form.matParam.baseParamsList && form.matParam.baseParamsList.length > 0">
          <el-form-item label="材质效果属性" class="block_title">
          </el-form-item>
        </el-col>
        <el-col :span="24" v-for="(item, index) in form.matParam.baseParamsList" :key="item.paramName">
          <div class="materialSlider" v-if="!item.hasOwnProperty('enableEdit') || item.enableEdit != 'false'">
            <el-form-item :label="item.label" :prop="item.paramName">
              <div class="slider-input-group">
                <el-slider v-model="item.paramValue1" :max="Number(item.max)" :min="Number(item.min)"
                  :step="Number(item.min) <= 0 ? 0.1 : ((Number(item.min) <= 0.01) ? 0.01 : 1)"
                  @change="syncSliderToParam(item)">
                </el-slider>
                <el-input v-model="item.paramValue" type="number" style="width: 80px; margin-left: 10px;"
                  @change="syncParamToSlider(item)"></el-input>
              </div>
            </el-form-item>
          </div>
        </el-col>
      </el-row>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="hide()">取 消</el-button>
      <el-button type="primary" @click="submit()">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { Getuserid } from "@/store/index.js";
import SingleUpload from '@/components/Upload/singleUpload.vue'
import { selectCustomizeMaterialGroup, addCustomizeMaterial, updateCustomizeMaterial, updateCustomizeMaterialByTask } from '@/api/resource/material.js'
import MapsPop from "./mapsPop.vue";
// import config from '../../../../../server.config';
import { rgbaToArray, arrayToRgba, array255ToRgba } from "@/utils/color.js";
import { template_noOpacity, template_opacity } from './template.js';

export default {
  components: { SingleUpload, MapsPop },
  // props: {
  //   parentData: {
  //     type: Array,
  //     default: () => []
  //   }
  // },
  data() {
    return {
      title: '',
      dialogVisible: false,
      form: {
        materialTemplate: '',//材质模板
        // 
        BaseColor: '',//基础色
        EmissionColor: '',//自发光颜色
        BaseColorMap: null,//基础颜色贴图
        MetallicMap: null,//金属度贴图
        RoughnessMap: null,//粗糙度贴图
        NormalMap: null,//法线贴图
        EmissionMap: null,//自发光贴图
        SwitchProportionalScale: '0',//是否等比缩放
        slider1: 0,
        UVOffset_X: 0,//横向偏移
        UVOffset_Y: 0,//纵向偏移
        UVRotation: 0,//角度
        UVScale: 1,//缩放
        UVScale_X: 1,//横向缩放
        UVScale_Y: 1,//纵向缩放
        Opacity: 0.5,//透明度
        Metallic: 0,//金属度
        Roughness: 1,//粗糙度
        Emission: 0,//自发光强度
        Normal: 1,//法线强度
        // fileUpload: 'https://api.ourbim.com:11023/vjapi/material/5027a25fbbe24016eea1dc67eb411cff.jpg',
        matParam: {},
      },
      rules: {
        matName: [
          { required: true, message: '请输入名称', trigger: 'blur' }
        ],
        // fileUpload: [{ required: true, message: '请上传材质文件', trigger: 'blur' }],
        parentId: [
          { required: false, message: '请选择分组', trigger: 'blur' }
        ],
        materialTemplate: [
          { required: false, message: '请选择材质模板', trigger: 'blur' }
        ],
      },
      materialTemplateList: [
        { value: '0', label: '不透明' },
        { value: '1', label: '半透明' },
        { value: '2', label: '双面不透明' },
        { value: '3', label: '双面半透明' },
      ],
      parentData: [],
    }
  },
  watch: {},
  computed: {},
  created() { },
  mounted() {
    this.getGroupList()
  },
  methods: {
    syncSliderToParam(item) {
      item.paramValue = Number(item.paramValue1)
    },
    syncParamToSlider(item) {
      item.paramValue1 = Number(item.paramValue)
    },
    filterTexturesList(type) {
      let res = this.form.matParam.textureParamsList.find(e => { return e.label === type })
      return res && res.paramValue
    },
    getGroupList() {
      let params = {
        userId: Getuserid()
      }
      selectCustomizeMaterialGroup(params).then(res => {
        this.parentData = res.data || []
      })
    },
    show(row) {
      this.form = this.$options.data().form
      this.dialogVisible = true
      this.$nextTick(() => {
        this.$refs.form.clearValidate()
        let matParam = row.matParam ? JSON.parse(row.matParam) : template_noOpacity;
        this.form = {
          ...this.form,
          ...row,
          matParam: this.formatMatParam(matParam),
        };
        if (row.matId) {
          this.title = '编辑'
          this.$set(this.form, 'fileUpload', row.matImgPath)
        } else {
          this.title = '新建'
        }
      })
    },
    // type == 1 接收参数 格式化
    // type == 2 提交参数 格式化
    formatMatParam(matParam, type = 1) {
      if (type == 1) {
        return {
          ...matParam,
          colorList: matParam.colorList ? matParam.colorList.map(color => {
            color.paramValue = array255ToRgba(color.paramValue)
            return color
          }) : [],
          textureParamsList: matParam.textureParamsList ? matParam.textureParamsList.map(item => {
            if (item.controlType == 'slide') {
              item.paramValue = Number(item.paramValue)
              item.paramValue1 = Number(item.paramValue)
            }
            return item
          }) : [],
          baseParamsList: matParam.baseParamsList ? matParam.baseParamsList.map(item => {
            if (item.controlType == 'slide') {
              item.paramValue = Number(item.paramValue)
              item.paramValue1 = Number(item.paramValue)
            }
            return item
          }) : [],
        }
      }
      if (type == 2) {
        return {
          ...matParam,
          colorList: matParam.colorList.map(color => {
            color.paramValue = rgbaToArray(color.paramValue)
            return color
          }),
        }
      }
    },
    materialTemplateChange(value) {
      this.form.matParam = this.formatMatParam(['1', '3'].includes(value) ? template_opacity : template_noOpacity)
    },
    hide() {
      this.dialogVisible = false
    },
    submit() {
      this.$refs.form.validate((valid) => {
        if (!valid) return false
        if (this.form.matId) {
          let data = {
            matId: this.form.matId,
            matName: this.form.matName,
            fileUpload: this.form.fileUpload || '',
            materialTemplate: this.form.materialTemplate || '',
            parentId: this.form.parentId,
            matParam: this.formatMatParam(this.form.matParam, 2),
          }
          const api = this.form?.tab2Index == 2 ? updateCustomizeMaterialByTask : updateCustomizeMaterial;
          if (this.form?.tab2Index == 2) {
            data.taskId = this.form.taskId
          }
          let formData = new FormData()
          for (const key in data) {
            if (key == 'matParam') {
              formData.append([key], JSON.stringify(data[key]))
            } else {
              formData.append([key], data[key])
            }
          }
          api(formData).then((res) => {
            this.$message.success('编辑成功')
            this.hide()
            this.$emit('reloadTable', this.form.groupId)
          })
        } else {
          let data = {
            userId: Getuserid(),
            matName: this.form.matName,
            isGroup: '1',
            parentId: this.form.groupId,
            fileUpload: this.form.fileUpload || '',
            materialTemplate: this.form.materialTemplate || '',
            matParam: this.formatMatParam(this.form.matParam, 2),
          }
          // console.log(data)
          let formData = new FormData()
          for (const key in data) {
            if (key == 'matParam') {
              formData.append([key], JSON.stringify(data[key]))
            } else {
              formData.append([key], data[key])
            }
          }
          addCustomizeMaterial(formData).then((res) => {
            this.$message.success(res.message)
            this.hide()
            this.$emit('reloadTable', this.form.groupId)
          })
        }
      })
    }
  }
}
</script>
<style lang="less" scoped>
// /deep/.form{
//   &.el-input{
//     width: 100%;
//   }
// }
.color_picker {
  height: 60px;
  width: 60px;

  /deep/.el-color-picker__trigger {
    height: 100%;
    width: 100%;
  }
}

.slider-input-group {
  display: flex;
  align-items: center;

  .el-slider {
    flex: 1;
    margin-right: 10px;
  }

  /deep/.el-input {
    flex: 0 0 80px;

    .el-input__inner {
      padding-right: 0px;
    }
  }

}

/deep/.block_title {
  .el-form-item__label {
    font-size: 15px;
    font-weight: 600;
    color: #333;
  }
}
</style>