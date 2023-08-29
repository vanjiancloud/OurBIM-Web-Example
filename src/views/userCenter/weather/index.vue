<!-- 天气 -->
<template>
    <Drawer ref="Drawer" title="天气环境" direction="rtl" @onClose="close">
        <Tab v-model="activeTab" :data="tabList"/>
        <WeatherSystem v-if="activeTab===0" :appId="data.appId" :taskId="data.taskId"/>
        <LaterPeriod v-if="activeTab===1" :data="data"/>
    </Drawer>
</template>

<script>
import WeatherSystem from "./weather_system.vue";
import LaterPeriod from "./laterPeriod.vue";
import Tab from "@/components/Tab/index.vue";
import Drawer from "@/components/Drawer/index.vue";
import { EventBus } from '@/utils/bus.js'
export default {
    components: { Drawer, Tab, LaterPeriod, WeatherSystem },
    props:{
        data: {
            type: Object,
            default: ()=>{},
        },
    },
    data() {
        return {
            activeTab:0,
            tabList:[
                {
                    name:'天气环境'
                },
                {
                    name:'后期处理'
                }
            ],
        };
    },
    watch: {},
    computed: {},
    created() { },
    mounted() { },
    methods: {
        show() {
            this.$refs.Drawer.show()
        },
        close(){
            this.$refs.Drawer.hide()
            EventBus.$emit('eventTool', 'renderingEnvironment')
        },
    }
};
</script>
<style lang="less" scoped>

</style>