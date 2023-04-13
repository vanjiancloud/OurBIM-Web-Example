<!-- 构件信息 -->
<template>
    <Drawer ref="Drawer" title="构件信息" direction="rtl" @onClose="close">
        <Tab v-model="activeTab" :data="tabList" @onTab="onTab" />
        <!-- 属性信息 -->
        <div class="attribute" v-if="activeTab===0">
            <el-row :gutter="20" v-for="(item,index) in data.memberInfo" :key="index">
                <el-col :span="8">{{item.name}}</el-col>
                <el-col :span="16">{{item.value}}</el-col>
            </el-row>
            <el-empty :image-size="100" v-if="!data.memberInfo.length"></el-empty>
        </div>
        <!-- 几何信息 -->
        <div class="geometry" v-if="activeTab===1">
            <div class="coordinate geometryItem">          
                <div class="comTitle"><img src="@/assets/images/component/title1.png"/>圆管</div>
                <div class="coordinateTitle">坐标：</div>
                <div class="coordinateItemInput">
                    X<el-input-number v-model="form.num" controls-position="right" size="mini" @keydown.native.stop />
                    Y<el-input-number v-model="form.num" controls-position="right" size="mini" @keydown.native.stop />
                    Z<el-input-number v-model="form.num" controls-position="right" size="mini" @keydown.native.stop />
                    <i class="el-icon-refresh-right"></i>
                </div>
                <div class="coordinateTitle">角度：</div>
                <div class="coordinateItemInput">
                    X<el-input-number v-model="form.num" controls-position="right" size="mini" @keydown.native.stop />
                    Y<el-input-number v-model="form.num" controls-position="right" size="mini" @keydown.native.stop />
                    Z<el-input-number v-model="form.num" controls-position="right" size="mini" @keydown.native.stop />
                    <i class="el-icon-refresh-right"></i>
                </div>
                <div class="coordinateTitle">比例：</div>
                <div class="coordinateItemInput">
                    X<el-input-number v-model="form.num" controls-position="right" size="mini" @keydown.native.stop />
                    Y<el-input-number v-model="form.num" controls-position="right" size="mini" @keydown.native.stop />
                    Z<el-input-number v-model="form.num" controls-position="right" size="mini" @keydown.native.stop />
                    <i class="el-icon-refresh-right"></i>
                </div>
            </div>
            <!-- 参数化尺寸参数 -->
            <div class="parameter geometryItem">
                <div class="comTitle"><img src="@/assets/images/component/title2.png"/>参数化尺寸参数</div>
                <div class="parameterItem">
                    <span>内半径</span>
                    <el-input v-model="form.input" placeholder="内容" size="mini" @keydown.native.stop/>mm
                    <i class="el-icon-refresh-right"></i>
                </div>
                <div class="parameterItem">
                    <span>外半径</span>
                    <el-input v-model="form.input" placeholder="内容" size="mini" @keydown.native.stop/>mm
                    <i class="el-icon-refresh-right"></i>
                </div>
                <div class="parameterItem">
                    <span>长度</span>
                    <el-input v-model="form.input" placeholder="内容" size="mini" @keydown.native.stop/>mm
                    <i class="el-icon-refresh-right"></i>
                </div>
            </div>
            <!-- 光源参数 -->
            <div class="light geometryItem">
                <div class="comTitle"><img src="@/assets/images/component/title2.png"/>光源参数</div>
                <div class="switchBox" style="margin-bottom: 26px;"><span>反射开关</span><el-switch v-model="form.value" active-color="#409EFF" inactive-color="#727272"></el-switch></div>
                <div class="CubeMap">
                    <div>CubeMap</div>

                </div>
                <div class="sliderBox"><span>影响范围</span><el-slider v-model="form.value1"></el-slider><span class="sliderNum">200cm</span></div>
                <div class="sliderBox"><span>反射强度</span><el-slider v-model="form.value1"></el-slider><span class="sliderNum">0.4</span></div>
            </div>
            <!-- 点光源 -->
            <div class="pointolite geometryItem">
                <div class="comTitle"><img src="@/assets/images/component/title3.png"/>点光源</div>
                <div class="switchBox">
                    <span>灯光开关</span><el-switch v-model="form.value" active-color="#409EFF" inactive-color="#727272"></el-switch>
                    <span>阴影开关</span><el-switch v-model="form.value" active-color="#409EFF" inactive-color="#727272"></el-switch>
                </div>
                <div class="colorBox"><span>灯光颜色</span><div><el-color-picker v-model="form.color" show-alpha></el-color-picker><span>{{formatColor(form.color)}}</span></div></div>
                <div class="sliderBox"><span>灯光强度</span><el-slider v-model="form.value1"></el-slider><span class="sliderNum">200cd</span></div>
                <div class="sliderBox"><span>锥体内角</span><el-slider v-model="form.value1"></el-slider><span class="sliderNum">200°</span></div>
                <div class="sliderBox"><span>锥体外角</span><el-slider v-model="form.value1"></el-slider><span class="sliderNum">200°</span></div>
                <div class="sliderBox"><span>衰减半径</span><el-slider v-model="form.value1"></el-slider><span class="sliderNum">200cm</span></div>
                <div class="sliderBox"><span>光源半径</span><el-slider v-model="form.value1"></el-slider><span class="sliderNum">200cm</span></div>
                <div class="sliderBox"><span>光源长度</span><el-slider v-model="form.value1"></el-slider><span class="sliderNum">200cm</span></div>
            </div>
            <!-- 文字信息 -->
            <div class="word">
                <div class="wordTextarea">
                    <span>文字内容</span>
                    <el-input type="textarea" :autosize="{ minRows: 4, maxRows: 8}" placeholder="请输入内容" v-model="form.textarea2"></el-input>
                </div>
                <div class="componentTitle">大小字体</div>
                <div class="wordDetail">
                    <span>高度</span>
                    <el-select v-model="form.value" placeholder="请选择" size="mini" style="width: 70px;">
                        <el-option
                        v-for="item in wordHeightList"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                        </el-option>
                    </el-select>
                    <span>字体</span>
                    <el-select v-model="form.value" placeholder="请选择" size="mini" style="width: 95px;">
                        <el-option
                        v-for="item in wordTypeList"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                        </el-option>
                    </el-select>
                </div>
                <div class="colorBox">
                    <span>颜色</span>
                    <div><el-color-picker v-model="form.color" show-alpha></el-color-picker><span>{{formatColor(form.color)}}</span></div>
                    <i class="el-icon-refresh-right"></i>
                </div>
            </div>
        </div>
        <!-- 材质信息 -->
        <div class="material" v-if="activeTab===2">
            <div class="materialList">
                <div class="materialListCon" :style="{'height':isOpen?'auto':'90px'}">
                    <div class="materialItem" :class="{activeMaterial:activeMaterialIndex===index}" v-for="(item,index) in componentAllInfo.matList" :key="index" @click="onMaterial(item,index)">
                        <el-image class="img" :src="item.imgPath" lazy></el-image>
                        <div class="materialReset" @click.stop="resetMaterial(item,index)"><i class="el-icon-refresh-right"></i></div>
                    </div>
                </div>
                <!-- 是否展开和收缩 -->
                <div class="isOpen" @click="isOpen=!isOpen"><i :class="{'el-icon-caret-top':isOpen,'el-icon-caret-bottom':!isOpen}"></i></div>
            </div>
            <template v-if="materialAllInfo.matParam && materialAllInfo.matParam.colorList.length">
                <div class="materialImg">
                    <span>颜色</span>
                    <el-color-picker v-model="form.color" show-alpha @change="updateMaterial()"></el-color-picker>
                    <div class="chartlet">
                        <span>基础颜色贴图</span>
                        <el-image class="img" :class="{activeChartlet:activeChartlet==='基础'}" :src="getChartletType('BaseColorMap')" lazy @click.native="onChartlet('基础')">
                            <div slot="error" class="image-slot">
                                <i class="el-icon-plus plusIcon"></i>
                            </div>
                        </el-image>
                        <span>法线贴图</span>
                        <el-image class="img" :class="{activeChartlet:activeChartlet==='法线'}" :src="getChartletType('NormalMap')" lazy @click.native="onChartlet('法线')">
                            <div slot="error" class="image-slot">
                                <i class="el-icon-plus plusIcon"></i>
                            </div>
                        </el-image>
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
                <div>
                    <el-checkbox v-model="form.checked">双面材质</el-checkbox>
                    <el-checkbox v-model="form.checked">替换所有相同材质</el-checkbox>
                </div>
            </template>
        </div>
    </Drawer>
