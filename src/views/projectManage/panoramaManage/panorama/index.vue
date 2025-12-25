<template>
  <List @change="onChange" style="padding: 10px 24px 20px 24px;" v-loading="loading">
    <template slot="title">
      <div class="boxHeader">
        <div class="boxHeaderTitle" v-if="isGroup">您共有<span>{{ total }}</span>个全景图场景</div>
        <div class="boxHeaderTitle" v-if="!isGroup">当前分组有<span>{{ total }}</span>个全景图</div>
        <div>
          <el-button class="blueBtn" type="primary" @click="add()" v-if="isGroup">新建场景</el-button>
          <el-button class="blueBtn" type="primary" @click="uploadPanoramicImage()" v-if="!isGroup">上传全景图</el-button>
        </div>
      </div>
    </template>
    <!-- 全景图分组 -->
    <el-table :data="tableData" @cell-click="cellClick" v-if="isList && isGroup" :row-style="{ 'cursor': 'pointer' }">
      <el-table-column prop="groupName" label="场景名称" />
      <el-table-column prop="groupId" label="场景ID" />
      <el-table-column prop="createTime" label="创建时间" />
      <el-table-column prop="createTime" label="文件大小" />
      <el-table-column prop="materialCount" label="包含图片数量" />
      <el-table-column prop="isGroup" label="类型">
        <template slot-scope="scope">
          {{ scope.row.isGroup === '1' ? '全景图' : '全景图分组' }}
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope" class="goapp-row">
          <div class="flexCenter">
            <el-button type="text" class="blueText" @click.stop="sceneArrange()">场景编排</el-button>
            <el-button type="text" class="blueText" @click.stop="sceneArrange('2')">预览</el-button>
            <el-dropdown @command="handleCommand($event, scope.row)" trigger="hover" placement="bottom"
              style="margin-left: 10px;">
              <span class="el-dropdown-link">
                <i class="el-icon-arrow-down el-icon-more"></i>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="shareFile">分享</el-dropdown-item>
                <el-dropdown-item command="editFile">编辑</el-dropdown-item>
                <el-dropdown-item command="downloadFile">下载</el-dropdown-item>
                <el-dropdown-item command="deleteFile">删除</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <!-- 全景图 -->
    <el-table :data="tableData" v-if="isList && !isGroup"
      :header-cell-style="{ 'background': '#D0DCE3', 'color': '#333333' }">
      <el-table-column prop="matName" label="全景图名称" />
      <el-table-column prop="id" label="全景图ID" />
      <el-table-column prop="createTime" label="上传时间" />
      <el-table-column label="文件大小">
        <template slot-scope="scope">
          {{ $common.convertBytes(scope.row.fileLongSize) }}
        </template>
      </el-table-column>
      <el-table-column prop="isGroup" label="类型">
        <template slot-scope="scope">
          {{ scope.row.isGroup === '1' ? '全景图' : '全景图分组' }}
        </template>
      </el-table-column>
      <el-table-column prop="id" label="状态" />
      <el-table-column label="操作">
        <template slot-scope="scope" class="goapp-row">
          <div class="flexCenter">
            <el-button type="text" class="blueText" @click="sceneArrange('2')">预览</el-button>
            <el-dropdown @command="handleCommand($event, scope.row)" trigger="hover" placement="bottom"
              style="margin-left: 10px;">
              <span class="el-dropdown-link">
                <i class="el-icon-arrow-down el-icon-more"></i>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="shareFile">分享</el-dropdown-item>
                <el-dropdown-item command="editFile">编辑</el-dropdown-item>
                <el-dropdown-item command="downloadFile">下载</el-dropdown-item>
                <el-dropdown-item command="deleteFile">删除</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
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
              @click.stop="item.isGroup === '0' ? add(item) : uploadPanoramicImage(item)">编辑</el-button>
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
    <AddGroup ref="AddGroupRef" @getList="getList" />
    <!-- 分享 -->
    <DialogShare ref="DialogShareRef" />
    <!-- 新建/编辑全景图 -->
    <DialogPanorama ref="DialogPanoramaRef" />
  </List>
</template>

<script>
import { Getuserid } from "@/store/index.js";
import { selectCustomizeMaterialGroup, selectCustomizeMaterial, deleteCustomizeMaterialGroup, deleteCustomizeMaterial } from '@/api/resource/material.js'
import List from "@/components/List/index.vue";
import AddGroup from "./addGroup.vue";
import DialogShare from "./DialogShare.vue";
import DialogPanorama from "./DialogPanorama.vue";

