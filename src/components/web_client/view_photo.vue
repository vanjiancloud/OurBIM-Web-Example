<template>
    <div>
        <!-- 视图列表 -->
      <div class="view_photo" v-if="viewPic==='1'">
        <div class="romaHead">
            <span class="title">视图列表</span>
            <span class="el-icon-close closeIcon" @click="viewClose"></span>
        </div>
        <div class="search">
            <el-input
              class="searchInput"
              type="text"
              v-model="input" 
              placeholder="请输入您要搜索的内容"  
            >
                <div slot="prefix"><i class="el-icon-search"></i></div>
            </el-input>
            <div class="threeLogo">
                <span>
                    <el-tooltip class="item" effect="light" content="更新视图" placement="top">
                      <i class="iconfont icon-a-gengxinshitu3" :class="{bind:active === -1}" :style="{'font-size':'24px' }"></i>
                    </el-tooltip>
                </span>
                <span :style="{'margin-bottom':'1px'}">
                    <el-tooltip class="item" effect="light" content="导出截图" placement="top">
                      <i class="iconfont icon-a-gengxinshitu2" @click="exportPic" :class="{bind:active === -1}"  :style="{'font-size':'24px'}"></i>
                    </el-tooltip>
                </span>
                <span :style="{'margin-top':'2px'}">
                    <el-tooltip class="item" effect="light" content="创建视图" placement="top">
                      <i class="iconfont icon-a-gengxinshitu1" :class="{bind:active !== -1}" :style="{'font-size':'22px' }" @click="InsertFollow"></i>
                    </el-tooltip>
                </span>
            </div>
        </div>
        <div class="pictures">
            <div class="picBox"  v-for="(item,index) in pointList" :key="index">
                <div class="boxPhoto">
                    <img :src="item.imagePath" alt="" @click="selected(index,item)" :class="{'borderWhite': index === active}">
                    <div class="bottom" :style="{'display':index === active ? 'block' : 'none'}">
                        <img :src="require('@/assets/images/view/view4.png')" alt="">
                        <img :src="require('@/assets/images/view/view5.png')" alt="">
                    </div>
                    <i class="el-icon-close err" :style="{'display':index === active ? 'block' : 'none'}" @click="removeDialog(item)"></i>
                </div>
                <div class="picInfo" @dblclick="dbTest(index,item)">
                    {{item.name}}
                </div>
            </div>
            <div class="nonePic" v-if="pointList.length === 0">
                暂无视图 可创建
            </div>
        </div>
        <!-- 视图导出弹窗 -->
       <viewDialog :item="dialogFlag" @closeDia="closeDia2" @noBorder="noBorder" 
        :delItem ="delFlag" :delInfo="delInfo" @pointListSon="pointListSon" 
        @runListPoint = "runListPoint"
        >
        </viewDialog>
        <!-- 编辑视点的名称 -->
        <el-dialog
            title="编辑"
            :visible="dialogVisible"
            @close="dialogVisibleClose"
            width="25%"
            :append-to-body="true"
            >
            <el-form :model="editForm" :rules="rules" ref="editForm">
                <el-form-item label="名称:" label-width="80px" prop="inputName">
                    <el-input v-model="editForm.inputName" placeholder="请输入内容"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisibleClose">取 消</el-button>
                <el-button type="primary" @click="submitDialog">确 定</el-button>
            </span>
        </el-dialog>
      </div>
      <!-- 视点动画列表 -->
       <div class="view_photo view_animation" v-if="viewPic==='2'">
        <div class="romaHead romaHead2">
            <span class="title">视点动画列表</span>
            <span class="el-icon-close closeIcon" @click="viewClose2"></span>
        </div>
        <div class="search">
            <el-input
              class="searchInput"
              type="text"
              v-model="input" 
              placeholder="请输入您要搜索的内容"  
            >
                <div slot="prefix"><i class="el-icon-search"></i></div>
            </el-input>
            <div class="threeLogo">
                <img :src="require('@/assets/images/view/plus.png')" @click="plusProEdit" alt="" :style="{'width':'24px','height':'24px','cursor':'pointer' }">
            </div>
        </div>
        <div class="videos">
            <div class="videosList"  v-for="(item,index) in 8" :key="index">
                <div class="frontCover">
                    <img @click="picAnimation(item,index)" :class="{'animationBorder':activeAnimation === index}" :src="require('@/assets/logo.png')" alt="" :style="{'width':'100%','height':'100%','cursor':'pointer','border-radius':'4px' }">
                </div>
                <div class="videoDes">
                    <div class="upWordes">
                        <span>时&nbsp;&nbsp;&nbsp;长:&nbsp;&nbsp;</span>
                        <span>59':59''</span>
                    </div>
                    <div class="downWordes">
                        <span>Video:&nbsp;&nbsp;</span>
                        <span>2022-7-18 11:25:36</span>
                    </div>
                </div>
                <div class="videosEdit">
                    <i class="el-icon-edit"></i>
                    <i class="el-icon-delete"></i>
                </div>
            </div>
        </div>
      </div>
      <!-- 预览与编辑菜单栏 -->
      <div class="proEdit" v-if="activeAnimation !== -1 || proEditFlag===true">
        <div class="proEditMain">
            <div class="proEditTop">
                <div class="component">
                    <img :style="{'width':'18px','height':'18px','margin-left':'10px'}" :src="require('@/assets/images/view/goujian.png')" alt="">
                    <span>附加构件动画:</span>
                    <el-select v-model="optionsComponents" placeholder="请选择">
                        <el-option
                             v-for="item in options"
                             :key="item.value"
                             :label="item.label"
                              :value="item.value">
                         </el-option>
                    </el-select>
                </div>
                <div class="order">
                    <img :style="{'width':'18px','height':'18px','margin-left':'10px'}" :src="require('@/assets/images/view/xulie.png')" alt="">
                    <span>附加序列动画:</span>
                    <el-select v-model="ordersValue" placeholder="请选择">
                        <el-option
                             v-for="item in  optionOrders"
                             :key="item.value"
                             :label="item.label"
                              :value="item.value">
                         </el-option>
                    </el-select>
                </div>
                <div class="play">
                    <div class="leftPlay" :style="{'cursor':'pointer'}">
                         <i class="el-icon-caret-left" :style="{'font-size':'16px'}"></i>
                         <i class="el-icon-caret-left" ></i>
                    </div>
                    <i v-if="true" class="el-icon-video-play" :style="{'cursor':'pointer'}"></i>
                    <i v-else class="el-icon-video-pause" :style="{'cursor':'pointer'}"></i>
                    <div class="rightPlay" :style="{'cursor':'pointer'}">
                        <i class="el-icon-caret-right" ></i>
                        <i class="el-icon-caret-right" :style="{'font-size':'16px',}"></i>
                    </div>
                </div>
                <div class="getVideo">
                    <el-select v-model="resolutionValue" placeholder="请选择">
                        <el-option
                             v-for="item in  resolution"
                             :key="item.value"
                             :label="item.label"
                              :value="item.value">
                         </el-option>
                    </el-select>
                    <el-button round class="button">渲染</el-button>
                    <el-button round class="button">导出</el-button>
                </div>
                <!-- 关闭按钮 -->
                <i  class="el-icon-close closeProEdit" @click="proEditClose"></i>
                <!-- 渲染进度条 -->
                <div class="progressDiv">
                    <el-progress :percentage="100"  :color="customColor"></el-progress>
                </div>
            </div>
            <div class="proEditDown">
                <div class="viewMorePic" v-for="(item,index) in 15" :key="index">
                    <img :src="require('@/assets/logo.png')" alt="" :style="{'width':'100%','height':'100%'}">
                    <div class="videosPlus">
                        <img :src="require('@/assets/images/view/jiahao.png')" :style="{'width':'100%','height':'100%'}" alt="">
                    </div>
                    <div class="videoWords">00':49''</div>
                </div>
            </div>
        </div>
      </div>
    </div>
