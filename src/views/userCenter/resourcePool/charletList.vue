<!-- 贴图库 -->
<template>
    <div>
        <!-- 点击到二级构件 -->
        <div class="level2" v-if="levels.level ===2">
            <span @click="back" class="backLevel1"><i class="el-icon-arrow-left"></i>{{levels.tabName}}</span> / <span class="level2Item">{{levels.groupName}}</span>
        </div>
        <!-- 搜索 -->
        <div class="search">
            <el-input v-model="search" size="mini" placeholder="请输入您要搜索的内容" prefix-icon="el-icon-search" @change="searchContent()" @keydown.native.stop/>
            <el-button v-if="levels.tab2Index===1" class="button" :class="{blueBtn1:levels.level ===1,blueBtn1:levels.level ===2}" 
            type="primary" icon="el-icon-plus" size="mini" @click="createGroup(levels.level ===1?'新建分组':'上传贴图')">{{levels.level ===1?'新建分组':'上传贴图'}}</el-button>
        </div>
        <Tab v-model="levels.tab2Index" v-show="levels.level ===1" class="roundTab" :data="typeList" @onTab="onTypeTab" />

        <div class="contentWrap">
            <!-- 内容资源 -->
            <div class="content">
                <div class="contentItem" v-for="(item,index) in (levels.level ===2 ? contentLevel2List:contentList)" :key="index" @click="toLevel2(item)">
                    <el-image class="img" :src="item.imgPath" lazy>
                        <div slot="placeholder" class="image-slot">
                            <img src="@/assets/default/material.png"/>
                        </div>
                        <div slot="error" class="image-slot">
                            <img src="@/assets/default/material.png"/>
                        </div>
                    </el-image>
                    <div>{{item.groupName}}</div>
                    <!-- 贴图-个人图的编辑删除 -->
                    <div class="iconBottom" v-if="levels.tab2Index ===1">
                        <i class="el-icon-edit editIcon" @click.stop="createGroup(levels.level ===1?'编辑分组':'编辑贴图',item)"></i>
                        <i class="el-icon-delete greyIcon" @click.stop="deleteGroup(levels.level,item)"></i>
                    </div>
                </div>
                <el-empty :image="require('@/assets/noData.png')" :image-size="100" v-if="levels.level ===2 ? !contentLevel2List.length:!contentList.length"></el-empty>
            </div>
        </div>

        <!-- 分页 -->
        <Pagination class="modelPage" layout="prev, pager, next" :pagerCount="5" :limit.sync="pages.pageSize" 
        :total="pageDatas.length" :page="pages.page" @pagination="pagination" />

        <!-- 新建分组弹框 -->
        <DialogChartletGroup ref="DialogChartletGroup" />
        <!-- 上传贴图弹框 -->
        <DialogChartlet ref="DialogChartlet" :groupList="searchToSaveList"/>
    </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex'
import DialogChartletGroup from "./DialogChartletGroup.vue"; // 新建分组弹框
import DialogChartlet from "./DialogCharlet.vue"; // 上传贴图弹框
import { getTextureGroup, getTextureByGroupId, deleteMaterialTexture } from "@/api/material_api";
import { throttle } from 'lodash'
import Tab from "@/components/Tab/index.vue";
import Pagination from "@/components/Pagination/index.vue";
import addMaterial from './addMaterial.js'
export default {
    components: { Tab, Pagination, DialogChartletGroup, DialogChartlet },
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
            ],
            levels: {
                tabName: "贴图库",
                groupName: "",
                level: 1,
                tab2Index: 0,//第二级tab切换
                groupId:null,//组id
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
    },
    created() { },
    mounted() { },
    methods: {
        // 公共库
        getPubilcList(){
            this.cancel&&this.cancel();
            this.contentList = []
            this.searchToSaveList = []
        },
        // 个人库
        async getUserList(){
            this.cancel&&this.cancel();
            getTextureGroup({ userId: this.data.userId }).then(
                (res) => {
                    this.contentList = res.data
                    this.searchToSaveList = JSON.parse(JSON.stringify(this.contentList))
                    this.pageDatas = JSON.parse(JSON.stringify(this.contentList))
                    this.searchContent()
                }
            );
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
        }),
        // 获取贴图列表
        getTextureList(groupId){
            getTextureByGroupId({userId:this.data.userId,groupId}).then(res=>{
                this.contentLevel2List = res.data&&res.data.map(e=>{
                    return {
                        ...e,
                        groupName:e.textureName
                    }
                })||[]
                this.searchToSaveList2 = JSON.parse(JSON.stringify(this.contentLevel2List))
                this.pageDatas = JSON.parse(JSON.stringify(this.searchToSaveList2))
                this.searchContent()
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
        // 点击去二级构件
        async toLevel2(item) {
            this.levels.activeContent = item
            if (this.levels.level === 1) {
                this.search = ''
                this.pages = this.$options.data().pages;
                this.levels.level = 2;
                this.levels.groupName = item.groupName;
                this.levels.groupId = item.groupId

                switch (this.levels.tab2Index) {
                    case 0:
                        
                        break;
                    case 1:
                        this.getTextureList(item.groupId)
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
                        
                        break;
                    case 1:
                        if(!this.material.openTexture){
                            return this.$message.warning('请选择要替换的贴图类型！')
                        }
                        this.addMaterial({textureId:item.textureId,isPublic:false})
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
        createGroup(title, row = {}) {
            let newRow = JSON.parse(JSON.stringify(row))
            switch (title) {
                case '新建分组': case '编辑分组':                   
                    this.$refs.DialogChartletGroup.show(title, newRow);
                    break;
                case '上传贴图': case '编辑贴图':                   
                    this.$refs.DialogChartlet.show(title, {...newRow,groupId:this.levels.groupId});
                    break;
            
                default:
                    break;
            }
        },
        // 删除贴图库组/贴图
        deleteGroup(level,row) {
            this.$confirm(
                `删除【${row.groupName}】后无法恢复，确认是否删除？`,
                "删除",
                {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    closeOnClickModal: false,
                    type: "warning",
                }
            )
                .then(() => {
                    let userId = this.$route.query.userId || JSON.parse(sessionStorage.getItem("userid")) || 'travels'
                    if(level===1){
                        let params = {
                            userId,
                            groupId:row.groupId
                        }
                        deleteMaterialTexture(params).then(()=>{
                            this.getUserList()
                            this.$message.success('删除成功！')
                        })
                    }else{
                        let params = {
                            userId,
                            textureId:row.textureId
                        }
                        deleteMaterialTexture(params).then(()=>{
                            this.$message.success('删除成功！')
                            this.getTextureList(this.levels.groupId)
                        })
                    }
                })
                .catch(() => {});
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