<!-- 构件信息 -->
<template>
    <Drawer ref="Drawer" title="构件信息" direction="rtl" @onClose="close">
        <Tab v-model="activeTab" :data="tabList" @onTab="onTab" />
        <!-- 属性信息 -->
        <div class="attribute" v-if="activeTab===0">
            <el-row :gutter="16" v-for="(item,index) in data.memberInfo" :key="index">
                <el-col :span="9">{{item.name}}</el-col>
                <el-col :span="15">{{item.value}}</el-col>
            </el-row>
            <el-empty :image="require('@/assets/noData.png')" :image-size="100" v-if="!data.memberInfo.length"></el-empty>
        </div>
        <!-- 几何信息 -->
        <Geometry v-show="activeTab===1" :data="data"/>
        <!-- 材质信息 -->
        <div class="material" v-if="activeTab===2">
            <el-empty :image="require('@/assets/noData.png')" description="暂无材质信息，请打开资源库点击构件" :image-size="100" v-if="!(componentAllInfo.matList&&componentAllInfo.matList.length)"></el-empty>
            <div class="materialList" v-if="componentAllInfo.matList&&componentAllInfo.matList.length">
                <div class="materialListCon" :style="{'height':isOpen?'auto':'90px'}">
                    <div class="materialItem" :class="{activeMaterial:activeMaterialIndex===index}" v-for="(item,index) in componentAllInfo.matList" :key="index" @click="onMaterial(item,index)">
                        <el-image class="img" :src="item.imgPath" lazy>
                            <div slot="placeholder" class="image-slot">
                                <img src="@/assets/default/material.png"/>
                            </div>
                            <div slot="error" class="image-slot">
                                <img src="@/assets/default/material.png"/>
                            </div>
                        </el-image>
                        <div class="materialReset" @click.stop="resetMaterial(item,index)" v-if="materialAllInfo.matParam && materialAllInfo.matParam.colorList && materialAllInfo.matParam.colorList.length"><i class="el-icon-refresh-right"></i></div>
                    </div>
                </div>
                <!-- 是否展开和收缩 -->
                <div class="isOpen" @click="isOpen=!isOpen"><i :class="{'el-icon-caret-top':isOpen,'el-icon-caret-bottom':!isOpen}"></i></div>
            </div>
            <template v-if="materialAllInfo.matParam && materialAllInfo.matParam.colorList && materialAllInfo.matParam.colorList.length">
                <div class="materialImg">
                    <span>颜色</span>
                    <el-color-picker v-model="form.color" show-alpha @change="updateMaterial()"></el-color-picker>
                    <div class="chartlet">
                        <div class="chartletItem">                            
                            <span>基础颜色贴图</span>
                            <el-image class="img" :class="{activeChartlet:activeChartlet==='基础'}" :src="getChartletType('BaseColorMap')" lazy @click.native="onChartlet('基础')">
                                <div slot="error" class="image-slot">
                                    <i class="el-icon-plus plusIcon"></i>
                                </div>
                            </el-image>
                            <div v-if="getChartletType('BaseColorMap')" class="deleteChartlet" @click="deleteChartlet('BaseColorMap')"><i class="el-icon-delete"></i></div>
                        </div>
                        <div class="chartletItem" style="margin-left: 18px;">                           
                            <span>法线贴图</span>
                            <el-image class="img" :class="{activeChartlet:activeChartlet==='法线'}" :src="getChartletType('NormalMap')" lazy @click.native="onChartlet('法线')">
                                <div slot="error" class="image-slot">
                                    <i class="el-icon-plus plusIcon"></i>
                                </div>
                            </el-image>
                            <div v-if="getChartletType('NormalMap')" class="deleteChartlet" @click="deleteChartlet('NormalMap')"><i class="el-icon-delete"></i></div>
                        </div>
                    </div>
                </div>
                <div class="componentTitle">贴图位置</div>
                <template v-for="(item,index) in materialChartlet.textureParamsList">
                    <div v-if="!item.hasOwnProperty('enableEdit')||item.enableEdit!='false'" :key="index">
                        <div class="switchBox" v-if="item.label === '等比缩放'">
                            <span>等比缩放</span><el-switch @change="updateMaterial()" v-model="item.paramValue" :active-value="1" :inactive-value="0" active-color="#409EFF" inactive-color="#727272"></el-switch>
                        </div>
                        <div class="materialSlider" :key="index+1" v-else-if="item.label !== '等比缩放' && (((filterTexturesList('等比缩放')==1&&item.label!=='纵向缩放'&&item.label!=='横向缩放') || (filterTexturesList('等比缩放')==0&&item.label!=='缩放')))">
                            <div>{{ item.label }}</div>
                            <div class="slider">
                                <el-slider @change="onChange(0,$event,index)" v-model="item.paramValue1" :max="Number(item.max)" :min="Number(item.min)" :step="Number(item.min)<=0 ? 0.1 : ((Number(item.min)<=0.01) ? 0.01 : 1)"></el-slider>
                                <input type="number" v-model.trim.number="item.paramValue" style="width:70px;height: 23px;" @change="updateMaterial()" />
                                <span v-if="['横向偏移','纵向偏移'].includes(item.label)">mm</span>
                                <span v-else-if="['角度'].includes(item.label)">°</span>
                                <span v-else></span>
                            </div>
                        </div>
                    </div>
                </template>
                <div class="componentTitle">材质效果属性</div>
                <template v-for="(item,index) in materialChartlet.baseParamsList">
                    <div class="materialSlider" :key="index+'base'" v-if="!item.hasOwnProperty('enableEdit')||item.enableEdit!='false'">
                        <div>{{ item.label }}</div>
                        <div class="slider">
                            <el-slider @change="onChange(1,$event,index)" v-model="item.paramValue1" :max="Number(item.max)" :min="Number(item.min)" :step="Number(item.min)<=0 ? 0.1 : ((Number(item.min)<=0.01) ? 0.01 : 1)"></el-slider>
                            <input type="number" v-model.trim.number="item.paramValue" style="width:70px;height: 23px;" @change="updateMaterial()" />
                        </div>
                    </div>
                </template>
                <!-- <div>
                    <el-checkbox v-model="form.checked">双面材质</el-checkbox>
                    <el-checkbox v-model="form.checked">替换所有相同材质</el-checkbox>
                </div> -->
            </template>
        </div>
    </Drawer>
