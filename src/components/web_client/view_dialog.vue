<template>
    <div>
       <div class="viewDialog" v-if="item">
          <div class="title">
              <span class="import">导出截图</span>
            <span class="el-icon-close closeIcon" :style="{'cursor':'pointer','color':'#A4A4A4'}" @click="closeDialog"></span>
          </div>
          <div class="content">
            <el-form>
                <el-form-item label="选择截图类型" label-width="150px">
                    <el-radio-group v-model="radio">
                        <el-radio :label="1">图片</el-radio>
                        <el-radio :label="2">360全景图</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="分辨率" label-width="150px">
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
            <el-button class="btn" type="primary">导出</el-button>
          </div>
          <el-progress class="progress" :percentage="100" status="success"></el-progress>
        </div>
    </div>
</template>

<script>
export default {
    props:{
        item:{
            type: Boolean,
            default: false
        }
    },
    data(){
        return{
            radio:1,
            value:'2',
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
    },
    created(){
    },
    mounted(){
       
    },
    methods:{
        closeDialog(){
            this.$emit('closeDia',false)
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
  left: 150%;
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
 .content{
    padding-top: 20px;
 }
 ::v-deep .el-form-item{
    margin-bottom: 10px;
 }
 ::v-deep .el-form-item .el-form-item__label{
    font-size: 16px;
    font-family: PingFangSC-Regular, PingFa;
    color: #28292E;
    padding: 0 20px 0 0;
 }
 ::v-deep .el-radio-group .el-radio__label{
    font-size: 16px;
    font-family: PingFangSC-Regular, PingFa;
    color: #28292E;
 }
 ::v-deep .el-select .el-input__inner{
    height: 30px;
 }
 .btn{
    width: 70px;
    height: 28px;
    line-height: 0;
    margin: 20px 0 0 205px ;
 }
  ::v-deep .el-progress{
    top: -178px;
    display: block;
 }
 ::v-deep .el-progress .el-icon-circle-check{
    display: none;
 }
 ::v-deep .el-progress .el-progress-bar__outer{
    height: 3px !important;
  }
 
  ::v-deep .el-progress .el-progress-bar{
    width: 460px;
  }
</style>