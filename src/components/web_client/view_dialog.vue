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
                        <el-radio :label="2" disabled>360°全景图</el-radio>
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
            <el-button class="btn" type="primary" @click="exportViewPhoto">导出</el-button>
          </div>
          <div class="progress">
              <el-progress :percentage="100" :color="customColor"></el-progress>
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
import { runInThisContext } from "vm";
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
        delInfo:{   // 删除或者导出时用的字段
            type: Object,
            default: () => ({})
        },
        taskid:{
            type: String,
            default: ''
        }
    },
    data(){
        return{
            radio:1,
            value:'720',
            options: [{
                value: '720',
                label: '1280×720 (720p)'
                }, {
                value: '1080',
                label: '1920×1080 (1080p)'
                }, {
                value: '2k',
                label: '2560×1440 (2K)'
                }, {
                value: '4k',
                label: '3840×2160 (4K)'
                }, {
                value: '8k',
                label: '7680×4320 (8K)'
            }],
            pointList:[],
            customColor:'#5DBB57', // 渲染进度条颜色
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
        // 导出图片
        exportViewPhoto(){
            // let url = this.delInfo.imagePath;
            // this.outPic(url);
            // let str = this.delInfo.imagePath;
            // let str2 = str.match(/view\/(\S*)\./)[1];
            let params = {
                taskId:this.taskid,
                imgType:this.value,
                tId:this.delInfo.tid
            }
            MODELAPI.EXPORTIMG(params).then((res)=>{
                if(res.data.code === 0){
                    this.$message.success('开始渲染');
                }else{
                    this.$message.error(res.data.message);
                }
            }).catch(()=>{})
        },
        outPic(url){
            //实例化一个img对象
            const img = new Image();
            //设置img的图片路径
            img.src = url;
            //设置跨域解决
            img.setAttribute('crossOrigin', 'Anonymous');
            //img加载完后处理
            img.onload = function() {
                //创建一个canvas对象
                const canvas = document.createElement('canvas')
                //把图片的宽度设为canves的宽度
                canvas.width = 1200
                //把图片的高度设为canves的高度
                canvas.height = 700
                //创建一个2d画布
                const ctx = canvas.getContext('2d')
                // 将img中的内容画到画布上
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
                // 将画布内容转换为base64
                let base64 = canvas.toDataURL()
                // 创建a链接
                const a = document.createElement('a')
                a.href = base64
                a.download = ''
                // 触发a链接点击事件，浏览器开始下载文件
                a.click()
            }

        }
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
    top: -7px;
    left: 0;
    width: 102%;
    height: 6px;
    display: none;
    ::v-deep .el-progress__text{
        color:#5DBB57;
    }
    ::v-deep .el-progress-bar__outer{
       background-color: rgba(255,255,255,0.1);
    }
    ::v-deep .el-progress-bar__inner{
        height: 50%;
    }
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
                    max-width: 80px;
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