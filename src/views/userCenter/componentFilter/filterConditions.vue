<template>
  <div>
    <el-dialog :title="title" :visible.sync="dialogVisible" :modal="true" :close-on-click-modal="false" append-to-body
      width="460px" :before-close="hide" :lock-scroll="false">
      <el-form class="filterForm" ref="form" :style="{ 'width': '100%' }" :model="form" :rules="rules" label-width="0"
        size="small">
        <el-row :gutter="10" v-for="(item, index) in form.list" :key="item.id || index">
          <el-col :span="18">
            <div style="display: flex;align-items: center;">
              <el-form-item label="" :prop="`list.${index}.a`" style="flex: 1">
                <el-input
                  :value="`${item.conditionParam} ${filterRule(item.conditionRule, ruleList)} ${item.conditionValue}`"
                  @keydown.native.stop size="small" readonly @click.native="editItem(item, index)"></el-input>
              </el-form-item>
              <!-- <div class="form_item">
              {{ item.conditionParam | filterLabel(filterItemList) }}{{ item.conditionRule }}{{ item.conditionValue }}
            </div> -->
              <i class="el-icon-circle-close close_item" @click="delItem(index)"></i>
            </div>
          </el-col>
          <el-col :span="6">
            <el-form-item label-width="0">
              {{ item.conditionCount }}个构件
            </el-form-item>
          </el-col>
          <el-col :span="24" style="display: flex;justify-content: flex-start;" v-if="index != form.list.length - 1">
            <el-form-item label="" :prop="`list.${index}.conditionJudge`">
              <el-select v-model="item.conditionJudge" placeholder="请选择" size="mini" style="width: 100px;"
                @change="(v)=>conditionJudgeChange(v,item,index)">
                <el-option v-for="opt in options1" :key="opt.value" :label="opt.label" :value="opt.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label-width="0" v-if="showTotal">
          <span style="color: red;">共过滤出{{ totalComponent }}个构件</span>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <div class="footer_row" style="text-align: start;">
          <el-button @click="selectSame('0')" size="small" class="btn1">所有同类型构件</el-button>
          <el-button @click="selectSame('1')" size="small" class="btn1">同层同类型构件</el-button>
        </div>
        <div class="footer_row" style="text-align: start;">
          <el-button @click="addCondition()" type="primary" size="small">添加条件</el-button>
        </div>
        <div>
          <el-button @click="hide" size="small">取 消</el-button>
          <el-button type="primary" @click="submit" size="small">确 定</el-button>
        </div>
      </span>
    </el-dialog>
    <Condition ref="ConditionRef" @add="add" @edit="edit" :data="data" :filterItemList="filterItemList"
      :ruleList="ruleList" />
  </div>
</template>