</template>

<script>
  import MODELAPI from "@/api/model_api";
  import viewDialog from "@/components/web_client/view_dialog";
  export default {
        components: {
         viewDialog
        },
        props:{
            viewPic:{ // 控制视图列表和视点动画框的显示
                type: String,
                default:''
            },
            setProps: {
                type: Object,
                default: () => {},
            },
            taskId:{   
                type: String,
                default: ""
            }
        },
        data() {
            return {
              input:'',  // 搜索绑定
              active:-1,
              activeAnimation:-1,
              num:0,    // 是否重复点击图片
              num2:0,
              dialogFlag:false, // 导出弹框
              delFlag:false,  // 控制删除弹框
              getProps:null,
              pointList:[], // 视点图片
              delInfo:{}, // 删除或选中时用到的参数传给view_dialog
              dialogVisible:false, // 编辑图片名字的弹框
              editForm:{
                inputName:'',
                tid:''
              },
              rules:{
                inputName: [
                    {
                        required: true,
                        message: "请输入名称",
                        trigger: "blur",
                    },
                ],
              },
               proEditFlag:false, // 预览与编辑框(创建按钮相关)
               options: [{   // 构件动画
                    value: '0',
                    label: '全选'
                }, {
                    value: '1',
                    label: '构件动画1'
                }, {
                    value: '2',
                    label: '构件动画2'
                }, {
                    value: '3',
                    label: '构件动画3'
                }, {
                    value: '4',
                    label: '构件动画4'
                }],
               optionsComponents:'1',
               optionOrders:[{   // 序列动画
                        value: '0',
                        label: '全选'
                    }, {
                        value: '1',
                        label: '序列动画1'
                    }, {
                        value: '2',
                        label: '序列动画2'
                    }, {
                        value: '3',
                        label: '序列动画3'
                    }, {
                        value: '4',
                        label: '序列动画4'
                }],
               ordersValue:'1',
               resolution: [{
                    value: '0',
                    label: '1920×1080 (1080p)'
                }, {
                    value: '1',
                    label: '2560×1440 (2K)'
                }, {
                    value: '2',
                    label: '3840×2160 (4K)'
                }, {
                    value: '3',
                    label: '7680×4320 (8K)'
               }],
               resolutionValue:'0',
               customColor:'#5DBB57', // 渲染进度条颜色
          }
        },
        watch:{
             setProps: {
                handler() {
                    if (this.setProps.taskId) {
                        this.getProps = this.setProps;
                        this.ListPoint();
                    }
                },
                deep: true,
              },
             viewPic:{
                handler(val,oldval){
                    if(val === '2' || val === '0'){
                        this.active = -1;
                        this.num= 0;
                        this.dialogFlag = false; 
                        this.delFlag = false; 
                    }
                    if(val === '2' || val === '0'){
                        this.activeAnimation=-1;
                        this.num2 = 0;
                        this.proEditFlag = false;
                    }
                }
             }
        },
        created(){
            if (this.setProps.taskId) {
                this.getProps = this.setProps;
                this.ListPoint();
            }
            // document.addEventListener("click", function(e) {
            //     console.log('666 在');
            //     var event = e || window.event;
            //     var target = event.target || event.srcElement;
            //     let flag = false;
            //     let imgLength = document.querySelectorAll(".boxPhoto img");
            //     for(let i =1;i<=imgLength.length;i++){
            //         if(document.querySelector(".pictures .picBox:nth-of-type("+i+") .boxPhoto").contains(target)) {
            //             flag = true;
            //         }
            //     }
            //     if(flag===false){
            //       this.active = -1;
            //     }
            // }) 
        },
        mounted(){
            console.log('222',this.pointList);
        },
        methods:{
            // 关闭视点列表 和 视点动画列表 时
            viewClose(){
                this.$emit('closeClick','0');
                this.active = -1;
                this.num= 0;
                this.$EventBus.$emit('okok',false); // 传递给 todo-footer关闭 视图图标
                this.dialogFlag = false; 
                this.delFlag = false; 
            },
            viewClose2(){
                this.$emit('closeClick','0');
                this.activeAnimation= -1;
                this.num2= 0;
                this.$EventBus.$emit('okok',false); // 传递给 todo-footer关闭 视图图标
            },
            runListPoint(){
                this.ListPoint();
            },
            // 点击选中
            selected(ind,e){
                // 选中时将信息传递给view-dialog
                this.delInfo = e;
                if(this.active === ind){
                    this.num+=1;
                    if(this.num%2 === 1){
                        this.active = -1;   
                        this.dialogFlag = false; 
                        this.delFlag = false;   
                    }
                }else{
                    this.num = 0;
                    this.active = ind; 
                    this.dialogFlag = false;     
                    this.delFlag = false; 
                }
                // 跳转视图
                if(this.active !== -1){
                    let params = {
                    taskid: this.getProps.taskId,
                    action: "moveToViewPoint",
                    camerashotId: e.tid,
                   };
                   this.UpdateOrder(params);
                }
            },
            // 点击导出
            exportPic(){
                this.dialogFlag = !this.dialogFlag;
                if(this.delFlag === true){
                    this.delFlag = false;
                }
            },
            removeDialog(e){
                if(this.dialogFlag){
                    this.dialogFlag = false;
                }
                this.delFlag = true;
                // 以下是删除时用到的参数
                this.delInfo.tid = e.tid;
                this.delInfo.taskId = this.taskId;
            },
            closeDia2(){
                this.dialogFlag = false;
                this.delFlag = false;
            },
            noBorder(valNum){
                this.active = valNum;
            },
            InsertFollow() {
                /**
                 * @Author: zk
                 * @Date: 2021-03-17 10:46:58
                 * @description: 添加视点
                 */
                let params = {
                    taskid: this.getProps.taskId,
                    action: "addViewPoint",
                };
                this.UpdateOrder(params).then(() => {
                    this.ListPoint();
                });
            },
            ListPoint() {
                /**
                 * @Author: zk
                 * @Date: 2021-03-17 10:30:51
                 * @description: 获取视点列表
                 */
                setTimeout(() => {
                    let params = {
                     taskid: this.getProps.taskId,
                    };
                    this.pointList = [];
                    MODELAPI.LISTFOLLOWPOINT(params)  
                    .then((res) => {
                        if (res.data.code === 0) {
                         this.pointList = res.data.data;
                        }
                    })
                    .catch((err) => {});
                }, 1000);
            },
            async UpdateOrder(e) {
                await MODELAPI.UPDATEORDER(e)
                    .then((res) => {
                    if (res.data.code === 0) {
                        this.$message({
                        message: '指令下发成功',
                        type: "success",
                        });
                    } else {
                        this.$message({
                        message: '指令下发失败',
                        type: "error",
                        });
                    }
                    })
                    .catch(() => {});
            },
            pointListSon(eventArr){ // 删除框传递来的更新后的pointList
                this.pointList = eventArr;
            },
            dbTest(ind,e){
                //    document.querySelector('.pictures .picBox:nth-of-type('+(ind+1)+') .picInfo .up .upName').style.display="none";
                //    document.querySelector('.pictures .picBox:nth-of-type('+(ind+1)+') .picInfo .up .edit').style.display="block";
                this.dialogVisible = true;
                this.editForm.inputName = e.name;
                this.editForm.tid = e.tid;
                console.log('333',this.editForm.inputName,this.editForm.tid,this.taskId);
            },
            submitDialog(){
                this.$refs["editForm"].validate((valid)=>{
                    if(valid){
                        let params = {
                            tid:this.editForm.tid,
                            name:this.editForm.inputName,
                            taskId:this.taskId
                        }
                        MODELAPI.UPDATEFOLLOWPOINT(params)
                        .then((res) => {
                            if (res.data.code === 0) {
                                this.ListPoint();
                                this.$message({
                                    type: "success",
                                    message: '修改成功',
                                });
                            }
                            this.dialogVisible = false;
                        })
                        .catch((err) => {});
                    }
                })
            },
            // 视图列表的×
            dialogVisibleClose(){ 
                this.$refs["editForm"].resetFields();
                this.editForm.inputName = '';
                this.dialogVisible = false;
            },
            // 点击创建视点动画
            plusProEdit(){
                this.proEditFlag = true;
                this.activeAnimation=-1;
                this.num2 = 0;
            },
            // 点击视点动画图片
            picAnimation(item,ind){
                if(this.activeAnimation === ind){
                    this.num2 += 1;
                    if(this.num2 % 2 === 1){
                        this.activeAnimation = -1; 
                        this.proEditFlag=false;  
                    }
                }else{
                    this.num2 = 0;
                    this.activeAnimation = ind; 
                     this.proEditFlag=false;                 
                }
            },
            // 预览和编辑框的叉号
            proEditClose(){
                this.activeAnimation=-1;
                this.num2 = 0;
                this.proEditFlag=false; 
            }
        }
    }
