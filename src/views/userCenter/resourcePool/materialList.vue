<!-- 材质库 -->
<template>
    <div>
        <!-- 点击到二级构件 -->
        <div class="level2" v-if="levels.level ===2">
            <span @click="back" class="backLevel1"><i class="el-icon-arrow-left"></i>{{levels.tabName}}</span> / <span class="level2Item">{{levels.groupName}}</span>
        </div>
        <!-- 搜索 -->
        <div class="search">
            <el-input v-model="search" size="mini" placeholder="请输入您要搜索的内容" prefix-icon="el-icon-search" @change="searchContent()" @keydown.native.stop/>
        </div>
        <Tab v-model="levels.tab2Index" v-show="levels.level ===1" class="roundTab" :data="typeList" @onTab="onTypeTab" />

        <div class="contentWrap">
            <!-- 内容资源 -->
            <div class="content">
                <div class="contentItem" v-for="(item,index) in (levels.level ===2 ? contentLevel2List:contentList)" :key="index" @click="toLevel2(item)">
                    <el-image class="img" :src="item.matImgPath" lazy>
                        <div slot="placeholder" class="image-slot">
                            <img src="@/assets/default/material.png"/>
                        </div>
                        <div slot="error" class="image-slot">
                            <img src="@/assets/default/material.png"/>
                        </div>
                    </el-image>
                    <div>{{item.groupName}}</div>
                </div>
                <el-empty :image="require('@/assets/noData.png')" :image-size="100" v-if="levels.level ===2 ? !contentLevel2List.length:!contentList.length"></el-empty>
            </div>
        </div>

        <!-- 分页 -->
        <Pagination class="modelPage" layout="prev, pager, next" :pagerCount="5" :limit.sync="pages.pageSize" 
        :total="pageDatas.length" :page="pages.page" @pagination="pagination" />
    </div>
</template>

<script>
import { throttle } from 'lodash'
import { BASEURL } from '@/utils/newRequest.js'
import { mapGetters, mapState } from 'vuex'
import { getMaterialByGroup, getMaterialFromUser, getOurBIMMaterialGroup, getProjectMaterial } from "@/api/material_api";
import Tab from "@/components/Tab/index.vue";
import Pagination from "@/components/Pagination/index.vue";
import addMaterial from './addMaterial.js'
export default {
    components: { Tab, Pagination },
    mixins:[addMaterial],
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
                {
                    name: "项目库",
                },
            ],
            levels: {
                tabName: "材质库",
                groupName: "",
                level: 1,
                tab2Index: 0,//第二级tab切换
                activeContent: null,
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
        ...mapGetters(["material","componentAllInfo","materialAllInfo"]),
        ...mapState(['cancel'])
    },
    created() { },
    mounted() {},
    methods: {
        // 公共库
        async getPubilcList(){
            this.cancel&&this.cancel();
            this.contentList = (await getOurBIMMaterialGroup({taskId: this.data.taskId})).data
            this.searchToSaveList = JSON.parse(JSON.stringify(this.contentList))
            this.pageDatas = JSON.parse(JSON.stringify(this.contentList))
            this.pageData()
        },
        // 个人库
        async getUserList(){
            this.cancel&&this.cancel();
            this.contentList = []
            this.searchToSaveList = []
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
        // 项目库
        async getProjectList() {
            this.cancel&&this.cancel();
            getProjectMaterial({taskId: this.data.taskId}).then((res)=>{
                this.contentList = res.data?.length && res.data.map((e) => {
                    return {
                        ...e,
                        matImgPath: BASEURL + '/material/'+e.matImgPath,
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
        searchContent(){
            this.pages.page = this.$options.data().pages.page
            let newContent = this.levels.level ===2 ? this.searchToSaveList2 : this.searchToSaveList
            if(this.search){
                if(newContent.length){
                    newContent = newContent.filter(e=>{ return e.groupName.indexOf(this.search)>-1 })
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
                case 2:
                    this.getProjectList()
                    break;
            
                default:
                    break;
            }
        },800),
        // 点击去二级构件
        async toLevel2(item) {
            this.levels.activeContent = item
            if (this.levels.level === 1) {
                this.search = ''
                this.pages = this.$options.data().pages;
                if(this.levels.tab2Index!==2){
                    this.levels.level = 2;
                    this.levels.groupName = item.groupName;
                }

                switch (this.levels.tab2Index) {
                    case 0:
                        let params = {
                            taskId: this.data.taskId,
                            groupId: item.groupId,
                        };
                        this.contentLevel2List = (await getMaterialByGroup(params)).data.map(e=>{return{groupName: e.matName,...e,}})
                        this.searchToSaveList2 = JSON.parse(JSON.stringify(this.contentLevel2List))
                        this.pageDatas = JSON.parse(JSON.stringify(this.searchToSaveList2))
                        break;
                    case 1:
                        
                        break;
                    case 2:
                        if(!this.material.openMaterial||!this.$parent.$parent.openComponent()){
                            return this.$message.warning('请打开材质信息！')
                        }
                        if(!this.data.selectPark){
                            return this.$message.warning('请先选择构件！')
                        }
                        // 先获取要替换的材质信息
                        // this.changeMaterial(item.matId)
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
                switch (this.levels.tab2Index) {
                    case 0:
                        if(!this.material.openMaterial||!this.$parent.$parent.openComponent()){
                            return this.$message.warning('请打开材质信息！')
                        }
                        if(!this.data.selectPark){
                            return this.$message.warning('请先选择构件！')
                        }
                        // 先获取要替换的材质信息
                        this.getMaterial(item.matId)
                        break;
                    case 1:
                        
                        break;
                    case 2:
                        
                        break;
                
                    default:
                        break;
                }
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
