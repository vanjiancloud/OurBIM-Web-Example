<!-- 资源库
    同一种类型接口返回的数据格式全部不一样。。。。。。。
-->
<template>
<div>
    <Drawer ref="Drawer" title="资源库" @onClose="close">
        <template v-slot="{ drawer }">
            <Tab v-model="levels.tab1Index" :data="tabList" @onTab="onTab($event,true)" />
            <!-- 点击到二级构件 -->
            <div class="level2" v-if="levels.level ===2">
                <span @click="back" class="backLevel1"><i class="el-icon-arrow-left"></i>{{levels.tabName}}</span> / <span class="level2Item">{{levels.groupName}}</span>
            </div>
            <div class="search" v-if="!levels.hideContent">
                <el-input v-model="search" size="mini" placeholder="请输入您要搜索的内容" prefix-icon="el-icon-search" @change="searchContent()" @keydown.native.stop>
                </el-input>
                <!-- 贴图按钮 -->
                <el-button v-if="levels.tab1Index ===2&&levels.tab2Index===1" class="button" :class="{blueBtn1:levels.level ===1,blueBtn1:levels.level ===2}" type="primary" icon="el-icon-plus" size="mini"
                            @click="createGroup(levels.level ===1?'新建分组':'上传贴图')">{{levels.level ===1?'新建分组':'上传贴图'}}</el-button>
            </div>
            <Tab v-model="levels.tab2Index" v-show="levels.level ===1" class="roundTab" :data="typeList" @onTab="onTypeTab" />
            
            <div class="contentWrap">               
                <!-- 导入图纸 -->
                <Drawing ref="Drawing" :levels="levels" :data="{taskId:data.taskId}" @toDrawLevel="toDrawLevel" />
                <!-- 内容资源 -->
                <div class="content" v-if="!levels.hideContent">
                    <div class="contentItem" v-for="(item,index) in (levels.level ===2 ? contentLevel2ListPage:contentList[levels.tab2Index])" :key="index" @click="toLevel2(item)">
                        <el-image class="img" :src="item.comUrl" lazy>
                            <div slot="placeholder" class="image-slot">
                                <img src="@/assets/default/component.png" v-if="levels.tab1Index ===0&&levels.tab2Index ===1"/>
                                <img src="@/assets/default/model.png" v-if="levels.tab1Index ===0&&levels.tab2Index ===0"/>
                                <img src="@/assets/default/material.png" v-if="levels.tab1Index ===1"/>
                                <img src="@/assets/default/charlet.png" v-if="levels.tab1Index ===2"/>
                            </div>
                            <div slot="error" class="image-slot">
                                <img src="@/assets/default/component.png" v-if="levels.tab1Index ===0&&levels.tab2Index ===1"/>
                                <img src="@/assets/default/model.png" v-if="levels.tab1Index ===0&&levels.tab2Index ===0"/>
                                <img src="@/assets/default/material.png" v-if="levels.tab1Index ===1"/>
                                <img src="@/assets/default/charlet.png" v-if="levels.tab1Index ===2"/>
                            </div>
                        </el-image>
                        <div>{{item.comName}}</div>
                        <!-- 贴图-个人图的编辑删除 -->
                        <div class="iconBottom" v-if="levels.tab1Index ===2 && levels.tab2Index ===1">
                            <i class="el-icon-edit editIcon" @click.stop="createGroup(levels.level ===1?'编辑分组':'编辑贴图',item)"></i>
                            <i class="el-icon-delete greyIcon" @click.stop="deleteGroup(levels.level,item)"></i>
                        </div>
                    </div>
                    <el-empty :image="require('@/assets/noData.png')" :image-size="100" v-if="levels.level ===2 ? !contentLevel2ListPage.length:(!contentList[levels.tab2Index]||!contentList[levels.tab2Index].length)"></el-empty>
                </div>
            </div>
            <!-- 二级才显示分页 -->
            <Pagination v-if="levels.level ===2&&!levels.hideContent" class="modelPage" layout="prev, pager, next" :pagerCount="5" :limit.sync="pages.pageSize" :total="contentLevel2List.length" :page="pages.page" @pagination="pagination" />
            
            
            <!-- 构件操作图标 -->
            <OperatingTools ref="OperatingTools" v-if="drawer" :data="data"/>
        
        </template>
    </Drawer>
    <!-- 新建分组弹框 -->
    <DialogChartletGroup ref="DialogChartletGroup" />
    <!-- 上传贴图弹框 -->
    <DialogChartlet ref="DialogChartlet" :groupList="contentList[1]" @onSuccess="onSuccessChartlet"/>
