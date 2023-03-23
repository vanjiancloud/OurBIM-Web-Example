<!-- 构件库
    同一种类型接口返回的数据格式全部不一样我真的。。。。。。。
-->
<template>
    <div class="drawerBox" :style="{'width':isShow?'300px':'0px'}">
        <el-drawer title="资源库" :visible.sync="drawer" direction="ltr" :modal="false" :wrapperClosable="false" :size="300" :before-close="close" class="newDrawer" :style="{'width':isShow?'300px':'0px'}">
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
            </div>
            <!-- 二级才显示分页 -->
            <Pagination v-if="levelName.level ===2" class="modelPage" layout="prev, pager, next" :pagerCount="5" :limit.sync="pages.pageSize" :total="contentLevel2List.length" :page="pages.page" @pagination="pagination" />
            <!-- 创建分组，上传贴图 -->
        </el-drawer>
        <!-- 收缩和展开 -->
        <!-- <transition name="el-fade-in"> -->
            <div class="isShow" @click="onIsShow" v-if="drawer">
                <i :class="{'el-icon-arrow-right':!isShow,'el-icon-arrow-left':isShow}"></i>
            </div>
        <!-- </transition> -->
        <!-- 新建分组弹框 -->
        <DialogChartletGroup ref="DialogChartletGroup" />
        <!-- 上传贴图弹框 -->
        <DialogChartlet ref="DialogChartlet" :groupList="contentList[1]"/>
    </div>
</template>

<script>
import CHAILIAOAPI, { getChartletList } from "@/api/material_api";
import MODELAPI from "@/api/model_api";
import COMPONENTLIBRARY from "@/api/component-library";
import Tab from "@/components/Tab/index.vue";
import Pagination from "@/components/Pagination/index.vue";
import DialogChartletGroup from "./DialogChartletGroup.vue"; // 新建分组弹框
import DialogChartlet from "./DialogCharlet.vue"; // 上传贴图弹框
export default {
    components: { Tab, Pagination, DialogChartletGroup, DialogChartlet },
    props: {
        taskId: {
            type: String,
        },
        userId: {
            type: [String, Number],
        },
    },
    data() {
        return {
            drawer: false,
            isShow:true,//是否展开和收缩
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
            }, //构件组名称,tab名称,默认一级
            pages: {
                page: 1, //分页，第几页
                pageSize: 18,
            },
        };
    },
    watch: {},
    computed: {},
    created() {},
    mounted() {},
    methods: {
        onIsShow(){
            this.isShow=!this.isShow
        },
        show() {
            this.drawer = true;
            this.content();
        },
        hide() {
            Object.assign(this.$data, this.$options.data());
            this.drawer = false;
        },
        close() {
            Object.assign(this.$data, this.$options.data());
            this.$parent.closePart(14);
        },
        // 点击tab
        onTab(e) {
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
        },
        // 点击库类型
        onTypeTab(e) {
            this.levelName.tab2Index = e.index;
        },
        // 点击返回第一级
        back() {
            this.levelName.level = 1;
        },
        // 点击去二级构件
        toLevel2(item) {
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
                            taskId: this.taskId,
                            groupId: item.groupId,
                        };
                        CHAILIAOAPI.GETOURBIMMATERIALBYGROUP(params).then(
                            (res) => {
                                this.contentLevel2List = res.data.data.map(
                                    (e) => {
                                        return {
                                            comName: e.matName,
                                            comUrl: e.matImgPath,
                                            ...e,
                                        };
                                    }
                                );
                            }
                        );
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
                this.contentLevel2ListPage = this.contentLevel2List.slice(
                    (this.pages.page - 1) * this.pages.pageSize,
                    this.pages.page * this.pages.pageSize
                );
            }
        },
        // 构件库
        async content() {
            // 获取公共库
            let publicList = (
                await COMPONENTLIBRARY.getPublicComList({ taskId: this.taskId })
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
            const { userId } = this.$route.query;
            let selfList = (await MODELAPI.GETALLCOM({ userId })).data.data;
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
            CHAILIAOAPI.GETOURBIMMATERIALGROUP({ taskId: this.taskId }).then(
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
            getChartletList({ userId: this.$route.query.userId }).then(
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
        createGroup(title, row = {}) {
            switch (title) {
                case '新建分组': case '编辑分组':                   
                    this.$refs.DialogChartletGroup.show(title, row);
                    break;
                case '上传贴图': case '编辑贴图':                   
                    this.$refs.DialogChartlet.show(title, {...row,groupId:this.levelName.groupId});
                    break;
            
                default:
                    break;
            }
        },
        // 删除贴图库组
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
                    if(level===1){

                    }else{

                    }
                })
                .catch(() => {});
        },
    },
};
</script>
<style lang="less" scoped>
.drawerBox{
    width: 300px;
    height: 100%;
    position: fixed;
    top: 0;
    animation: ltr-drawer-in .3s 1ms;
    .isShow{
        width: 20px;
        height: 64px;
        background: rgba(16,16,16,0.7);
        border-radius: 0px 14px 14px 0px;
        position: absolute;
        right: -20px;
        top: 0;
        bottom: 0;
        margin: auto 0;
        cursor: pointer;
        color: #ffffff;
        font-size: 18px;
        line-height: 64px;
        text-align: center;
    }
}
.level2 {
    font-size: 16px;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    color: #ffffff;
    padding: 0 16px 16px 16px;
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
</style>