</template>

<script>
import { mapGetters } from 'vuex'
import { getMaterialByMatId, resetMaterial, updateMaterial } from "@/api/material_api";
import { modifyComParams } from "@/api/component-library";
import { EventBus } from '@/utils/bus.js'
import Drawer from "@/components/Drawer/index.vue";
import Tab from "@/components/Tab/index.vue";
import Geometry from "./geometry.vue";
import { Getuserid } from "@/store/index.js"; 
export default {
    components: { Tab, Drawer, Geometry },
    props: {
        data: {
            type: Object,
            default:()=> {}
        }
    },
    data() {
        return {
            activeTab:2,//tab栏
            tabList: [
                {
                    name: '属性信息'
                },
                {
                    name: '几何信息'
                },
                {
                    name: '材质信息'
                }
            ],
            // 材质start-----------------------
            isOpen:false,
            activeMaterialIndex: 0, //默认选中材质
            materialChartlet: {
                textureParamsList: [],
                baseParamsList: []
            }, //材质下面的信息,贴图，缩放
            activeChartlet: null,//贴图是否被选中
            form: {},
            // 材质end-----------------------

            // 几何信息start-----------------------
            lightArr:[
                {
                    key:'intensity',
                    name: '光源强度',
                    unit: 'cd',
                    limits: ['spotLight','pointLight','areaLight']
                },
                {
                    key:'radiationAngleOfInner',
                    name: '内辐射角',
                    unit: '°',
                    limits: ['spotLight']
                },
                {
                    key:'radiationAngleOfOuter',
                    name: '外辐射角',
                    unit: '°',
                    limits: ['spotLight']
                },
                {
                    key:'attenuationRadius',
                    name: '衰减半径',
                    unit: 'cm',
                    limits: ['spotLight','pointLight','areaLight']
                },
                {
                    key:'influenceRadius',
                    name: '影响半径',
                    unit: 'cm',
                    limits: ['sphereReflection']
                },
                {
                    key:'brightness',
                    name: '反射强度',
                    unit: '',
                    limits: ['sphereReflection'],
                    min:0,
                    max:1,
                    step:0.1
                },
                {
                    key:'sourceRadius',
                    name: '光源半径',
                    unit: 'cm',
                    limits: ['spotLight','pointLight']
                },
                {
                    key:'sourceLength',
                    name: '光源长度',
                    unit: 'cm',
                    limits: ['spotLight','pointLight']
                },
                {
                    key:'sourceHeight',
                    name: '光源高度',
                    unit: 'cm',
                    limits: ['areaLight']
                },
                {
                    key:'sourceWidth',
                    name: '光源宽度',
                    unit: 'cm',
                    limits: ['areaLight']
                },{
                    key:'barnDoorAngle',
                    name: '谷仓门角度',
                    unit: '。',
                    limits: ['areaLight']
                },{
                    key:'barnDoorLength',
                    name: '谷仓门长度',
                    unit: 'cm',
                    limits: ['areaLight']
                }
            ],
            wordHeightList: [], //字体高度
            wordTypeList: [], //字体
            // 几何信息end-----------------------
            isGis:false,//是否是gis模式下的
        }
    },
    watch: {
        activeMaterialIndex(val){
            this.changeSetting({ key: "activeMaterialIndex", value: val })
        },
    },
    computed: {
        ...mapGetters(["componentAllInfo", "materialAllInfo"]),
    },
    created() {
        this.isGis = (this.$route.query.isGis&&eval(this.$route.query.isGis.toLowerCase())) || (this.$route.query.weatherBin&&eval(this.$route.query.weatherBin.toLowerCase())) || false
        this.unwatchToken = this.$store.watch((state) => state.material.materialAllInfo,(newValue, oldValue) => {
            if(!newValue.matParam || !newValue.matParam.baseParamsList){
                // this.unwatchToken()
                return
            }
            console.log('🚀🚀🚀是否更新',newValue);
            this.materialChartlet.textureParamsList = this.formatBaseParams(this.getChartletParams())
            this.materialChartlet.baseParamsList = this.formatBaseParams(newValue.matParam.baseParamsList)
            this.formatColors(newValue.matParam.colorList)
        }, { deep: true });
    },
    mounted() {},
    destroyed () {
        EventBus.$off('eventTool')
    },
    methods: {
        show() {
            this.$refs.Drawer.show()
            this.settingMaterialTab()
            this.changeSetting({ key: "openMaterial", value: this.activeTab===2 })
        },
        close(){
            this.$refs.Drawer.hide()
            EventBus.$emit('eventTool', 'componentInformation')
        },
        // 改变vuex的数据
        changeSetting(obj){
            this.$store.dispatch('material/changeSetting',obj)
        },
        async onTab(e){
            this.activeTab = e.index
            this.changeSetting({ key: "openMaterial", value: this.activeTab===2 })
            this.settingMaterialTab()
        },
        // 点击材质信息资源库跳到材质库
        settingMaterialTab(){
            if(this.activeTab === 2){
                this.$store.dispatch('material/changeSetting',{ key: "materialLevel1Tab", value: 1 })
            }
        },
        // 去掉rgba,去掉空格
        formatColor(color){
            return  color && color.slice(5,color.length-1).replace(/\s*/g, '') || ''
        },
        // 颜色数组变rgba
        arrToRgb(arr){
            if(!arr || !arr.length) return null
            return `rgba(${Number(arr[0])},${Number(arr[1])},${Number(arr[2])},${Number(arr[3])/255})`
        },
        /* 
            处理贴图
            颜色paramName：BaseColor  不同材质不同取值
            isUpdate：true:点击更新提交的时候转为数组
            isUpdate：false:回显的时候转为rgba
        */
        formatColors(colorList,isUpdate){
            if(isUpdate){
                if(colorList.length){
                    try {
                        colorList.forEach(e=>{
                            if(e.paramName==='BaseColor' || e.paramName==='Color' || e.paramName==='GlowColor' || e.paramName==='BaseColor1' || e.paramName==='BaseColor2'){
                                e.paramValue = this.form.color?this.formatColor(this.form.color).split(','):[]
                                throw new Error()
                            }
                        })
                    } catch (error) {}
                }
                return colorList
            }else{
                if(colorList.length){
                    try {
                        colorList.forEach(e=>{
                            if(e.paramName==='BaseColor' || e.paramName==='Color' || e.paramName==='GlowColor' || e.paramName==='BaseColor1' || e.paramName==='BaseColor2'){
                                this.$set(this.form,'color',this.arrToRgb(e.paramValue))
                                throw new Error()
                            }
                        })           
                    } catch (error) {}
                }else{
                    this.$set(this.form,'color',null)
                }
            }
        },
        // 获取贴图数据
        getChartletType(type){
            let res = this.materialAllInfo.matParam&&this.materialAllInfo.matParam.texturesList.find(e=>{return e.paramName===type})
            return res&&res.paramValue
        },
        // 贴图位置
        getChartletParams(){
            //   为了排序start
            let imgData = this.materialAllInfo.matParam.textureParamsList || []
            let reSort = []
            imgData.forEach((e,i)=>{
                this.$set(e,'paramValue1',Number(e.paramValue))
                e.paramValue = Number(e.paramValue)
                if(e.label==='等比缩放'){
                    // e.paramValue = Number(e.paramValue).toString()
                    reSort.unshift(e)
                }
                if(e.label==='横向缩放'){
                    reSort.push(e)
                }
                if(e.label==='纵向缩放'){
                    reSort.push(e)
                }
                if(e.label==='缩放'){
                    reSort.push(e)
                }
            })
            let seen = new Map();
            let uniqueArr = reSort.concat(imgData).filter((item) => {
                return !seen.has(JSON.stringify(item)) && seen.set(JSON.stringify(item), 1);
            });
            // end
            return uniqueArr
        },
        formatBaseParams(data){
            return data.map(e=>{return {...e,paramValue:Number(e.paramValue),paramValue1:Number(e.paramValue)}})
        },
        filterTexturesList(type){
            let res = this.getChartletParams().find(e=>{return e.label===type})
            return res&&res.paramValue
        },
        onMaterial(item,i){
            this.activeMaterialIndex = i
            // 重置后的数据不请求，因为返回的还是原来的数据没更新
            if(item.matId === 'RESET'){
                return
            }
            this.getMaterial(item.matId)
        },
        // 获取材质信息
        getMaterial(matId){
            getMaterialByMatId({ matId: matId || this.materialAllInfo.matId, isPublic: false }).then(res=>{
                let materialAllInfo = {...this.componentAllInfo.matList[this.activeMaterialIndex],...res.data,matParam:JSON.parse(res.data.matParam)}
                this.changeSetting({ key: "materialAllInfo", value: materialAllInfo })
                this.formatColors(materialAllInfo.matParam.colorList)
                this.getChartletParams()
            })
        },
        // 更新滑动条
        onChange(type,e,i){
            if(type===0){
                this.materialChartlet.textureParamsList[i].paramValue = e
            }
            if(type===1){
                this.materialChartlet.baseParamsList[i].paramValue = e
            }
            this.updateMaterial()
        },
        // 更新材质
        updateMaterial(){
            let params = {
                taskId:this.data.taskId,
                appId: this.$parent.pakidToAppid(this.componentAllInfo.pakId),
                // baseColorTextureId:'',
                // normalMapTextureId:''
            }
            let colorList = this.formatColors(this.materialAllInfo.matParam.colorList,true)
            let data = [{
                matId: this.materialAllInfo.matId,
                pakId: this.componentAllInfo.pakId,
                matParam:{
                    matId:this.materialAllInfo.matId,
                    ...this.materialAllInfo.matParam,
                    colorList,
                    ...this.materialChartlet
                }
            }]
            updateMaterial(params,JSON.stringify(data)).then(()=>{
                this.$message.success('材质替换成功')
                this.getMaterial(data.matId)
            })
        },
        // 点击贴图
        onChartlet(type){
            this.activeChartlet = type
            this.$store.dispatch('material/changeSetting',{ key: "materialLevel1Tab", value: 2 })//点击贴图切换到贴图管理
            this.changeSetting({ key: "openTexture", value: type })
        },
        // 删除贴图
        deleteChartlet(key){
            this.$confirm('您要删除此贴图, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
                }).then(async () => {
                    this.getChartletType(key)
                    let index = this.materialAllInfo.matParam.texturesList.findIndex(e=>{return e.paramName===key})
                    this.materialAllInfo.matParam.texturesList[index].paramValue = ''
                    this.updateMaterial()
                }).catch(() => {});
        },
        // 恢复材质按钮,公共构件appId不用传；pakIdMapweb：是否是公共构件
        resetMaterial(item,i){
            this.$confirm('您将重置此材质, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                let params = {
                    taskId:this.data.taskId,
                    appId: this.$parent.pakidToAppid(this.componentAllInfo.pakId),
                    matId:item.matId,
                    isPublic: false
                }
                let arr = [
                    {
                        actorId:this.componentAllInfo.actorId,
                        meshIndex:this.materialAllInfo.meshIndex,
                        matIndex:this.materialAllInfo.matIndex,
                        comType: this.data.pakIdMapweb,
                        pakId:this.componentAllInfo.pakId
                    }
                ]
                resetMaterial(params,JSON.stringify(arr)).then(()=>{
                    let matList = JSON.parse(JSON.stringify(this.componentAllInfo.matList))
                    matList[i].imgPath = require('@/assets/caizhi.jpg')
                    matList[i].matId = 'RESET'
                    this.$store.dispatch('material/changeSetting',{ key: "componentAllInfo", value: {matList} })
                    this.changeSetting({ key: "materialAllInfo", value: {matParam:{baseParamsList:[],colorList:[],textureParamsList:[],texturesList:[]}} })
                    this.$message.success('材质重置成功')
                })
            }).catch(() => {});
        },
    }
}
</script>
<style lang="less" scoped>
.geometryText{
    span{
        padding: 0 16px;
        &:first-child{
            padding-left: 0;
        }
    }
}
.componentTitle{
    font-weight: 500;
    margin-bottom: 20px;
}

