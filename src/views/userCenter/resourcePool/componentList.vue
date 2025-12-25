<!-- 构件库 -->
<template>
  <div style="height: 100%;">
    <!-- 面包屑导航 -->
    <div class="level2" v-if="levels.level === 2">
      <span @click="back" class="backLevel1"><i class="el-icon-arrow-left"></i>{{ levels.tabName }}</span>
      <span @click="toCadLevel1" :class="levels.cadGroupName ? 'backLevel1' : 'level2Item'" v-if="levels.groupName"> /
        {{ levels.groupName
        }}</span>
      <span class="level2Item" v-if="levels.cadGroupName"> / {{ levels.cadGroupName }}</span>
    </div>
    <!-- 搜索 -->
    <div class="search" v-if="!levels.hideContent">
      <el-input v-model="search" size="mini" placeholder="请输入您要搜索的内容" prefix-icon="el-icon-search"
        @input="searchContent()" @keydown.native.stop />
    </div>
    <!-- 切换公共/个人 tabs -->
    <Tab v-model="levels.tab2Index" v-show="levels.level === 1" class="roundTab" :data="typeList" @onTab="onTypeTab" />
    <!-- 主体内容 -->
    <div class="contentWrap">
      <!-- 导入图纸 -->
      <Drawing ref="Drawing" :levels="levels" :data="{ ...data }" @toDrawLevel="toDrawLevel"
        @setCadGroupName="setCadGroupName" />
      <!-- 构件内容资源 -->
      <div class="content" v-if="!levels.hideContent">
        <div class="contentItem" v-for="(item, index) in (levels.level === 2 ? contentLevel2List : contentList)"
          :key="index" @click="toLevel2(item)">
          <el-image class="img" :src="item.comUrl" lazy>
            <div slot="placeholder" class="image-slot">
              <img src="@/assets/default/model.png" v-if="levels.tab2Index === 0" />
              <img src="@/assets/default/component.png" v-if="levels.tab2Index === 1" />
            </div>
            <div slot="error" class="image-slot">
              <img src="@/assets/default/model.png" v-if="levels.tab2Index === 0" />
              <img src="@/assets/default/component.png" v-if="levels.tab2Index === 1" />
            </div>
          </el-image>
          <div>{{ item.comName }}</div>
        </div>
        <el-empty :image="require('@/assets/noData.png')" :image-size="100"
          v-if="levels.level === 2 ? !contentLevel2List.length : !contentList.length"></el-empty>
      </div>
    </div>

    <!-- 分页 -->
    <Pagination v-if="!levels.hideContent" class="modelPage" layout="prev, pager, next" :pagerCount="5"
      :limit.sync="pages.pageSize" :total="pageDatas.length" :page="pages.page" @pagination="pagination" />
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { throttle } from 'lodash'
import Tab from "@/components/Tab/index.vue";
import Pagination from "@/components/Pagination/index.vue";
import { getPublicList, addCom } from "@/api/userCenter/resourcePool.js";
import MODELAPI from "@/api/model_api";
import Drawing from "./drawing.vue"; //导入图纸
import { addObject, addComponent, parametricComponentDraw, parametricComponentEdit } from '@/api/userCenter/drawMenu.js';

