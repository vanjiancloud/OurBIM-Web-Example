<!-- 材质库 -->
<template>
  <div>
    <!-- 点击到二级构件 -->
    <div class="level2" v-if="levels.level === 2">
      <span @click="back" class="backLevel1"><i class="el-icon-arrow-left"></i>{{ levels.tabName }}</span> /
      <span class="level2Item">{{ levels.groupName }}</span>
    </div>
    <!-- 搜索 -->
    <div class="search">
      <el-input v-model="search" size="mini" placeholder="请输入您要搜索的内容" prefix-icon="el-icon-search"
        @change="searchContent()" @keydown.native.stop />
      <el-button v-if="levels.tab2Index === 1" class="button blueBtn1" type="primary" icon="el-icon-plus" size="mini"
        @click="createItem()">{{ levels.level === 1 ? '新建分组' : '新建材质'
        }}</el-button>
    </div>
    <Tab v-model="levels.tab2Index" v-show="levels.level === 1" class="roundTab" :data="typeList" @onTab="onTypeTab" />

    <div class="contentWrap">
      <!-- 内容资源 -->
      <div class="content">
        <!-- @mouseenter="handleMouseEnter(item)" @mouseleave="handleMouseLeave" -->
        <div class="contentItem" v-for="(item, index) in (levels.level === 2 ? contentLevel2List : contentList)"
          :key="index" @click="toLevel2(item)">
          <!-- 公共库操作 -->
          <div class="subOperate" v-if="levels.tab2Index == 0">
            <el-button type="primary" icon="el-icon-document-copy" size="mini" @click.stop="copyMeterial(item)"
              v-if="levels.level == 2"></el-button>
          </div>
          <!-- 个人库操作 -->
          <div class="subOperate" v-if="levels.tab2Index == 1">
            <!-- <i class="el-icon-document-copy"></i>
            <i class="el-icon-edit-outline"></i>
            <i class="el-icon-delete"></i> -->
            <el-button type="primary" icon="el-icon-document-copy" size="mini" @click.stop="copyMeterial(item)"
              v-if="levels.level == 2"></el-button>
            <el-button type="primary" icon="el-icon-edit-outline" size="mini"
              @click.stop="createItem(item)"></el-button>
            <el-button type="primary" icon="el-icon-delete" size="mini" @click.stop="deleteRow(item)"></el-button>
          </div>
          <!-- 项目库操作 -->
          <div class="subOperate" v-if="levels.tab2Index == 2">
            <el-button type="primary" icon="el-icon-edit-outline" size="mini"
              @click.stop="createItem(item)"></el-button>
            <el-button type="primary" icon="el-icon-document-copy" size="mini"
              @click.stop="copyMeterial(item)"></el-button>
          </div>
          <!--  -->
          <el-image class="img" :src="item.matImgPath ? item.matImgPath + `?t=${Date.now()}` : ''" lazy>
            <div slot="placeholder" class="image-slot">
              <img src="@/assets/default/material.png" />
            </div>
            <div slot="error" class="image-slot">
              <img src="@/assets/default/material.png" />
            </div>
          </el-image>
          <div>{{ item.groupName }}</div>
        </div>
        <el-empty :image="require('@/assets/noData.png')" :image-size="100"
          v-if="levels.level === 2 ? !contentLevel2List.length : !contentList.length"></el-empty>
      </div>
    </div>

    <!-- 分页 -->
    <Pagination class="modelPage" layout="prev, pager, next" :pagerCount="5" :limit.sync="pages.pageSize"
      :total="pageDatas.length" :page="pages.page" @pagination="pagination" />

    <!-- 新建/编辑分组 -->
    <DialogsMeterialGroup ref="DialogsMeterialGroup" @getList="refreshData" />
    <!-- 新建/编辑材质 -->
    <DialogMeterial ref="DialogMeterial" @reloadTable="refreshData" />
    <!-- 复制材质球 -->
    <CopyMeterial ref="CopyMeterialRef" @reloadTable="refreshData" />
  </div>
</template>

<script>
import { Getuserid } from "@/store/index.js";
import { throttle } from 'lodash'
import { BASEURL } from '@/utils/newRequest.js'
import { mapGetters, mapState } from 'vuex'
import { getMaterialByGroup, getMaterialFromUser, getOurBIMMaterialGroup, getProjectMaterial } from "@/api/userCenter/resourcePool.js";
import { selectCustomizeMaterialGroup, selectCustomizeMaterial, deleteCustomizeMaterialGroup, deleteCustomizeMaterial, setCustomizeMaterialImage } from '@/api/resource/material.js'
import Tab from "@/components/Tab/index.vue";
import Pagination from "@/components/Pagination/index.vue";
import addMaterial from './addMaterial.js';
import DialogsMeterialGroup from '../../projectManage/resource/meterial/DialogsMeterialGroup.vue';
import DialogMeterial from '../../projectManage/resource/meterial/DialogMeterial.vue';
import CopyMeterial from '../../projectManage/resource/meterial/CopyMeterial.vue';
import { EventBus } from '@/utils/bus.js';