<script>
import { getConditionList, filterCondition, selectfilterCondition, selectfilterConditionSame, filterConditionCount } from '@/api/userCenter/componentFilter.js'
import Condition from './condition.vue'
export default {
  components: {
    Condition
  },
  props: {
    data: {
      type: Object,
      default: () => { }
    }
  },
  data() {
    return {
      title: '过滤条件',
      dialogVisible: false,
      form: {
        list: []
      },
      rules: {
        // dirName: [{ required: true, message: "请输入名称", trigger: "blur" }],
      },
      options1: [
        { value: 'and', label: '和' },
        { value: 'or', label: '或' },
      ],
      filterItemList: [],
      ruleList: [
        { label: '==', explain: '等于', value: '0' },
        { label: '≠', explain: '不等于', value: '1' },
        { label: '>', explain: '大于', value: '2' },
        { label: '≥', explain: '大于或等于', value: '3' },
        { label: '<', explain: '小于', value: '4' },
        { label: '≤', explain: '小于或等于', value: '5' },
        { label: '⊆', explain: '包含', value: '6' },
        { label: '⊈', explain: '不包含', value: '7' },
      ],
      showTotal: false,
      totalComponent: 0,
    };
  },
  watch: {
    "form.list": {
      deep: true,
      async handler(val, oldval) {
        if (val.length > 0) {
          this.showTotal = true;
          let parmas = {
            taskId: this.data.taskId,
            groupId: this.data.groupId,
          }
          let data = val.map((item, index) => {
            // if (!item.conditionJudge) item.conditionJudge = 'and'
            if (index == this.form.list.length - 1) {
              item.conditionJudge = null
            }
            return item
          })
          this.totalComponent = await this.getFilterCount(parmas, data)
        } else {
          this.totalComponent = 0;
          this.showTotal = false;
        }
      }
    }
  },
  computed: {},
  created() {
    this.getConfigList()
  },
  mounted() { },
  methods: {
    async getFilterCount(parmas, data) {
      let res = await filterConditionCount(parmas, data);
      return res.data
    },
    // filterLabel(value, arr) {
    //   if (!value) return '';
    //   return arr.find(a => a.id == value).itemName
    // },
    filterRule(value, arr) {
      if (!value) return '';
      return arr.find(a => a.value == value).label
    },
    delItem(index) {
      this.form.list.splice(index, 1)
    },
    editItem(item, index) {
      // console.log(item, index)
      this.$refs.ConditionRef.show(item, index);
    },
    selectSame(judgeType) {
      // if (!this.data.selectPark && !this.data.multiComponents.length) {
      //   return this.$message.warning("请点击选择构件！");
      // }
      if (!this.data.selectPark) {
        return this.$message.warning("请点击选择构件！");
      }
      // console.log(this.data,judgeType)
      let params = {
        taskId: this.data.taskId,
        groupId: this.data.groupId,
        uuid: this.data.selectPark.data.uuid,
        judgeType
      }
      selectfilterConditionSame(params).then(res => {
        res.data.map(async a => {
          a.conditionCount = await this.getFilterCount({
            taskId: this.data.taskId,
            groupId: this.data.groupId,
          }, res.data)
          return a;
        });
        this.form.list = [...this.form.list, ...res.data].map(a => {
          a.conditionJudge = a.conditionJudge || 'and';
          return a;
        })
        // this.$message.success('操作成功！')
        // this.hide();
        // this.$emit('getList')
      })
    },
    getConfigList() {
      // console.log('条件选项设置',this.data)
      getConditionList({
        taskId: this.data.taskId,
        groupId: this.data.groupId,
      }).then(res => {
        this.filterItemList = res.data
      })
    },
    addCondition() {
      this.$refs.ConditionRef.show();
    },
    add(obj) {
      this.form.list.push(obj); // 添加新条件到数组末尾
      // 当数组长度≥2时，设置倒数第二条的 conditionJudge 为 'and'
      if (this.form.list.length >= 2) {
        const prevIndex = this.form.list.length - 2; // 倒数第二条的索引
        this.form.list[prevIndex].conditionJudge = 'and'; // 直接修改响应式属性
      }
    },
    conditionJudgeChange(v,item,index) {
      this.$set(this.form.list, index, item)
    },
    edit(obj, index) {
      // console.log(obj,index)
      // this.form.list[index] = obj
      this.$set(this.form.list, index, obj)
    },
    show(title, row) {
      this.title = '过滤条件'
      this.form = this.$options.data().form
      this.dialogVisible = true;
      selectfilterCondition({
        taskId: this.data.taskId,
        groupId: this.data.groupId,
      }).then(res => {
        if (res?.data?.filterdata) {
          let filterdata = JSON.parse(res.data.filterdata)
          this.form.list = filterdata
        }
      })
      // this.$nextTick(() => {
      //   this.$refs.form.clearValidate();
      //   this.form = row
      // })
    },
    hide() {
      this.dialogVisible = false;
    },
    submit() {
      this.$refs.form.validate((valid) => {
        if (!valid) return false;
        // console.log(this.form)
        if (this.form.id) {
          // let data = {
          //   type: 1,
          //   newName: this.form.dirName,
          //   id: this.form.id
          // }
          // updateName(data).then(() => {
          //   this.$message.success('操作成功！')
          //   this.hide();
          //   this.$parent.$parent.getList()
          // });
        } else {
          let params = {
            taskId: this.data.taskId,
            groupId: this.data.groupId,
          }
          let data = this.form.list.map((item, index) => {
            if (index == this.form.list.length - 1) {
              item.conditionJudge = null
            }
            return item
          })
          // console.log(data)
          filterCondition(params, data).then(() => {
            this.$message.success('操作成功！')
            this.hide();
            this.$emit('getList')
          });
        }
      })
    },
  }
};
</script>
<style lang="less" scoped>
.flex {
  display: flex;
  align-items: center;
}

.footer_row {
  &>button {
    margin-bottom: 10px;
  }

  .btn1 {
    background: #FFFFFF;
    border-radius: 4px;
    border: 1px solid #00C9FD;
    color: #00C9FD;
  }
}

.filterForm {
  .el-form-item {
    margin-bottom: 4px;
  }

  .close_item {
    margin-left: 4px;
    font-size: 18px;
    cursor: pointer;

    &:hover {
      color: #78aff9;
    }
  }
}
</style>