<!-- 底部工具栏 -->
<template>
    <div class="tool">
        <div class="toolBox">
            <div class="toolItem" v-for="(item,index) in list" :key="index" @click="onTool(item)">
                <el-tooltip effect="dark" :content="item.name" placement="top">
                    <img :src="item.check?item.checkUrl:item.url" />
                </el-tooltip>
            </div>
        </div>
    </div>
</template>

<script>
import { EventBus } from '@/utils/bus.js'
export default {
    components: {},
    props: {
        value: {
            type:Array,
            default:()=> []
        }
    },
    data() {
        return {
            // key的值不要改动，name可以随便改
            list: [
                {
                    url: require('@/assets/images/todo/unchecked/tool1.png'),
                    checkUrl: require('@/assets/images/todo/check/tool1.png'),
                    name: '显示',
                    key: 'show',
                    check: false
                },{
                    url: require('@/assets/images/todo/unchecked/tool2.png'),
                    checkUrl: require('@/assets/images/todo/check/tool2.png'),
                    name: '框选',
                    key: 'selection',
                    check: false
                },{
                    url: require('@/assets/images/todo/unchecked/tool3.png'),
                    checkUrl: require('@/assets/images/todo/check/tool3.png'),
                    name: '漫游导航',
                    key: 'roaming',
                    check: false
                },{
                    url: require('@/assets/images/todo/unchecked/tool4.png'),
                    checkUrl: require('@/assets/images/todo/check/tool4.png'),
                    name: '模型剖切',
                    key: 'modelSectioning',
                    check: false
                },{
                    url: require('@/assets/images/todo/unchecked/tool5.png'),
                    checkUrl: require('@/assets/images/todo/check/tool5.png'),
                    name: '测量',
                    key: 'measure',
                    check: false
                },{
                    url: require('@/assets/images/todo/unchecked/tool6.png'),
                    checkUrl: require('@/assets/images/todo/check/tool6.png'),
                    name: '标签',
                    key: 'label',
                    check: false
                },{
                    url: require('@/assets/images/todo/unchecked/tool7.png'),
                    checkUrl: require('@/assets/images/todo/check/tool7.png'),
                    name: '视图',
                    key: 'view',
                    check: false
                },{
                    url: require('@/assets/images/todo/unchecked/tool8.png'),
                    checkUrl: require('@/assets/images/todo/check/tool8.png'),
                    name: '模型动画',
                    key: 'modelAnimation',
                    check: false
                },{
                    url: require('@/assets/images/todo/unchecked/tool9.png'),
                    checkUrl: require('@/assets/images/todo/check/tool9.png'),
                    name: '分解模型',
                    key: 'decompositionModel',
                    check: false
                },{
                    url: require('@/assets/images/todo/unchecked/tool10.png'),
                    checkUrl: require('@/assets/images/todo/check/tool10.png'),
                    name: '渲染环境',
                    key: 'renderingEnvironment',
                    check: false
                },{
                    url: require('@/assets/images/todo/unchecked/tool11.png'),
                    checkUrl: require('@/assets/images/todo/check/tool11.png'),
                    name: '资源库',
                    key: 'resource',
                    check: false
                },{
                    url: require('@/assets/images/todo/unchecked/tool12.png'),
                    checkUrl: require('@/assets/images/todo/check/tool12.png'),
                    name: '浏览器',
                    key: 'browser',
                    check: false
                },{
                    url: require('@/assets/images/todo/unchecked/tool13.png'),
                    checkUrl: require('@/assets/images/todo/check/tool13.png'),
                    name: '构件信息',
                    key: 'componentInformation',
                    check: false
                },
            ]
        }
    },
    watch: {},
    computed: {},
    created() {},
    mounted() {
        this.hideContent()
    },
    methods: {
        onTool(item){
            // 需要哪个同时选中传值就行
            const filterCheck = (preName,nextNameArr)=>{
                let isEnd = new Promise((resolve, reject) => {
                    let total = null
                    this.list.forEach((e,i)=>{
                        if(nextNameArr&&nextNameArr.length){
                            const isExist = nextNameArr.every(exit => e.key !== exit);
                            if(e.name!==preName && isExist){
                                this.$set(e,'check',false)
                            }
                        }else{
                            this.$set(e,'check',false)
                        }
                        total = i+1
                    })
                    if(total===this.list.length){
                        resolve(true)
                    }
                })
                isEnd.then(()=>{
                    this.$set(item,'check',true)
                    this.$emit('onSuccess',item)
                    this.getChecks()
                })
            }
            if(item.check){
                this.$set(item,'check',false)
                this.$emit('close',item)
                this.getChecks()

            }else{
                switch (item.key) {
                    // 显示
                    case 'show':
                        filterCheck(item.name)
                        break;
                    // 框选
                    case 'selection':
                        filterCheck(item.name)
                        break;
                    // 漫游导航
                    case 'roaming':
                        filterCheck(item.name)
                        break;
                    // 模型剖切
                    case 'modelSectioning':
                        filterCheck(item.name)
                        break;
                    // 测量
                    case 'measure':
                        filterCheck(item.name)
                        break;
                    // 标签
                    case 'label':
                        filterCheck(item.name)
                        break;
                    // 视图
                    case 'view':
                        filterCheck(item.name)
                        break;
                    // 模型动画
                    case 'modelAnimation':
                        filterCheck(item.name)
                        break;
                    // 分解模型
                    case 'decompositionModel':
                        filterCheck(item.name)
                        break;
                    // 渲染环境
                    case 'renderingEnvironment':
                        filterCheck(item.name)
                        break;
                    // 资源库
                    case 'resource':
                        filterCheck(item.name,['componentInformation'])
                        break;
                    // 浏览器
                    case 'browser':
                        filterCheck(item.name,['componentInformation'])
                        break;
                    // 构件信息
                    case 'componentInformation':
                        filterCheck(item.name,['browser','resource'])
                        break;
                
                    default:
                        break;
                }
            }
            this.$forceUpdate()
        },
        // 点击x关掉相应工具栏
        hideContent(){
            EventBus.$on('eventTool', data => {
                this.list.forEach(e=>{
                    if(e.key===data){
                        e.check = false
                        this.getChecks()
                    }
                })
            })
        },
        // 获取check=true的数组
        getChecks(){
            let result = []
            this.list.forEach(e=>{ 
                if(e.check) {
                    result.push(e.key) 
                }
            })
            console.log('🚀🚀🚀check=true',result);
            this.$emit("input", result);
            return result
        }
    }
}
</script>
<style lang="less" scoped>
.tool {
    height: 56px;
    background: rgba(13,22,40,0.7);
    border-radius: 6px;
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    margin: 0 auto;
    width: fit-content;
    .toolBox{
        display: flex;
        align-items: center;
        height: 100%;
        width: 100%;
        padding: 0 16px;
        .toolItem{
            padding: 0 16px;
            cursor: pointer;
            width: 30px;
            height: 30px;
            img{
                width: 100%;
                height: 100%;
            }
        }
    }
}
</style>