<template>
  <Drawer ref="Drawer" title="关键帧属性设置" direction="rtl" @onClose="close()" :class="{ 'changeDrawerBox': true }">
    <el-form ref="formRef" :model="form" class="animationEditForm" label-width="98px" label-position="left" size="mini">
      <div class="key-title flex">
        <img :src="require('@/assets/images/animation/action1.png')" alt="">
        <div>{{ keyFrameEditData.groupName }}</div>
      </div>
      <el-form-item label="选择子构件">
        <el-select v-model="form.subcomponent" placeholder="选择子构件(组)">
          <el-option v-for="item in subcomponentList" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="选择动作类型">
        <el-select v-model="form.actionType" placeholder="选择动作类型">
          <el-option v-for="item in actionTypeList" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <!-- 位置 -->
      <template v-if="form.actionType === '1'">
        <partLocation ref="partLocationRef" />
      </template>
      <!-- 材质 -->
      <template v-if="form.actionType === '2'">
        <partMaterial ref="partMaterialRef" />
      </template>
      <!-- 剖切 -->
      <template v-if="form.actionType === '3'">
        <partSection ref="partSectionRef" />
      </template>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">确 定</el-button>
      </el-form-item>
    </el-form>
  </Drawer>
</template>

<script>
import Drawer from "@/components/Drawer/index.vue";
import partLocation from "./partLocation.vue";
import partMaterial from "./partMaterial.vue";
import partSection from "./partSection.vue";
import { isShowList } from "./data.js";

export default {
  components: { Drawer, partMaterial, partLocation, partSection },
  props: {
    data: {
      type: Object,
      default: () => { }
    },
  },
  data() {
    return {
      isShowList,
      subcomponentList: [
        {
          value: '1',
          label: '一级液压杆（动作）'
        },
        {
          value: '2',
          label: '二级液压杆（动作）'
        }
      ],
      actionTypeList: [
        {
          value: '1',
          label: '位置'
        },
        {
          value: '2',
          label: '材质'
        },
        {
          value: '3',
          label: '剖切'
        },
        {
          value: '4',
          label: '分解'
        }
      ],
      form: {
        subcomponent: '1',
        actionType: '1',
      },

    }
  },
  watch: {

  },
  computed: {
    keyFrameEditData() {
      return this.$store.state.customAnimation.keyFrameEditData
    }
  },
  created() { },
  mounted() {
  },
  methods: {
    show() {
      this.$refs.Drawer.show()
      this.$store.commit('customAnimation/changeDrawerShow', true)
      // console.log(this.keyFrameEditData)
    },
    close() {
      this.$refs.Drawer.hide()
      this.$store.commit('customAnimation/changeDrawerShow', false)
    },
    onSubmit() {
      this.$refs.formRef.validate((valid) => {
        if (valid) {
          console.log(this.form)
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    }
  }
}
</script>
<style lang="less" scoped>
.flex {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  color: #fff;
}


.changeDrawerBox {
  height: 50vh;
  top: initial;
  bottom: 0;
  border-top: 1px solid #747374;
}

.animationEditForm {
  margin: 16px;
  overflow-y: auto;
  overflow-x: hidden;
  max-height: calc(100% - 90px);

  .key-title {
    font-weight: 500;
    font-size: 16px;
    color: #00AAF0;
    margin-bottom: 18px;

    img {
      height: 20px;
      width: 20px;
      margin-right: 8px;
    }
  }

  /deep/ .el-form-item__label {
    font-weight: 400;
    font-size: 14px;
    color: rgba(255, 255, 255, 0.7);
  }
}
</style>
