<template>
  <List @change="onChange" style="padding: 10px 24px 20px 24px;" v-loading="loading">
    <template slot="title">
      <div class="boxHeader">
        <div class="boxHeaderTitle" v-if="isGroup">您共有<span>{{ total }}</span>个材质分组</div>
        <div class="boxHeaderTitle" v-if="!isGroup">当前分组有<span>{{ total }}</span>个材质素材</div>
        <div>
          <el-button class="blueBtn" type="primary" @click="add()" v-if="isGroup">新建分组</el-button>
          <el-badge :value="uploadCom" :hidden="!uploadCom" v-if="!isGroup">
            <el-button class="blueBtn" type="primary" @click="addMeterial()">新建材质</el-button>
          </el-badge>
        </div>
      </div>
    </template>
    <!-- 材质分组 -->
    <el-table :data="tableData" @cell-click="cellClick" v-if="isList && isGroup" :row-style="{ 'cursor': 'pointer' }">
      <el-table-column prop="groupName" label="分组名称" />
      <el-table-column prop="groupId" label="分组ID" />
      <!-- <el-table-column prop="createTime" label="创建时间" /> -->
      <el-table-column prop="materialCount" label="包含材质数量">
        <!-- <template slot-scope="scope">
          {{ tableData.length }}
        </template> -->
      </el-table-column>
      <el-table-column prop="isGroup" label="类型">
        <template slot-scope="scope">
          {{ scope.row.isGroup === '1' ? '材质' : '材质分组' }}
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="150">
        <template slot-scope="scope">
          <el-button type="text" class="blueText" @click.stop="add(scope.row)">编辑</el-button>
          <el-button type="text" class="blackText" @click.stop="deleteRow(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 材质球素材 -->
    <el-table :data="tableData" v-if="isList && !isGroup"
      :header-cell-style="{ 'background': '#D0DCE3', 'color': '#333333' }">
      <el-table-column prop="matName" label="材质名称" />
      <el-table-column prop="id" label="材质ID" />
      <!-- <el-table-column prop="createTime" label="上传时间" />
      <el-table-column label="文件大小">
        <template slot-scope="scope">
          {{ $common.convertBytes(scope.row.fileLongSize) }}
        </template>
      </el-table-column> -->
      <el-table-column prop="isGroup" label="类型">
        <template slot-scope="scope">
          {{ scope.row.isGroup === '1' ? '材质' : '材质分组' }}
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="180">
        <template slot-scope="scope">
          <el-button type="text" class="blueText" @click.stop="addMeterial(scope.row)">编辑</el-button>
          <el-button type="text" class="blueText" @click.stop="copyMeterial(scope.row)">复制</el-button>
          <el-button type="text" class="blackText" @click.stop="deleteRow(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 盒子 -->
    <div class="listBox" v-if="!isList">
      <div class="listItem" v-for="(item, index) in tableData" :key="index"
        @click="item.isGroup === '0' ? cellClick(item) : ''"
        :style="{ cursor: item.isGroup === '0' ? 'pointer' : 'auto' }">
        <el-image :src="item.matImgPath" class="defaultImg">
          <div slot="placeholder" class="image-slot">
            <img :src="require('@/assets/default/list1.png')" />
          </div>
          <div slot="error" class="image-slot">
            <img :src="require('@/assets/default/list1.png')" />
          </div>
        </el-image>
        <div class="title">{{ item.isGroup === '0' ? item.groupName : item.matName }}</div>
        <div class="flexBetween">
          <div class="type">类型：{{ item.isGroup === '0' ? '材质分组' : '材质' }}</div>
        </div>
        <div class="flexBetween">
          <div>
            <el-button class="blueBtn" type="primary" size="small"
              @click.stop="item.isGroup === '0' ? add(item) : addMeterial(item)">编辑</el-button>
            <el-button class="blueBtn" type="primary" size="small" v-if="item.isGroup == '1'"
              @click.stop="copyMeterial(item)">复制</el-button>
          </div>
          <el-dropdown>
            <span class="el-dropdown-link">
              <i class="el-icon-arrow-down el-icon-more"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item @click.native="deleteRow(item)">删除</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </div>
    </div>
    <el-empty v-if="!isList && !tableData.length" :image="require('@/assets/noData.png')" :image-size="100"></el-empty>

    <!-- 新建/编辑分组 -->
    <DialogsMeterialGroup ref="DialogsMeterialGroup" @getList="getList" />
    <!-- 新建/编辑材质 -->
    <DialogMeterial ref="DialogMeterial" @reloadTable="getTextureList" />
    <!-- 复制材质球 -->
    <CopyMeterial ref="CopyMeterialRef" @reloadTable="getTextureList"
      @update:groupName="$emit('update:groupName', $event)" />
  </List>
</template>

<script>
import { Getuserid } from "@/store/index.js";
import { selectCustomizeMaterialGroup, selectCustomizeMaterial, deleteCustomizeMaterialGroup, deleteCustomizeMaterial } from '@/api/resource/material.js'
import List from "@/components/List/index.vue";
import DialogsMeterialGroup from './DialogsMeterialGroup.vue';
import DialogMeterial from './DialogMeterial.vue';
import CopyMeterial from './CopyMeterial.vue';

export default {
  components: { List, DialogsMeterialGroup, DialogMeterial, CopyMeterial },
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