.attribute,.geometry,.material{
    padding: 0 30px 20px 30px;
    width: 100%;
    height: calc(100vh - 105px);
    overflow: auto;
}
.attribute{
    /deep/ .el-row{
        color: #ffffff;
        letter-spacing: 2px;
        font-size: 12px;
        border-bottom: 1px solid #484A4E;
        padding: 10px 0px;
        >div{
            word-break: break-word;
        }
        >div:first-child{
            color: #C2C2C4;
        }
    }
}
.sliderBox{
    display: flex;
    align-items: center;
    span{
        margin-right: 8px;
    }
    .sliderNum{
        display: inline-block;
        min-width: 50px;
        margin-left: 8px;
    }
    /deep/ .el-slider{
        flex: 1;
        .el-slider__runway{
            height: 16px;
            background: #252525;
            border: 1px solid #4D4B4B;
            margin: 10px 0;
        }
        .el-slider__bar{
            height: 16px;
            background: #646464;
        }
        .el-slider__button{
            background: #0089D1;
            border:none;
            width: 4px;
            height: 16px;
            border-radius: 0 4px 4px 0;
        }
        .el-slider__button-wrapper{
            top: -10px;
        }
    }
}
.switchBox{
    margin: 20px 0;
    .geometryText();
}
.colorBox{
    margin-bottom: 10px;
    display: flex;
    align-items: center;
    .geometryText();
    >div{
        background: #24262B;
        border-radius: 2px;
        border: 1px solid #727272;
        padding: 3px;
        display: flex;
        span{
            padding: 0 10px;
        }
    }
    i{
        margin-left: 8px;
    }
    /deep/ .el-color-picker{
        height: 22px;
        .el-color-picker__trigger{
            border:none;
            width: 56px;
            height: 22px;
            padding: 0;
            border-radius: 4px;
            overflow: hidden;
            .el-color-picker__color{
                border:none;
            }
        }
    }
}