</script>

<style lang="less" scoped>
*{
    box-sizing: border-box;
}      
.view_photo {
  position: absolute;
  z-index: 9;
  height: 580px;
  top: 0;
  width: 420px;
  color: white;
  margin: 2vh 0 0 20px;
  border-radius: 10px;
  background-color: rgba(17,17,17,0.88);
  .romaHead{
    width: 420px;
    height: 50px;
    font-size: 16px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #25282e;
    .title{
      margin-left: 18px;
    }
    .closeIcon{
      font-size: 16px;
      margin-right: 16px;
      cursor: pointer;
    }
  }
  .search{
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    height: 46px;
    padding: 0 24px 0 16px;
    border-bottom: 1px solid #25282e;
    ::v-deep .searchInput .el-input__inner{
        width: 200px;
        height: 28px;
        color: #fff;
        padding-left: 40px;
        border: none;
        border-radius: 14px;
        background-color: #28292E;
    }
    ::v-deep .searchInput .el-input__inner::placeholder{
        font-size: 12px;
        color: #fff;
    }
    .el-icon-search{
        font-size: 20px;
        color: #fff;
        line-height: 30px !important;
        margin-left: 8px;
        cursor: pointer;
    }
    .threeLogo{
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 120px;
        height: 24px;
        span{
            width: 24px;
            height: 24px;
            cursor: pointer;
        }
    }
  }
}

 .pictures{
    display: flex;
    flex-wrap: wrap;
    align-content: flex-start;
    height: 484px;
    width: 100%;
    padding-left: 16px;
    overflow: hidden;
    overflow-y:auto;
    .nonePic{
        font-size: 16px;
        color: #7e7f7f;
        margin: 50px auto;
    }
    .picBox{
         width: 120px;
         height: 138px;
         margin: 16px 10px 0 0;
        .boxPhoto{
            position: relative;
            width: 120px;
            height: 96px;
            border-radius: 4px;
            // &:hover .bottom,&:hover .err{
            //     display: block;
            // }
            img{
                width: 118px;
                height: 94px;
                border-radius: 4px;
            }
            .bottom{
                position: absolute;
                bottom: 0;
                left: 0;
                width: 118px;
                height: 28px;
                background-color: rgba(0,0,0,.3);
                display: none;
                img{
                    float: right;
                    width: 18px;
                    height: 18px;
                    margin: 5px 8px 0 0;
                    cursor: pointer;
                }
            }
            
            .err{
                position: absolute;
                top: 5px;
                right: 8px;
                font-size: 12px;
                width: 12px;
                height: 12px;
                background-color: rgba(0,0,0,.3);
                border-radius: 8px;
                display: none;
                cursor: pointer;
            }
        }
        .picInfo{
            height: 34px;
            width: 120px;
            margin-top: 6px;
            font-size: 12px;  
            text-align: center;
            overflow: hidden;
            text-overflow: ellipsis;
        }
    }
  }
 
  .borderWhite{
    border: 1px solid #fff;
  }
  .bind{
    color: #a4a5a6;
    pointer-events: none;
  }
   ::-webkit-scrollbar {
    /* 对应纵向滚动条的宽度 */
    width: 10px;
    /* 对应横向滚动条的宽度 */
    height: 10px;
    }

    /* 滚动条上的滚动滑块 */
    ::-webkit-scrollbar-thumb {
        background-color: #515560;
        border-radius: 5px;
    }

    /* 滚动条轨道 */
    ::-webkit-scrollbar-track {
        background-color: #16191f;
        border: 1px solid #41444D;
        border-radius:2px;
    }
