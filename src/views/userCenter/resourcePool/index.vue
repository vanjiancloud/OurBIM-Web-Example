<!-- 资源库
    同一种类型接口返回的数据格式全部不一样。。。。。。。
-->
<template>
<div>
    <Drawer ref="Drawer" title="资源库" @onClose="close">
        <template v-slot="{ drawer }">
            <Tab v-model="levelName.tab1Index" v-show="levelName.level ===1" :data="tabList" @onTab="onTab" />
            <!-- 点击到二级构件 -->
            <div class="level2" v-if="levelName.level ===2">
                <i class="el-icon-arrow-left" @click="back"></i>
                <span>{{levelName.groupName}} / <span class="level2Item">{{levelName.tabName}}</span></span>
            </div>
            <div class="search">
                <el-input v-model="search" size="mini" placeholder="请输入您要搜索的内容" prefix-icon="el-icon-search">
                </el-input>
                <!-- 贴图按钮 -->
                <el-button v-if="levelName.tab1Index ===2&&levelName.tab2Index===1" class="button" :class="{blueBtn1:levelName.level ===1,blueBtn1:levelName.level ===2}" type="primary" icon="el-icon-plus" size="mini"
                            @click="createGroup(levelName.level ===1?'新建分组':'上传贴图')">{{levelName.level ===1?'新建分组':'上传贴图'}}</el-button>
            </div>
            <Tab v-model="levelName.tab2Index" v-show="levelName.level ===1" class="roundTab" :data="typeList" @onTab="onTypeTab" />
            
            
            <!-- 内容资源 -->
            <div class="content">
                <div class="contentItem" v-for="(item,index) in (levelName.level ===2 ? contentLevel2ListPage:contentList[levelName.tab2Index])" :key="index" @click="toLevel2(item)">
                    <el-image class="img" :src="item.comUrl" lazy></el-image>
                    <div>{{item.comName}}</div>
                    <!-- 贴图-个人图的编辑删除 -->
                    <div class="iconBottom" v-if="levelName.tab1Index ===2 && levelName.tab2Index ===1">
                        <i class="el-icon-edit editIcon" @click.stop="createGroup(levelName.level ===1?'编辑分组':'编辑贴图',item)"></i>
                        <i class="el-icon-delete greyIcon" @click.stop="deleteGroup(levelName.level,item)"></i>
                    </div>
                </div>
                <el-empty :image="require('@/assets/noData.png')" :image-size="100" v-if="levelName.level ===2 ? !contentLevel2ListPage?.length:!contentList[levelName.tab2Index]?.length"></el-empty>
            </div>
            <!-- 二级才显示分页 -->
            <Pagination v-if="levelName.level ===2" class="modelPage" layout="prev, pager, next" :pagerCount="5" :limit.sync="pages.pageSize" :total="contentLevel2List.length" :page="pages.page" @pagination="pagination" />
            
            
            <!-- 构件操作图标 -->
            <div class="toolList" v-if="drawer">
                <el-tooltip v-for="(item,index) in toolIcons" :key="index" effect="dark" :content="item.name" placement="bottom">
                    <img :src="item.check?item.checkUrl:item.url" @click="onOprate(item)" :style="{'pointer-events': (item.name==='轴心'&&!toolIcons[0].check && !toolIcons[1].check && !toolIcons[2].check) ? 'none' : 'auto'}" />
                </el-tooltip>
            </div>
        
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
import CHAILIAOAPI, { getChartletList, getMaterialByGroup, addMaterialForUser, changeMaterialByInstruction, getMaterialByMatId,deleteMaterialTexture } from "@/api/material_api";
import MODELAPI, { setGizmoMode, setGizmoModeType } from "@/api/model_api";
import COMPONENTLIBRARY, { addCom, closeComEdit } from "@/api/component-library";
import Tab from "@/components/Tab/index.vue";
import Pagination from "@/components/Pagination/index.vue";
import DialogChartletGroup from "./DialogChartletGroup.vue"; // 新建分组弹框
import DialogChartlet from "./DialogCharlet.vue"; // 上传贴图弹框
import Drawer from "@/components/Drawer/index.vue";
export default {
    components: { Tab, Pagination, DialogChartletGroup, DialogChartlet, Drawer },
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
            contentList: [], //库，一级
            contentLevel2List: [], //二级
            contentLevel2ListPage: [], //分页数据
            levelName: {
                groupName: "",
                tab1Index: 0,
                tab2Index: 0,
                tabName: "构件库",
                level: 1,
                groupId:null,//组id
                activeContent: null
            }, //构件组名称,tab名称,默认一级
            pages: {
                page: 1, //分页，第几页
                pageSize: 18,
            },
            toolIcons:[
                {
                    url:require('@/assets/images/todo/unchecked/com/move1.png'),
                    checkUrl:require('@/assets/images/todo/check/com/move1.png'),
                    name:'缩放',
                    key:'scale',
                    check:false
                },
                {
                    url:require('@/assets/images/todo/unchecked/com/move2.png'),
                    checkUrl:require('@/assets/images/todo/check/com/move2.png'),
                    name:'旋转',
                    key:'rotate',
                    check:false
                },
                {
                    url:require('@/assets/images/todo/unchecked/com/move3.png'),
                    checkUrl:require('@/assets/images/todo/check/com/move3.png'),
                    name:'移动',
                    key:'translate',
                    check:false
                },
                {
                    url:require('@/assets/images/todo/unchecked/com/move4.png'),
                    checkUrl:require('@/assets/images/todo/check/com/move4.png'),
                    name:'轴心',
                    check:false
                },
                // {
                //     url:require('@/assets/images/todo/unchecked/com/move5.png'),
                //     checkUrl:require('@/assets/images/todo/check/com/move5.png'),
                //     name:'笔刷',
                //     check:false
                // },
            ],
            openMater:false //是否打开材质编辑
        };
    },
    watch: {},
    computed: {
        ...mapGetters(["material","componentAllInfo","materialAllInfo"]),
        ...mapState(['cancel'])
    },
    created() {},
    mounted() {},
    destroyed () {
        EventBus.$off('eventTool')
    },
    methods: {
        show() {
            this.$refs.Drawer.show()
            switch (this.levelName.tab1Index) {
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
        onTab:throttle(function(e) {
            this.levelName.tabName = e.name;
            this.levelName.tab1Index = e.index;
            this.levelName.tab2Index = 0;
            this.contentList = [];
            this.typeList = this.$options.data().typeList;
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
            this.levelName.tab2Index = e.index;
        },
        // 点击返回第一级
        back() {
            this.levelName.level = 1;
        },
        // 点击去二级构件
        async toLevel2(item) {
            this.levelName.activeContent = item
            // 一级点击   0：构件库   1：材质库   2：贴图库
            if (this.levelName.level === 1) {
                this.pages = this.$options.data().pages;
                this.levelName.level = 2;
                this.levelName.groupName = item.comName;
                this.levelName.groupId = item.groupId
                switch (this.levelName.tab1Index) {
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
                        break;
                    case 1:
                        let params = {
                            taskId: this.data.taskId,
                            groupId: item.groupId,
                        };
                        this.contentLevel2List = (await getMaterialByGroup(params)).data.map(e=>{return{comName: e.matName,comUrl: e.matImgPath,...e,}})
                        break;
                    case 2:
                        this.contentLevel2List = item.rsTextureList.map((e) => {
                            return {
                                comName: e.textureName,
                                comUrl: e.imgPath,
                                ...e,
                            };
                        });
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
              * this.levelName.tab2Index === 1  个人库
            */
            if (this.levelName.level === 2) {
                switch (this.levelName.tab1Index) {
                    case 0:
                        let data = {
                            taskId: this.data.taskId,
                            comName: item.comName,
                            comId: this.levelName.tab2Index === 1 ? item.ourbimComponentInfo.comId : item.id,
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
                    this.$store.dispatch('material/changeSetting',{ key: "materialAllInfo", value: { ...res.data,matParam:JSON.parse(res.data.matParam),matImgPath:this.levelName.activeContent.comUrl} })
                    // 构件库替换构件的时候更新右边构件信息的图片
                    if(this.levelName.tab1Index === 1 && this.levelName.level === 2){
                        let matList = JSON.parse(JSON.stringify(this.componentAllInfo.matList))
                        matList[this.material.activeMaterialIndex].imgPath = this.levelName.activeContent.comUrl
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
                selfList.length &&
                selfList[0].data.map((e) => {
                    return {
                        comUrl: e.data?.[0]?.ourbimComponentInfo.comUrl,
                        comName: e.groupName,
                        rsComponent: e.data,
                        ...e,
                    };
                });
            this.contentList = [publicList, selfList];
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
                    this.$refs.DialogChartlet.show(title, {...newRow,groupId:this.levelName.groupId});
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
        // 那五个操作------------缩放,旋转,移动,轴心,笔刷
        onOprate(item){
            if(item.check){
                this.$set(item,'check',false)
            }else{
                if(item.name==='轴心'){
                    this.$set(item,'check',true)
                }else{
                    let isEnd = new Promise((resolve, reject) => {
                        let total = null
                        this.toolIcons.forEach((e,i)=>{
                            if(e.name!=='轴心'){
                                e.check = false
                            }
                            total = i+1
                        })
                        if(total===this.toolIcons.length){
                            resolve(true)
                        }
                    })
                    isEnd.then(()=>{
                        this.$set(item,'check',true)
                    })
                }
            }
            this.$forceUpdate()
            setTimeout(()=>{
                switch (item.name) {
                    case '缩放':
                    case '旋转':
                    case '移动':
                        if(item.check){
                            this.setGizmoMode(item.key)                        
                        }else{
                            this.closeGizmoMode()
                        }
                        break;
                    case '轴心':
                        if(item.check){
                            this.setGizmoModeType(true)
                        }else{
                            this.setGizmoModeType(false)
                        }
                        break;
                    case '笔刷':
                        
                        break;
                
                    default:
                        break;
                }
            },500)
        },
        // 图标显示--------缩放,旋转,移动,轴心,笔刷
        checkOprate(data){
            this.toolIcons.forEach((e,i)=>{
                if(['缩放','旋转','移动'].includes(e.name)){
                    if(e.key===data.gizmoMode){
                        e.check = true
                    }else{
                        e.check = false
                    }              
                }
            })
        },
        // 打开缩放，旋转，移动
        setGizmoMode(mode){
            let params ={
                taskId: this.data.taskId,
                mode
            }
            setGizmoMode(params).then(()=>{
                this.$message.success('切换编辑模式')
            })
        },
        // 打开坐标轴心
        setGizmoModeType(flag){
            let params ={
                taskId: this.data.taskId,
                flag
            }
            setGizmoModeType(params).then(()=>{
                this.$message.success(`坐标模式切换${flag?'开启':'关闭'}`)
            })
        },
        // 关闭缩放，旋转，移动
        closeGizmoMode(){
            let params ={
                taskId: this.data.taskId
            }
            closeComEdit(params).then(()=>{
                this.$message.success('暂时关闭自定义构件编辑')
            })
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
}
.content {
    display: flex;
    flex-wrap: wrap;
    align-content: flex-start;
    gap: 10px;
    height: calc(100vh - 200px);
    overflow: auto;
    padding: 0 12px;
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
.toolList{
    position: absolute;
    right: -250px;
    top: 0;
    height: 40px;
    background: rgba(13,22,40,0.7);
    border-radius: 4px;
    line-height: 40px;
    padding: 0 10px;
    img{
        width: 24px;
        height: 24px;
        cursor: pointer;
        vertical-align: middle;
        margin: 0 10px;
    }
}
</style>
