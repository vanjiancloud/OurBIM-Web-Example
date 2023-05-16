<!-- 底部工具栏 -->
<template>
    <div class="tool">
        <div class="toolBox">
            <div class="toolItem" v-for="(item,index) in list" :key="index">
                <el-tooltip effect="dark" :content="item.name" placement="top">
                    <img :src="item.check?item.checkUrl:item.url" @click="onTool(item)" />
                </el-tooltip>

                <transition name="el-zoom-in-bottom">
                    <!-- 显示子菜单 -->
                    <div class="subTool" v-if="item.key==='show'&&item.check">
                        <div v-for="item in showSubList" :key="item.key" class="subToolItem" @click="onSubTool(item)">
                            <el-tooltip effect="dark" :content="item.name" placement="left">
                                <span>
                                    <el-image :src="item.url" class="url"></el-image>
                                    <el-image :src="item.checkUrl" class="checkUrl"></el-image>
                                </span>
                            </el-tooltip>
                        </div>
                    </div>
                    <!-- 模型剖切子菜单 -->
                    <div class="subTool" v-if="item.key==='modelSectioning'&&item.check">
                        <div v-for="item in sectioningSubList" :key="item.key" class="subToolItem" @click="onSubTool(item)">
                            <el-tooltip effect="dark" :content="item.name" placement="left">
                                <img :src="item.check?item.checkUrl:item.url" />
                            </el-tooltip>
                        </div>
                    </div>
                    <!-- 测量子菜单 -->
                    <div class="subTool" v-if="item.key==='measure'&&item.check">
                        <div v-for="item in measureSubList" :key="item.key" class="subToolItem" @click="onSubTool(item)">
                            <el-tooltip effect="dark" :content="item.name" placement="left" v-if="item.key!=='settingMeasure'">
                                <img :src="item.check?item.checkUrl:item.url" />
                            </el-tooltip>
                            <!-- 设置 -->
                            <el-popover placement="right" width="200" trigger="click" popper-class="measurePopover" v-else>
                                <el-tooltip slot="reference" effect="dark" :content="item.name" placement="left">
                                    <img :src="item.check?item.checkUrl:item.url" />
                                </el-tooltip>
                                <el-form class="set-form" ref="setForm" :model="setForm" label-position="top">
                                    <el-form-item label="单位">
                                        <el-select size="mini" popper-class="popper-bgi" @change="changeGauge('单位')" v-model="setForm.unit">
                                            <el-option :label="item" :value="item" v-for="item in unitList" :key="item"></el-option>
                                        </el-select>
                                    </el-form-item>
                                    <el-form-item label="精度">
                                        <el-select size="mini" popper-class="popper-bgi" @change="changeGauge('精度')" v-model="setForm.precision">
                                            <el-option :label="item" :value="item" v-for="item in accuracyList" :key="item"></el-option>
                                        </el-select>
                                    </el-form-item>
                                </el-form>
                            </el-popover>
                        </div>
                    </div>
                    <!-- 视图子菜单 -->
                    <div class="subTool" v-if="item.key==='view'&&item.check">
                        <div v-for="item in viewSubList" :key="item.key" class="subToolItem" @click="onSubTool(item)">
                            <el-tooltip effect="dark" :content="item.name" placement="left">
                                <img :src="item.check?item.checkUrl:item.url" />
                            </el-tooltip>
                        </div>
                    </div>
                    <!-- 分解模型-------滑块 -->
                    <div class="decompositionSubTool" v-if="item.key==='decompositionModel'&&item.check">
                        <el-slider v-model="splitValue" :min="0" :max="10" :step="1" @change="changeDecomposition"></el-slider>
                    </div>
                </transition>
            </div>
        </div>
    </div>
</template>