.view_animation{
    height: 500px;
    width: 400px;
    .romaHead2{
        width: 400px;
    }
    .threeLogo{
        justify-content: right !important;
    }
    .videos{
        height: 405px;
        width: 100%;
        // padding-left: 16px;
        padding: 7px 0 0 16px;
        overflow: hidden;
        overflow-y:auto;
        .videosList{
            display: flex;
            width: 372px;
            height: 55px;
            margin-top: 8px;
            .frontCover{
                width: 84px;
                height: 55px;
                margin-right: 16px;
                border-radius: 4px;
            }
            .videoDes{
                display: flex;
                flex-direction: column;
                justify-content: space-around;
                width: 187px;
                height: 55px;
                font-size: 14px;
                color: rgba(255,255,255,0.7000);
                margin-right: 15px;
            }
            .videosEdit{
                display: flex;
                align-items: center;
                justify-content: space-between;
                width: 44px;
                height: 55px;
                i{
                    cursor:pointer;
                }
            }
        }
    }
}
.animationBorder{
    border: 1px solid #B0FCFF;
}
// 编辑预览框
.proEdit{
    position: absolute;
    bottom: 80px;
    left: 0;
    width: 100%;
    height: 193px;
}
.proEditMain{
    min-width: 1200px;
    width: 70%;
    height: 100%;
    margin: 0 auto;
    background-color:rgba(16,16,16,0.9);
    border-radius: 6px;
    .proEditTop{
        position: relative;
        display: flex;
        align-items: center;
        height: 50px;
        width: 100%;
    }
}
.component, .order{
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 255px;
    height: 30px;
    margin-left: 1%;
}
.component, .order, .getVideo{ // 不影响之前的选择框样式
    ::v-deep .el-input input{
        height: 28px;
        width: 125px;
        color: #fff;
        background-color: #24262B;
        border: 1px solid #727272;
    }
    span{
        font-size: 14px;
        color: #fff;
    }
    ::v-deep .el-input .el-input__suffix{
        top: 6px;
    }
    ::v-deep .el-input .el-select__caret.is-reverse{
        margin-top: -10px;
    }
}
    
   .play{
    width: 94px;
    height: 30px;
    display: flex;
    justify-content: space-between;
    align-items: center;
     margin-left: 5%;
    i{
        font-size: 24px;
        color: #fff;
    }
    .leftPlay, .rightPlay{
        position: relative;
        width: 24px;
        height: 24px;
    }
    .leftPlay i:nth-of-type(1){
            position: absolute;
            top: 4px;
            left: -2px;
        }
    .rightPlay i:nth-of-type(2){
        position: absolute;
        top: 4px;
        right: -2px;
    }
   }
    .getVideo{
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 412px;
        height: 30px;
         margin-left: 5%;
        ::v-deep .el-input input{
            width: 200px;
        }
        .button{
            width: 90px;
            height: 26px;
            background-color: rgba(0,0,0,.5);
            color: #fff;
            border: 1px solid #fff;
            padding-top: 6px;
        }
        .button:nth-of-type(1){
            margin-left: 20px;
        }
    }
    .closeProEdit{
        position: absolute;
        top: 10px;
        right: 20px;
        font-size: 18px;
        cursor: pointer;
        color: #fff;
    }
    .progressDiv{
        width: 100%;
        height: 6px;
        position: absolute;
        top: -8px;
        left: 0;
        ::v-deep .el-progress-bar__outer{
            height: 3px;
        }
        ::v-deep .el-progress__text{
            color:#5DBB57;
        }
    }
//   预览下半部分
    .proEditDown{
        display: flex;
        width: 100%;
        height: 143px;
        padding: 17px 0 0 6px;
        transform: scaleY(-1); // 利用翻转 将滚动条放到上方
        overflow-x: scroll;
        .viewMorePic{
            position: relative;
            flex-shrink:0;
            width: 120px;
            height: 80px;
            transform: scaleY(-1); // 父盒子翻转后 将子盒子再翻转回来
            margin-right: 10px;
            .videosPlus{
                position: absolute;
                top: 28px;
                right: -18px;
                width: 25px;
                height: 25px;
                cursor: pointer;
           }
           .videoWords{
                position: absolute;
                top: -25px;
                right: -34px;
                width: 62px;
                height: 18px;
                color: #C0C0C2;
                font-size: 12px;
                line-height: 18px;
                text-align: center;
                background: #181A1E;
                border-radius: 2px;
                border: 1px solid #727272;
           }
        }
        
    }
</style>
