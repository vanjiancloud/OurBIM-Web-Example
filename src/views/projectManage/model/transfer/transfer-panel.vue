<template>
  <div :class="['el-transfer-panel', isCustomRight || isGIS ? 'right-panel' : '']">
    <!-- 全选框 -->
    <!-- indeterminate 属性用以表示 checkbox 的不确定状态(选中但未全部选中的状态)，一般用于实现全选的效果 -->
    <p class="el-transfer-panel__header">
      <el-checkbox
        v-model="allChecked"
        @change="handleAllCheckedChange"
        :indeterminate="isIndeterminate">
        {{ title }}
        <span>{{ checkedSummary }}</span>
      </el-checkbox>
    </p>
    
    <div :class="['el-transfer-panel__body', hasFooter ? 'is-with-footer' : '']">
      <!-- 搜索框 -->
      <el-input
        class="el-transfer-panel__filter"
        v-model="query"
        size="small"
        :placeholder="placeholder"
        @mouseenter.native="inputHover = true"
        @mouseleave.native="inputHover = false"
        v-if="filterable">
        <i slot="prefix"
          :class="['el-input__icon', 'el-icon-' + inputIcon]"
          @click="clearQuery"
        ></i>
      </el-input>

      <!-- 穿梭框的复选框组 -->
      <el-checkbox-group
        v-model="checked"
        v-show="!hasNoMatch && data.length > 0"
        :class="{ 'is-filterable': filterable }"
        class="el-transfer-panel__list">
        <el-checkbox
          :class="['el-transfer-panel__item', isCustomRight ? 'right-checkbox' : '']"
          :label="item[keyProp]"
          :disabled="item[disabledProp]"
          :key="item[keyProp]"
          v-for="item in filteredData">
          <option-content v-if="!isCustomRight" :option="item"></option-content>

          <div v-else class="flex">
            <el-tooltip
              placement="top"
              effect="dark"
            >
              <span slot="content" class="right-label textEllipsis">{{ item[labelProp] }}</span>
              <span class="right-label textEllipsis">{{ item[labelProp] }}</span>
              
            </el-tooltip>
            <el-form
              :model="item"
              :rules="gisInfoRules"
              class="right-form"
              ref="gisInfo"
            >
              <el-form-item label="" prop="longitude" class="right-form-box">
                <el-input size="small" class="right-input" placeholder="请输入经度" v-model="item.longitude"></el-input>
                <span class="right-input-label">°</span>
              </el-form-item>
              <el-form-item label="" prop="latitude" class="right-form-box">
                <el-input size="small" class="right-input" placeholder="请输入纬度" v-model="item.latitude"></el-input>
                <span class="right-input-label">°</span>
              </el-form-item>
              <el-form-item label="" prop="altitude" class="right-form-box">
                <el-input size="small" class="right-input" placeholder="请输入海拔高度" v-model="item.altitude"></el-input>
                <span class="right-input-label">m</span>
              </el-form-item>
            </el-form>
          </div>
        </el-checkbox>
      </el-checkbox-group>

      <!-- 无匹配数据提示语 -->
      <p
        class="el-transfer-panel__empty"
        v-show="hasNoMatch">{{ t('el.transfer.noMatch') }}</p>

      <!-- 无数据提示语 -->
      <p
        class="el-transfer-panel__empty"
        v-show="data.length === 0 && !hasNoMatch">{{ t('el.transfer.noData') }}</p>
    </div>

    <!-- 底部插槽 -->
    <p class="el-transfer-panel__footer" v-if="hasFooter">
      <slot></slot>
    </p>
  </div>
</template>