.material{
    padding: 0 15px 20px 15px;
    color: #ffffff;
    font-size: 14px;
    .materialList{
        border-bottom: 1px solid #464646;
        .materialListCon{
            display: flex;
            flex-wrap: wrap;
            gap: 12px;
            overflow: hidden;
            height: 90px;
        }
        .materialItem{
            width: 80px;
            height: 80px;
            overflow: hidden;
            border-radius: 6px;
            cursor: pointer;
            background: #0089D1;
            position: relative;
            .img{
                width: 100%;
                height: 100%;
                object-fit: cover;
            }
            .materialReset{
                width: 26px;
                height: 26px;
                background: rgba(51,51,51,0.8);
                border-radius: 4px;
                position: absolute;
                right: 0;
                top: 0;
                font-size: 16px;
                text-align: center;
                color: #ffffff;
                line-height: 26px;
                display: none;
            }
            &:hover .materialReset{
                display: block;
            }
        }
        .activeMaterial{
            border:1px solid #00C9FD;
        }
        .isOpen{
            text-align: center;
            padding: 8px 0;
            color: #BABFC6;
            cursor: pointer;
        }
    }
    .materialImg{
        .geometryText();
        margin: 23px 0;
        span{
            padding: 0 8px 0 20px;
        }
        /deep/ .el-color-picker__trigger, /deep/ .el-color-picker__color{
            border: none;
            padding: 0;
        }
        /deep/.el-color-picker{
            vertical-align: middle;
        }
        .chartlet{
            margin-top: 20px;
            display: flex;
            align-items: center;
            .chartletItem{
                position: relative;
                display: flex;
                align-items: center;
                &:hover .deleteChartlet{
                    display: block !important;
                }
                .deleteChartlet{
                    position: absolute;
                    right: -10px;
                    top: -10px;
                    background: rgba(255,255,255,0.3);
                    border-radius: 100%;
                    width: 20px;
                    height: 20px;
                    text-align: center;
                    cursor: pointer;
                    display: none;
                    &:hover{
                        background: #c8550e;
                    }
                }
                .img{
                    width: 40px;
                    height: 40px;
                    object-fit: cover;
                    cursor: pointer;
                    border-radius: 6px;
                }
                /deep/ .image-slot{
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background-color: #cccccc;
                    height: 100%;
                    width: 100%;
                }
            }
            .activeChartlet{
                border: 2px solid #00c9fd;
            }
        }
    }
    .materialSlider{
        margin: 15px 0;
        font-family: PingFangSC-Regular, PingFang SC;
        color: #c2c5bc;
        .slider{
            display: flex;
            align-items: center;
            span{
                width: 40px;
            }
        }
        /deep/ .el-slider{
            flex: 1;
            margin-right: 6px;
            .el-slider__runway.show-input{
                margin-right: 80px;
            }
            .el-slider__runway,.el-slider__bar{
                height: 3px;
            }
            .el-slider__runway{
                margin: 12px 0;
            }
            .el-slider__button{
                width: 10px;
                height: 10px;
            }
            .el-slider__button-wrapper{
                top: -16px;
            }
            .el-slider__bar{
                background: #18ACFB;
            }
        }
    }
}
</style>