export default {
  components: { Tab, Pagination, DialogsMeterialGroup, DialogMeterial, CopyMeterial },
  mixins: [addMaterial],
  props: {
    data: {
      type: Object,
      default: () => { }
    }
  },
  data() {
    return {
      contentList: [], //一级列表数据
      contentLevel2List: [], //二级列表数据
      search: '',//搜索
      searchToSaveList: [],//因为事前端搜，所以需要一个字段去保存原有的数据一级
      searchToSaveList2: [],//因为是前端搜，所以需要一个字段去保存原有的数据二级
      typeList: [
        {
          name: "公共库",
        },
        {
          name: "个人库",
        },
        {
          name: "项目库",
        },
      ],
      //组名称,tab名称,默认一级
      levels: {
        tabName: "材质库",//当前主模块名称
        groupName: "",//当前分组名称
        level: 1,//当前数据显示的层级 1级分组 2级材质球
        tab2Index: 0,//第二级tab切换(公共库0 个人库1 项目库2)
        activeContent: {},//当前点击内容
        activeLevel1Content: {},//当前点击的一级内容
        activeLevel2Content: {},//当前点击的二级内容
      },
      pageDatas: [],//分页数据
      pages: {
        page: 1, //分页，第几页
        pageSize: 18,
      },
      mouseEnterId: null,
      waitMatId: null,//当前个人材质库中点击替换的材质,等待websocket的id-55消息后在执行替换材质操作
    };
  },
  watch: {

  },
  computed: {
    ...mapGetters(["material", "componentAllInfo", "materialAllInfo"]),
    ...mapState(['cancel'])
  },
  created() { },
  mounted() {
    this.setBus();
  },
  destroyed() {
    EventBus.$off('resourcePoolMaterialListRefresh', this.refreshData)
    EventBus.$off('waitReplaceByMatId', this.waitReplaceByMatId)
  },
  methods: {
    setBus() {
      EventBus.$on('resourcePoolMaterialListRefresh', this.refreshData)
      EventBus.$on('waitReplaceByMatId', this.waitReplaceByMatId)
    },
    async waitReplaceByMatId(rsInfo) {
      await this.refreshData();
      this.getMaterial(rsInfo[0].matId, false, '2')
    },
    handleMouseEnter(item) {
      this.mouseEnterId = item.id
    },
    handleMouseLeave() {
      this.mouseEnterId = null
    },
    // 刷新数据
    async refreshData() {
      switch (this.levels.tab2Index) {
        // 公共库
        case 0:
          if (this.levels.level == 1) {
            this.getPubilcList()
          }
          if (this.levels.level == 2) {
            this.getPubilcList2(this.levels.activeLevel1Content)
          }
          break;
        // 个人库
        case 1:
          if (this.levels.level == 1) {
            this.getUserList()
          }
          if (this.levels.level == 2) {
            this.getUserList2(this.levels.activeLevel1Content)
          }
          break;
        // 项目库
        case 2:
          setTimeout(() => {
            this.getProjectList()
          }, 1000);
          break;
        default:
          break;
      }
    },
    // 点击库类型
    onTypeTab: throttle(function (e) {
      this.levels.tab2Index = e.index;
      this.pages.page = this.$options.data().pages.page
      switch (e.index) {
        // 公共库
        case 0:
          this.getPubilcList()
          break;
        // 个人库
        case 1:
          this.getUserList()
          break;
        // 项目库
        case 2:
          this.getProjectList()
          break;
        default:
          break;
      }
    }, 800),
    // 公共库
    async getPubilcList() {
      this.cancel && this.cancel();
      this.contentList = (await getOurBIMMaterialGroup({ taskId: this.data.taskId })).data
      this.searchToSaveList = JSON.parse(JSON.stringify(this.contentList))
      this.pageDatas = JSON.parse(JSON.stringify(this.contentList))
      this.pageData()
    },
    async getPubilcList2(item) {
      let params = {
        taskId: this.data.taskId,
        groupId: item.groupId,
      };
      this.contentLevel2List = (await getMaterialByGroup(params)).data.map(e => { return { groupName: e.matName, ...e, } })
      this.searchToSaveList2 = JSON.parse(JSON.stringify(this.contentLevel2List))
      this.pageDatas = JSON.parse(JSON.stringify(this.searchToSaveList2))
      this.pageData()
    },
    // 个人库
    async getUserList() {
      this.cancel && this.cancel();
      this.contentList = (await selectCustomizeMaterialGroup({ userId: Getuserid() })).data
      this.searchToSaveList = JSON.parse(JSON.stringify(this.contentList))
      this.pageDatas = JSON.parse(JSON.stringify(this.contentList))
      this.pageData()
      // getMaterialFromUser({userId: this.data.userId}).then((res)=>{
      //     this.contentList = res.data?.length && res.data.map((e) => {
      //             return {
      //                 ...e,
      //                 matImgPath: BASEURL + '/material/'+e.matImgPath,
      //             };
      //         }) || [];
      //     this.searchToSaveList = JSON.parse(JSON.stringify(this.contentList))
      //     this.pageData()
      // })
    },
    async getUserList2(item) {
      let params = {
        userId: Getuserid(),
        parentId: item.groupId,
      };
      this.contentLevel2List = (await selectCustomizeMaterial(params)).data.map(e => { return { groupName: e.matName, ...e, } })
      this.searchToSaveList2 = JSON.parse(JSON.stringify(this.contentLevel2List))
      this.pageDatas = JSON.parse(JSON.stringify(this.searchToSaveList2))
      this.pageData()
    },
    // 项目库
    async getProjectList() {
      this.cancel && this.cancel();
      getProjectMaterial({ taskId: this.data.taskId }).then((res) => {
        this.contentList = res.data?.length && res.data.map((e) => {
          return {
            ...e,
            // matImgPath: BASEURL + '/material/' + e.matImgPath,
            matImgPath: e.matImgPath,
            groupName: e.matName,
          };
        }) || [];
        this.searchToSaveList = JSON.parse(JSON.stringify(this.contentList))
        this.pageDatas = JSON.parse(JSON.stringify(this.contentList))
        this.pageData()
      })
    },
    // 点击返回第一级
    back() {
      this.levels.level = 1;
      this.pages.page = this.$options.data().pages.page
      this.search = ''
      this.searchContent()
    },
    // 搜索内容----前端实现的
    searchContent() {
      this.pages.page = this.$options.data().pages.page
      let newContent = this.levels.level === 2 ? this.searchToSaveList2 : this.searchToSaveList
      if (this.search) {
        if (newContent.length) {
          newContent = newContent.filter(e => { return e.groupName.indexOf(this.search) > -1 })
          if (this.levels.level === 2) {
            this.contentLevel2List = newContent
          } else {
            this.contentList = newContent
          }
          this.pageData(newContent)
        }
      } else {
        if (this.levels.level === 2) {
          this.contentLevel2List = this.searchToSaveList2
        } else {
          this.contentList = this.searchToSaveList
        }
        this.pageData()
      }
    },
    // 点击去二级构件
    async toLevel2(item) {
      this.levels.activeContent = item;
      // 一级分组
      if (this.levels.level === 1) {
        this.levels.activeLevel1Content = item;
        // 清空搜索内容
        this.search = ''
        // 初始化分页
        this.pages = this.$options.data().pages;
        // 当前二级Tab不是项目库时
        if (this.levels.tab2Index !== 2) {
          // 进入二级目录
          this.levels.level = 2;
          // 设置二级目录名称
          this.levels.groupName = item.groupName;
        }
        switch (this.levels.tab2Index) {
          // 公共库
          case 0:
            this.getPubilcList2(item);
            break;
          // 个人库
          case 1:
            this.getUserList2(item);
            break;
          // 项目库
          case 2:
            // 判断是否打开了构件信息面板并且打开了材质信息tab
            if (!this.material.openMaterial || !this.$parent.$parent.openComponent()) {
              return this.$message.warning('请打开材质信息！')
            }
            // 是否单选构件
            if (!this.data.selectPark) {
              return this.$message.warning('请先选择构件！')
            }
            // 先获取要替换的材质信息
            this.getMaterial(item.matId, false, '3')
            break;
          default:
            break;
        }
        return
      }
      // 二级材质球
      if (this.levels.level === 2) {
        this.levels.activeLevel2Content = item;
        switch (this.levels.tab2Index) {
          // 公共库
          case 0:
            if (!this.material.openMaterial || !this.$parent.$parent.openComponent()) {
              return this.$message.warning('请打开材质信息！')
            }
            if (!this.data.selectPark) {
              return this.$message.warning('请先选择构件！')
            }
            // 先获取要替换的材质信息
            this.getMaterial(item.matId, true, '1')
            break;
          // 个人库
          case 1:
            if (!this.material.openMaterial || !this.$parent.$parent.openComponent()) {
              return this.$message.warning('请打开材质信息！')
            }
            if (!this.data.selectPark) {
              return this.$message.warning('请先选择构件！')
            }
            setCustomizeMaterialImage({
              matId: item.matId,
              taskId: this.data.taskId,
            }).then(res => {
              // 先获取要替换的材质信息
              // this.getMaterial(item.matId, false, '2')
              // 更新列表缩略图后在执行替换材质操作
              this.waitMatId = item.matId;
            })
            break;
          // 项目库
          case 2:
            break;
          default:
            break;
        }
      }
    },
    // 分页
    pageData(data) {
      // 后端返回全部数据，前端做数据分页
      let pageList = data || (this.levels.level === 1 ? this.searchToSaveList : this.searchToSaveList2)
      let result = pageList.slice(
        (this.pages.page - 1) * this.pages.pageSize,
        this.pages.page * this.pages.pageSize
      );
      this.pageDatas = pageList
      this.levels.level === 1 ? this.contentList = result : this.contentLevel2List = result
    },
    // 分页
    pagination(e) {
      this.pages.page = e.pageIndex;
      this.pages.pageSize = e.pageSize;
      let pageList = this.levels.level === 1 ? this.searchToSaveList : this.searchToSaveList2
      let result = pageList.slice(
        (this.pages.page - 1) * this.pages.pageSize,
        this.pages.page * this.pages.pageSize
      );
      this.levels.level === 1 ? this.contentList = result : this.contentLevel2List = result
    },
    createItem(item = {}) {
      if (this.levels.tab2Index == 0 || this.levels.tab2Index == 1) {
        if (this.levels.level == 1) {
          // 新建/编辑分组
          this.$refs.DialogsMeterialGroup.show({ ...JSON.parse(JSON.stringify(item)) })
        }
        if (this.levels.level == 2) {
          // 新建/编辑材质
          this.$refs.DialogMeterial.show({ ...JSON.parse(JSON.stringify(item)), groupId: this.levels.activeLevel1Content.groupId })
        }
      } else {
        // 新建/编辑材质
        this.$refs.DialogMeterial.show({ ...JSON.parse(JSON.stringify(item)), groupId: this.levels.activeLevel1Content.groupId })
      }
    },
    // 复制材质球
    copyMeterial(row) {
      this.$refs.CopyMeterialRef.show({ ...JSON.parse(JSON.stringify(row)), tab2Index: this.levels.tab2Index })
    },
    // 删除
    deleteRow(row) {
      this.$confirm(`此操作将删除该【${this.levels.level == 1 ? row.groupName : row.matName}】${this.levels.level == 1 ? '分组及分组下包含的材质球素材' : '材质球素材'}, 是否继续?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        if (row.isGroup == '0') {
          deleteCustomizeMaterialGroup({
            groupId: row.groupId
          }).then(() => {
            this.$message.success('删除成功！');
            this.refreshData();
          })
        }
        if (row.isGroup == '1') {
          deleteCustomizeMaterial({
            matId: row.matId
          }).then(() => {
            this.$message.success('删除成功！');
            this.refreshData();
          })
        }
      })
        .catch(() => { });
    },
  }
};
</script>
<style lang="less" scoped>
.level2 {
  font-size: 16px;
  font-family: PingFangSC-Medium, PingFang SC;
  font-weight: 500;
  color: #ffffff;
  padding: 16px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;

  i {
    margin-right: 5px;
    cursor: pointer;
  }

  .level2Item {
    color: #706c65;
  }

  .backLevel1 {
    cursor: pointer;
  }
}

.contentWrap {
  padding: 0 12px;
  height: calc(100vh - 252px);
  overflow: auto;
}

.content {
  display: flex;
  flex-wrap: wrap;
  align-content: flex-start;
  gap: 10px;

  .contentItem {
    width: (92/3%);
    font-size: 12px;
    font-family: PingFangSC-Regular, PingFang SC;
    color: #ffffff;
    text-align: center;
    cursor: pointer;
    box-sizing: border-box;
    position: relative;

    &:hover .iconBottom {
      display: block;
    }

    .img {
      width: 100%;
      height: 85px;
      object-fit: fill;
      margin-bottom: 8px;
      background: #28292E;
      border-radius: 4px;
      display: flex;
      justify-content: center;
      align-items: center;

      /deep/.el-image__error,
      /deep/.el-image__inner,
      /deep/.el-image__placeholder {
        max-width: 100%;
        max-height: 100%;
        width: auto;
        height: auto;
      }
    }

    >div {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .iconBottom {
      position: absolute;
      bottom: 25px;
      width: 100%;
      height: 32px;
      line-height: 32px;
      background: rgba(37, 39, 40, 0.77);
      border-radius: 0px 0px 2px 2px;
      text-align: center;
      display: none;

      i {
        margin: 0 10px;
      }
    }

    .subOperate {
      position: absolute;
      right: 4px;
      top: 4px;
      z-index: 1;
      display: none;

      button {
        padding: 0;
        font-size: 14px;
        background: rgba(51, 51, 51, 0.8);
        border: 0;
        padding: 2px;

        &:not(:first-child) {
          margin-left: 4px;
        }
      }
    }

    &:hover .subOperate {
      display: block;
    }
  }
}
</style>
