<!-- 构件库 -->
<template>
    <div>
        <!-- 点击到二级构件 -->
        <div class="level2" v-if="levels.level ===2">
            <span @click="back" class="backLevel1"><i class="el-icon-arrow-left"></i>{{levels.tabName}}</span> / <span class="level2Item">{{levels.groupName}}</span>
        </div>
        <!-- 搜索 -->
        <div class="search" v-if="!levels.hideContent">
            <el-input v-model="search" size="mini" placeholder="请输入您要搜索的内容" prefix-icon="el-icon-search" @change="searchContent()" @keydown.native.stop/>
        </div>
        <Tab v-model="levels.tab2Index" v-show="levels.level ===1" class="roundTab" :data="typeList" @onTab="onTypeTab" />

        <div class="contentWrap">
            <!-- 导入图纸 -->
            <Drawing ref="Drawing" :levels="levels" :data="{taskId:data.taskId}" @toDrawLevel="toDrawLevel" />
            <!-- 内容资源 -->
            <div class="content" v-if="!levels.hideContent">
                <div class="contentItem" v-for="(item,index) in (levels.level ===2 ? contentLevel2List:contentList)" :key="index" @click="toLevel2(item)">
                    <el-image class="img" :src="item.comUrl" lazy>
                        <div slot="placeholder" class="image-slot">
                            <img src="@/assets/default/component.png" v-if="levels.tab2Index ===1"/>
                            <img src="@/assets/default/model.png" v-if="levels.tab2Index ===0"/>
                        </div>
                        <div slot="error" class="image-slot">
                            <img src="@/assets/default/component.png" v-if="levels.tab2Index ===1"/>
                            <img src="@/assets/default/model.png" v-if="levels.tab2Index ===0"/>
                        </div>
                    </el-image>
                    <div>{{item.comName}}</div>
                </div>
                <el-empty :image="require('@/assets/noData.png')" :image-size="100" v-if="levels.level ===2 ? !contentLevel2List.length:!contentList.length"></el-empty>
            </div>
        </div>

        <!-- 分页 -->
        <Pagination v-if="!levels.hideContent" class="modelPage" layout="prev, pager, next" :pagerCount="5" :limit.sync="pages.pageSize" 
        :total="pageDatas.length" :page="pages.page" @pagination="pagination" />
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
export default {
    components: { Tab, Pagination, Drawing },
    props: {
        data: {
            type: Object,
            default:()=> {}
        }
    },
    data() {
        return {
            search:'',//搜索
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
                hideContent: false //隐藏content
            }, //组名称,tab名称,默认一级
            contentList: [], //一级列表数据
            contentLevel2List: [], //二级列表数据
            searchToSaveList:[],//因为事前端搜，所以需要一个字段去保存原有的数据一级
            searchToSaveList2:[],//因为是前端搜，所以需要一个字段去保存原有的数据二级
            pageDatas:[],//分页数据
            pages: {
                page: 1, //分页，第几页
                pageSize: 18,
            },
        };
    },
    watch: {},
    computed: {
        ...mapState(['cancel'])
    },
    created() { },
    mounted() {},
    methods: {
        // 公共库
        getPubilcList(){
            this.cancel&&this.cancel();
            if(this.$refs.Drawing){
                this.$refs.Drawing.drawingList = this.$refs.Drawing.$options.data().drawingList//图纸数据初始化
            }
            getPublicList({ taskId: this.data.taskId }).then(res => {
                this.contentList = res.data.map(e=>{
                    return {
                        ...e,
                        comName: e.group,
                        comUrl: e.rsComponent?.[0]?.comUrl
                    }
                })
                this.searchToSaveList = JSON.parse(JSON.stringify(this.contentList))
                this.pageDatas = JSON.parse(JSON.stringify(this.contentList))
                this.pageData()
            })
        },
        // 个人库
        async getUserList(){
            this.cancel&&this.cancel();
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
        // 点击返回第一级
        back() {
            this.levels.level = 1;
            this.pages.page = this.$options.data().pages.page
            this.search = ''
            this.levels.hideContent = false
            this.searchContent()
        },
        // 搜索内容----前端实现的
        searchContent(){
            this.pages.page = this.$options.data().pages.page
            let newContent = this.levels.level ===2 ? this.searchToSaveList2 : this.searchToSaveList
            if(this.search){
                if(newContent.length){
                    newContent = newContent.filter(e=>{ return e.comName.indexOf(this.search)>-1 })
                    if(this.levels.level === 2){
                        this.contentLevel2List = newContent
                    }else{
                        this.contentList = newContent
                    }
                    this.pageData(newContent)
                }
            }else{
                if(this.levels.level ===2){
                    this.contentLevel2List = this.searchToSaveList2
                }else{
                    this.contentList = this.searchToSaveList
                }
                this.pageData()
            }
        },
        // 点击库类型
        onTypeTab:throttle(function(e) {
            this.levels.tab2Index = e.index;
            this.pages.page = this.$options.data().pages.page
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
        },800),
        // 点击去二级构件
        async toLevel2(item) {
            if (this.levels.level === 1) {
                this.search = ''
                this.pages = this.$options.data().pages;
                this.levels.level = 2;
                this.levels.groupName = item.comName;

                switch (this.levels.tab2Index) {
                    case 0:
                        this.contentLevel2List = item.rsComponent
                        this.searchToSaveList2 = JSON.parse(JSON.stringify(this.contentLevel2List))
                        this.pageDatas = JSON.parse(JSON.stringify(this.searchToSaveList2))
                        break;
                    case 1:
                        this.contentLevel2List = item.rsComponent.map((e) => {
                                return {
                                    comName: e.ourbimComponentInfo.comName,
                                    comUrl: e.ourbimComponentInfo.comUrl,
                                    ...e,
                                };
                            });
                        this.searchToSaveList2 = JSON.parse(JSON.stringify(this.contentLevel2List))
                        this.pageDatas = JSON.parse(JSON.stringify(this.searchToSaveList2))
                        break;
                
                    default:
                        break;
                }
                // 后端返回全部数据，前端做数据分页
                this.pageData()
                return
            }
            /*  
              *  二级点击
              * 
            */
            if (this.levels.level === 2) {
                let data = {
                    taskId: this.data.taskId,
                    comName: item.comName,
                    comId: this.levels.tab2Index === 1 ? item.ourbimComponentInfo.comId : item.id,
                    userId: item.userId
                }
                addCom(data).then(res=>{
                    this.$parent.$parent.hideTool();//隐藏工具
                    this.$message.success('指令下发成功');
                })
            }
        },
        // 分页
        pageData(data){
            // 后端返回全部数据，前端做数据分页
            let pageList = data||(this.levels.level === 1 ? this.searchToSaveList : this.searchToSaveList2)
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
        toDrawLevel(val){
            this.search = ''
            this.pages = this.$options.data().pages;
            this.levels.level = val.level;
            this.levels.groupName = val.name;
            this.levels.hideContent = true
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
    .backLevel1{
        cursor: pointer;
    }
}
.contentWrap{
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
            /deep/.el-image__error, /deep/.el-image__inner, /deep/.el-image__placeholder{
                max-width: 100%;
                max-height: 100%;
                width: auto;
                height: auto;
            }
        }
        > div {
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