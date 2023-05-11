<template>
    <div class="drawerBox" v-show="drawer" :style="{'width':isShow&&drawer?'300px':'0px'}" :class="direction==='ltr'?'drawerBoxLeft':'drawerBoxRight'">
        <!-- 收缩和展开 -->
        <div class="isShow" @click="onIsShow" v-if="drawer">
            <i v-if="direction==='ltr'" :class="{'el-icon-arrow-right':!isShow,'el-icon-arrow-left':isShow}"></i>
            <i v-else :class="{'el-icon-arrow-right':isShow,'el-icon-arrow-left':!isShow}"></i>
        </div>

        <div class="drawerContent">           
            <div class="drawerTitle">{{ title }}<i class="el-icon-close" @click="close"></i></div>
            <slot :isShow="isShow" :drawer="drawer"></slot>
        </div>
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
        },
    },
    data() {
        return {
            isShow: true, //展开和收缩
            drawer: false,
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
        hide(){
            this.drawer = false
        },
        close() {
            this.hide()
            this.$emit('onClose')
        }
    }
}
</script>
<style lang="less" scoped>
.drawerBoxLeft{
    animation: ltr-drawer-in 0.6s;
    .isShow {
        right: -20px;
        left: initial;
        border-radius: 0px 14px 14px 0px!important;
    }
}
.drawerBoxRight {
    right: 0;
    animation: rtl-drawer-in 0.6s;
    .isShow {
        left: -20px;
        right: initial;
        border-radius: 14px 0 0 14px!important;
    }
}
.drawerBox {
    width: 300px;
    height: 100%;
    position: fixed;
    top: 0;
    background: rgba(16,16,16,0.7);
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
    .drawerTitle{
        font-size: 16px;
        color: #FFFFFF;
        font-family: PingFangSC-Regular, PingFang SC;
        padding: 16px 40px 16px 16px;
        word-break: break-all;
        position: relative;
        border-bottom: 1px solid #464646;
        i{
            color: #FFFFFF;
            position: absolute;
            right: 16px;
            top: 17px;
            font-size: 20px;
            cursor: pointer;
        }
    }
    div {
        box-sizing: border-box;
    }
    .drawerContent{
        width: 100%;
        height: 100%;
        overflow: hidden;
    }
}

</style>