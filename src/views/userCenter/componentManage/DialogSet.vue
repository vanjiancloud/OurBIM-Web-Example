<!--
 * @Autor: zk
 * @Date: 2024-10-27 15:56:52
 * @LastEditors: zk
 * @LastEditTime: 2024-11-06 23:18:50
 * @Description: 
-->
<template>
    <el-dialog title="GIS遮罩图元设置" :visible.sync="dialogVisible" width="30%" :before-close="hide" :modal-append-to-body="true"
        :append-to-body="true" :close-on-click-modal="true">
        <el-form class="gis-box" :model="form" ref="form" :rules="{}" label-width="120px">
            <el-form-item label="图层通道0颜色：" prop="tint0">
                <el-color-picker v-model="form.tint0" show-alpha color-format="rgb"></el-color-picker>
            </el-form-item>
            <el-form-item label="图层通道1颜色：" prop="tint1">
                <el-color-picker v-model="form.tint1" show-alpha color-format="rgb"></el-color-picker>
            </el-form-item>
            <el-form-item label="图层通道2颜色：" prop="tint2">
                <el-color-picker v-model="form.tint2" show-alpha color-format="rgb"></el-color-picker>
            </el-form-item>
            <el-form-item label="边线选中颜色：" prop="selectedColor">
                <el-color-picker  v-model="form.selectedColor" color-format="rgb"></el-color-picker>
            </el-form-item>

            <el-form-item label="边线颜色：" prop="unselectedColor">
                <el-color-picker v-model="form.unselectedColor" color-format="rgb"></el-color-picker>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="hide">取 消</el-button>
            <el-button class="blueBtn" type="primary" @click="submit">确 定</el-button>
        </span>
    </el-dialog>
</template>

<script>
import { updateColor, getColor } from '@/api/projectManage/element.js'

export default {
    components: {},
    props: {
        data: {
            type: Object,
            default: () => { }
        },
    },
    data() {
        return {
            dialogVisible: false,
            form: {},
        }
    },
    watch: {},
    computed: {},
    created() { },
    mounted() {
        // this.getType()
    },
    methods: {
        setColor(e){
            if (!e) return
            const realR = e[0] * 255
            const realG = e[1] * 255
            const realB = e[2] * 255
            const realColor = e.length === 3 ? `rgb(${realR}, ${realG}, ${realB})` : `rgba(${realR}, ${realG}, ${realB}, ${e[3]})`
            return realColor
        },
        setColArr(e){

        },
        show() {
            this.dialogVisible = true
            this.$nextTick(() => {
                this.getColorInfo()
            })
        },
        hide() {
            this.dialogVisible = false
        },
        rgbToArray(rgbStr, e) {
            // 移除字符串开头的 "rgb(" 和结尾的 ")"，并以逗号分隔
            if (!rgbStr) {
                return []
            }
            const colors = e === 'rgba' ? rgbStr.replace(/^rgba\(|\)$/g, '').split(',') :
            rgbStr.replace(/^rgb\(|\)$/g, '').split(',');
            let realList = colors.map(Number)
            const realR = realList[0] / 255
            const realG = realList[1] / 255
            const realB = realList[2] / 255
            // 将字符串数组转换为整数数组
            return e === 'rgba' ? [realR, realG, realB, realList[3]] : [realR, realG, realB]
        },
        submit() {
            this.$refs.form.validate((valid) => {
                if (!valid) return false
                const params = {
                    taskId: this.data.taskId
                }
                const data = JSON.parse(JSON.stringify(this.form))
                const { tint0, tint1, tint2, selectedColor, unselectedColor } = data
                let realData = {
                    tint0: this.rgbToArray(tint0, 'rgba'),
                    tint1: this.rgbToArray(tint1, 'rgba'),
                    tint2: this.rgbToArray(tint2, 'rgba'),
                    selectedColor: this.rgbToArray(selectedColor, 'rgb'),
                    unselectedColor: this.rgbToArray(unselectedColor, 'rgb'),
                }
                updateColor(params, realData).then(() => {
                    this.dialogVisible = false
                    this.$message.success('设置成功')
                })
            })
        },
        getColorInfo(){
            const params = {
                taskId: this.data.taskId
            }
            getColor(params).then((res) => {
                const { colorSet } = res.data
                let realColor = JSON.parse(colorSet)
                console.log(realColor)
                const { tint0, tint1, tint2, selectedColor, unselectedColor } = realColor
                this.form = {
                    tint0: this.setColor(tint0),
                    tint1: this.setColor(tint1),
                    tint2: this.setColor(tint2),
                    selectedColor: this.setColor(selectedColor),
                    unselectedColor: this.setColor(unselectedColor),
                }
            })
        }
    }
}
</script>
<style lang="less" scoped>
.GISMark {
    text-align: center;
}
</style>
<style lang="less">
.gis-box{
    .el-color-picker{
        width: 100%;
    }
    .el-color-picker__trigger{
        width: 100%;
    }
}
</style>