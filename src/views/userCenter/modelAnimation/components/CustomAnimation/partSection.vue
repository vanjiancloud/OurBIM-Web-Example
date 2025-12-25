<template>
  <div class="part-section">
    <!-- 流动 -->
    <el-divider class="divider"></el-divider>
    <div class="section-title">剖切幅度设置</div>
    <el-row class="double-row">
      <el-col :span="12">
        <el-form-item label="初始值" label-width="58px">
          <i class="el-icon-refresh-right"></i>
        </el-form-item>
        <el-form-item label="上部剖面" :label-width="labelWidth">
          <el-input-number v-model="sectionForm.sectionTopStart" controls-position="right" size="mini"
            @keydown.native.stop></el-input-number>
        </el-form-item>
        <el-form-item label="下部剖面" :label-width="labelWidth">
          <el-input-number v-model="sectionForm.sectionBottomStart" controls-position="right" size="mini"
            @keydown.native.stop></el-input-number>
        </el-form-item>
        <el-form-item label="左部剖面" :label-width="labelWidth">
          <el-input-number v-model="sectionForm.sectionLeftStart" controls-position="right" size="mini"
            @keydown.native.stop></el-input-number>
        </el-form-item>
        <el-form-item label="右部剖面" :label-width="labelWidth">
          <el-input-number v-model="sectionForm.sectionRightStart" controls-position="right" size="mini"
            @keydown.native.stop></el-input-number>
        </el-form-item>
        <el-form-item label="前部剖面" :label-width="labelWidth">
          <el-input-number v-model="sectionForm.sectionFrontStart" controls-position="right" size="mini"
            @keydown.native.stop></el-input-number>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="结束值" label-width="58px">
          <i class="el-icon-refresh-right"></i>
        </el-form-item>
        <el-form-item label="上部剖面" :label-width="labelWidth">
          <el-input-number v-model="sectionForm.sectionTopEnd" controls-position="right" size="mini"
            @keydown.native.stop></el-input-number>
        </el-form-item>
        <el-form-item label="下部剖面" :label-width="labelWidth">
          <el-input-number v-model="sectionForm.sectionBottomEnd" controls-position="right" size="mini"
            @keydown.native.stop></el-input-number>
        </el-form-item>
        <el-form-item label="左部剖面" :label-width="labelWidth">
          <el-input-number v-model="sectionForm.sectionLeftEnd" controls-position="right" size="mini"
            @keydown.native.stop></el-input-number>
        </el-form-item>
        <el-form-item label="右部剖面" :label-width="labelWidth">
          <el-input-number v-model="sectionForm.sectionRightEnd" controls-position="right" size="mini"
            @keydown.native.stop></el-input-number>
        </el-form-item>
        <el-form-item label="前部剖面" :label-width="labelWidth">
          <el-input-number v-model="sectionForm.sectionFrontEnd" controls-position="right" size="mini"
            @keydown.native.stop></el-input-number>
        </el-form-item>
      </el-col>
    </el-row>
  </div>
</template>
<script>

export default {
  data() {
    return {
      labelWidth: '60px',
      sectionForm: {
        sectionTopStart: 0,
        sectionBottomStart: 0,
        sectionLeftStart: 0,
        sectionRightStart: 0,
        sectionFrontStart: 0,
        sectionTopEnd: 0,
        sectionBottomEnd: 0,
        sectionLeftEnd: 0,
        sectionRightEnd: 0,
        sectionFrontEnd: 0,
      },

    }
  },
  watch: {

  },
  computed: {},
  created() { },
  mounted() {
  },
  methods: {

  }
}
</script>
<style lang="less" scoped>
.flex {
  display: flex;
  align-items: center;
}

.part-section {
  color: rgba(255, 255, 255, 0.7);

  .section-title {
    font-weight: 500;
    font-size: 16px;
    color: #00AAF0;
    margin-bottom: 18px;
  }

  i {
    font-size: 20px;
    color: #9FAFC2;
    cursor: pointer;
    vertical-align: middle;
    margin-left: 6px;
  }

  .unit {
    margin-left: 6px;
    font-size: 12px;
  }

  .divider {
    background-color: rgba(255, 255, 255, 0.22);
  }

  .material-ball {
    text-align: center;
    cursor: pointer;

    // &:hover {
    //   border: 1px solid #00C9FD;
    // }
    &.hover {
      .title {
        color: #00c9fd;
      }
    }

    img {
      border-radius: 4px;
    }

    .title {
      font-weight: 400;
      font-size: 12px;
    }
  }

  .color-line {
    display: flex;
    background: #24262B;
    border: 1px solid #727272;
    border-radius: 2px;
    padding: 2px 4px;

    /deep/.el-color-picker__trigger {
      width: 50px;
      padding: 0;
      border: 0;
      margin-right: 10px;

    }

    /deep/.el-color-picker__color {
      border: 0;
    }

    /deep/.el-color-picker__color-inner {
      border-radius: 4px;
    }
  }

  .double-row {
    /deep/.el-form-item__label {
      padding: 0;
    }
  }
}
</style>