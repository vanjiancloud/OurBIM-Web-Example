<!-- 复制材质球 -->
<template>
  <el-dialog :title="title" :visible.sync="dialogVisible" :before-close="hide" :close-on-click-modal="false"
    width="580px" append-to-body>
    <el-form :model="form" :rules="rules" ref="form" label-width="98px">
      <el-form-item label="材质名称:" prop="matName">
        <el-input v-model="form.matName" placeholder="请输入"></el-input>
      </el-form-item>
      <el-form-item label="选择分组:" prop="groupId">
        <el-select v-model="form.groupId" placeholder="请选择分组" style="width:100%">
          <el-option v-for="(item, index) in groupList" :key="index" :label="item.groupName"
            :value="item.groupId"></el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="hide">取 消</el-button>
      <el-button class="blueBtn" type="primary" @click="submit">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { Getuserid } from "@/store/index.js";
import { selectCustomizeMaterialGroup, copyCustomizeMaterial, copyPublicMaterialToCustomMaterial, copyAppMaterialToCusTomMaterial } from '@/api/resource/material.js'

export default {
  props: {},
  data() {
    return {
      title: '复制',
      dialogVisible: false,
      form: {},
      rules: {
        matName: [{ required: true, message: '请输入材质名称', trigger: 'blur' }]
      },
      groupList: [],
    }
  },
  watch: {},
  computed: {},
  created() { },
  mounted() {
    this.getGroupList();
  },
  methods: {
    getGroupList() {
      let params = {
        userId: Getuserid()
      }
      selectCustomizeMaterialGroup(params).then(res => {
        this.groupList = res.data || []
      })
    },
    show(row) {
      this.dialogVisible = true
      this.getGroupList();
      this.$nextTick(() => {
        this.$refs.form.clearValidate()
        this.form = row
      })
    },
    hide() {
      this.dialogVisible = false
    },
    submit() {
      this.$refs.form.validate((valid) => {
        if (!valid) return false
        let api = copyCustomizeMaterial;
        const params = {
          matId: this.form.matId,
          matName: this.form.matName,
          groupId: this.form.groupId,
        }
        if (this.form.tab2Index == 0) {
          api = copyPublicMaterialToCustomMaterial;
          delete params.groupId;
          params.parentId = this.form.groupId;
          params.userId = Getuserid();
        }
        if (this.form.tab2Index == 1) {
          // api = copyCustomizeMaterial;
          // delete params.groupId;
          // params.parentId = this.form.groupId;
          // params.userId = Getuserid();
        }
        if (this.form.tab2Index == 2) {
          api = copyAppMaterialToCusTomMaterial;
          delete params.groupId;
          params.parentId = this.form.groupId;
          params.userId = Getuserid();
        }
        api(params).then(res => {
          this.$message.success(res.message)
          this.hide();
          this.$emit('reloadTable', this.form.groupId)
          this.$emit('update:groupName', this.groupList.find(item => item.groupId == this.form.groupId).groupName);
        })
      })
    }
  }
}
</script>
<style lang="less" scoped>
.uploadTip {
  font-size: 12px;
  color: #999999;
}

/deep/.el-upload {
  width: 120px;
  height: 120px;
}
</style>