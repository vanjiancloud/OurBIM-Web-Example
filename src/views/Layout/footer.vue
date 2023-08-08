<template>
    <div class="footer">
        <div class="first">
            <a v-if="!statement" href="https://www.vanjian.com/" target="_blank">
                Copyright © 2017-2023 万间网络科技（天津）有限公司 版权所有
            </a>
            <div v-if="statement">
                <p class="first">Copyright © 2023 www.OurBIM.com, All Rights Reserved.</p>
                <p>022-8633-0370</p>
            </div>
        </div>
        <div class="last">
            <a href="https://beian.miit.gov.cn/#/Integrated/index" target="_blank">津ICP备15006036号-2</a>
        </div>
    </div>
</template>

<script>
export default {
    components: {},
    props: {
        statement:{
            type: Boolean,
            debugger: false
        }
    },
    data() {
        return {}
    },
    watch: {},
    computed: {},
    created() {},
    mounted() {},
    methods: {}
}
</script>
<style lang="less" scoped>
.footer {
    padding: 20px;
    background-color: #19283b;
    font-size: 14px;
    color: #fff;
    text-align: center;
    a {
        color: #fff;
        text-decoration: none;
        &:hover{
            text-decoration: underline;
        }
    }
    .first {
        margin-bottom: 10px;
    }
}
</style>
