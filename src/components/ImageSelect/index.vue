<template>
  <div class="image-select-container" :class="customClass">
    <!-- 选择器 -->
    <el-select class="pure-custom-select" v-model="localValue" :placeholder="placeholder" :disabled="disabled"
      :style="selectStyle" @change="handleChange">
      <!-- 选中后的回显模板 -->
      <template slot="prefix">
        <div class="selected-item-wrapper" v-if="localValue">
          <div class="selected-image-wrapper">
            <img :src="getOptionLabelImage(localValue)" :alt="getImageLabel(localValue)"
              style="height: 32px; width: 60px; object-fit: fill;">
          </div>
          <span class="selected-item-label">{{ getImageLabel(localValue) }}</span>
        </div>
      </template>

      <!-- 下拉选项 -->
      <el-option v-for="item in options" :key="getOptionKey(item)" :label="getOptionLabel(item)"
        :value="getOptionValue(item)">
        <div class="option-content" :style="optionStyle">
          <!-- 图片 -->
          <div class="image-container">
            <img :src="getOptionImage(item)" style="height: 40px; width: 80px; object-fit: fill;">
          </div>
          <!-- 文字 -->
          <div class="label-container">
            {{ getOptionLabel(item) }}
          </div>
          <!-- 删除图标 -->
          <div class="action-container" v-if="item.isHdri == '1'">
            <i v-if="showDelete && !disabled" class="el-icon-close delete-icon" :style="deleteIconStyle"
              @click.stop="handleDeleteItem(item)" />
          </div>
        </div>
      </el-option>
    </el-select>
    <el-button size="small" type="primary" @click="handleAddClick" style="margin-left: 4px;">上传</el-button>
    <!-- 上传组件 -->
    <add-dialog ref="addDialogRef" @refresh="$emit('refresh')" />
  </div>
</template>

<script>
// import ImageUpload from './upload.vue'
import AddDialog from './addDialog.vue';
import { deleteWeatherList } from '@/api/userCenter/weather.js';

export default {
  name: 'ImageSelect',
  components: { AddDialog },
  props: {
    /* v-model 绑定值 */
    value: { type: [String, Number], default: '' },
    /* 选项数组 */
    options: { type: Array, default: () => [] },
    /* 占位符 */
    placeholder: { type: String, default: '请选择' },
    /* 是否禁用 */
    disabled: { type: Boolean, default: false },
    /* 是否显示删除图标 */
    showDelete: { type: Boolean, default: true },
    /* 选择框样式 */
    selectStyle: { type: Object, default: () => ({ width: '100%' }) },
    /* 选项内容样式 */
    optionStyle: { type: Object, default: () => ({}) },
    /* 删除图标样式 */
    deleteIconStyle: { type: Object, default: () => ({ cursor: 'pointer', color: '#f56c6c' }) },
    /* 自定义类名 */
    customClass: { type: String, default: '' },
    /* 字段映射 */
    optionKey: { type: String, default: 'value' },
    optionLabel: { type: String, default: 'label' },
    optionValue: { type: String, default: 'value' },
    optionImage: { type: String, default: 'image' }
  },
  data() {
    return {
      localValue: this.value
    }
  },
  watch: {
    value(val) {
      this.localValue = val
    },
    localValue(val) {
      this.$emit('input', val)
    }
  },
  methods: {
    /* 工具函数 */
    getOptionKey(item) {
      return item[this.optionKey] || item[this.optionValue]
    },
    getOptionLabel(item) {
      return item[this.optionLabel] || ''
    },
    getOptionValue(item) {
      return item[this.optionValue]
    },
    getOptionImage(item) {
      return item[this.optionImage] || ''
    },
    getOptionLabelImage(val) {
      const hit = this.options.find(opt => opt[this.optionValue] === val)
      return hit ? hit[this.optionImage] : ''
    },
    getImageLabel(val) {
      const hit = this.options.find(opt => opt[this.optionValue] === val)
      return hit ? hit[this.optionLabel] : ''
    },

    /* 事件 */
    handleChange(val) {
      this.$emit('input', val)
      this.$emit('change', val);
    },
    handleDeleteItem(item) {
      this.$confirm(`删除后无法恢复，确认是否删除？`, '删除', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        closeOnClickModal: false,
        type: 'warning'
      }).then(() => {
        const params = {
          id: item.value
        }
        deleteWeatherList(params).then(res => {
          if (res.code === 0) {
            this.$emit('delete', item)
            this.$message.success("删除成功")
          }
        })
      }).catch(() => { })
    },
    handleAddClick() {
      this.$refs.addDialogRef.show('贴图上传')
    }
  }
}
</script>

<style lang="less" scoped>
.image-select-container {
  display: flex;
  align-items: center;
}

.pure-custom-select {
  width: 100%;

  ::v-deep .el-input__inner {
    color: transparent !important;
  }

  ::v-deep .el-input__prefix {
    height: 100%;
    width: 80%;
    left: 8px;
    display: flex;
    align-items: center;
  }
}

/* 回显 */
.selected-item-wrapper {
  display: flex;
  align-items: center;
  gap: 4px;
  height: 100%;
  max-width: 100%;
  overflow: hidden;
}

.selected-image-wrapper {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 32px; // 固定高度
  width: 60px; // 固定宽度
}

.selected-item-label {
  flex: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 14px;
  line-height: 1.4;
}

// 下拉选项样式
.el-select-dropdown__item {
  padding: 0 10px;
  height: auto;
}

.el-scrollbar__wrap {
  overflow-x: hidden;
}

/* 下拉选项 */
.option-content {
  display: flex;
  align-items: center;
  width: 100%;
  min-height: 60px;
  padding: 4px 0;
}

.image-container {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
}

.label-container {
  max-width: 120px;
  margin: 0 10px;
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.action-container {
  flex-shrink: 0;
}

.delete-icon {
  transition: all 0.3s;

  &:hover {
    transform: scale(1.1);
    color: #f78989;
  }
}
</style>