export default {
  components: { List, AddGroup, DialogShare, DialogPanorama },
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
    // 场景编排 预览
    sceneArrange(type = '1') {
      const url = this.$router.resolve({
        name: 'panorama',
        query: { type }
      }).href;
      // 用新窗口打开
      window.open(url, '_blank');
      // this.$router.push({
      //   name: "panorama",
      //   query: {

      //   },
      // });
    },
    getList() {
      this.$emit('update:groupName', '')
      // let params = {
      //   userId: Getuserid()
      // }
      // this.loading = true
      // selectCustomizeMaterialGroup(params).then(res => {
      //   this.loading = false
      //   this.isGroup = true
      //   this.tableData = res.data || []
      //   this.parentData = res.data || []
      //   this.$emit('update:total', this.tableData.length)
      // }).catch(() => {
      //   this.loading = false
      // })
      // 测试
      this.isGroup = true
      this.tableData = [{
        "id": "103146",
        "matImgPath": "https://api.ourbim.com:11023/vjapi/userMaterialMap/ceed1fe7efca428988e9989e1bb3fbec.jpg",
        "userId": "8096717ae4b84f29853e6d423afef811",
        "groupName": "场景分组1",
        "isGroup": "0",
        "groupId": "1ea417c7b7684a15914ce22afd1b492c",
        "sonMaterialList": null,
        "materialTemplate": null,
        "idStrs": null,
        "parentIdStrs": null,
        "parentIds": null,
        "ids": null,
        "start": 0,
        "end": 0,
        "pageNo": 0,
        "pageSize": 0,
        "isUpdateImage": null,
        "materialCount": "2"
      }]
      this.parentData = this.tableData
      this.$emit('update:total', this.tableData.length)
    },
    handleCommand(command, item) {
      switch (command) {
        case 'shareFile':
          if (this.isGroup) {
            this.$refs.DialogShareRef.show(item)
          } else {
            this.$refs.DialogShareRef.show(item)
          }
          break
        case 'editFile':
          if (this.isGroup) {
            this.add(item)
          } else {
            this.uploadPanoramicImage(item)
          }
          break
        case 'downloadFile':
          if (this.isGroup) {
            this.downloadFile(item)
          } else {
            this.downloadFile(item)
          }
          break
        case 'deleteFile':
          this.deleteRow(item)
          break
        default:
          break
      }
    },
    // 分组下的材质
    getTextureList(groupId) {
      // let params = {
      //   userId: Getuserid(),
      //   parentId: groupId,
      // }
      // this.loading = true
      // selectCustomizeMaterial(params).then(res => {
      //   this.loading = false
      //   this.isGroup = false
      //   this.tableData = res.data || []
      //   this.$emit('update:total', this.tableData.length)
      // }).catch(() => {
      //   this.loading = false
      // })
      // 测试
      this.isGroup = false
      this.tableData = [{
        "id": "103372",
        "matPath": "Material'/Game/Materials_PBR/Masters/M_Opaque_PBR.M_Opaque_PBR'",
        "matId": "ceed1fe7efca428988e9989e1bb3fbec",
        "matName": "材质4",
        "matImgPath": "https://api.ourbim.com:11023/vjapi/userMaterialMap/ceed1fe7efca428988e9989e1bb3fbec.jpg",
        "userId": "8096717ae4b84f29853e6d423afef811",
        "isGroup": "1",
        "parentId": "1ea417c7b7684a15914ce22afd1b492c",
        "sonMaterialList": null,
        "materialTemplate": "0",
        "idStrs": null,
        "parentIdStrs": null,
        "parentIds": null,
        "ids": null,
        "start": 0,
        "end": 0,
        "pageNo": 0,
        "pageSize": 0,
        "isUpdateImage": "1",
        "materialCount": null
      }]
      this.$emit('update:total', this.tableData.length)
    },
    // 新建、编辑
    add(row = {}) {
      this.$refs.AddGroupRef.show({ ...JSON.parse(JSON.stringify(row)) })
    },
    // 复制材质球
    copyMeterial(row) {
      this.$refs.CopyMeterialRef.show({ ...JSON.parse(JSON.stringify(row)) })
    },
    // 删除
    deleteRow(row) {
      this.$confirm(`此操作将删除该【${this.isGroup ? row.groupName : row.matName}】${this.isGroup ? '分组及分组下包含的全景图素材' : '全景图素材'}, 是否继续?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        // if (row.isGroup == '0') {
        //   deleteCustomizeMaterialGroup({
        //     groupId: row.groupId
        //   }).then(() => {
        //     this.$message.success('删除成功！')
        //     if (this.isGroup) {
        //       this.getList()
        //     } else {
        //       this.getTextureList(row.parentId)
        //     }
        //   })
        // }
        // if (row.isGroup == '1') {
        //   deleteCustomizeMaterial({
        //     matId: row.matId
        //   }).then(() => {
        //     this.$message.success('删除成功！')
        //     if (this.isGroup) {
        //       this.getList()
        //     } else {
        //       this.getTextureList(row.parentId)
        //     }
        //   })
        // }
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
    // 新增/编辑全景图
    uploadPanoramicImage(row = {}) {
      this.$refs.DialogPanoramaRef.show({ ...JSON.parse(JSON.stringify(row)), groupId: this.parentId })
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