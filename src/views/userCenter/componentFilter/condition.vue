<template>
  <el-dialog :title="title" :visible.sync="dialogVisible" :close-on-click-modal="false" append-to-body width="460px"
    :before-close="hide">
    <el-form ref="form" :style="{ 'width': '90%' }" :model="form" :rules="rules" label-width="98px" size="small">
      <el-form-item label="条件参数" prop="conditionParam">
        <el-select v-model="form.conditionParam" filterable placeholder="请选择" style="width: 100%;">
          <el-option v-for="item in filterItemList" :key="item.id" :label="item.itemName" :value="item.itemName">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="判断规则" prop="conditionRule">
        <el-select v-model="form.conditionRule" placeholder="请选择" style="width: 100%;">
          <el-option v-for="item in ruleList" :key="item.value" :label="item.label" :value="item.value">
            <span style="float: left">{{ item.label }}</span>
            <span style="float: right; color: #8492a6; font-size: 13px">{{ item.explain }}</span>
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="参数值" prop="conditionValue">
        <!-- <el-select v-model="form.conditionValue" placeholder="请选择" style="width: 100%;">
          <el-option v-for="item in options3" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select> -->
        <el-input v-model="form.conditionValue" placeholder="请输入内容"></el-input>
      </el-form-item>
      <el-form-item>
        <div style="display: flex;align-items: center;justify-content: space-between;" v-if="validPercentage > 0">
          <el-progress :percentage="validPercentage" :text-inside="true" :stroke-width="12"
            style="flex: 1;"></el-progress>
          <div style="margin-left: 10px;" v-if="showCount">{{ form.conditionCount || '0'}}个</div>
        </div>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="hide" size="small">取 消</el-button>
      <el-button type="primary" @click="filter" size="small">过 滤</el-button>
      <el-button type="primary" @click="submit" size="small" :disabled="!filterFinish">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { filterConditionCount } from '@/api/userCenter/componentFilter.js'
export default {
  components: {},
  props: {
    data: {
      type: Object,
      default: () => { }
    },
    filterItemList: {
      type: Array,
      default: () => { [] }
    },
    ruleList: {
      type: Array,
      default: () => { [] }
    },
  },
  data() {
    return {
      title: '条件选项设置',
      dialogVisible: false,
      form: {
        conditionParam: undefined,
        conditionRule: undefined,
        conditionValue: null,
        conditionCount: null,
      },
      rules: {
        conditionParam: [{ required: true, message: "请输入条件参数", trigger: ['blur', 'change'] }],
        conditionRule: [{ required: true, message: "请输入判断规则", trigger: ['blur', 'change'] }],
        conditionValue: [{ required: true, message: "请输入参数值", trigger: ['blur', 'change'] }],
      },
      currentIndex: null,
      filterFinish: false,
      progress: 0,
      timer: null,
      showCount: false,
    };
  },
  watch: {},
  computed: {
    validPercentage() {
      return Math.min(100, Math.max(0, this.progress));
    }
  },
  created() {

  },
  mounted() { },
  methods: {
    show(row, index) {
      // console.log(row, index)
      this.form = this.$options.data().form
      this.dialogVisible = true;
      this.currentIndex = index ?? null;
      this.resetFilterProgress();
      this.$nextTick(() => {
        this.$refs.form.clearValidate();
        if (row) this.form = row
        // this.form.conditionJudge = 'and'
      })
    },
    hide() {
      this.dialogVisible = false;
    },
    resetFilterProgress() {
      this.progress = 0;
      this.filterFinish = false;
      this.showCount = false;
      if (this.timer) {
        clearInterval(this.timer);
        this.timer = null;
      };
    },
    async filter() {
      this.$refs.form.validate(async (valid) => {
        this.resetFilterProgress();
        this.startProgress()
        let parmas = {
          taskId: this.data.taskId,
          groupId: this.data.groupId,
        }
        let data = [this.form]
        let res = await filterConditionCount(parmas, data)
        this.form.conditionCount = res.data
      })

      // 
    },
    startProgress() {
      if (this.timer) return;
      this.timer = setInterval(() => {
        if (this.progress < 100) {
          this.progress = this.progress + Math.floor(Math.random() * 10);
        } else {
          clearInterval(this.timer);
          this.timer = null;
          setTimeout(() => {
            this.filterFinish = true;
            this.showCount = true;
          }, 350)
        }
      }, 100);

    },
    submit() {
      this.$refs.form.validate((valid) => {
        if (!valid) return false;
        if (this.currentIndex !== null) {
          this.$emit('edit', this.form, this.currentIndex)
        } else {
          this.$emit('add', this.form)
        }
        this.hide()
      })
    },
  }
};
</script>
<style lang="less" scoped></style>