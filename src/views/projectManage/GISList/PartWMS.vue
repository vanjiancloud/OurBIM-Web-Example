<!--
 * @Autor: zk
 * @Date: 2024-09-21 22:30:06
 * @LastEditors: zk
 * @LastEditTime: 2024-10-10 21:37:33
 * @Description: 
-->
<template>
    <div>
        <el-form-item label="图层顺序">
            <el-input v-model.number="form.materialLayerKey"></el-input>
        </el-form-item>
        <el-form-item label="瓦片像素尺寸">
            <el-col class="GISMark" :span="2">X</el-col>
            <el-col :span="10">
                <el-form-item>
                    <el-input v-model="form.tileWidth" placeholder="X"></el-input>
                </el-form-item>
            </el-col>
            <el-col class="GISMark" :span="2">Y</el-col>
            <el-col :span="10">
                <el-form-item>
                    <el-input v-model="form.tileHeight" placeholder="Y"></el-input>
                </el-form-item>
            </el-col>
        </el-form-item>
        <el-form-item label="缩放级别">
            <el-col class="GISMark" :span="2">Min</el-col>
            <el-col :span="10">
                <el-form-item>
                    <el-input v-model="form.minLevel" placeholder="Min"></el-input>
                </el-form-item>
            </el-col>
            <el-col class="GISMark" :span="2">Max</el-col>
            <el-col :span="10">
                <el-form-item>
                    <el-input v-model="form.maxLevel" placeholder="Max"></el-input>
                </el-form-item>
            </el-col>
        </el-form-item>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                form: {
                    tileWidth: 256,
                    tileHeight: 256,
                    minLevel: 0,
                    maxLevel: 14,
                    materialLayerKey: 0
                }
            }
        },
    }
</script>

<style lang="less" scoped>
.GISMark{
    text-align: right;
    padding-right: 5px;
}
</style>