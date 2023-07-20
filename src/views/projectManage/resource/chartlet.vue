<template>
    <List @change="onChange" style="padding: 10px 24px 20px 24px;" v-loading="loading">
        <template slot="title">
            <div class="boxHeader">
                <div class="boxHeaderTitle" v-if="isGroup">您共有<span>{{total}}</span>个贴图分组</div>
                <div class="boxHeaderTitle" v-if="!isGroup">当前分组有<span>{{total}}</span>个贴图文件</div>
                <div>
                    <el-button class="blueBtn" type="primary" @click="add()" v-if="isGroup">新建分组</el-button>
                    <el-badge :value="uploadCom" :hidden="!uploadCom" v-if="!isGroup">
                        <el-button class="blueBtn" type="primary" @click="addChartlet()">上传贴图</el-button>
                    </el-badge>
                </div>
            </div>
        </template>
        <!-- 表格--分组 -->
        <el-table :data="tableData" @cell-click="cellClick" v-if="isList&&isGroup" :row-style="{'cursor': 'pointer'}">
            <el-table-column prop="groupName" label="分组名称" />
            <el-table-column prop="groupId" label="分组ID" />
            <el-table-column prop="createTime" label="创建时间" />
            <el-table-column prop="num" label="包含贴图数量" />
            <el-table-column prop="isGroup" label="类型">
                <template slot-scope="scope">
                    {{ scope.row.isGroup === '1' ? '贴图分组' : '贴图' }}
                </template>
            </el-table-column>
            <el-table-column fixed="right" label="操作" width="150">
                <template slot-scope="scope">
                    <el-button type="text" class="blueText" @click.stop="add(scope.row)">编辑</el-button>
                    <el-button type="text" class="blackText" @click.stop="deleteRow(scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <!-- 子构件 -->
        <el-table :data="tableData" v-if="isList&&!isGroup" :header-cell-style="{'background': '#D0DCE3','color':'#333333'}">
            <el-table-column prop="textureName" label="贴图名称" />
            <el-table-column prop="textureId" label="贴图ID" />
            <el-table-column prop="" label="上传时间" />
            <el-table-column label="文件大小">
                <template slot-scope="scope">
                    <!-- {{  }}MB -->
                </template>
            </el-table-column>
            <el-table-column prop="isGroup" label="类型">
                <template slot-scope="scope">
                    {{ scope.row.isGroup === '1' ? '贴图分组' : '贴图' }}
                </template>
            </el-table-column>
            <el-table-column fixed="right" label="操作" width="180">
                <template slot-scope="scope">
                    <el-button type="text" class="blueText" @click.stop="addChartlet(scope.row)">编辑</el-button>
                    <el-button type="text" class="blackText" @click.stop="deleteRow(scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>

        <!-- 盒子 -->
        <div class="listBox" v-if="!isList">
            <div class="listItem" v-for="(item,index) in tableData" :key="index" @click="item.isGroup === '1' ? cellClick(item):''" :style="{cursor:item.isGroup === '1'?'pointer':'auto'}">
                <el-image :src="item.imgPath" class="defaultImg">
                    <div slot="error" class="image-slot">
                        <img :src="require('@/assets/default/list.png')"/>
                    </div>
                </el-image>
                <div class="title">{{ item.isGroup === '1'?item.groupName:item.textureName }}</div>
                <div class="flexBetween">
                    <div class="type">类型：{{ item.isGroup === '1' ? '构件分组' : '构件' }}</div>
                </div>
                <div class="flexBetween">
                    <div>
                        <el-button class="blueBtn" type="primary" size="small" @click.stop="item.isGroup === '1' ? add(item) : addChartlet(item)">编辑</el-button>
                    </div>
                    <el-dropdown>
                        <span class="el-dropdown-link">
                            <i class="el-icon-arrow-down el-icon-more"></i>
                        </span>
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item @click.native="deleteRow(item)">删除</el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                </div>
            </div>
        </div>
        <el-empty v-if="!isList&&!tableData.length" :image="require('@/assets/noData.png')" :image-size="100"></el-empty>

        <!-- 新建\编辑分组 -->
        <DialogsChartletGroup ref="DialogsChartletGroup"/>
        <!-- 新建、编辑构件 -->
        <DialogCharlet ref="DialogCharlet" :parentData="parentData"/>
    </List>
