<template>
  <div></div>
</template>

<script>
import { Getuserid } from "@/store/index.js";
import { selectCustomizeMaterialGroup, selectCustomizeMaterial, deleteCustomizeMaterialGroup, deleteCustomizeMaterial } from '@/api/resource/material.js'
import List from "@/components/List/index.vue";

export default {
  components: { List},
  props: {
    total: {
      type: Number,
      default: 0,
      require: true
    },
    groupName: {
      type: String,
      default: '',
      require: true
    },
  },
  data() {
    return {
      loading: false,
      isList: true,
      tableData: [],
      parentData: [],//一级数据，二级编辑换组使用
      parentId: '',//父级id
      isGroup: true, //是否是分组
    };
  },
  watch: {},
  computed: {
    uploadCom() {
      return this.$store.state.uploadCom
    }
  },
  created() {
    this.getList()
  },
  mounted() { },
  methods: {
    onChange(e) {
      this.isList = e
    },
    // 返回一级
    back() {
      this.getList()
    },
    getList() {
      this.$emit('update:groupName', '')
      let params = {
        userId: Getuserid()
      }
      this.loading = true
      selectCustomizeMaterialGroup(params).then(res => {
        this.loading = false
        this.isGroup = true
        this.tableData = res.data || []
        this.parentData = res.data || []
        this.$emit('update:total', this.tableData.length)
      }).catch(() => {
        this.loading = false
      })
    },
    // 分组下的材质
    getTextureList(groupId) {
      let params = {
        userId: Getuserid(),
        parentId: groupId,
      }
      this.loading = true
      selectCustomizeMaterial(params).then(res => {
        this.loading = false
        this.isGroup = false
        this.tableData = res.data || []
        this.$emit('update:total', this.tableData.length)
      }).catch(() => {
        this.loading = false
      })
    },
    // 新建、编辑
    add(row = {}) {
      this.$refs.DialogsMeterialGroup.show({ ...JSON.parse(JSON.stringify(row)) })
    },
    // 复制材质球
    copyMeterial(row) {
      this.$refs.CopyMeterialRef.show({ ...JSON.parse(JSON.stringify(row)) })
    },
    // 删除
    deleteRow(row) {
      this.$confirm(`此操作将删除该【${this.isGroup ? row.groupName : row.matName}】${this.isGroup ? '分组及分组下包含的材质球素材' : '材质球素材'}, 是否继续?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        if (row.isGroup == '0') {
          deleteCustomizeMaterialGroup({
            groupId: row.groupId
          }).then(() => {
            this.$message.success('删除成功！')
            if (this.isGroup) {
              this.getList()
            } else {
              this.getTextureList(row.parentId)
            }
          })
        }
        if (row.isGroup == '1') {
          deleteCustomizeMaterial({
            matId: row.matId
          }).then(() => {
            this.$message.success('删除成功！')
            if (this.isGroup) {
              this.getList()
            } else {
              this.getTextureList(row.parentId)
            }
          })
        }
      })
        .catch(() => { });
    },
    // 点击进入详情
    cellClick(row) {
      // isGroup 
      // 材质分组 0  
      // 二级材质球 1
      if (this.isGroup && row.isGroup === '0') {
        this.getTextureList(row.groupId)
        this.parentId = row.groupId
        this.$emit('update:groupName', row.groupName)
      }
    },
    // 新增、编辑材质
    addMeterial(row = {}) {
      this.$refs.DialogMeterial.show({ ...JSON.parse(JSON.stringify(row)), groupId: this.parentId })
    },
  }
};
</script>
<style lang="less" scoped>
.List .subContent .listBox .listItem {
  width: 180px !important;
  flex: initial;
  min-width: initial;
}
</style>