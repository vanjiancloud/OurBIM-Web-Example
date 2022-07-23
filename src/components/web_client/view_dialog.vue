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
          <div class="progress">
              <el-progress :percentage="100" status="success"></el-progress>
          </div>
        </div>
        <!-- 删除框 -->
        <div class="delDialog" v-if="delItem">
          <div class="title">
              <span class="import">提示</span>
              <span class="el-icon-close closeIcon" :style="{'cursor':'pointer','color':'#A4A4A4'}" @click.stop="closeDialog"></span>
          </div>
          <div class="contentDown">
            <div class="description">
                <img :style="{'width':'18px','height':'18px'}" :src="require('@/assets/images/view/waring.png')" alt="">
                <div class="sheng">
                    <span>&nbsp;将删除名为"</span>
                    <span>{{delInfo.name}}</span>
                    <span>"的数据，是否确认删除？</span>
                </div>
            </div>
            <div class="bottomBtn">
                <el-button class="btn1" type="primary" @click.stop="closeDialog">取消</el-button>
                <el-button class="btn2" type="primary" @click="removeBtn">删除</el-button>
            </div>
          </div>
        </div>
    </div>
</template>

<script>
import MODELAPI from "@/api/model_api";
export default {
    props:{
        item:{
            type: Boolean,
            default: false
        },
        delItem:{
            type: Boolean,
            default: false
        },
        delInfo:{   // 删除时用的字段
            type: Object,
            default: () => ({})
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
                label: '3840×2160 (4K)'
                }, {
                value: '5',
                label: '7680×4320 (8K)'
            }],
            pointList:[],
        }
    },
    created(){
    },
    mounted(){
       
    },
    methods:{
        closeDialog(){
            this.$emit('closeDia',false); // 控制关闭 导出和删除弹框
        },
        removeBtn(){
            /**
             * @Author: zk
             * @Date: 2021-03-17 10:35:16
             * @description: 删除视点
             */
                let params = this.delInfo;
                MODELAPI.DElETEFOLLOWPOINT(params)
                    .then((res) => {
                        if (res.data.code === 0) {
                           this.$emit('runListPoint'); // 调用父级的ListPoint方法
                            this.$message({
                                type: "success",
                                message: '删除成功',
                            });
                            this.$emit('noBorder',-1)
                        }
                    })
                    .catch((err) => {});
                   this.$emit('closeDia',false)
        },
    }
}
</script>

<style lang="less" scoped>
*{
    box-sizing: border-box;
}

.viewDialog,.delDialog {
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
 .progress{
    position: absolute;
    top: -10px;
    left: 0;
    width: 100%;
    height: 6px;
 }
   ::v-deep .el-progress .el-progress-bar{
    width: 106%;
  }
//   ::v-deep .el-progress{
//     top: -178px;
//     display: block;
//  }
//  ::v-deep .el-progress .el-icon-circle-check{
//     display: none;
//  }
//  ::v-deep .el-progress .el-progress-bar__outer{
//     height: 3px !important;
//   }

  .delDialog{
    height: 213px;
    .contentDown{
        width: 100%;
        height: 167px;
        padding-top: 40px;
        .description{
            margin-left: 45px;
            height: 30px;
            display: flex;
            align-items: center;
            img{
                margin-top: 2px;
            }
            .sheng{
                display: flex;
                span:nth-of-type(2){
                     width: 80px;
                    overflow: hidden;
                    text-overflow:ellipsis;
                    white-space: nowrap;
                }
                span{
                    font-size: 16px;
                    font-family: PingFangSC-Regular, PingFang SC;
                    color: #28292E;
                }
            }
        }
        .bottomBtn{
            width: 100%;
            display: flex;
            justify-content: center;
            margin-top: 40px;
            .btn1,.btn2{
                width: 70px;
                height: 28px;
                line-height: 0;
            }
            .btn1{
                color: #28292E;
                background-color: #fff;
                border: 1px solid #E4E7EB;
            }
        }
    }
  }
</style>