</div>
</template>

<script>
import { throttle } from 'lodash'
import { mapGetters, mapState } from 'vuex'
import { EventBus } from '@/utils/bus.js'
import { deleteMaterialTexture } from '@/api/resource/chartlet.js'
import CHAILIAOAPI, { getChartletList, getMaterialByGroup, addMaterialForUser, changeMaterialByInstruction, getMaterialByMatId } from "@/api/material_api";
import MODELAPI from "@/api/model_api";
import COMPONENTLIBRARY, { addCom } from "@/api/component-library";
import Tab from "@/components/Tab/index.vue";
import Pagination from "@/components/Pagination/index.vue";
import DialogChartletGroup from "./DialogChartletGroup.vue"; // 新建分组弹框
import DialogChartlet from "./DialogCharlet.vue"; // 上传贴图弹框
import Drawer from "@/components/Drawer/index.vue";
import OperatingTools from "@/components/OperatingTools";
import Drawing from "./drawing.vue"; //导入图纸
export default {
    components: { Tab, Pagination, DialogChartletGroup, DialogChartlet, Drawer, OperatingTools, Drawing },
    props: {
        data: {
            type: Object,
            default:()=> {}
        }
    },
    data() {
        return {
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
            searchToSaveList:[],//因为事前端搜，所以需要一个字段去保存原有的数据一级
            searchToSaveList2:[],//因为事前端搜，所以需要一个字段去保存原有的数据二级
            contentList: [], //库，一级
            contentLevel2List: [], //二级
            contentLevel2ListPage: [], //分页数据
            levels: {
                isClickTab:false,//是否点击一级的tab
                groupName: "",
                tab1Index: 0,
                tab2Index: 0,
                tabName: "构件库",
                level: 1,
                groupId:null,//组id
                activeContent: null,
                hideContent: false //隐藏content
            }, //构件组名称,tab名称,默认一级
            pages: {
                page: 1, //分页，第几页
                pageSize: 18,
            },
            openMater:false //是否打开材质编辑
        };
    },
    watch: {},
    computed: {
        ...mapGetters(["material","componentAllInfo","materialAllInfo"]),
        ...mapState(['cancel'])
    },
    created() {},
    mounted() {
        // 点击材质信息监听tab切换
        this.$store.watch((state) => state.material.materialLevel1Tab,(newValue, oldValue) => {
            // isClickTab避免重复请求,点击材质信息会更新
            if(!this.levels.isClickTab){
                this.onTab({index:newValue,name:this.tabList[newValue].name})
            }else{
                this.levels.isClickTab = false
            }
        });
    },
    destroyed () {
        EventBus.$off('eventTool')
    },
    methods: {
        show() {
            if(this.$refs.Drawing){
                this.$refs.Drawing.drawingList = this.$refs.Drawing.$options.data().drawingList//图纸数据初始化
            }
            this.$refs.Drawer.show()
            switch (this.levels.tab1Index) {
                case 0:
                    this.content();
                    break;
                case 1:
                    this.typeList = this.typeList.slice(0, 1);
                    this.getMaterials();
                    break;
                case 2:
                    this.getChartletList();
                    break;

                default:
                    break;
            }
        },
        close(){
            this.$refs.Drawer.hide()
            EventBus.$emit('eventTool', 'resource')
        },
        // hide() {
        //     // Object.assign(this.$data, this.$options.data());
        // },
        // 点击tab
        onTab:throttle(function(e,isClick=false) {
            this.levels = this.$options.data().levels
            this.levels.isClickTab = isClick
            if(isClick){
                this.$store.dispatch('material/changeSetting',{ key: "materialLevel1Tab", value: this.levels.tab1Index })
            }
            this.levels.tabName = e.name;
            this.levels.tab1Index = e.index;
            this.levels.tab2Index = 0;
            this.levels.level = 1
            this.contentList = [];
            this.typeList = this.$options.data().typeList;
            this.search = ''
            switch (e.index) {
                case 0:
                    this.content();
                    break;
                case 1:
                    this.typeList = this.typeList.slice(0, 1);
                    this.getMaterials();
                    break;
                case 2:
                    this.getChartletList();
                    break;

                default:
                    break;
            }
        },800),
        // 点击库类型
        onTypeTab(e) {
            this.levels.tab2Index = e.index;
        },
        // 点击返回第一级
        back() {
            this.levels.level = 1;
            this.levels.hideContent = false
            this.search = ''
            this.searchContent()
        },
        // 点击去二级构件
        async toLevel2(item) {
            this.levels.activeContent = item
            // 一级点击   0：构件库   1：材质库   2：贴图库
            if (this.levels.level === 1) {
                this.search = ''
                this.pages = this.$options.data().pages;
                this.levels.level = 2;
                this.levels.groupName = item.comName;
                this.levels.groupId = item.groupId
                switch (this.levels.tab1Index) {
                    case 0:
                        this.contentLevel2List = item.rsComponent;
                        if (item.data && item.data.length) {
                            this.contentLevel2List = item.rsComponent.map(
                                (e) => {
                                    return {
                                        comName: e.ourbimComponentInfo.comName,
                                        comUrl: e.ourbimComponentInfo.comUrl,
                                        ...e,
                                    };
                                }
                            );
                        }
                        this.searchToSaveList2 = JSON.parse(JSON.stringify(this.contentLevel2List))
                        break;
                    case 1:
                        let params = {
                            taskId: this.data.taskId,
                            groupId: item.groupId,
                        };
                        this.contentLevel2List = (await getMaterialByGroup(params)).data.map(e=>{return{comName: e.matName,comUrl: e.matImgPath,...e,}})
                        this.searchToSaveList2 = JSON.parse(JSON.stringify(this.contentLevel2List))
                        break;
                    case 2:
                        this.contentLevel2List = item.rsTextureList.map((e) => {
                            return {
                                comName: e.textureName,
                                comUrl: e.imgPath,
                                ...e,
                            };
                        });
                        this.searchToSaveList2 = JSON.parse(JSON.stringify(this.contentLevel2List))
                        break;

                    default:
                        break;
                }
                // 后端返回全部数据，前端做数据分页
                this.level2page()
                return
            }
            /*  
              *  二级点击
              * this.levels.tab2Index === 1  个人库
            */
            if (this.levels.level === 2) {
                switch (this.levels.tab1Index) {
                    case 0:
                        let data = {
                            taskId: this.data.taskId,
                            comName: item.comName,
                            comId: this.levels.tab2Index === 1 ? item.ourbimComponentInfo.comId : item.id,
                            userId: item.userId
                        }
                        addCom(data).then(res=>{
                            this.$parent.hideTool();//底部栏隐藏
                            this.$message.success('指令下发成功');
                        })
                        break;
                    case 1:
                        if(!this.material.openMaterial||!this.$parent.checkShow('componentInformation')){
                            return this.$message.warning('请打开材质信息！')
                        }
                        if(!this.data.selectPark){
                            return this.$message.warning('请先选择构件！')
                        }
                        // 先获取要替换的材质信息
                        this.getMaterial(item.matId)
                        break;
                    case 2:
                        if(!this.material.openTexture){
                            return this.$message.warning('请选择要替换的贴图类型！')
                        }
                        this.addMaterial({textureId:item.textureId,isPublic:false})
                        break;
                    default:
                        break;
                }
                return
            }
        },
        // 获取材质信息isPublic=true：添加材质
        getMaterial(matId,isPublic=true){
            getMaterialByMatId({ matId: matId || this.materialAllInfo.matId, isPublic }).then(res=>{
                if(isPublic){
                    this.addMaterial({matId:res.data.matId,matParam:JSON.parse(res.data.matParam)})
                }else{
                    this.$store.dispatch('material/changeSetting',{ key: "materialAllInfo", value: { ...res.data,matParam:JSON.parse(res.data.matParam),matImgPath:this.levels.activeContent.comUrl} })
                    // 构件库替换构件的时候更新右边构件信息的图片
                    if(this.levels.tab1Index === 1 && this.levels.level === 2){
                        let matList = JSON.parse(JSON.stringify(this.componentAllInfo.matList))
                        matList[this.material.activeMaterialIndex].imgPath = this.levels.activeContent.comUrl
                        this.$store.dispatch('material/changeSetting',{ key: "componentAllInfo", value: {matList} })
                    }
                }
            })
        },
        // 添加材质
        addMaterial({matId, matParam, isPublic = true, textureId }){
            if(!matParam && !this.materialAllInfo.matParam){
                return this.$message.warning('请选择要替换的构件！')
            }
            let params = {
                userId: this.$route.query.userId || JSON.parse(sessionStorage.getItem("userid")) || 'travels',
                matId: matId || this.materialAllInfo.matId,
                isPublic,
                baseColorTextureId: this.material.openTexture==='基础' ? textureId : '',
                normalMapTextureId: this.material.openTexture==='法线' ? textureId : ''
            }
            addMaterialForUser(params, JSON.stringify(matParam || this.materialAllInfo.matParam)).then(res=>{
                let matList = JSON.parse(JSON.stringify(this.componentAllInfo.matList))
                matList[this.material.activeMaterialIndex].matId = res.data
                this.$store.dispatch('material/changeSetting',{ key: "componentAllInfo", value: {matList} })
                this.$store.dispatch('material/changeSetting',{ key: "materialAllInfo", value: {matId:res.data} })
                this.changeMaterial(res.data)
            })
        },
        // 替换材质
        changeMaterial(matId){
            let params = {
                taskId: this.data.taskId,
                appId: this.$parent.pakidToAppid(this.componentAllInfo.pakId),
                matId,
                isPublic: false,
                isUpdateSameMaterial: false,
            }
            let data = [{
                actorId:this.componentAllInfo.actorId,
                meshIndex:this.materialAllInfo.meshIndex,
                matIndex:this.materialAllInfo.matIndex,
                comType: this.data.pakIdMapweb,
                pakId:this.componentAllInfo.pakId
            }]
            changeMaterialByInstruction(params,JSON.stringify(data)).then(res=>{
                this.getMaterial(matId,false)
                this.$message.success('材质替换成功');

            })
        },
        // 构件库
        async content() {
            this.cancel&&this.cancel();
            // 获取公共库
            let publicList = (
                await COMPONENTLIBRARY.getPublicComList({ taskId: this.data.taskId })
            ).data.data;
            publicList =
                publicList.length &&
                publicList.map((e) => {
                    return {
                        comUrl: e.rsComponent?.[0]?.comUrl,
                        comName: e.group,
                        ...e,
                    };
                });
            // 获取个人库
            let selfList = (await MODELAPI.GETALLCOM({ userId: this.data.userId })).data.data;
            selfList =
                selfList?.length &&
                selfList[0].data.map((e) => {
                    return {
                        comUrl: e.data?.[0]?.ourbimComponentInfo?.comUrl,
                        comName: e.groupName,
                        rsComponent: e.data,
                        ...e,
                    };
                }) || [];
            this.contentList = [publicList, selfList];
            this.searchToSaveList = JSON.parse(JSON.stringify(this.contentList))
        },
        // 材质库
        getMaterials() {
            this.cancel&&this.cancel();
            CHAILIAOAPI.GETOURBIMMATERIALGROUP({ taskId: this.data.taskId }).then(
                (res) => {
                    let publicList = res.data.data.map((e) => {
                        return {
                            comUrl: e.matImgPath,
                            comName: e.groupName,
                            ...e,
                        };
                    });
                    this.contentList = [publicList];
                    this.searchToSaveList = JSON.parse(JSON.stringify(this.contentList))
                }
            );
        },
        // 获取贴图库
        getChartletList() {
            getChartletList({ userId: this.data.userId }).then(
                (res) => {
                    let data = res.data.map((e) => {
                        return {
                            comUrl: e.imgPath,
                            comName: e.groupName,
                            ...e,
                        };
                    });
                    this.contentList = [[], data];
                    this.searchToSaveList = JSON.parse(JSON.stringify(this.contentList))
                }
            );
        },
        // 分页
        pagination(e) {
            this.pages.page = e.pageIndex;
            this.pages.pageSize = e.pageSize;
            this.contentLevel2ListPage = this.contentLevel2List.slice(
                (e.pageIndex - 1) * e.pageSize,
                e.pageIndex * e.pageSize
            );
        },
        // 分页
        level2page(){
            // 后端返回全部数据，前端做数据分页
            this.contentLevel2ListPage = this.contentLevel2List.slice(
                (this.pages.page - 1) * this.pages.pageSize,
                this.pages.page * this.pages.pageSize
            );
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
                `删除【${row.comName}】后无法恢复，确认是否删除？`,
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
                            this.getChartletList()
                            this.$message.success('删除成功！')
                        })
                    }else{
                        let params = {
                            userId,
                            textureId:row.textureId
                        }
                        deleteMaterialTexture(params).then(()=>{
                            this.$message.success('删除成功！')
                            this.getChartletList()
                            this.contentLevel2List = this.contentLevel2List.filter((e)=> {
                                return e.textureId !== row.textureId
                            })
                            this.level2page()
                        })
                    }
                })
                .catch(() => {});
        },
        // 上传或者编辑贴图成功
        onSuccessChartlet(row){
            setTimeout(()=>{
                let findContent = this.contentList[1].find((e)=>{return e.groupId == row.groupId})
                this.contentLevel2List = findContent.rsTextureList.map((e) => {
                    return {
                        comName: e.textureName,
                        comUrl: e.imgPath,
                        ...e,
                    };
                });
                this.level2page()
            },1000)
        },
        
        // 图标显示--------缩放,旋转,移动,轴心,笔刷
        checkOprate(data){
            this.$refs.OperatingTools&&this.$refs.OperatingTools.checkOprate(data)
        },
        // 搜索内容----前端实现的
        searchContent(){
            let newContent = this.levels.level ===2 ? this.searchToSaveList2:this.searchToSaveList[this.levels.tab2Index]
            if(this.search){
                if(newContent.length){
                    newContent = newContent.filter(e=>{ return e.comName.indexOf(this.search)>-1 })
                    if(this.levels.level === 2){
                        this.contentLevel2List = newContent
                        this.level2page()
                    }else{
                        this.contentList.splice(this.levels.tab2Index,1,newContent)
                    }
                }
            }else{
                if(this.levels.level ===2){
                    this.contentLevel2List = this.searchToSaveList2
                    this.level2page()
                }else{
                    this.contentList.splice(this.levels.tab2Index,1,this.searchToSaveList[this.levels.tab2Index])
                }
            }
        },
        // 点击图纸
        toDrawLevel(val){
            this.search = ''
            this.pages = this.$options.data().pages;
            this.levels.level = val.level;
            this.levels.groupName = val.name;
            this.levels.hideContent = true
        }
    },
};
</script>
<style lang="less" scoped>
.level2 {
    font-size: 16px;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    color: #ffffff;
    padding: 16px;
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