<script>
  import ElCheckboxGroup from 'element-ui/packages/checkbox-group';
  import ElCheckbox from 'element-ui/packages/checkbox';
  import ElInput from 'element-ui/packages/input';
  import Locale from 'element-ui/src/mixins/locale';

  export default {
    mixins: [Locale],

    name: 'ElTransferPanel',

    componentName: 'ElTransferPanel',

    components: {
      ElCheckboxGroup,
      ElCheckbox,
      ElInput,
      OptionContent: {
        props: {
          option: Object
        },
        render(h) {
          const getParent = vm => {
            if (vm.$options.componentName === 'ElTransferPanel') {
              return vm;
            } else if (vm.$parent) {
              return getParent(vm.$parent);
            } else {
              return vm;
            }
          };
          const panel = getParent(this);
          const transfer = panel.$parent || panel;
          return panel.renderContent
            ? panel.renderContent(h, this.option)
            : transfer.$scopedSlots.default
              ? transfer.$scopedSlots.default({ option: this.option })
              : <span>{ this.option[panel.labelProp] || this.option[panel.keyProp] }</span>;
        }
      }
    },

    props: {
      data: {
        type: Array,
        default() {
          return [];
        }
      },
      renderContent: Function,
      placeholder: String,
      title: String,
      filterable: Boolean,
      format: Object,
      filterMethod: Function,
      defaultChecked: Array,
      props: Object,
      isCustomRight: Boolean,
      isGIS: Boolean
    },

    data() {
      const validaLongitude = (rule, value, callback) => {
        if (!value || value === '') {
          callback(new Error('经度不能为空'))
        }
        if (Number(value) > 180 || Number(value) < -180) {
          callback(new Error('经度范围为-180~180'))
        } else {
          callback()
        }
      }
      const validaLatitude = (rule, value, callback) => {
        if (!value || value === '') {
          callback(new Error('纬度不能为空'))
        }
        if (Number(value) > 90 || Number(value) < -90) {
          callback(new Error('纬度范围为-90~90'))
        } else {
          callback()
        }
      }
      return {
        checked: [],
        allChecked: false,
        query: '',
        inputHover: false,
        checkChangeByUser: true,
        gisInfoRules: {
          longitude: [{ required: true, validator: validaLongitude, trigger: ['change', 'blur'] }],
          latitude: [{ required: true, validator: validaLatitude, trigger: ['change', 'blur'] }],
          altitude: [{ required: true, message: "海拔高度不能为空", trigger: ['change', 'blur'] }]
        }
      };
    },

    watch: {
      checked(val, oldVal) {
        this.updateAllChecked();
        if (this.checkChangeByUser) {
          const movedKeys = val.concat(oldVal)
            .filter(v => val.indexOf(v) === -1 || oldVal.indexOf(v) === -1);
          this.$emit('checked-change', val, movedKeys);
        } else {
          this.$emit('checked-change', val);
          this.checkChangeByUser = true;
        }
      },

      data() {
        const checked = [];
        const filteredDataKeys = this.filteredData.map(item => item[this.keyProp]);
        this.checked.forEach(item => {
          if (filteredDataKeys.indexOf(item) > -1) {
            checked.push(item);
          }
        });
        this.checkChangeByUser = false;
        this.checked = checked;
      },

      checkableData() {
        this.updateAllChecked();
      },

      defaultChecked: {
        immediate: true,
        handler(val, oldVal) {
          if (oldVal && val.length === oldVal.length &&
            val.every(item => oldVal.indexOf(item) > -1)) return;
          const checked = [];
          const checkableDataKeys = this.checkableData.map(item => item[this.keyProp]);
          val.forEach(item => {
            if (checkableDataKeys.indexOf(item) > -1) {
              checked.push(item);
            }
          });
          this.checkChangeByUser = false;
          this.checked = checked;
        }
      }
    },

    computed: {
      filteredData() {
        return this.data.filter(item => {
          if (typeof this.filterMethod === 'function') {
            return this.filterMethod(this.query, item);
          } else {
            const label = item[this.labelProp] || item[this.keyProp].toString();
            return label.toLowerCase().indexOf(this.query.toLowerCase()) > -1;
          }
        });
      },

      checkableData() {
        return this.filteredData.filter(item => !item[this.disabledProp]);
      },

      checkedSummary() {
        const checkedLength = this.checked.length;
        const dataLength = this.data.length;
        const { noChecked, hasChecked } = this.format;
        if (noChecked && hasChecked) {
          return checkedLength > 0
            ? hasChecked.replace(/\${checked}/g, checkedLength).replace(/\${total}/g, dataLength)
            : noChecked.replace(/\${total}/g, dataLength);
        } else {
          return `${ checkedLength }/${ dataLength }`;
        }
      },

      isIndeterminate() {
        const checkedLength = this.checked.length;
        return checkedLength > 0 && checkedLength < this.checkableData.length;
      },

      hasNoMatch() {
        return this.query.length > 0 && this.filteredData.length === 0;
      },

      inputIcon() {
        return this.query.length > 0 && this.inputHover
          ? 'circle-close'
          : 'search';
      },

      labelProp() {
        return this.props.label || 'label';
      },

      keyProp() {
        return this.props.key || 'key';
      },

      disabledProp() {
        return this.props.disabled || 'disabled';
      },

      hasFooter() {
        return !!this.$slots.default;
      }
    },

    methods: {
      updateAllChecked() {
        const checkableDataKeys = this.checkableData.map(item => item[this.keyProp]);
        this.allChecked = checkableDataKeys.length > 0 &&
          checkableDataKeys.every(item => this.checked.indexOf(item) > -1);
      },

      handleAllCheckedChange(value) {
        this.checked = value
          ? this.checkableData.map(item => item[this.keyProp])
          : [];
      },

      clearQuery() {
        if (this.inputIcon === 'circle-close') {
          this.query = '';
        }
      },

      getData () {
        // console.log('内部组件获取数据', this.filteredData)
        // this.validaForm()
        return this.filteredData
      },

      validaForm () {
        // 表单不存在即不需要校验
        if (!this.$refs.gisInfo || this.$refs.gisInfo.length === 0) return true
        const dataArr = this.$refs.gisInfo
        let validStatus = true
        dataArr.forEach(item => {
          item.validate(valid => {
            if (!valid) {
              validStatus = false
            }
          })
        })
        return validStatus
      }
    }
  };
</script>

<style lang="less" scoped>
.right-panel {
  // width: 680px !important;
}
.el-transfer-panel__item {
  margin: 10px 0 10px 0 !important;
}
.right-label {
  margin-top: 6px;
  width: 100px;
}
.flex {
  display: flex;
  align-items: flex-start;
}
.right-form {
  display: flex;
  align-items: flex-start;
  height: 58px;
}
.right-form-box {
  flex: 1;
  margin: 0 5px 0 5px;
  .right-input {
    flex: 1;
  }
  .right-input-label {
    margin: 0 0 0 5px;
  }
}
/deep/ .el-form-item__content {
  display: flex;
}
/deep/ .right-checkbox span.el-checkbox__inner {
  margin-top: 5px;
}
</style>