<script>
import { EventBus } from '@/utils/bus.js'
import { comSwitch } from '@/api/component-library.js'
import { controlTagShow } from '@/api/tag_tree.js'
import MODELAPI, {
    conChoiceVisible,
    invertHidden,
    displayAllActor
} from '@/api/model_api.js'
import { materialEditorControl } from "@/api/material_api";
export default {
    components: {},
    props: {
        value: {
            type: Array,
            default: () => []
        },
        data: {
            type: Object,
            default: () => {}
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
                },
                {
                    url: require('@/assets/images/todo/unchecked/tool2.png'),
                    checkUrl: require('@/assets/images/todo/check/tool2.png'),
                    name: '框选',
                    key: 'selection',
                    check: false
                },
                {
                    url: require('@/assets/images/todo/unchecked/tool3.png'),
                    checkUrl: require('@/assets/images/todo/check/tool3.png'),
                    name: '漫游导航',
                    key: 'roaming',
                    check: false
                },
                {
                    url: require('@/assets/images/todo/unchecked/tool4.png'),
                    checkUrl: require('@/assets/images/todo/check/tool4.png'),
                    name: '模型剖切',
                    key: 'modelSectioning',
                    check: false
                },
                {
                    url: require('@/assets/images/todo/unchecked/tool5.png'),
                    checkUrl: require('@/assets/images/todo/check/tool5.png'),
                    name: '测量',
                    key: 'measure',
                    check: false
                },
                {
                    url: require('@/assets/images/todo/unchecked/tool6.png'),
                    checkUrl: require('@/assets/images/todo/check/tool6.png'),
                    name: '标签',
                    key: 'label',
                    check: false
                },
                {
                    url: require('@/assets/images/todo/unchecked/tool7.png'),
                    checkUrl: require('@/assets/images/todo/check/tool7.png'),
                    name: '视图',
                    key: 'view',
                    check: false
                },
                {
                    url: require('@/assets/images/todo/unchecked/tool8.png'),
                    checkUrl: require('@/assets/images/todo/check/tool8.png'),
                    name: '模型动画',
                    key: 'modelAnimation',
                    check: false
                },
                {
                    url: require('@/assets/images/todo/unchecked/tool9.png'),
                    checkUrl: require('@/assets/images/todo/check/tool9.png'),
                    name: '分解模型',
                    key: 'decompositionModel',
                    check: false
                },
                {
                    url: require('@/assets/images/todo/unchecked/tool10.png'),
                    checkUrl: require('@/assets/images/todo/check/tool10.png'),
                    name: '渲染环境',
                    key: 'renderingEnvironment',
                    check: false
                },
                {
                    url: require('@/assets/images/todo/unchecked/tool11.png'),
                    checkUrl: require('@/assets/images/todo/check/tool11.png'),
                    name: '资源库',
                    key: 'resource',
                    check: false
                },
                {
                    url: require('@/assets/images/todo/unchecked/tool12.png'),
                    checkUrl: require('@/assets/images/todo/check/tool12.png'),
                    name: '浏览器',
                    key: 'browser',
                    check: false
                },
                {
                    url: require('@/assets/images/todo/unchecked/tool13.png'),
                    checkUrl: require('@/assets/images/todo/check/tool13.png'),
                    name: '构件信息',
                    key: 'componentInformation',
                    check: false
                }
            ],
            // 显示的子菜单
            showSubList: [
                {
                    url: require('@/assets/images/hide/hide.png'),
                    checkUrl: require('@/assets/images/hide/hide-ac.png'),
                    name: '隐藏图元',
                    key: 'hideElements',
                    check: false
                },
                {
                    url: require('@/assets/images/hide/split.png'),
                    checkUrl: require('@/assets/images/hide/split-ac.png'),
                    name: '隔离图元',
                    key: 'isolateElements',
                    check: false
                },
                {
                    url: require('@/assets/images/hide/show-all.png'),
                    checkUrl: require('@/assets/images/hide/show-all-ac.png'),
                    name: '全部显示',
                    key: 'allShowElements',
                    check: false
                }
            ],
            // 模型剖切子菜单
            sectioningSubList: [
                {
                    url: require('@/assets/images/todo/unchecked/slice/move.png'),
                    checkUrl: require('@/assets/images/todo/check/slice/move.png'),
                    name: '移动',
                    key: 'moveSectioning',
                    value: 'move',
                    check: false
                },
                {
                    url: require('@/assets/images/todo/unchecked/slice/rotate.png'),
                    checkUrl: require('@/assets/images/todo/check/slice/rotate.png'),
                    name: '旋转',
                    key: 'rotateSectioning',
                    value: 'rotate',
                    check: false
                },
                {
                    url: require('@/assets/images/todo/unchecked/slice/reverse.png'),
                    checkUrl: require('@/assets/images/todo/check/slice/reverse.png'),
                    name: '反选',
                    key: 'invertSectioning',
                    value: 'invert',
                    check: false
                },
                {
                    url: require('@/assets/images/todo/unchecked/slice/appoint.png'),
                    checkUrl: require('@/assets/images/todo/check/slice/appoint.png'),
                    name: '指定',
                    key: 'appointSectioning',
                    value: 'startItem',
                    check: false
                },
                {
                    url: require('@/assets/images/todo/unchecked/slice/reset.png'),
                    checkUrl: require('@/assets/images/todo/check/slice/reset.png'),
                    name: '重置',
                    key: 'resetSectioning',
                    value: 'restoration',
                    check: false
                }
            ],
            // 测量子菜单
            measureSubList: [
                {
                    url: require('@/assets/images/todo/unchecked/position.png'),
                    checkUrl: require('@/assets/images/todo/check/position.png'),
                    name: '坐标',
                    key: 'coordinateMeasure',
                    value: 'coordinate',
                    check: false
                },
                {
                    url: require('@/assets/images/todo/unchecked/gauge.png'),
                    checkUrl: require('@/assets/images/todo/check/gauge.png'),
                    name: '距离',
                    key: 'distanceMeasure',
                    value: 'distance',
                    check: false
                },
                {
                    url: require('@/assets/images/todo/unchecked/angle.png'),
                    checkUrl: require('@/assets/images/todo/check/angle.png'),
                    name: '角度',
                    key: 'angleMeasure',
                    value: 'angle',
                    check: false
                },
                {
                    url: require('@/assets/images/todo/unchecked/set.png'),
                    checkUrl: require('@/assets/images/todo/check/set.png'),
                    name: '设置',
                    key: 'settingMeasure',
                    check: false
                }
            ],
            // 测量子菜单-----设置
            setForm: {
                unit: 'm',
                precision: '0.01',
            },
            unitList: ["m", "cm", "mm", "ft", "in"],//单位
            accuracyList: ["0", "0.1", "0.01"],//精度
            // 视图子菜单
            viewSubList: [
                {
                    url: require("@/assets/images/todo/unchecked/viewList/create.png"),
                    checkUrl: require("@/assets/images/todo/check/viewList/create.png"),
                    name: '创建视图',
                    key: 'createView',
                    check: false
                },{
                    url: require("@/assets/images/todo/unchecked/viewList/animation.png"),
                    checkUrl: require("@/assets/images/todo/check/viewList/animation.png"),
                    name: '视点动画',
                    key: 'viewAnimation',
                    check: false
                }
            ],
            splitValue:0,//分解模型-------滑块的初始值
        }
    },
    watch: {},
    computed: {},
    created() {},
    mounted() {
        this.hideContent()
    },
    methods: {
        onTool(item) {
            // 需要哪个同时选中传值就行
            const filterCheck = (preName, nextNameArr) => {
                let isEnd = new Promise((resolve, reject) => {
                    let total = null
                    this.list.forEach((e, i) => {
                        if (nextNameArr && nextNameArr.length) {
                            const isExist = nextNameArr.every(
                                (exit) => e.key !== exit
                            )
                            if (e.name !== preName && isExist) {
                                if (e.check) {
                                    this.closeApi(e.key)
                                }
                                this.$set(e, 'check', false)
                            }
                        } else {
                            if (e.check) {
                                this.closeApi(e.key)
                            }
                            this.$set(e, 'check', false)
                        }
                        total = i + 1
                    })
                    if (total === this.list.length) {
                        resolve(true)
                    }
                })
                isEnd.then(() => {
                    this.$set(item, 'check', true)
                    this.$emit('onSuccess', item)
                    this.getChecks()
                })
            }
            if (item.check) {
                this.$set(item, 'check', false)
                this.$emit('close', item)
                this.getChecks()
                this.closeApi(item.key)
            } else {
                switch (item.key) {
                    // 显示
                    case 'show':
                        filterCheck(item.name)
                        break
                    // 框选
                    case 'selection':
                        filterCheck(item.name)
                        this.updateEdit({
                            action: 'componentBoxSelection',
                            Switch: 'on'
                        })
                        break
                    // 漫游导航
                    case 'roaming':
                        filterCheck(item.name)
                        break
                    // 模型剖切
                    case 'modelSectioning':
                        this.sectioningSubList = this.$options.data().sectioningSubList //点击初始化
                        filterCheck(item.name)
                        this.updateEdit({ action: 'start' })
                        break
                    // 测量
                    case 'measure':
                        this.measureSubList = this.$options.data().measureSubList //点击初始化
                        filterCheck(item.name)
                        break
                    // 标签
                    case 'label':
                        filterCheck(item.name)
                        this.controlTagShow(true)
                        break
                    // 视图
                    case 'view':
                        this.viewSubList = this.$options.data().viewSubList //点击初始化
                        filterCheck(item.name)
                        break
                    // 模型动画
                    case 'modelAnimation':
                        filterCheck(item.name)
                        break
                    // 分解模型
                    case 'decompositionModel':
                        this.splitValue = this.$options.data().splitValue
                        filterCheck(item.name)
                        break
                    // 渲染环境
                    case 'renderingEnvironment':
                        filterCheck(item.name)
                        break
                    // 资源库
                    case 'resource':
                        filterCheck(item.name, ['componentInformation'])
                        this.comSwitch(true)
                        this.materialEditor('on')
                        break
                    // 浏览器
                    case 'browser':
                        filterCheck(item.name, ['componentInformation'])
                        break
                    // 构件信息
                    case 'componentInformation':
                        filterCheck(item.name, ['browser', 'resource'])
                        break

                    default:
                        break
                }
            }
            this.$forceUpdate()
        },
        // 点击x关掉相应工具栏
        hideContent() {
            EventBus.$on('eventTool', (data) => {
                this.list.forEach((e) => {
                    if (e.key === data) {
                        e.check = false
                        this.getChecks()
                        this.closeApi(data)
                    }
                })
            })
        },
        // 获取check=true的数组
        getChecks() {
            let result = []
            this.list.forEach((e) => {
                if (e.check) {
                    result.push(e.key)
                }
            })
            this.$emit('input', result)
            return result
        },
        // 关闭操作
        closeApi(key) {
            if (key === 'selection') {
                // 关闭框选功能
                this.updateEdit({
                    action: 'componentBoxSelection',
                    Switch: 'off'
                })
            }
            if (key === 'modelSectioning') {
                // 关闭模型刨切功能
                this.updateEdit({ action: 'end' })
            }
            if (key === 'resource') {
                // 资源库关闭构件添加
                this.comSwitch(false)
                // 关闭材质编辑
                this.materialEditor('off')
            }
            if (key === 'measure') {
                // 测量关闭
                this.updateEdit({ action: 'endMeasure' })
            }
            if (key === 'label') {
                // 标签关闭
                this.controlTagShow(false)
            }
            if (key === 'view') {
                // 视图关闭弹窗
                this.$parent.showViewPic(null)
            }
            if (key === 'decompositionModel') {
                // 视图关闭弹窗
                this.changeDecomposition(0)
            }
        },
        // 操作子菜单
        onSubTool(item, parentKey) {
            switch (item.key) {
                // 显示的子菜单------------隐藏图元
                case 'hideElements':
                    if (!this.data.selectPark)
                        return this.$message.warning('请点击要隐藏的图元!')
                    conChoiceVisible({
                        taskid: this.data.taskId,
                        visible: false
                    }).then((res) => {
                        this.$message.success(res.message)
                    })
                    break
                // 显示的子菜单------------隔离图元
                case 'isolateElements':
                    if (!this.data.selectPark)
                        return this.$message.warning('请点击要隔离的图元!')
                    invertHidden({ taskId: this.data.taskId }).then((res) => {
                        this.$message.success(res.message)
                    })
                    break
                // 显示的子菜单------------全部显示
                case 'allShowElements':
                    displayAllActor({ taskId: this.data.taskId }).then(
                        (res) => {
                            this.$message.success(res.message)
                        }
                    )
                    break
                // 模型剖切子菜单---------移动，旋转，指定
                case 'moveSectioning':
                case 'rotateSectioning':
                case 'appointSectioning':
                    // 打开移动时关闭旋转
                    if (item.key === 'moveSectioning') {
                        this.sectioningSubList.map((e) => {
                            if (e.key === 'rotateSectioning') {
                                e.check = false
                            }
                        })
                    }
                    // 打开旋转时关闭移动
                    if (item.key === 'rotateSectioning') {
                        this.sectioningSubList.map((e) => {
                            if (e.key === 'moveSectioning') {
                                e.check = false
                            }
                        })
                    }
                    if (item.check) {
                        this.updateEdit({ action: 'cutBox' })
                    } else {
                        this.updateEdit({ action: item.value })
                    }
                    item.check = !item.check
                    break
                // 模型剖切子菜单---------反选
                case 'invertSectioning':
                    this.updateEdit({
                        action: item.value,
                        Switch: item.check ? 'off' : 'on'
                    })
                    item.check = !item.check
                    break
                // 模型剖切子菜单---------重置
                case 'resetSectioning':
                    this.updateEdit({ action: item.value })
                    break
                // 测量子菜单--------坐标，距离，角度
                case 'coordinateMeasure':
                case 'distanceMeasure':
                case 'angleMeasure':
                    this.measureSubList.map((e) => {
                        if (e.key !== 'settingMeasure' && e.key!==item.key) {
                            e.check = false
                        }
                    })
                    this.updateEdit({ action: 'endMeasure' })
                    if (!item.check) {
                        setTimeout(() => {
                            this.updateEdit({ action: item.value })
                        }, 200);
                    }
                    item.check = !item.check
                    break
                // 视图子菜单--------创建视图
                case 'createView':
                    this.viewSubList.map((e) => {
                        if (e.key !== 'createView') {
                            e.check = false
                        }
                    })
                    item.check = !item.check
                    if(item.check){
                        this.$parent.showViewPic('1')
                    }else{
                        this.$parent.showViewPic(null)
                    }
                    break
                // 视图子菜单--------视点动画
                case 'viewAnimation':
                    this.viewSubList.map((e) => {
                        if (e.key !== 'viewAnimation') {
                            e.check = false
                        }
                    })
                    item.check = !item.check
                    if(item.check){
                        this.$parent.showViewPic('2')
                    }else{
                        this.$parent.showViewPic(null)
                    }
                    break
                default:
                    break
            }
        },
        // 测量-----------设置单位和精度
        changeGauge(type){
            this.updateEdit({action:'changePrecisionOrUnit',unit:this.setForm.unit,precision:this.setForm.precision})
        },
        // 打开或关闭构件库添加构件
        comSwitch(flag) {
            comSwitch({ taskId: this.data.taskId, flag })
        },
        // 打开或关闭材质编辑  'on':'off'
        materialEditor(flag){
            materialEditorControl({taskId: this.data.taskId,flag}).then(()=>{
                if(flag==='off'){
                    this.$store.dispatch('material/changeSetting',{ key: "componentAllInfo", value: { matList:[] } })
                    this.$store.dispatch('material/changeSetting',{ key: "materialAllInfo", value: { matParam:{} } })
                }
            })
        },
        // 标签打开和关闭lableVisibility:true/false
        controlTagShow(lableVisibility){
            controlTagShow({ taskId: this.data.taskId, lableVisibility })
        },
        // 滑动分解模型
        changeDecomposition(e){
            this.updateEdit({action:'splitModel',splitValue:e})
        },
        // 打开或关闭框选功能
        updateEdit(obj) {
            let params = {
                taskid: this.data.taskId,
                ...obj
            }
            MODELAPI.UPDATEORDER(params)
                .then((res) => {
                    if (res.data.code === 0) {
                        this.$message.success(res.data.message)
                        // 模型剖切子菜单---------重置，移除模型剖切子菜单所有选项
                        if (obj.action === 'restoration') {
                            this.sectioningSubList.map((e) => {
                                e.check = false
                            })
                        }
                    } else {
                        this.$message.error(res.data.message)
                    }
                })
                .catch(() => {})
        }
    }
}
</script>
<style lang="less" scoped>
.tool {
    height: 56px;
    background: rgba(13, 22, 40, 0.7);
    border-radius: 6px;
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    margin: 0 auto;
    width: fit-content;
    .toolBox {
        display: flex;
        align-items: center;
        height: 100%;
        width: 100%;
        padding: 0 16px;
        .toolItem {
            padding: 0 10px;
            cursor: pointer;
            width: 30px;
            height: 30px;
            position: relative;
            img {
                width: 100%;
                height: 100%;
            }
            .subTool {
                position: absolute;
                bottom: 43px;
                left: 0;
                right: 0;
                margin: 0 auto;
                background: rgba(13, 22, 40, 0.7);
                border-top-left-radius: 6px;
                border-top-right-radius: 6px;
                width: 40%;
                padding: 10px;
                .subToolItem {
                    text-align: center;
                    img,
                    .el-image {
                        width: 20px;
                        height: 20px;
                        padding: 6px 0;
                        object-fit: contain;
                    }
                    span {
                        text-align: center;
                    }
                    .url {
                        display: block;
                    }
                    .checkUrl {
                        display: none;
                    }
                    &:hover {
                        .url {
                            display: none;
                        }
                        .checkUrl {
                            display: block;
                        }
                    }
                }
            }
            .decompositionSubTool{
                position: absolute;
                bottom: 43px;
                left: -115px;
                right: 0;
                margin: 0 auto;
                width: 150%;
                padding: 0 100px;
            }
        }
    }
}
.measurePopover {
    height: 160px;
}
.set-form {
    /deep/ .el-form-item__label {
        color: #ffffff;
        padding: 0;
    }
    /deep/ .el-form-item {
        margin-bottom: 0;
    }
}
</style>