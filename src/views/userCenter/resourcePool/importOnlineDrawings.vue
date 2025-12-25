<template>
  <el-dialog title="导入在线图纸" :visible.sync="dialogVisible" width="30%" append-to-body>
    <el-select v-model="value" placeholder="请选择" style="width: 100%;">
      <el-option v-for="item in options" :key="item.userFileId" :label="item.fileName" :value="item.userFileId">
      </el-option>
    </el-select>
    <span slot="footer" class="dialog-footer">
      <el-button @click="close">取 消</el-button>
      <el-button type="primary" @click="submit">确 定</el-button>
    </span>
  </el-dialog>
</template>
<script>
import { Getuserid } from "@/store/index.js"
import { getList } from "@/api/projectManage/CADList.js"
import { inputOnlineCadFile } from "@/api/userCenter/resourcePool.js";

export default {
  props: {
    data: {
      type: Object,
      default: () => { }
    }
  },
  data() {
    return {
      dialogVisible: false,
      value: '',
      options: [],
    };
  },
  created() {
    this.getOptions();
  },
  methods: {
    show() {
      this.value = '';
      this.dialogVisible = true;
    },
    close() {
      this.dialogVisible = false;
    },
    getOptions() {
      // console.log(this.data)
      const params = {
        ...this.pages,
        userId: this.data.userId || Getuserid()
      }
      getList(params).then((res) => {
        if (res.code === 200) {
          this.options = res.data
        } else {
          this.options = []
        }
      }).catch(() => {
        this.options = []
      })
    },
    submit() {
      const { sourceFilePath, extand, fileName, fileSize } = this.options.find(item => item.userFileId === this.value)
      const params = {
        taskId: this.data.taskId,
        sourceFilePath,
        extand,
        fileName,
        fileSize,
      }
      // console.log(params)
      inputOnlineCadFile(params).then(res => {
        if (res.code === 0) {
          this.$message.success(res.message)
          this.close()
          this.$emit('success')
        }
      })
    },
  }
};
</script>