</template>

<script>
import { Getuserid } from "@/store/index.js";
import { list, textureList, deleteMaterialTexture } from '@/api/resource/chartlet.js'
import List from "@/components/List/index.vue";
import DialogsChartletGroup from './components/DialogsChartletGroup.vue'
import DialogCharlet from './components/DialogCharlet.vue'
export default {
    components: { List, DialogsChartletGroup, DialogCharlet },
    props: {
        total: {
            type: Number,
            default: 0,
            require: true
        },
        groupName: {
            type: String,
            default: '',
            require: true
        },
    },
    data() {
        return {
            loading: false,
            isList: true,
            tableData: [],
            parentData: [],//一级数据，二级编辑换组使用
            parentId: '',//父级id
            isGroup: true, //是否是分组
        };
    },
    watch: {},
    computed: {
        uploadCom() {
            return this.$store.state.uploadCom
        }
    },
    created() {
        this.getList()
    },
    mounted() { },
    methods: {
        onChange(e){
            this.isList = e
        },
        // 返回一级
        back(){
            this.getList()
        },
        getList(){
            this.$emit('update:groupName','')
            let params = {
                userId: Getuserid()
            }
            this.loading = true
            list(params).then(res=>{
                this.loading = false
                this.isGroup = true
                this.tableData = res.data || []
                this.parentData = res.data || []
                this.$emit('update:total',this.tableData.length)
            }).catch(()=>{
                this.loading = false
            })
        },
        // 分组下的贴图
        getTextureList(groupId){
            let params = {
                userId: Getuserid(),
                groupId
            }
            this.loading = true
            textureList(params).then(res=>{
                this.loading = false
                this.isGroup = false
                this.tableData = res.data || []
                this.$emit('update:total',this.tableData.length)
            }).catch(()=>{
                this.loading = false
            })
        },
        // 新建、编辑
        add(row={}){
            this.$refs.DialogsChartletGroup.show({...JSON.parse(JSON.stringify(row))})
        },
        // 删除,删除构件
        deleteRow(row){
            this.$confirm(`此操作将删除该【${this.isGroup?row.groupName:row.textureName}】${this.isGroup?'分组':'贴图'}, 是否继续?`, "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
            }).then(() => {
                let params = {
                    userId: Getuserid(),
                    textureId: row.isGroup==='0' ? row.textureId : '',
                    groupId: row.isGroup==='1' ? row.groupId : ''
                }
                deleteMaterialTexture(params,).then(()=>{
                    this.$message.success('删除成功！')
                    if(this.isGroup){
                        this.getList()
                    }else{
                        this.getTextureList(row.parentId)
                    }
                })
            }).catch(() => {});
        },
        // 点击进入详情
        cellClick(row){
            if(this.isGroup&&row.isGroup==='1'){               
                this.getTextureList(row.groupId)
                this.parentId = row.groupId
                this.$emit('update:groupName',row.groupName)
            }
        },
        // 新增、编辑贴图
        addChartlet(row={}){
            this.$refs.DialogCharlet.show({...JSON.parse(JSON.stringify(row)),groupId:this.parentId})
        },
    }
};
</script>
<style lang="less" scoped>
// .listItem{
//     width: 180px!important;
//     min-width: 180px!important;
//     max-width: 24%!important;
// }
// @media only screen and (min-width: 1318px) and (max-width: 1514px) {
//     .listItem {
//         max-width: 18%!important;
//     }
// }
// @media only screen and (min-width: 1514px) and (max-width: 1750px) {
//     .listItem {
//         max-width: 15%!important;
//     }
// }
// @media only screen and (min-width: 1750px) and (max-width: 1920px) {
//     .listItem {
//         max-width: 10%!important;
//     }
// }
// @media only screen and (min-width: 1921px) {
//     .listItem {
//         max-width: 180px!important;
//         min-width: 180px!important;
//     }
// }
</style>