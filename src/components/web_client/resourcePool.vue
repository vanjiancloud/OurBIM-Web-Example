<!-- 构件库 -->
<template>
  <el-drawer
    title="资源库"
    :visible.sync="drawer"
    v-if="drawer"
    direction="ltr"
    :modal="false"
    :wrapperClosable="false"
    :size="300"
    :before-close="close"
    class="newDrawer"
  >
    <Tab v-show="levelName.level ===1" :data="tabList" @onTab="onTab" />
    <!-- 点击到二级构件 -->
    <div class="level2" v-if="levelName.level ===2">
      <i class="el-icon-arrow-left" @click="back"></i>
      <span>{{levelName.groupName}} / <span class="level2Item">{{levelName.tabName}}</span></span>
    </div>
    <div class="search">
      <el-input
        v-model="search"
        size="mini"
        placeholder="请输入您要搜索的内容"
        prefix-icon="el-icon-search"
      >
      </el-input>
      <el-button v-if="levelName.tab1Index ===2" class="button" type="primary" icon="el-icon-plus" size="mini" @click="createGroup">新建分组</el-button>
    </div>
    <Tab v-show="levelName.level ===1" class="roundTab" :data="typeList" @onTab="onTypeTab" />
    <!-- 内容资源 -->
    <div class="content">
      <div class="contentItem" v-for="(item,index) in (levelName.level ===2 ? contentLevel2ListPage:contentList[levelName.tab2Index])" :key="index" @click="toLevel2(item)">
        <el-image class="img" :src="item.comUrl" lazy></el-image>
        <div>{{item.comName}}</div>
      </div>
    </div>
    <!-- 二级才显示分页 -->
    <Pagination v-show="levelName.level ===2" :total="contentLevel2List.length" :page="pages.page" :pageSize="pages.pageSize" @pagination="pagination"  />
    <!-- 创建分组，上传贴图 -->
    <DialogChartlet ref="DialogChartlet"/>
  </el-drawer>
</template>

<script>
import CHAILIAOAPI from "@/api/material_api";
import MODELAPI from "@/api/model_api";
import COMPONENTLIBRARY from "@/api/component-library";
import Tab from "@/components/Tab/index.vue";
import Pagination from "@/components/Pagination/index.vue";
import DialogChartlet from "@/components/web_client/DialogChartlet.vue"; // 上传贴图弹框
export default {
  components: { Tab, Pagination, DialogChartlet },
  props: {
    taskId:{
      type: String,
    },
    userId:{
      type: [String,Number],
    }
  },
  data() {
    return {
      drawer: false,
      tabList: [
        {
          name: "构件库",
        },
        {
          name: "材质库",
        },
        {
          name: "贴图库",
        },
      ],
      typeList: [
        {
          name: "公共库",
        },
        {
          name: "个人库",
        },
      ],
      search: "",
      contentList:[],//库
      contentLevel2List: [],//二级
      contentLevel2ListPage: [], //分页数据
      levelName: { groupName:'',tab1Index: 0, tab2Index: 0,tabName:'构件库', level: 1 }, //构件组名称,tab名称,默认一级
      pages:{
        page: 1, //分页，第几页
        pageSize:18
      },
    };
  },
  watch: {},
  computed: {},
  created() {},
  mounted() {
    
  },
  methods: {
    show() {
      this.drawer = true;
      this.content()
    },
    hide() { 
      Object.assign(this.$data, this.$options.data())
      this.drawer = false;
      
    },
    close() {
      Object.assign(this.$data, this.$options.data())
      this.$parent.closePart(14);
    },
    // 点击tab
    onTab(e) {
      this.levelName.tabName = e.name
      this.levelName.tab1Index = e.index
      this.contentList = []
      this.typeList = this.$options.data().typeList
      switch (e.index) {
        case 0:
          this.content()
          break;
        case 1:
          this.typeList = this.typeList.slice(0,1)
          this.getMaterials()
          break;
        case 2:
          
          break;
      
        default:
          break;
      }
    },
    // 点击库类型
    onTypeTab(e){
      this.levelName.tab2Index = e.index
    },
    // 点击返回第一级
    back(){
      this.levelName.level = 1
    },
    // 点击去二级构件
    toLevel2(item){
      if(this.levelName.level === 1){
        this.pages = this.$options.data().pages
        this.levelName.level = 2
        this.levelName.groupName = item.comName
        switch (this.levelName.tab1Index) {
          case 0:
              this.contentLevel2List = item.rsComponent
              if(item.data&&item.data.length){
                this.contentLevel2List = item.rsComponent.map(e=>{return{comName:e.ourbimComponentInfo.comName,comUrl:e.ourbimComponentInfo.comUrl,...e}})
              }
            break;
          case 1:
            let params = {
              taskId:this.taskId,
              groupId:item.groupId
            }
            CHAILIAOAPI.GETOURBIMMATERIALBYGROUP(params).then(res=>{
              this.contentLevel2List = res.data.data.map(e=>{return{comName:e.matName,comUrl:e.matImgPath,...e}})
            })
            break;
              
          default:
            break;
          }       
          // 后端返回全部数据，前端做数据分页
          this.contentLevel2ListPage = this.contentLevel2List.slice((this.pages.page - 1)*this.pages.pageSize,this.pages.page*this.pages.pageSize)
      }
    },
    // 构件库
    async content(){
      // 获取公共库
      let publicList = ((await COMPONENTLIBRARY.getPublicComList({taskId: this.taskId})).data.data);
      publicList = publicList.length && publicList.map(e=>{return { comUrl:e.rsComponent?.[0].comUrl,comName:e.group,...e }});
      // 获取个人库
      const { userId } = this.$route.query;
      let selfList = (await MODELAPI.GETALLCOM({userId})).data.data;
      selfList = selfList.length && selfList[0].data.map(e=>{return { comUrl:e.data?.[0].ourbimComponentInfo.comUrl,comName:e.groupName,rsComponent:e.data,...e }});
      this.contentList = [
        publicList,
        selfList
      ]
      
    },
    // 材质库
    getMaterials(){
      CHAILIAOAPI.GETOURBIMMATERIALGROUP({taskId:this.taskId}).then((res)=>{
        let publicList = res.data.data.map(e=>{
          return { comUrl:e.matImgPath,comName:e.groupName,...e }
        })
        this.contentList = [
          publicList
        ]
      })
    },
    // 分页
    pagination(e){
      this.pages.page = e.pageIndex
      this.pages.pageSize = e.pageSize
      this.contentLevel2ListPage = this.contentLevel2List.slice((e.pageIndex - 1)*e.pageSize,e.pageIndex*e.pageSize)
    },
    createGroup(){
      this.$refs.DialogChartlet.show()
    }
  },
};
</script>
<style lang="less" scoped>
.level2{
  font-size: 16px;
  font-family: PingFangSC-Medium, PingFang SC;
  font-weight: 500;
  color: #FFFFFF;
  padding: 0 16px 16px 16px;
  i{
    margin-right: 5px;
    cursor: pointer;
  }
  .level2Item{
    color: #706c65;
  }
}
.content{
  display: flex;
  flex-wrap: wrap;
  align-content: flex-start;
  height: calc(100vh - 200px);
  overflow: auto;
  .contentItem{
    width: (100/3%);
    font-size: 12px;
    font-family: PingFangSC-Regular, PingFang SC;
    color: #FFFFFF;
    text-align: center;
    padding: 10px;
    cursor: pointer;
    box-sizing: border-box;
    .img{
      width: 100%;
      height: 85px;
      object-fit: fill;
      margin-bottom: 8px;
    }
    >div{
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
}
</style>
