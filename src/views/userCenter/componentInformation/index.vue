<!-- 构件信息 -->
<template>
    <div class="drawerBox" :style="{'width':isShow?'300px':'0px'}">
        <el-drawer title="构件信息" :visible.sync="drawer" direction="rtl" :modal="false" :wrapperClosable="false" :size="300" @close="hide" class="newDrawer" :style="{'width':isShow?'300px':'0px'}">
            <Tab :data="tabList" @onTab="onTab" />
            <!-- 属性信息 -->
            <div class="attribute" v-if="activeTab===0">
                <el-row :gutter="20" v-for="(item,index) in data" :key="index">
                    <el-col :span="8">{{item.name}}</el-col>
                    <el-col :span="16">{{item.value}}</el-col>
                </el-row>
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
                <div class="coordinate geometryItem">
                    <div class="comTitle"><img src="@/assets/images/component/title2.png"/>光源参数</div>
                    <div>反射开关<el-switch v-model="form.value" active-color="#409EFF" inactive-color="#ff4949"></el-switch></div>
                    <div>
                        <div>CubeMap</div>
                    </div>
                </div>
                <!-- 点光源 -->
                <div class="coordinate geometryItem">
                    <div class="comTitle"><img src="@/assets/images/component/title3.png"/>点光源</div>
                </div>
            </div>
            <!-- 材质信息 -->
        </el-drawer>
        <!-- 收缩和展开 -->
        <div class="isShow" @click="onIsShow" v-if="drawer">
            <i :class="{'el-icon-arrow-right':isShow,'el-icon-arrow-left':!isShow}"></i>
        </div>
    </div>
</template>

<script>
import Tab from "@/components/Tab/index.vue";
export default {
    components: { Tab },
    props: {
        taskId: {
            type: String,
        },
        data: {
            type: Array,
            default:()=> []
        }
    },
    data() {
        return {
            drawer: false,
            isShow: true, //是否展开和收缩
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
            form:{}
        }
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
            // this.content();
        },
        hide() {
            Object.assign(this.$data, this.$options.data());
            this.drawer = false;
        },
        onTab(e){
            this.activeTab = e.index
        }
    }
}
</script>
<style lang="less" scoped>
.drawerBox {
    width: 300px;
    height: 100%;
    position: fixed;
    top: 0;
    right: 0;
    animation: rtl-drawer-in .3s 1ms;
    .isShow{
        width: 20px;
        height: 64px;
        background: rgba(16,16,16,0.7);
        border-radius: 14px 0 0 14px;
        position: absolute;
        left: -20px;
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
/deep/ .el-drawer__wrapper{
    left: initial;
}

.attribute,.geometry{
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
}
</style>