<template>
    <!-- 导入图纸 -->
    <div class="drawing" v-if="levels.tab1Index === 0 && levels.tab2Index === 0">
        <div class="drawingLevel1" v-if="levels.level === 1">
            <div class="comTitle">导入图纸</div>
            <div class="drawingCon" @click="toLevel2()">
                <div class="drawingImg"><svg-icon icon-class="drawing" /></div>
                <div class="drawingName">图纸</div>
            </div>
        </div>
        <div class="drawingLevel2" v-if="levels.level === 2 && levels.hideContent">
            <div class="drawingLevel2Item" v-for="(item, index) in drawingList" :key="index" @click="onDrawing(item)">
                <!-- 上传图纸 -->
                <SingleUpload v-if="item.id===1" ref="SingleUpload" class="drawingLevel2Img" accept="image/png" url="/buildSystem/blueprintImport" :params="{taskId:data.taskId,fileUpload:null}">
                    <svg-icon slot="icon" :icon-class="item.svgUrl" />
                </SingleUpload>
                <!-- 调整比例尺 -->
                <div v-else class="drawingLevel2Img" :class="{activeDraw:item.check}">
                    <svg-icon :icon-class="item.svgUrl" />
                </div>
                <div class="drawingName">{{ item.name }}</div>
            </div>
        </div>
    </div>
</template>

<script>
import { doAction } from '@/api/model_api.js' 
import SingleUpload from '@/components/Upload/singleUpload.vue'
export default {
    components: { SingleUpload },
    props: {
        // 层级的数据
        levels: {
            type: Object,
            default:()=> {}
        },
        // 其他参数
        data: {
            type: Object,
            default:()=> {}
        }
    },
    data() {
        return {
            // 图纸
            drawingList:[
                {
                    id:1,
                    name: '上传图纸',
                    svgUrl: 'drawingAdd',
                    check: false
                },
                {
                    id:2,
                    name: '调整图纸比例尺',
                    svgUrl: 'drawingProportion',
                    check: false
                }
            ]
        };
    },
    watch: {},
    computed: {},
    created() { },
    mounted() { },
    methods: {
        // 点击到第二层级
        toLevel2(){
            this.$emit('toDrawLevel', { level: 2, name: '图纸' })
        },
        // 点击相应的操作
        onDrawing(item){
            switch (item.id) {
                // 上传图纸
                case 1:
                    
                    break;
                // 调整图纸比例尺
                case 2:
                    if(!item.check){
                        item.check = true
                        this.updateEdit({action: 'distance'},'调整图纸比例尺')
                    }else{
                        item.check = false
                        this.updateEdit({action: 'endMeasure'})
                    }
                    break;
            
                default:
                    break;
            }
        },
        // action事件
        updateEdit(obj,type) {
            let params = {
                taskid: this.data.taskId,
                ...obj
            }
            doAction(params).then((res) => {
                if(type==='调整图纸比例尺'){
                    this.$message.warning('请先在临摹图上拾取已知实际距离的两点')
                    return
                }
                this.$message.success(res.message)
            })
        },
    },
};
</script>
<style lang="less" scoped>
.drawing{
    margin-bottom: 24px;
    margin-top: 10px;
    .drawingImg{
        height: 85px;
        background: linear-gradient(180deg, #74E2FF 0%, #00AAF0 100%);
        border-radius: 4px;
        line-height: 85px;
        text-align: center;
        svg{
            color: #ffffff;
            font-size: 46px;
            vertical-align: middle;
        }
    }
    .drawingName{
        font-size: 14px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #FFFFFF;
        text-align: center;
        padding: 8px 0;
    }
    .drawingCon{
        cursor: pointer;
        width: 85px;
        &:hover .drawingImg{
            background: #00A6DF;
        }
    }
    .drawingLevel1{
        border-bottom: 1px solid #464646;
        padding-bottom: 7px;
    }
    .drawingLevel2{
        display: flex;
        flex-wrap: wrap;
        align-content: flex-start;
        gap: 20px;
        padding: 0 25px;
        .drawingLevel2Item{
            width: (90/2%);
            cursor: pointer;
            .drawingLevel2Img{
                display: flex;
                justify-content: center;
                align-items: center;
                height: 104px;
                background: #28292E;
                border-radius: 4px;
                border: 1px solid #727272;
                svg{
                    font-size: 26px;
                }
                /deep/ .el-upload{
                    background: none;
                    border: none;
                }
            }
            .activeDraw{
                border: 1px solid #00B3F3;
                box-shadow: 0px 0px 5px 0px rgba(255,255,255,0.5);
            }
            &:hover .drawingLevel2Img{
                .activeDraw();
            }
        }
    }
}
</style>
