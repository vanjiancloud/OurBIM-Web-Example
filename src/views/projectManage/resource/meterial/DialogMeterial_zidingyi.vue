<!-- 上传\编辑材质 -->
<template>
  <el-dialog :title="title + '材质球'" :visible.sync="dialogVisible" :close-on-click-modal="false" append-to-body
    width="580px" :before-close="hide">
    <el-form ref="form" class="form" :model="form" :rules="rules" label-width="118px" size="mini">
      <el-row>
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
          <el-select v-model="form.materialTemplate" placeholder="请选择材质模板" style="width:100%" clearable>
            <el-option v-for="(item, index) in materialTemplateList" :key="index" :label="item.label"
              :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="材质缩略图:" prop="fileUpload">
          <SingleUpload v-model="form.fileUpload" :autoUpload="false" accept="image/png"></SingleUpload>
        </el-form-item>
        <el-col :span="24">
          <el-form-item label-width="0" prop="baseColorCheck">
            <el-checkbox v-model="form.baseColorCheck">基础色</el-checkbox>
          </el-form-item>
        </el-col>
        <template v-if="form.baseColorCheck">
          <el-col :span="12">
            <el-form-item label="颜色" prop="BaseColor">
              <el-color-picker v-model="form.BaseColor" class="color_picker" color-format="rgb"
                show-alpha></el-color-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="基础颜色贴图" prop="BaseColorMap">
              <MapsPop v-model="form.BaseColorMap" />
            </el-form-item>
          </el-col>
          <el-col :span="24" v-if="form.materialTemplate == '1' || form.materialTemplate == '3'">
            <el-form-item label="透明度" prop="Opacity">
              <el-slider v-model="form.Opacity" :min="0" :max="1" :step="0.01" show-input>
              </el-slider>
            </el-form-item>
          </el-col>
        </template>
        <el-col :span="24">
          <el-form-item label-width="0" prop="MetallicCheck">
            <el-checkbox v-model="form.MetallicCheck">金属度</el-checkbox>
          </el-form-item>
        </el-col>
        <template v-if="form.MetallicCheck">
          <el-col :span="24">
            <el-form-item label="金属度" prop="Metallic">
              <el-slider v-model="form.Metallic" :min="0" :max="1" :step="0.01" show-input>
              </el-slider>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="金属度贴图" prop="MetallicMap">
              <MapsPop v-model="form.MetallicMap" />
            </el-form-item>
          </el-col>
        </template>
        <el-col :span="24">
          <el-form-item label-width="0" prop="RoughnessCheck">
            <el-checkbox v-model="form.RoughnessCheck">粗糙度</el-checkbox>
          </el-form-item>
        </el-col>
        <template v-if="form.RoughnessCheck">
          <el-col :span="24">
            <el-form-item label="粗糙度" prop="Roughness">
              <el-slider v-model="form.Roughness" :min="0" :max="2" :step="0.01" show-input>
              </el-slider>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="粗糙度贴图" prop="RoughnessMap">
              <MapsPop v-model="form.RoughnessMap" />
            </el-form-item>
          </el-col>
        </template>
        <el-col :span="24">
          <el-form-item label-width="0" prop="EmissionCheck">
            <el-checkbox v-model="form.EmissionCheck">自发光</el-checkbox>
          </el-form-item>
        </el-col>
        <template v-if="form.EmissionCheck">
          <el-col :span="24">
            <el-form-item label="自发光强度" prop="Emission">
              <el-slider v-model="form.Emission" :min="0" :max="1" :step="0.01" show-input>
              </el-slider>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="自发光颜色" prop="EmissionColor">
              <el-color-picker v-model="form.EmissionColor" class="color_picker" color-format="rgb"
                show-alpha></el-color-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="自发光贴图" prop="EmissionMap">
              <MapsPop v-model="form.EmissionMap" />
            </el-form-item>
          </el-col>
        </template>
        <el-col :span="24">
          <el-form-item label-width="0" prop="NormalCheck">
            <el-checkbox v-model="form.NormalCheck">法线</el-checkbox>
          </el-form-item>
        </el-col>
        <template v-if="form.NormalCheck">
          <el-col :span="24">
            <el-form-item label="法线强度" prop="Normal">
              <el-slider v-model="form.Normal" :min="-2" :max="2" :step="0.01" show-input>
              </el-slider>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="法线贴图" prop="NormalMap">
              <MapsPop v-model="form.NormalMap" />
            </el-form-item>
          </el-col>
        </template>
        <el-col :span="24">
          <el-form-item label-width="0" prop="MapsCheck">
            <el-checkbox v-model="form.MapsCheck">贴图位置</el-checkbox>
          </el-form-item>
        </el-col>
        <template v-if="form.MapsCheck">
          <el-col :span="24">
            <el-form-item label="等比缩放" prop="SwitchProportionalScale">
              <el-switch v-model="form.SwitchProportionalScale" active-value="1" inactive-value="0">
              </el-switch>
            </el-form-item>
          </el-col>
          <template v-if="form.SwitchProportionalScale == '1'">
            <el-col :span="24">
              <el-form-item label="缩放" prop="UVScale">
                <el-slider v-model="form.UVScale" :min="0.5" :max="2" :step="0.01" show-input>
                </el-slider>
              </el-form-item>
            </el-col>
          </template>
          <template v-else>
            <el-col :span="24">
              <el-form-item label="横向缩放" prop="UVScale_X">
                <el-slider v-model="form.UVScale_X" :min="0.5" :max="2" :step="0.01" show-input>
                </el-slider>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="纵向缩放" prop="UVScale_Y">
                <el-slider v-model="form.UVScale_Y" :min="0.5" :max="2" :step="0.01" show-input>
                </el-slider>
              </el-form-item>
            </el-col>
          </template>
          <el-col :span="24">
            <el-form-item label="角度" prop="UVRotation">
              <el-slider v-model="form.UVRotation" :min="0" :max="360" :step="0.01" show-input>
              </el-slider>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="横向偏移" prop="UVOffset_X">
              <el-slider v-model="form.UVOffset_X" :min="0" :max="1" :step="0.01" show-input>
              </el-slider>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="纵向偏移" prop="UVOffset_Y">
              <el-slider v-model="form.UVOffset_Y" :min="0" :max="1" :step="0.01" show-input>
              </el-slider>
              <!-- <input type="number" v-model.trim.number="form.UVOffset_Y1" style="width:70px;height: 23px;margin-left: 20px;"/> -->
            </el-form-item>
          </el-col>
        </template>
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
import { selectCustomizeMaterialGroup, addCustomizeMaterial, updateCustomizeMaterial } from '@/api/resource/material.js'
import MapsPop from "./mapsPop.vue";
import config from '../../../../../server.config';
import { rgbaToArray, arrayToRgba } from "@/utils/color.js";

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

        baseColorCheck: true,//基础色check
        MetallicCheck: true,//金属度check
        RoughnessCheck: true,//粗糙度check
        EmissionCheck: true,//自发光check
        NormalCheck: true,//法线check
        MapsCheck: true,//贴图位置check
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
        let matParam = row.matParam ? JSON.parse(row.matParam) : {};
        this.form = {
          ...this.form,
          ...row,
          BaseColor: this.obj2findValue(matParam.vector, 'BaseColor'),
          EmissionColor: this.obj2findValue(matParam.vector, 'EmissionColor'),
          BaseColorMap: this.obj2findValue(matParam.texture, 'BaseColorMap'),
          MetallicMap: this.obj2findValue(matParam.texture, 'MetallicMap'),
          RoughnessMap: this.obj2findValue(matParam.texture, 'RoughnessMap'),
          NormalMap: this.obj2findValue(matParam.texture, 'NormalMap'),
          EmissionMap: this.obj2findValue(matParam.texture, 'EmissionMap'),
          SwitchProportionalScale: this.obj2findValue(matParam.scalar, 'SwitchProportionalScale'),
          UVOffset_X: this.obj2findValue(matParam.scalar, 'UVOffset_X'),
          UVOffset_Y: this.obj2findValue(matParam.scalar, 'UVOffset_Y'),
          UVRotation: this.obj2findValue(matParam.scalar, 'UVRotation'),
          UVScale: this.obj2findValue(matParam.scalar, 'UVScale'),
          UVScale_X: this.obj2findValue(matParam.scalar, 'UVScale_X'),
          UVScale_Y: this.obj2findValue(matParam.scalar, 'UVScale_Y'),
          Opacity: this.obj2findValue(matParam.scalar, 'Opacity'),
          Metallic: this.obj2findValue(matParam.scalar, 'Metallic'),
          Roughness: this.obj2findValue(matParam.scalar, 'Roughness'),
          Emission: this.obj2findValue(matParam.scalar, 'Emission'),
          Normal: this.obj2findValue(matParam.scalar, 'Normal'),
        };
        if (row.matId) {
          this.title = '编辑'
          this.$set(this.form, 'fileUpload', row.matImgPath)
        } else {
          this.title = '新建'
        }
      })
    },
    obj2findValue(obj, key) {
      // if (!obj) return null
      if (key == 'BaseColor' || key == 'EmissionColor') {
        return arrayToRgba(obj && obj.find(a => a.paramName == key)?.paramValue)
      }
      else if (key == 'UVRotation' || key == 'UVOffset_X' || key == 'UVOffset_Y' || key == 'Metallic' || key == 'Emission') {
        return obj ? Number(obj.find(a => a.paramName == key)?.paramValue) : 0
      }
      else if (key == 'UVScale_X' || key == 'UVScale_Y' || key == 'UVScale' || key == 'Roughness' || key == 'Normal') {
        return obj ? Number(obj.find(a => a.paramName == key)?.paramValue) : 1
      }
      else if (key == 'Opacity') {
        return obj ? Number(obj.find(a => a.paramName == key)?.paramValue) : 0.5
      }
      else if (key == 'BaseColorMap' || key == 'EmissionMap') {
        return obj ? obj.find(a => a.paramName == key)?.paramValue : config.VUE_APP_REQUEST_URL + '/userMaterialMap/Materials_PBR/T_White_Color.png'
      }
      else if (key == 'MetallicMap') {
        return obj ? obj.find(a => a.paramName == key)?.paramValue : config.VUE_APP_REQUEST_URL + '/userMaterialMap/Materials_PBR/T_White_Linear.png'
      }
      else if (key == 'RoughnessMap') {
        return obj ? obj.find(a => a.paramName == key)?.paramValue : config.VUE_APP_REQUEST_URL + '/userMaterialMap/Materials_PBR/T_MidGray_Linear.BMP'
      }
      else if (key == 'NormalMap') {
        return obj ? obj.find(a => a.paramName == key)?.paramValue : config.VUE_APP_REQUEST_URL + '/userMaterialMap/Materials_PBR/T_Flat_Normal.png'
      }
      else if (key == 'SwitchProportionalScale') {
        return obj ? obj.find(a => a.paramName == key)?.paramValue : '0'
      }
      else {
        return obj ? obj.find(a => a.paramName == key)?.paramValue : ''
      }
    },
    hide() {
      this.dialogVisible = false
    },
    submit() {
      this.$refs.form.validate((valid) => {
        if (!valid) return false
        // console.log(this.form)
        let matParam = {
          vector: [
            {
              paramName: "BaseColor",
              paramValue: rgbaToArray(this.form.BaseColor),
            },
            {
              paramName: "EmissionColor",
              paramValue: rgbaToArray(this.form.EmissionColor),
            },
          ],
          texture: [
            {
              paramName: "BaseColorMap",
              paramValue: this.form.BaseColorMap,
            },
            {
              paramName: "MetallicMap",
              paramValue: this.form.MetallicMap,
            },
            {
              paramName: "RoughnessMap",
              paramValue: this.form.RoughnessMap,
            },
            {
              paramName: "NormalMap",
              paramValue: this.form.NormalMap,
            },
            {
              paramName: "EmissionMap",
              paramValue: this.form.EmissionMap,
            },
          ],
          scalar: [
            {
              paramName: "SwitchProportionalScale",
              paramValue: this.form.SwitchProportionalScale,
            },
            {
              paramName: "UVOffset_X",
              paramValue: this.form.UVOffset_X,
            },
            {
              paramName: "UVOffset_Y",
              paramValue: this.form.UVOffset_Y,
            },
            {
              paramName: "UVRotation",
              paramValue: this.form.UVRotation,
            },
            {
              paramName: "UVScale",
              paramValue: this.form.UVScale,
            },
            {
              paramName: "UVScale_X",
              paramValue: this.form.UVScale_X,
            },
            {
              paramName: "UVScale_Y",
              paramValue: this.form.UVScale_Y,
            },
            {
              paramName: "Metallic",
              paramValue: this.form.Metallic,
            },
            {
              paramName: "Roughness",
              paramValue: this.form.Roughness,
            },
            {
              paramName: "Emission",
              paramValue: this.form.Emission,
            },
            {
              paramName: "Normal",
              paramValue: this.form.Normal,
            },
          ]
        }
        // 类型为半透明时传透明度
        if (this.form.materialTemplate == '1' || this.form.materialTemplate == '3') {
          matParam.scalar.push({
            paramName: "Opacity",
            paramValue: this.form.Opacity
          })
        }
        if (this.form.matId) {
          let data = {
            matId: this.form.matId,
            matName: this.form.matName,
            fileUpload: this.form.fileUpload,
            materialTemplate: this.form.materialTemplate,
            parentId: this.form.parentId,
            matParam,
          }
          let formData = new FormData()
          for (const key in data) {
            if (key == 'matParam') {
              formData.append([key], JSON.stringify(data[key]))
            } else {
              formData.append([key], data[key])
            }
          }
          updateCustomizeMaterial(formData).then((res) => {
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
            fileUpload: this.form.fileUpload,
            materialTemplate: this.form.materialTemplate,
            matParam,
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
</style>