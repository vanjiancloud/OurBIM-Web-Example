<!-- 资源库 -->
<template>
<div>
    <Drawer ref="Drawer" title="资源库" @onClose="close">
        <template v-slot="{ drawer }">
            <Tab v-model="levels.tab1Index" :data="tabList" @onTab="onTab($event,true)" />

            <!-- 构件库 -->
            <ComponentList ref="ComponentList" v-if="levels.tab1Index===0" :data="data"/>
            <!-- 材质库 -->
            <MaterialList ref="MaterialList" v-if="levels.tab1Index===1" :data="data"/>
            <!-- 贴图库 -->
            <CharletList ref="CharletList" v-if="levels.tab1Index===2" :data="data"/>           
            
            <!-- 构件操作图标 -->
            <OperatingTools ref="OperatingTools" v-if="drawer" :data="data"/>
        
        </template>
    </Drawer>
</div>
</template>

<script>
import { throttle } from 'lodash'
import { mapGetters, mapState } from 'vuex'
import { EventBus } from '@/utils/bus.js'
import Tab from "@/components/Tab/index.vue";
import Drawer from "@/components/Drawer/index.vue";
import OperatingTools from "@/components/OperatingTools";
import MaterialList from './materialList.vue'
import ComponentList from './componentList.vue'
import CharletList from './charletList.vue'
export default {
    components: { Tab, Drawer, OperatingTools, MaterialList, ComponentList, CharletList },
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
            levels: {
                isClickTab:false,//是否点击一级的tab
                tab1Index: 0,
            },
        };
    },
    watch: {},
    computed: {
        ...mapGetters(["componentAllInfo"]),
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
            this.$refs.Drawer.show()
            this.getList()
        },
        close(){
            this.$refs.Drawer.hide()
            EventBus.$emit('eventTool', 'resource')
        },
        // 点击tab
        onTab:throttle(function(e,isClick=false) {
            this.levels = this.$options.data().levels
            this.levels.isClickTab = isClick
            if(isClick){
                this.$store.dispatch('material/changeSetting',{ key: "materialLevel1Tab", value: this.levels.tab1Index })
            }
            this.levels.tab1Index = e.index;
            // 没打开不请求
            if(!this.$refs.Drawer.drawer) return
            setTimeout(()=>{
                this.getList()
            },500)
        },800),
        getList(){
            switch (this.levels.tab1Index) {
                case 0:
                    this.$refs.ComponentList&&this.$refs.ComponentList.getPubilcList()
                    break;
                case 1:
                    this.$refs.MaterialList&&this.$refs.MaterialList.getPubilcList()
                    break;
                case 2:
                    this.$refs.CharletList&&this.$refs.CharletList.getPubilcList()
                    break;

                default:
                    break;
            }
        },
        // 是否打开构件信息
        openComponent(){
            return this.$parent.checkShow('componentInformation')
        },
        // 是否打开构件信息
        findPakId(){
            return this.$parent.pakidToAppid(this.componentAllInfo.pakId)
        },
        // 隐藏工具
        hideTool(){
            this.$parent.hideTool()
        },
        // 点击库类型
        onTypeTab(e) {
            this.levels.tab2Index = e.index;
        },
        
        // 图标显示--------缩放,旋转,移动,轴心,笔刷
        checkOprate(data){
            this.$refs.OperatingTools&&this.$refs.OperatingTools.checkOprate(data)
        },
    },
};
</script>
<style lang="less" scoped>
</style>