</template>

<script>
import { mapGetters } from 'vuex'
import { materialEditorControl, getMaterialByMatId, resetMaterial, updateMaterial } from "@/api/material_api";
import { EventBus } from '@/utils/bus.js'
import Drawer from "@/components/Drawer/index.vue";
import Tab from "@/components/Tab/index.vue";
export default {
    components: { Tab, Drawer },
    props: {
        data: {
            type: Object,
            default:()=> {}
        }
    },
    data() {
        return {
            activeTab:0,//tab栏
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
            form:{},
            wordHeightList: [], //字体高度
            wordTypeList: [], //字体
            isOpen:false,
            activeMaterialIndex: 0, //默认选中材质
            materialChartlet: {
                textureParamsList: [],
                baseParamsList: []
            }, //材质下面的信息,贴图，缩放
            activeChartlet: null,//贴图是否被选中
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
        this.$store.watch((state) => state.material.materialAllInfo.matParam,(newValue, oldValue) => {
            this.materialChartlet.textureParamsList = this.formatBaseParams(this.getChartletParams())
            this.materialChartlet.baseParamsList = this.formatBaseParams(newValue.baseParamsList)
            this.formatColors(newValue.colorList)
        });
    },
    mounted() {},
    methods: {
        show() {
            this.$refs.Drawer.show()
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
            // 打开或关闭材质编辑
            await materialEditorControl({taskId: this.data.taskId,flag:this.activeTab===2?'on':'off'})
            this.changeSetting({ key: "openMaterial", value: this.activeTab===2 })
        },
        // 去掉rgba
        formatColor(color){
            return color && color.slice(5,color.length-1)
        },
        // 颜色数组变rgba
        arrToRgb(arr){
            if(!arr || !arr.length) return null
            return `rgba(${arr[0]},${arr[1]},${arr[2]},${Number(arr[3])/255})`
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
                                e.paramValue = this.formatColor(this.form.color).split(',')
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
                let materialAllInfo = {...res.data,matParam:JSON.parse(res.data.matParam)}
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
            this.changeSetting({ key: "openTexture", value: type })
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
        font-size: 14px;
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
.geometry{
    padding: 0 15px 20px 15px;
    font-size: 14px;
    color: #ffffff;
    i{
        font-size: 20px;
        color: #9FAFC2;
        cursor: pointer;
        vertical-align: middle;
    }
    .geometryItem{
        border-bottom: 1px solid #464646;
        padding-bottom: 22px;
        &:last-child{
            border-bottom: 0;
        }
    }
    .coordinate{
        .coordinateTitle{
            margin: 12px 0;
        }
        .coordinateItemInput{
            text-align: center;
        }
    }
    .parameter{
        .parameterItem{
            margin-top: 16px;
            span{
                display: inline-block;
                width: 60px;
            }
            .el-input{
                width: 85px;
                margin-right: 10px;
            }
            i{
                margin-left: 24px;
            }
        }
    }
    .light{}
    .pointolite{}
    .word{
        .wordTextarea{
            display: flex;
            margin: 20px 0;
            span{
                width: 90px;
            }
        }
        .wordDetail{
            display: flex;
            align-items: center;
            margin: 16px 0;
            .geometryText();
            span{
                padding: 0 13px;
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
            display: flex;
            align-items: center;
            margin-top: 20px;
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