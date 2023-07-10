<!-- 定位码 -->
<template>
    <div class="locationCode">
        <Drawer ref="Drawer" :title="title" direction="rtl" @onClose="close" @onIcon="onIcon">
            <template slot="icon" v-if="type!==0">
                <i class="el-icon-arrow-left"></i>
            </template>
            <template slot="titleRight" v-if="type===2">
                <i class="el-icon-edit titleIcon" @click="editRow()"></i>
                <i class="el-icon-delete titleIcon" @click="deleteRow()"></i>
            </template>
            <!-- 列表 -->
            <div class="DrawerWrap" v-if="type===0">          
                <div class="btn">
                    <el-button class="blueBtn1" type="primary" size="small" @click="add()">新建</el-button>
                    <el-button class="darkBluePlain" size="small" @click="downCode()">下载所有定位码</el-button>
                </div>
                <div class="list">
                    <div class="item" v-for="item in list" :key="item.id" @click="detail(item)">
                        <div class="listTop flex">
                            <div class="flex">
                                <el-image :src="item.codeViewImg" fit="fit" class="image"></el-image>
                                <span class="name">{{ item.createUser }}</span>
                            </div>
                            <div class="time">{{ item.updateTime }}</div>
                        </div>
                        <div class="flex content">
                            <el-image :src="item.qrCode" fit="fit" class="image"></el-image>
                            <div class="right">
                                <div class="text">编号：{{ item.codeId }}</div>
                                <div class="text">名称：{{ item.codeName }}</div>
                                <div>
                                    <el-button class="blueBtn" type="primary" size="mini" @click.stop="downCode(item)">下载</el-button>
                                    <el-button class="grayPlain" type="primary" size="mini" @click.stop="deleteRow(item)">删除</el-button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <el-empty :image="require('@/assets/noData.png')" :image-size="100" v-if="!list.length"></el-empty>
                </div>
            </div>
            <!-- 增加定位码或者编辑定位码 -->
            <AddCode ref="AddCode" v-if="type!==0" :data="{ ...data, type }" @update="update"/>
        </Drawer>
        <!-- 操作轴 -->
        <OperatingTools ref="OperatingTools" :data="data" class="OperatingTools" v-if="$refs.AddCode&&$refs.AddCode.updateCode"/>
    </div>
</template>

<script>
import OperatingTools from "@/components/OperatingTools";
import { getList, download, deleteCode, openLocate } from '@/api/userCenter/locationCode.js'
import { EventBus } from '@/utils/bus.js'
import Drawer from "@/components/Drawer/index.vue";
import AddCode from "./addCode.vue";
export default {
    components: { Drawer, AddCode, OperatingTools },
    props: {
        data: {
            type: Object,
            default:()=> {}
        }
    },
    data() {
        return {
            title: 'AR定位码',
            list:[],
            type: 0,//0：列表，1：新增，2，编辑。
        };
    },
    watch: {},
    computed: {},
    created() { },
    mounted() { },
    destroyed () {
        EventBus.$off('eventTool')
    },
    methods: {
        show() {
            this.openLocate()
            this.getList()
            this.$refs.Drawer.show()
        },
        close(){
            this.$refs.Drawer.hide()
            EventBus.$emit('eventTool', 'locationCode')
        },
        //  进入/退出定位模式
        openLocate(){
            openLocate({ taskId: this.data.taskId, status: true }).then(()=>{
                this.$message.success('指令发送成功！')
            })
        },
        // 定位码放置完成
        placeCode(){
            this.$refs.AddCode.placeCode()
        },
        // 获取列表
        getList(){
            getList({ appId: this.data.appId }).then((res)=>{
                this.list = res?.data || []
            })
        },
        // 添加定位码
        add(){
            this.type = 1
            this.title = '创建AR定位码'
            setTimeout(()=>{
                if(this.$refs.AddCode){
                    this.$refs.AddCode.show()
                }
            },200)
        },
        // 编辑定位码
        detail(row){
            this.type = 2
            this.title = 'AR定位码详情'
            setTimeout(()=>{
                if(this.$refs.AddCode){
                    let newRow = JSON.parse(JSON.stringify(row))
                    this.$refs.AddCode.show(newRow)
                }
            },200)
        },
        // 点击编辑
        editRow(){
            this.type = 1
            this.title = '编辑AR定位码'
            if(this.$refs.AddCode){
                this.$refs.AddCode.anchorPoint = true
            }
        },
        // 点击返回列表
        onIcon(){
            this.type = 0
            this.title = this.$options.data().title
        },
        // 删除
        deleteRow(item){
            let newItem = item || this.$refs.AddCode.form
            this.$confirm(`删除【${newItem.codeName}】定位码后无法恢复，确认是否删除？`, '删除定位码', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                closeOnClickModal:false,
                type: 'warning'
            }).then(() => {
                deleteCode({taskId: this.data.taskId},[newItem.codeId]).then(res=>{
                    this.$message.success('删除成功！')
                    this.getList()
                    // 从详情删除成功后返回列表
                    if(!item){
                        this.onIcon()
                    }
                })
            }).catch(() => {});
        },
        // 下载所有定位码
        downCode(item){
            let data = {
                isAll: true,
                appId: this.data.appId
            }
            if(item){
                data ={
                    codeId: item.codeId,
                    isAll: false
                }
            }
            download(data).then(res=>{

            })
        },
        // 更新定位码
        update(e){
            setTimeout(()=>{
                if(e&&this.$refs.OperatingTools){
                    this.$refs.OperatingTools.checkOprate({gizmoMode:'translate'})
                }
            },300)
        }
    }
};
</script>
<style lang="less" scoped>
.DrawerWrap{
    padding: 20px;
    max-height: calc(100vh - 54px);
    overflow: auto;
}
.titleIcon{
    cursor: pointer;
    margin: 0 4px;
    &:hover{
        color: #409EFF;
    }
}
.flex{
    display: flex;
    justify-content: space-between;
    align-items: center;
}
.list{
    .item{
        margin-top: 24px;
        background: #24262B;
        box-shadow: 0 0 6px 1px #ACACAC;
        border-radius: 6px;
        position: relative;
        padding: 15px 15px 15px 24px;
        cursor: pointer;
        &::before{
            content: '';
            display: block;
            width: 9px;
            height: 100%;
            background: #C9DAE5;
            position: absolute;
            left: 0;
            top: 0;
            border-radius: 48px 0px 0px 48px;
        }
        &:hover::before{
            background: #3ADCFF;
        }
        .listTop{
            .flex();
            .image{
                width: 32px;
                height: 32px;
                border-radius: 100%;
                border:1px solid #3adcff;
            }
            .name{
                font-size: 16px;
                font-family: PingFangSC-Medium, PingFang SC;
                font-weight: 500;
                color: #FFFFFF;
                margin-left: 10px;
            }
            .time{
                font-size: 12px;
                font-family: PingFangSC-Regular, PingFang SC;
                color: #6D7278;
            }
        }
        .content{
            font-size: 14px;
            font-family: PingFangSC-Regular, PingFang SC;
            color: #DBDBDB;
            margin-top: 16px;
            .image{
                width: 70px;
                height: 70px;
                flex-shrink:0;
            }
            .right{
                margin-left: 12px;
                overflow: hidden;
                .text{
                    width: 100%;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                    margin-bottom: 3px;
                }
            }
        }
    }
}
.OperatingTools{
    left: 5%;
    right: initial;
}
</style>