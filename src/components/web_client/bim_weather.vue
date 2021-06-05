<!--
 * @Author: zk
 * @Date: 2021-06-05 15:27:38
 * @LastEditors: zk
 * @LastEditTime: 2021-06-05 15:48:19
 * @description: 
-->
<template>
    <div class="bim-weather" v-if="setProps">
        <img class="thumbnail-img" :src="setProps.img" alt="">
        <div class="weather-title" v-text="setProps.weatherName"></div>
    </div>
</template>

<script>
    export default {
        props: {
            setProps: {
                type: Object,
                default: function() {}
            },
        },
    }
</script>

<style lang="less" scoped>
.bim-weather{
    cursor: pointer;
    .thumbnail-img{
        width: 100%;
    }
    .weather-title{
        color: #fff;
        font-size: 0.75rem;
        margin: 5px 0 10px 0;
    }
}
</style>