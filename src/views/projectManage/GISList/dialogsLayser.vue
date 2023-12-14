<template>
    <el-dialog :title="title+'GIS图层'" :visible.sync="dialogVisible" width="50%" :before-close="hide" :close-on-click-modal="false">
        <el-form :model="form" :rules="rules" ref="form" label-width="120px">
            <el-form-item label="图层名称：" prop="gisServerName">
                <el-input v-model="form.gisServerName" placeholder="请输入"></el-input>
            </el-form-item>
            <el-form-item label="图层类型：" prop="layerType">
                <el-select v-model="form.layerType " placeholder="请选择" style="width:100%">
                    <el-option :value="item.key" v-for="(item,index) in layerTypeList" :key="index">{{ item.name }}</el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="图层地址：" prop="fileUrl">
                <el-input v-model="form.fileUrl" placeholder="请输入"></el-input>
            </el-form-item>
            <!-- <el-form-item label="GIS信息：" required v-if="form.layerType==='3dtiles'">
                <el-col :span="7">
                    <el-form-item prop="longitude">
                        <el-input v-model="form.longitude" placeholder="经度" v-only-number="{min:-180,max:180,precision:8}"></el-input>
                    </el-form-item>
                </el-col>
                <el-col class="GISMark" :span="1">°</el-col>
                <el-col :span="7">
                    <el-form-item prop="latitude">
                        <el-input v-model="form.latitude" placeholder="纬度" v-only-number="{min:-90,max:90,precision:8}"></el-input>
                    </el-form-item>
                </el-col>
                <el-col class="GISMark" :span="1">°</el-col>
                <el-col :span="7">
                    <el-form-item prop="altitude">
                        <el-input type="number" v-model.number="form.altitude" placeholder="海拔高度"></el-input>
                    </el-form-item>
                </el-col>
                <el-col class="GISMark" :span="1">m</el-col>
            </el-form-item> -->
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="hide">取 消</el-button>
            <el-button class="blueBtn" type="primary" @click="submit">确 定</el-button>
        </span>
    </el-dialog>
</template>

<script>
import { gisLayer } from "./json"
import { getDict } from '@/api/dict.js'
export default {
    components: {},
    props: {},
    data() {
        return {
            title: '添加',
            dialogVisible: false,
            form: {},
            rules: {
                gisServerName: [
                    {
                        required: true,
                        message: '请输入项目名称',
                        trigger: 'blur'
                    }
                ],
                layerType: [
                    {
                        required: true,
                        message: '请选择图层类型',
                        trigger: 'blur'
                    }
                ],
                fileUrl: [
                    {
                        required: true,
                        message: '请输入正确的图层地址',
                        trigger: 'blur',
                        pattern: /^http(s)?:\/\/[^\s]*/, 
                    }
                ],
                // longitude: [
                //     {
                //         required: true,
                //         message: '请输入经度(-180°~180°)',
                //         trigger: 'blur'
                //     }
                // ],
                // latitude: [
                //     {
                //         required: true,
                //         message: '请输入纬度(-90°~90°)',
                //         trigger: 'blur'
                //     }
                // ],
                // altitude: [
                //     {
                //         required: true,
                //         message: '请输入海拔高度',
                //         trigger: 'blur'
                //     }
                // ],
            },
            layerTypeList: [] //图层类型
        }
    },
    watch: {},
    computed: {},
    created() {},
    mounted() {
        // this.getType()
    },
    methods: {
        show(title, row, gisPlugin) {
            this.title = title
            this.dialogVisible = true
            this.$nextTick(() => {
                this.$refs.form.clearValidate()
                this.layerTypeList = gisLayer.filter(e => { return e.type === gisPlugin })
                this.form = row
            })
        },
        hide() {
            this.dialogVisible = false
        },
        // async getType() {
        //     this.layerTypeList = (await getDict('layerType')).data
        // },
        submit() {
            this.$refs.form.validate((valid) => {
                if (!valid) return false
                let data = this.form
                // 3dtiles这个类型的图层要传经纬度
                if(this.form.layerType!=='3dtiles'){
                    let { gisServerName, layerType, fileUrl, index } = this.form
                    data = { gisServerName, layerType, fileUrl, index }
                }
                this.$emit('onLayerSuccess', data)
                this.hide()
            })
        }
    }
}
</script>
<style lang="less" scoped>
.GISMark {
    text-align:center;
}
</style>