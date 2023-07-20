<!-- 列表模式切换显示方式 -->
<template>
    <div class="List box">
        <div class="boxHeader">
            <!-- 头部 -->
            <div class="ListTitle"><slot name="title"></slot></div>
            <!-- 切换图标 -->
            <div class="changeList">
                <svg-icon icon-class="list" class="svgBtn" :class="{activeSvg:isList}" @click="changeList(true)"/>
                <svg-icon icon-class="list1" class="svgBtn" :class="{activeSvg:!isList}" @click="changeList(false)"/>
            </div>
        </div>
        <div class="subContent">
            <slot></slot>
        </div>
    </div>
</template>

<script>
export default {
    components: {},
    props: {},
    data() {
        return {
            isList:true,//是否是列表
        };
    },
    watch: {},
    computed: {},
    created() { },
    mounted() { },
    methods: {
        changeList(e){
            this.isList = e
            this.$emit('change',e)
        }
    }
};
</script>
<style lang="less" scoped>
.List{
    .ListTitle{
        flex: 1;
    }
    .changeList{
        margin-left: 8px;
        .svgBtn{
            color: #AAAFB6;
            font-size: 20px;
            cursor: pointer;
            margin-left: 24px;
        }
        .activeSvg{
            color: #02abf0;
        }
    }
    .subContent{
        margin-top: 16px;
        .listBox{
            display: flex;
            flex-flow: row wrap;
            align-items: stretch;
            gap: 17px;
            width: 100%;
            .listItem{
                width: 300px;
                max-width: 32%;
                min-width: 270px;
                flex: 1 0 auto;
                .defaultImg{
                    width: 100%;
                    height: 180px;
                    border-radius: 8px;
                    object-fit: cover;
                    /deep/.image-slot img{
                        width: 100%;
                        height: 180px;
                        border-radius: 8px;
                        object-fit: cover;
                    }
                }
                .title{
                    font-weight: 500;
                    color: #494D55;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                    margin-top: 16px;
                }
                .type{
                    color: #606266;
                    font-size: 12px;
                    margin: 10px 0;
                }
            }
        }
    }
    .status {
        position: relative;
        font-size: 14px;
        &::before {
            content: "";
            display: inline-block;
            width: 8px;
            height: 8px;
            background: #14dda6;
            border-radius: 100%;
            margin-right: 6px;
        }
    }
    /deep/.el-icon-more{
        font-size: 20px;
    }
}
@media only screen and (min-width: 1480px) and (max-width: 1750px) {
    .listItem {
        max-width: 23%!important;
    }
}
@media only screen and (min-width: 1750px) and (max-width: 1920px) {
    .listItem {
        max-width: 19%!important;
    }
}
@media only screen and (min-width: 1921px) {
    .listItem {
        max-width: 300px!important;
        min-width: 300px!important;
    }
}
</style>