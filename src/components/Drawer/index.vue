<template>
    <div class="drawerBox" v-show="drawer" :style="{'width':isShow&&drawer?'300px':'0px'}" :class="direction==='ltr'?'drawerBoxLeft':'drawerBoxRight'">
        <!-- 收缩和展开 -->
        <div class="isShow" @click="onIsShow" v-if="drawer">
            <i v-if="direction==='ltr'" :class="{'el-icon-arrow-right':!isShow,'el-icon-arrow-left':isShow}"></i>
            <i v-else :class="{'el-icon-arrow-right':isShow,'el-icon-arrow-left':!isShow}"></i>
        </div>

        <el-drawer :title="title" :visible.sync="drawer" :direction="direction" :modal="false" :wrapperClosable="false" :size="300" @close="close" class="newDrawer" :style="{'width':isShow?'300px':'0px'}">
            <slot name="drawer" :isShow="isShow" :drawer="drawer"></slot>
        </el-drawer>

        <!-- 其他内容避免弹窗获取不到父级 -->
        <slot name="append" :isShow="isShow" :drawer="drawer"></slot>
    </div>
</template>

<script>
export default {
    components: {},
    props: {
        direction: {
            type: String,
            default: 'ltr'
        },
        title: {
            type: String,
            default: '标题'
        }
    },
    data() {
        return {
            isShow: true, //展开和收缩
            drawer: false
        }
    },
    watch: {},
    computed: {},
    created() {},
    mounted() {},
    methods: {
        onIsShow() {
            this.isShow = !this.isShow
        },
        show() {
            this.drawer = true
        },
        close() {
            this.drawer = false
        }
    }
}
</script>
<style lang="less" scoped>
@keyframes fadeLeft {
    0% {
        transform: translateX(300px);
    }
    100% {
        transform: translateX(0);
    }
}
@keyframes fadeRight {
    0% {
        transform: translateX(-300px);
    }
    100% {
        transform: translateX(0);
    }
}
.left {
    animation: ltr-drawer-in 0.3s 1ms;
}
.right {
    animation: rtl-drawer-in 0.3s 1ms;
}
.drawerBox {
    width: 300px;
    height: 100%;
    position: fixed;
    top: 0;
    animation: ltr-drawer-in 0.3s 1ms;
    .isShow {
        width: 20px;
        height: 64px;
        background: rgba(16, 16, 16, 0.7);
        border-radius: 0px 14px 14px 0px;
        position: absolute;
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
.drawerBoxLeft{
    animation: fadeRight 0.3s 1ms;
    .isShow {
        right: -20px;
        left: initial;
        border-radius: 0px 14px 14px 0px;
        animation: fadeRight 0.3s 1ms;
    }
}
.drawerBoxRight {
    right: 0;
    animation: fadeLeft 0.3s 1ms;
    /deep/ .el-drawer__wrapper {
        left: initial;
    }
    .isShow {
        left: -20px;
        right: initial;
        border-radius: 14px 0 0 14px;
        animation: fadeLeft 0.3s 1ms;
    }
}
// 公共样式
.newDrawer {
    width: 300px;
    /deep/.el-drawer {
        background: rgba(16, 16, 16, 0.7);
        .el-drawer__header {
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #ffffff;
            padding: 16px;
            margin: 0;
        }
    }

    /deep/ .el-input__inner {
        background: #24262b;
        color: #ffffff;
        border: 1px solid #727272;
    }

    /deep/ .el-input-number--mini {
        width: 60px;
        margin: 0 3px 0 6px;

        .el-input__inner {
            padding-right: 14px;
            padding-left: 5px;
        }

        .el-input-number__decrease,
        .el-input-number__increase {
            width: 12px;
            background: none;
            border: none;
            color: #ffffff;
            right: 4px;
        }
    }
    /deep/ .el-textarea__inner {
        background: #24262b;
        border: 1px solid #727272;
        color: #ffffff;
    }
    /deep/ .el-checkbox {
        color: #ffffff;
    }
    /deep/ .el-checkbox__input.is-checked + .el-checkbox__label {
        color: #20c6ff;
    }
    /deep/ .el-checkbox__input.is-checked .el-checkbox__inner,
    /deep/ .el-checkbox__input.is-indeterminate .el-checkbox__inner {
        background-color: #20c6ff;
        border-color: #20c6ff;
    }
}
</style>