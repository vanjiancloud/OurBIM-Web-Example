<template>
  <el-dialog title="导入在线图纸" :visible.sync="dialogVisible" width="30%" append-to-body>
    <el-select v-model="value" placeholder="请选择" style="width: 100%;">
      <el-option v-for="item in options" :key="item.userFileId" :label="item.fileName" :value="item.userFileId">
      </el-option>
    </el-select>
    <span slot="footer" class="dialog-footer">
      <el-button @click="close">取 消</el-button>
      <el-button type="primary" @click="close">确 定</el-button>
    </span>
  </el-dialog>
</template>
<script>
import { Getuserid } from "@/store/index.js"
import { getList } from "@/api/projectManage/CADList.js"

export default {
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
      this.value = '',
      this.dialogVisible = true;
    },
    close() {
      this.dialogVisible = false;
    },
    getOptions() {
      const params = {
        ...this.pages,
        userId: Getuserid()
      }
      getList(params).then((res) => {
        if (res.data.code === 200) {
          this.options = res.data.data
        } else {
          this.options = []
        }
      }).catch(() => {
        this.options = []
      })
    }
  }
};
</script>