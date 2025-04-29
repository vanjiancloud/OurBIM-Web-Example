<template>
  <div>
    <el-row>
      <el-col :span="8">
        <el-form-item label="图层顺序">
          <el-input v-model.number="form.materialLayerKey"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label-width="80px" label="样式">
          <el-input v-model="form.style"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label-width="80px" label="格式">
          <el-input v-model="form.format"></el-input>
        </el-form-item>
      </el-col>
    </el-row>
    <el-form-item label-width="0">
      <div class="box-flex">
        <el-checkbox v-model="form.bspecifyTileMatrixSetLabels">指定瓦片矩阵集合标签</el-checkbox>
        <el-input v-if="form.bspecifyTileMatrixSetLabels" v-model="form.tileMatrixSetLabels"></el-input>
      </div>
    </el-form-item>
    <el-form-item v-if="!form.bspecifyTileMatrixSetLabels" label-width="160px" label="瓦片矩阵集合标签前缀">
      <el-input v-model="form.tileMatrixSetLabelPrefix"></el-input>
    </el-form-item>
    <el-form-item label="投影模式">
      <el-select v-model="form.projection" placeholder="请选择">
        <el-option v-for="item in listProjection" :key="item.value" :label="item.label" :value="item.value">
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="瓦片像素尺寸">
      <el-col class="GISMark" :span="1">X</el-col>
      <el-col :span="11">
        <el-form-item>
          <el-input v-model="form.tileWidth" placeholder="X"></el-input>
        </el-form-item>
      </el-col>
      <el-col class="GISMark" :span="1">Y</el-col>
      <el-col :span="11">
        <el-form-item>
          <el-input v-model="form.tileHeight" placeholder="Y"></el-input>
        </el-form-item>
      </el-col>
    </el-form-item>
    <el-form-item label-width="0">
      <el-checkbox v-model="form.bspecifyTilingScheme">指定瓦片平铺方案</el-checkbox>
    </el-form-item>
    <el-form-item label="根级别瓦片数量">
      <el-col class="GISMark" :span="1">X</el-col>
      <el-col :span="11">
        <el-form-item>
          <el-input v-model="form.roottilesX" placeholder="X"></el-input>
        </el-form-item>
      </el-col>
      <el-col class="GISMark" :span="1">Y</el-col>
      <el-col :span="11">
        <el-form-item>
          <el-input v-model="form.roottilesY" placeholder="Y"></el-input>
        </el-form-item>
      </el-col>
    </el-form-item>
    <el-form-item label="经度范围">
      <el-col class="GISMark" :span="1">W</el-col>
      <el-col :span="11">
        <el-form-item>
          <el-input v-model="form.rectangleWest" placeholder="w"></el-input>
        </el-form-item>
      </el-col>
      <el-col class="GISMark" :span="1">E</el-col>
      <el-col :span="11">
        <el-form-item>
          <el-input v-model="form.rectangleEast" placeholder="E"></el-input>
        </el-form-item>
      </el-col>
    </el-form-item>
    <el-form-item label="纬度范围">
      <el-col class="GISMark" :span="1">S</el-col>
      <el-col :span="11">
        <el-form-item>
          <el-input v-model="form.rectangleSouth" placeholder="S"></el-input>
        </el-form-item>
      </el-col>
      <el-col class="GISMark" :span="1">N</el-col>
      <el-col :span="11">
        <el-form-item>
          <el-input v-model="form.rectangleNorth" placeholder="N"></el-input>
        </el-form-item>
      </el-col>
    </el-form-item>
    <el-form-item label-width="0">
      <el-checkbox v-model="form.bspecifyZoomLevels">指定缩放级别</el-checkbox>
    </el-form-item>
    <el-form-item label-width="0">
      <el-col class="GISMark" :span="2">Min</el-col>
      <el-col :span="10">
        <el-form-item>
          <el-input :disabled="!form.bspecifyZoomLevels" v-model="form.minLevel" placeholder="Min"></el-input>
        </el-form-item>
      </el-col>
      <el-col class="GISMark" :span="2">Max</el-col>
      <el-col :span="10">
        <el-form-item>
          <el-input :disabled="!form.bspecifyZoomLevels" v-model="form.maxLevel" placeholder="Max"></el-input>
        </el-form-item>
      </el-col>
    </el-form-item>
  </div>
</template>

<script>
export default {
  props: {
    receiveData: {
      type: Object,
      default: () => ({}),
    }
  },
  data() {
    return {
      form: {
        style: null,
        format: 'image/jpeg',
        bspecifyTileMatrixSetLabels: false,
        tileMatrixSetLabels: "",
        tileMatrixSetLabelPrefix: "",
        projection: 'webMercator',
        tileWidth: '256',
        tileHeight: '256',
        bspecifyTilingScheme: false,
        roottilesX: null,
        roottilesY: null,
        rectangleWest: null,
        rectangleEast: null,
        rectangleSouth: null,
        rectangleNorth: null,
        bspecifyZoomLevels: false,
        minLevel: 0,
        maxLevel: 14,
        materialLayerKey: 0
      },
      listProjection: [
        {
          value: 'webMercator',
          label: '墨卡托投影'
        },
        {
          value: 'geographic',
          label: '经纬度投影'
        }
      ]
    }
  },
  watch: {
    // initData: {
    //   handler(newVal, oldVal) {
    //     if(newVal){
    //       this.form = {
    //         ...newVal,
    //         bspecifyTileMatrixSetLabels: newVal.bspecifyTileMatrixSetLabels === 'false' ? false : true,
    //         bspecifyTilingScheme: newVal.bspecifyTilingScheme === 'false' ? false : true,
    //         bspecifyZoomLevels: newVal.bspecifyZoomLevels === 'false' ? false : true,
    //       }
    //     }
    //   },
    //   deep: true,
    //   immediate: true
    // }
  },
  created() {
    // console.log(this.$data)
    // 过滤掉子组件未定义的属性
    this.$nextTick(() => {
      const validKeys = Object.keys(this.$data.form);
      console.log('receiveData',this.receiveData)
      validKeys.forEach(key => {
        if (this.receiveData.hasOwnProperty(key)) {
          if (['bspecifyTileMatrixSetLabels', 'bspecifyTilingScheme', 'bspecifyZoomLevels'].includes(key)) {
            this.form[key] = this.receiveData[key] === 'false' ? false : true
          } else {
            this.form[key] = this.receiveData[key];
          }
        }
      });
      // console.log(this.form)
    })
  },
  methods: {
    setFormData(d) {
      this.form = d
    }
  },
}
</script>

<style lang="less" scoped>
.box-flex {
  display: flex;

  .el-input {
    margin-left: 20px;
  }
}

</style>