export default {
  components: { Tab, Pagination, Drawing },
  props: {
    data: {
      type: Object,
      default: () => { }
    }
  },
  data() {
    return {
      search: '',//搜索
      typeList: [
        {
          name: "公共库",
        },
        {
          name: "个人库",
        },
      ],
      levels: {
        tabName: "构件库",
        groupName: "",
        level: 1,
        tab2Index: 0,//第二级tab切换
        hideContent: false, //隐藏content
        activeContent: {},//
        activeLevel1Content: {},//
        activeLevel2Content: {},//
        cadGroupName: '',//图纸分组名称
      },
      contentList: [], //一级列表数据
      contentLevel2List: [], //二级列表数据
      searchToSaveList: [],//因为是前端搜，所以需要一个字段去保存原有的数据一级
      searchToSaveList2: [],//因为是前端搜，所以需要一个字段去保存原有的数据二级
      pageDatas: [],//分页数据
      pages: {
        page: 1, //分页，第几页
        pageSize: 18,
      },
      // 历史页码状态保存
      savedPageState: {
        page: 1,
        search: ''
      },
      //建筑结构一级数据
      buildingStructure: [
        {
          id: 'buildStructure',
          group: '建筑结构',
          comName: '建筑结构',
          comUrl: require('@/assets/images/resourcePool/build.png'),
          rsComponent: [
            {
              id: 'generalWall',
              parentId: "buildStructure",
              comUrl: require('@/assets/images/resourcePool/wall-0.png'),
              comName: '直墙'
            },
            {
              id: 'arcWall',
              parentId: "buildStructure",
              comUrl: require('@/assets/images/resourcePool/wall-1-ourbim.png'),
              comName: '弧形墙'
            },
            {
              id: 'singleDoor',
              parentId: "buildStructure",
              comUrl: require('@/assets/images/resourcePool/door-0.png'),
              comName: '单开门'
            },
            {
              id: 'doubleDoor',
              parentId: "buildStructure",
              comUrl: require('@/assets/images/resourcePool/door-1.png'),
              comName: '双开门'
            },
            {
              id: 'slidingDoor',
              parentId: "buildStructure",
              comUrl: require('@/assets/images/resourcePool/door-2.png'),
              comName: '推拉门'
            },
            {
              id: 'commonWindow',
              parentId: "buildStructure",
              comUrl: require('@/assets/images/resourcePool/door-3.png'),
              comName: '普通窗户'
            },
            {
              id: 'onelineBayWindow',
              parentId: "buildStructure",
              comUrl: require('@/assets/images/resourcePool/door-4.png'),
              comName: '飘窗'
            },
            {
              id: 'frenchWindow',
              parentId: "buildStructure",
              comUrl: require('@/assets/images/resourcePool/door-5.png'),
              comName: '落地窗'
            },
            {
              id: 'squareFlue',
              parentId: "buildStructure",
              comUrl: require('@/assets/images/resourcePool/door-8.png'),
              comName: '方形烟道'
            },
            {
              id: 'squarePillar',
              parentId: "buildStructure",
              comUrl: require('@/assets/images/resourcePool/build-0.png'),
              comName: '矩形柱'
            },
            {
              id: 'beam',
              parentId: "buildStructure",
              comUrl: require('@/assets/images/resourcePool/build-2.png'),
              comName: '梁'
            },
          ]
        }
      ],
      //机电管线一级数据
      pipeline: [
        {
          id: 'pipeline',
          group: '机电管线',
          comName: '机电管线',
          comUrl: require('@/assets/images/resourcePool/pipeline.png'),
          rsComponent: [
            {
              id: 'rectangle',
              parentId: "pipeline",
              comUrl: require('@/assets/images/resourcePool/pipe-1.png'),
              comName: '矩形管道'
            },
            // {
            //   id: 'conn',
            //   parentId: "pipeline",
            //   comUrl: require('@/assets/images/resourcePool/pipe-2.png'),
            //   comName: '槽型管件'
            // },
            {
              id: 'circle',
              parentId: "pipeline",
              comUrl: require('@/assets/images/resourcePool/pipe-3.png'),
              comName: '圆形管道'
            },
            {
              id: 'ellipse',
              parentId: "pipeline",
              comUrl: require('@/assets/images/resourcePool/pipe-4.png'),
              comName: '椭圆形管道'
            },
            // {
            //   id: 'conn',
            //   parentId: "pipeline",
            //   comUrl: require('@/assets/images/resourcePool/pipe-5.png'),
            //   comName: '矩形管件'
            // },
            {
              id: 'groove',
              parentId: "pipeline",
              comUrl: require('@/assets/images/resourcePool/pipe-6.png'),
              comName: '槽型管道'
            },
            {
              id: 'conn',
              parentId: "pipeline",
              comUrl: require('@/assets/images/resourcePool/pipe-7.png'),
              comName: '连接管件'
            },
            // {
            //   id: 'conn',
            //   parentId: "pipeline",
            //   comUrl: require('@/assets/images/resourcePool/pipe-8.png'),
            //   comName: '椭圆形管件'
            // }
          ]
        }
      ],
      buildDraw: {
        activeDraw: '',
      }
    };
  },
  watch: {},
  computed: {
    ...mapState(['cancel']),
    topStore() {
      return this.$store.state.top
    },
    designStore() {
      return this.$store.state.design
    },
  },
  created() { },
  mounted() { },
  methods: {
    setCadGroupName(name) {
      this.levels.cadGroupName = name
    },
    toCadLevel1() {
      this.levels.cadGroupName = '';
      this.$refs.Drawing.setCadLevel(1);
      this.$refs.Drawing.getList();
    },
    // 刷新数据
    refreshData() {
      switch (this.levels.tab2Index) {
        // 公共库
        case 0:
          if (this.levels.level == 1) {
            this.getPubilcList()
          }
          if (this.levels.level == 2) {
            this.getPublicList2(this.levels.activeLevel1Content)
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
        default:
          break;
      }
    },
    // 公共库
    getPubilcList() {
      this.cancel && this.cancel();
      if (this.$refs.Drawing) {
        this.$refs.Drawing.drawingList = this.$refs.Drawing.$options.data().drawingList//图纸数据初始化
      }
      getPublicList({ taskId: this.data.taskId }).then(res => {
        let apiContentList = res.data.map(e => {
          return {
            ...e,
            comName: e.group,
            comUrl: e.rsComponent?.[0]?.comUrl
          }
        })
        // 加入自定义建筑结构
        this.contentList = [...this.buildingStructure, ...this.pipeline, ...apiContentList];
        this.searchToSaveList = JSON.parse(JSON.stringify(this.contentList))
        this.pageDatas = JSON.parse(JSON.stringify(this.contentList))
        this.pageData()
      })
    },
    // 公共库二级
    getPublicList2(item) {
      this.contentLevel2List = item.rsComponent
      this.searchToSaveList2 = JSON.parse(JSON.stringify(this.contentLevel2List))
      this.pageDatas = JSON.parse(JSON.stringify(this.searchToSaveList2))
    },
    // 个人库
    async getUserList() {
      this.cancel && this.cancel();
      this.contentList = (await MODELAPI.GETALLCOM({ userId: this.data.userId })).data.data;
      this.contentList = this.contentList?.length && this.contentList[0].data.map((e) => {
        return {
          comUrl: e.data?.[0]?.ourbimComponentInfo?.comUrl,
          comName: e.groupName,
          rsComponent: e.data,
          ...e,
        };
      }) || [];
      this.searchToSaveList = JSON.parse(JSON.stringify(this.contentList))
      this.pageDatas = JSON.parse(JSON.stringify(this.contentList))
      this.pageData()
    },
    // 个人库二级
    async getUserList2(item) {
      this.contentLevel2List = item?.rsComponent ? item.rsComponent.map((e) => {
        return {
          comName: e.ourbimComponentInfo.comName,
          comUrl: e.ourbimComponentInfo.comUrl,
          ...e,
        };
      }) : [];
      this.searchToSaveList2 = JSON.parse(JSON.stringify(this.contentLevel2List))
      this.pageDatas = JSON.parse(JSON.stringify(this.searchToSaveList2))
    },
    // 点击返回第一级
    back() {
      this.levels.level = 1;
      // 恢复之前保存的页面状态
      this.pages.page = this.savedPageState.page;
      this.search = this.savedPageState.search;
      // this.pages.page = this.$options.data().pages.page
      // this.search = ''
      this.levels.hideContent = false
      this.levels.cadGroupName = ''
      // this.searchContent()
      // 直接处理数据，不调用searchContent()避免页码被重置
      let newContent = this.searchToSaveList
      if (this.search) {
        if (newContent.length) {
          newContent = newContent.filter(e => { return e.comName.indexOf(this.search) > -1 })
          this.contentList = newContent
        }
      } else {
        this.contentList = this.searchToSaveList
      }
      this.pageData(newContent)
    },
    // 搜索内容----前端实现的
    searchContent() {
      this.pages.page = this.$options.data().pages.page
      let newContent = this.levels.level === 2 ? this.searchToSaveList2 : this.searchToSaveList
      if (this.search) {
        if (newContent.length) {
          newContent = newContent.filter(e => { return e.comName.indexOf(this.search) > -1 })
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
    // 切换库类型
    onTypeTab(e) {
      this.levels.tab2Index = e.index;
      this.pages.page = this.$options.data().pages.page
      this.search = this.$options.data().search;
      this.contentList = this.$options.data().contentList;
      this.contentLevel2List = this.$options.data().contentLevel2List;
      switch (e.index) {
        case 0:
          this.getPubilcList()
          break;
        case 1:
          this.getUserList()
          break;
        default:
          break;
      }
    },
    // 点击去二级构件
    async toLevel2(item) {
      this.levels.activeContent = item;
      // 一级点击
      if (this.levels.level === 1) {
        // 保存当前页面状态
        this.savedPageState.page = this.pages.page;
        this.savedPageState.search = this.search;
        // 
        this.levels.activeLevel1Content = item;
        this.search = ''
        this.pages = this.$options.data().pages;
        this.levels.level = 2;
        this.levels.groupName = item.comName;
        switch (this.levels.tab2Index) {
          case 0:
            this.getPublicList2(item)
            break;
          case 1:
            this.getUserList2(item)
            break;
          default:
            break;
        }
        // 后端返回全部数据，前端做数据分页
        this.pageData()
        return
      }
      //  二级点击
      if (this.levels.level === 2) {
        // 建筑结构部分(摩方迁移)
        if (item.parentId == "buildStructure") {
          this.setBuildStructure(item);
        }
        // 机电管件部分
        else if (item.parentId == "pipeline") {
          this.setPipeline(item);
        }
        // 套线结构部分(摩方迁移)
        else if (['门套线', '木饰线', '地板', '瓷砖', '瓦片', '扶手线', '石膏线', '石套线', '地脚线', '灯槽线'].includes(item.comName)) {
          if (item.comName == '灯槽线') {
            this.$store.dispatch('design/changeDrawType', 1);
          }
          this.$store.commit('design/changeLibNode', item);
          this.onChangeNode(item);
        }
        // 其他部分(原公共库构件)
        else {
          this.levels.activeLevel2Content = item;
          let data = {
            taskId: this.data.taskId,
            comName: item.comName,
            comId: this.levels.tab2Index === 1 ? item.ourbimComponentInfo.comId : item.id,
            userId: item.userId
          }
          addCom(data).then(res => {
            this.$parent.$parent.hideTool();//隐藏工具
            this.$message.success('指令下发成功');
          })
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
    // 点击图纸
    toDrawLevel(val) {
      this.search = ''
      this.pages = this.$options.data().pages;
      this.levels.level = val.level;
      this.levels.groupName = val.name;
      this.levels.hideContent = true
    },
    // 绘制建筑结构
    setBuildStructure(e) {
      // this.buildDraw.activeDraw = this.buildDraw.activeDraw == e.id ? null : e.id;
      this.buildDraw.activeDraw = e.id;
      const params = {
        taskId: this.data.taskId,
        type: e.id
      }
      // 开始绘制
      if (this.buildDraw.activeDraw) {
        this.$store.dispatch('bim/changeMode', { e: '2D' }).then(() => {
          if (e.id == 'generalWall' || e.id == 'arcWall') {
            this.$store.dispatch('design/changeDrawType', 0);
          }
          addObject(params)
        })
      } else {
        // 结束绘制
        this.$store.dispatch('design/changeDrawType', null);
      }
    },
    // 绘制机电管线
    async setPipeline(item) {
      // rectangle（矩形截面）,groove（槽形截面）, circle（圆形截面）, ellipse（椭圆形截面）  
      if (['rectangle', 'groove', 'circle', 'ellipse', 'conn'].includes(item.id)) {
        const pipelineForm = this.$store.state.design.pipelineForm;
        // await parametricComponentEdit({ taskId: this.data.taskId }, {
        //   function: "editor",
        //   bActivate: true     //绘制模式是否激活
        // })
        await parametricComponentDraw({
          taskId: this.data.taskId,
        }, {
          function: "draw",
          bActivate: true, //绘制模式是否激活
          type: item.id,
          width: pipelineForm.width,
          height: pipelineForm.height,
          thickness: pipelineForm.thickness,
          diameter: pipelineForm.diameter,
          planeHeight: pipelineForm.planeHeight,
        }).then(res => {
          this.$store.commit('design/changePipelineType', item.id);
          this.$store.dispatch('design/changeDrawType', 4);
        })
      }
    },
    // 绘制套线结构
    onChangeNode(item) {
      const _this = this;
      if (!item.type === 'pave') {
        _this.$store.dispatch('design/changeDrawType', null);
      }
      if (item && item.type === 'spline') {
        _this.$store.dispatch('design/changeDrawType', 1);
      }
      if (item && item.type === 'pave') {
        if (this.topStore.topType !== 1) {
          _this.$message.warning('请先进行面层设计')
          return
        }
        _this.$store.dispatch('design/changeDrawType', 2);
      }
      setTimeout(() => {
        this.addComponentInfo(item)
      }, 200);
    },
    addComponentInfo(item) {
      const _this = this;
      const { memberId, memberInfo, bimUserId } = this.designStore;
      const { faceTypeData, paveType } = this.topStore;
      try {
        const params = {
          taskId: this.data.taskId,
          comName: item.comName,
          comId: item.comIdCustom,
          userId: bimUserId,
        }
        if (item.type === 'spline') {
          params.skirtingLineType = item.defaultType;
          // params.lineGroupType = item.comName;
        } else if (item.type === 'pave') {
          params.pave = paveType;
        }
        params.skirtingLineType = this.topStore.styleLine || item.defaultType
        // 
        let data = {}
        let size = item.defaultValue && JSON.parse(item.defaultValue)
        if (item.type === 'pave') {
          data.id = memberId
          data.meshID = item.comIdCustom
          const typeObj = memberInfo.find(item => item.key === 'rootTypeInfo')
          data.type = typeObj.type
          let paveObj = faceTypeData.find(item => item.type === paveType)
          paveObj.params.lengthOfUnit = size.length
          paveObj.params.widthOfUnit = size.width
          data = { ...data, ...paveObj.params }
        }
        // 
        addComponent(params, data).then(() => {
          _this.$message.success('指令下发成功');
        })
      } catch (err) {
        _this.$message.warning('请先选择面层');
        console.log(err)
      }
    }
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
  height: calc(100% - 252px);
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
        // max-width: 100%;
        // max-height: 100%;
        // width: auto;
        // height: auto;
        height: 100%;
        width: 100%;
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
  }
}
</style>