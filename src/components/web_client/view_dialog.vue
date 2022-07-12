<template>
    <div class="viewDialog">
        <div class="title">
            <span class="import">导出截图</span>
            <span class="el-icon-close closeIcon" :style="{'cursor':'pointer'}"></span>
        </div>
        <div class="content">
            <el-form>
                <el-form-item label="选择截图类型">
                    <el-radio-group v-model="radio">
                        <el-radio :label="1">图片</el-radio>
                        <el-radio :label="2">360全景图</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="分辨率">
                     <el-select v-model="value" placeholder="请选择">
                        <el-option
                        v-for="item in options"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script>
export default {
    data(){
        return{
            radio:1,
            value:'',
            options: [{
                value: '1',
                label: '1280×720 (720p)'
                }, {
                value: '2',
                label: '1920×1080 (1080p)'
                }, {
                value: '3',
                label: '2560×1440 (2K)'
                }, {
                value: '4',
                label: '4096×2160 (4K)'
                }, {
                value: '5',
                label: '7680×4320 (8K)'
            }],
        }
    }
}
</script>

<style lang="less" scoped>
*{
    box-sizing: border-box;
}
.viewDialog {
  position: absolute;
  top: 35%;
  left: 40%;
  width: 460px;
  height: 237px;
  background-color: #fff;
  border-radius: 6px;
 }
 .title{
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    height: 46px;
    padding: 0 24px;
    border-bottom: 1px solid rgba(126,135,161,0.4900);;
    .import{
        font-weight: 700;
        font-size: 16px;
        color: #28292E;
    }
 }
</style>