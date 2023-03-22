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
              @blur="inputBlur"
              class="searchInput"
              type="text"
              v-model="input" 
              @keyup.enter.native="searchBtn"
              placeholder="请输入视图名称"  
            >
                <div slot="prefix"><i class="el-icon-search" @click="searchBtn"></i></div>
            </el-input>
            <div class="threeLogo">
                <span>
                    <el-tooltip class="item" effect="light" content="更新视图" placement="top">
                      <i class="iconfont icon-a-gengxinshitu3" @click="coverClick" :class="{bind:active === -1}" :style="{'font-size':'24px' }"></i>
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
        <div class="pictures" onselectstart="return false;">
            <div class="picBox"  v-for="(item,index) in pointList" :key="index">
                <div class="boxPhoto">
                    <img :src="item.imagePath" alt="" @click="selected(index,item)" :class="{'borderWhite': index === active}" :style="{'cursor':'pointer'}">
                    <div class="bottom" :style="{'display':index === active ? 'block' : 'none'}">
                        <img @click="normalPic('1',item.imagePath)" :src="require('@/assets/images/view/view4.png')" alt="">
                        <!-- <img @click="normalPic('2',item.imagePath)" :src="require('@/assets/images/view/view5.png')" alt=""> -->
                    </div>
                    <i class="el-icon-close err" :style="{'display':index === active ? 'block' : 'none'}" @click="removeDialog(item)"></i>
                </div>
                <div class="picInfo" @dblclick="dbTest(item,'one')">
                    {{item.name}}
                </div>
            </div>
            <div class="nonePic" v-if="pointList.length === 0">
                暂无视图
            </div>
        </div>
        <!-- 图片预览弹框 -->
        <el-dialog class="picProview" :title="namePicDif==='1' ? '图片预览' : '全景图预览'" :visible="proviewPic" @close="proviewPic=false" :append-to-body="true" width="70%">
            <img :src="this.proLookPic" alt="" :style="{'width':'100%','height':'100%'}">
        </el-dialog>
        <!-- 视图导出弹窗 -->
       <viewDialog :item="dialogFlag" @closeDia="closeDia2" @noBorder="noBorder" 
        :delItem ="delFlag" :delInfo="delInfo" @pointListSon="pointListSon" :taskid="taskId"
        @runListPoint = "runListPoint"
        >
        </viewDialog>
      </div>
       <!-- 编辑视点的名称 -->
        <el-dialog
            title="编辑"
            :visible="dialogVisible"
            @close="dialogVisibleClose"
            width="25%"
            :append-to-body="true"
            :close-on-click-modal="false"
            >
            <el-form :model="editForm" :rules="rules" ref="editForm">
                <el-form-item label="名称:" label-width="80px" prop="inputName">
                    <el-input v-model="editForm.inputName" placeholder="请输入内容" @keydown.native.stop></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisibleClose">取 消</el-button>
                <el-button type="primary" @click="submitDialog">确 定</el-button>
            </span>
        </el-dialog>
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
              v-model="inputTwo" 
              placeholder="请输入视点动画名称"
              @blur="animBlur"
              @keyup.enter.native="searchAnim"  
            >
                <div slot="prefix"><i class="el-icon-search" @click="searchAnim"></i></div>
            </el-input>
            <div class="threeLogo">
                <img :src="require('@/assets/images/view/plus.png')" @click="plusProEdit" alt="" :style="{'width':'24px','height':'24px','cursor':'pointer' }">
            </div>
        </div>
        <div class="videos">
            <div class="videosList"  v-for="(item,index) in viewPointLists" :key="index">
                <div class="frontCover">
                    <img v-if="item.imagePath" @click="picAnimation(item,index)" :class="{'animationBorder':activeAnimation === index}" :src="item.imagePath" alt="" :style="{'width':'100%','height':'100%','cursor':'pointer','border-radius':'4px' }">
                    <img v-else @click="picAnimation(item,index)" :class="{'animationBorder':activeAnimation === index}" :src="require('@/assets/images/view/picFirst.png')" alt="" :style="{'width':'100%','height':'100%','cursor':'pointer','border-radius':'4px','border':'1px #fff solid' }">
                </div>
                <div class="videoDes">
                    <div class="upWordes">
                        <span>时&nbsp;&nbsp;&nbsp;长:&nbsp;&nbsp;</span>
                        <span>{{item.time | timeChanger}}</span>
                    </div>
                    <div class="downWordes">
                        <span>Video:&nbsp;&nbsp;</span>
                        <span>{{item.name}}</span>
                    </div>
                </div>
                <div class="videosEdit">
                    <i class="el-icon-edit" @click="editPro(item,'two')"></i>
                    <i class="el-icon-delete" @click="delAnimation(item)"></i>
                </div>
            </div>
            <div class="nonePic" v-if="viewPointLists === undefined || viewPointLists.length === 0">
                暂无视点动画
            </div>
        </div>
      </div>
      <!-- 预览与编辑菜单栏 -->
      <div class="proEdit" v-if="activeAnimation !== -1">
        <div class="proEditMain">
            <div class="proEditTop" onselectstart="return false;">
                <div class="component">
                    <!-- <img :style="{'width':'18px','height':'18px','margin-left':'10px'}" :src="require('@/assets/images/view/goujian.png')" alt="">
                    <span>附加构件动画:</span>
                    <el-select v-model="optionsComponents" placeholder="请选择">
                        <el-option
                             v-for="item in options"
                             :key="item.value"
                             :label="item.label"
                             :value="item.value">
                        </el-option>
                    </el-select> -->
                </div>
                <div class="order">
                    <!-- <img :style="{'width':'18px','height':'18px','margin-left':'10px'}" :src="require('@/assets/images/view/xulie.png')" alt="">
                    <span>附加序列动画:</span>
                    <el-select v-model="ordersValue" placeholder="请选择">
                        <el-option
                             v-for="item in  optionOrders"
                             :key="item.value"
                             :label="item.label"
                              :value="item.value">
                         </el-option>
                    </el-select> -->
                </div>
                <div class="play">
                    <div class="leftPlay" @click="logoClick('stop')" :style="{'cursor':'pointer'}" :class="animaViewPointer===undefined || animaViewPointer.length<2 ? 'noAllowed' : ''">
                         <i class="el-icon-caret-left" :style="{'font-size':'16px'}"></i>
                         <i class="el-icon-caret-left" ></i>
                    </div>
                    <i v-if="playFlags==='1'" class="el-icon-video-play" @click="startPlay" :style="{'cursor':'pointer'}" :class="animaViewPointer===undefined || animaViewPointer.length<2 ? 'noAllowed' : ''"></i>
                    <i v-if="playFlags==='2'" class="el-icon-video-pause" @click="logoClick('pause')" :style="{'cursor':'pointer'}"></i>
                    <i v-if="playFlags==='3'" class="el-icon-remove-outline" @click="logoClick('replay')" :style="{'cursor':'pointer'}"></i>
                    <div class="rightPlay" @click="logoClick('stop')" :style="{'cursor':'pointer'}" :class="animaViewPointer===undefined || animaViewPointer.length<2 ? 'noAllowed' : ''">
                        <i class="el-icon-caret-right" ></i>
                        <i class="el-icon-caret-right" :style="{'font-size':'16px',}"></i>
                    </div>
                </div>
                <div class="getVideo">
                    <!-- <el-select v-model="resolutionValue" placeholder="请选择">
                        <el-option
                             v-for="item in  resolution"
                             :key="item.value"
                             :label="item.label"
                              :value="item.value">
                         </el-option>
                    </el-select>
                    <el-button round class="button">渲染</el-button>
                    <el-button round class="button">导出</el-button> -->
                </div>
                <!-- 关闭按钮 -->
                <i  class="el-icon-close closeProEdit" @click="proEditClose"></i>
                <!-- 渲染进度条 -->
                <div class="progressDiv">
                    <el-progress :percentage="90"  :color="customColor"></el-progress>
                </div>
                <!-- 播放条 -->
                <div class="startPost" v-if="animaViewPointer.length>=2" :class="this.playFlags==='2' ? 'noAllowed' : ''" style="left: 6px;">
                        <div class="outCircle">
                        </div>
                        <div class="bigCircle" @mousedown="pushMouse" @mouseup="releaseMouse">
                             <div class="smallCircle"></div>
                        </div>
                        <div class="postDown"></div>
                </div>
            </div>
            <div class="proEditDown">
                <div class="allWidth" :style="{'display':'flex'}" onselectstart="return false;">
                  <draggable v-model="animaViewPointer" handle=".dragImg"  chosenClass="chosen" forceFallback="true" group="people" animation="1000" @start="onStart" @end="onEnd">
                    <transition-group :style="{'display':'flex'}">
                        <div class="viewMorePic" v-for="(item,index) in animaViewPointer" :key="item.tid">
                            <img class="dragImg" :src="item.imagePath" alt="" @click="selectPoints(index)" :class="{'pointBor':activePoints === index}" :style="{'width':'100%','height':'100%','cursor': 'move'}">
                            <i class="el-icon-close pointsClose" @click="delPoints(index,item)" v-if="activePoints === index"></i>
                            <div class="videosPlus">
                                <img :src="require('@/assets/images/view/jiahao.png')" @click.stop="addView(index)" :style="{'width':'100%','height':'100%'}" alt="">
                            </div>
                            <div class="videoWords" v-if="index<=animaViewPointer.length-2 && animaViewPointer.length>1" @click="changePointTime(item)">{{item.time | timeChanger}}</div>
                            <div class="firstAdd" v-if="index === 0">
                                <img :src="require('@/assets/images/view/jiahao.png')" @click.stop="addView('one')" :style="{'width':'100%','height':'100%'}" alt="">
                            </div>
                        </div>
                    </transition-group>
                  </draggable> 
                </div>
                <div class="onlyPlus" v-if="animaViewPointer.length === 0">
                    <img :src="require('@/assets/images/view/jiahao.png')" @click.stop="addView('one')" :style="{'width':'100%','height':'100%'}" alt="">
                </div>
            </div>
        </div>
      </div>
      <!-- 新建空的视点动画的名称（或改变视点间的时间） -->
        <el-dialog
            title="编辑"
            :visible.sync="newBlockView"
            :close-on-click-modal="false"
            @close="closeNewView"
            width="25%"
            :append-to-body="true"
            >
            <el-form v-if="flagTime === ''" :model="newViewForm" :rules="ruleNewView" ref="newViewForm" @submit.native.prevent>
                <el-form-item label="名称:" label-width="80px" prop="name">
                    <el-input v-model="newViewForm.name" placeholder="请输入内容"  @keydown.native.stop autofocus="true"></el-input>
                </el-form-item>
            </el-form>
            <el-form v-if="flagTime === '1'" :model="newTime" :rules="ruleTime" ref="newTime">
                <el-form-item  label="时间:" label-width="80px" prop="time">
                    <el-input type="number" v-model="newTime.time"  placeholder="秒"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="closeNewView">取 消</el-button>
                <el-button type="primary" @click="sureNewView">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
  import draggable from 'vuedraggable'
  import MODELAPI from "@/api/model_api";
  import viewDialog from "@/components/web_client/view_dialog";
  import { kMaxLength } from "buffer";
import { log } from 'console';
  export default {
        components: {
         viewDialog,
         draggable,
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
              proviewPic:false, // 图片预览弹框
              namePicDif:'', // 区分图片预览的名称
              drag:false, // 拖拽视点相关
              input:'',  // 视点列表搜索绑定
              inputTwo:'', // 视点动画搜索绑定
              active:-1,
              activeAnimation:-1,
              num:0,    // 是否重复点击图片
              num2:0,
              activePoints:-1, // 视图动画里面的视点相关
              num3:0,
              dialogFlag:false, // 导出弹框
              delFlag:false,  // 控制删除弹框
              getProps:null,
              pointList:[], // 视点图片
              searchPoint:[], // 搜索完成后 将它的值赋予pointList
              delInfo:{}, // 删除或选中时用到的参数传给view_dialog
              dialogVisible:false, // 编辑图片名字的弹框
              animViewIdedit:'', // 点击视图动画列表的编辑时的 viewId
              animViewId:'', // 点击视图动画列表的图片时的 viewId
              editForm:{
                inputName:'',
                tid:'',
                flag:'', // 判断是视点列表还是动画列表
                name2:'', // 用于修改名称表单验证时过滤掉自己
              },
              rules:{
                inputName: [
                    {
                        required: true,
                        message: "请输入名称",
                        trigger: "blur",
                    },
                    {
                      validator: (rules, value, callback) => {
                        let newArr = [];
                        // 当this.editForm.flag等于one 时，就是验证 修改视点的名字是否重复
                        if (this.editForm.flag === 'one') {
                            newArr = this.searchPoint;
                        } else if(this.editForm.flag === 'two'){
                            newArr = this.animNewarr;
                        }
                        let resBol = null;
                        if(newArr.length === 0){
                            resBol = false
                        }else{
                            resBol = newArr.some((item) => {
                                return item.name !== this.editForm.name2 && item.name === value;
                            })
                        }
                        resBol
                        ? callback(new Error('名称重复'))
                        : callback()
                      },
                      trigger: 'change'
                    },
                ],
              },
            //   视点间的时间
              ruleTime:{
                time: [
                        {
                            required: true,
                            message: "请输入时间(秒)",
                            trigger: "blur",
                        },
                        {
                            pattern:/^((?!0)\d{1,3}|1000)$/, message: "请输入1~1000s之间的秒数", trigger: "change",
                        }
                   ],
              },
            //  新建新的视点动画时 名称不可重复
            ruleNewView:{
                name:[
                    {
                        required: true,
                        message: "请输入名称",
                        trigger: "blur",
                    },
                    // {
                    //   validator: (rules, value, callback) => {
                    //     // 新增的视点动画的名字是否重复
                    //     let resBol = null;
                    //     console.log('8787',this.animNewarr);
                    //     if(this.animNewarr.length === 0){
                    //         resBol = false;
                    //     }else{
                    //         resBol = this.animNewarr.some((item) => {
                    //             return  item.name === value;
                    //         })
                    //     }
                    //     resBol
                    //     ? callback(new Error('名称重复'))
                    //     : callback()
                    //   },
                    //   trigger: 'change'
                    // }
                ]
            },
            //    proEditFlag:false, // 预览与编辑框(创建按钮相关)
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
               viewPointLists:[],  // 视点动画列表
               newBlockView:false, // 新创建的空视点动画名称弹框
               // 新创建的空视点动画姓名
               newViewForm:{
                name:''
               },
               animaViewPointer:[], // 视点动画里的视点数据
               // 视点间的时间
               newTime:{  
                 time:'',
                 timeTid:''
               },
               animNewarr:[], // 搜索完成后 将它的值赋予viewPointLists
               flagTime:'', // 用于区分是点击的改变视点间的时间还是点击的新建空视图
               playFlags:'1', // 控制播放按钮的切换
               picTime:0,  // 当前视点动画的总时长
               startLang:0, // 进度条距离左侧的距离
               noTimer:null, // 点击播放 没有进度条时第一个定时器
               twoTimer:null, // 点击播放 有进度条时第一个定时器
               threeTimer:null, // 点击播放 有进度条时第二个定时器
               clickPlayTime:null,  // 点击播放时 应该传递的时间
               proLookPic:'',  // 预览视点图片地址
               addViewTimeFlage:true, // 防止连续点击视图动画加号
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
                        // this.proEditFlag = false;
                        if(val === '2'){
                            this.getListsAnimations();
                        }
                    }
                }
             }
        },
        filters:{
            timeChanger(value){
                let sec = value % 60 <10 ? '0'+value % 60 + "″" : value % 60 + "″";
                let minu = Math.floor(value / 60) < 10 ? '0' + Math.floor(value / 60) + '′' : Math.floor(value / 60) + '′';
                return minu + sec;
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
            
        },
        methods:{
             //开始拖拽事件
            onStart(e){
                this.drag=true;
            },
            //拖拽结束事件
            onEnd(e) {
               this.drag=false;
               let currentTid = this.animaViewPointer[e.newIndex].tid;
               let newBefoTid = e.newIndex === 0 ? '0' : this.animaViewPointer[e.newIndex-1].tid;
               let params = {
                    tidMouse: currentTid,
                    leftTidIndex: newBefoTid,
                    viewId:this.animViewId
               }
               MODELAPI.UPDATEORDERBYMOUSE(params).then((res)=>{
                    if(res.data.code === 200){
                        this.viewsPointesGet(this.animViewId);
                    }
               }).catch(()=>{});
            },
            // 点击图片预览
            normalPic(eName,photoLook){
                this.namePicDif = eName;
                this.proviewPic = true;
                this.proLookPic = photoLook;
            },
            // 视点列表搜索
            searchBtn(){
                if(this.input.trim() !== ''){
                    let newArrSear = this.searchPoint.filter((item)=>{
                        if(item.name.indexOf(this.input.trim())>-1){
                            return item;
                        }
                    })
                    this.pointList = newArrSear;
                }else{
                  this.pointList = this.searchPoint;
                }
            },
            // 视点列表搜索框失去焦点时
            inputBlur(){
                if(this.input === ''){
                   this.pointList = this.searchPoint;
                }
                this.active = -1;
                this.num = 0;
            },
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
                this.logoClick('stop'); // 停止视图动画
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
            // 更新视图
            coverClick(){
                let params = {
                    taskId:this.taskId,
                    tid:this.delInfo.tid
                }
                MODELAPI.COVERVIEW(params).then((res)=>{
                    if(res.data.code === 200){
                        this.ListPoint();
                        this.$message({
                            message: '更新成功',
                            type: "success",
                        });
                    }else{
                        this.$message({
                            message: res.data.message,
                            type: "error",
                        });
                    }
                }).catch(()=>{})
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
                    MODELAPI.LISTFOLLOWPOINT(params)  
                    .then((res) => {
                        if (res.data.code === 0) {
                         this.pointList = res.data.data;
                         this.searchPoint = res.data.data;
                        }
                    })
                    .catch((err) => {});
                }, 1500);
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
            dbTest(e,flags){
                //    document.querySelector('.pictures .picBox:nth-of-type('+(ind+1)+') .picInfo .up .upName').style.display="none";
                //    document.querySelector('.pictures .picBox:nth-of-type('+(ind+1)+') .picInfo .up .edit').style.display="block";
                this.dialogVisible = true;
                this.editForm.inputName = e.name;
                this.editForm.tid = e.tid;
                this.editForm.flag = flags;
                this.editForm.name2 = e.name;
            },
            // 点击确认 编辑 视图列表名称 或 视图动画名称
            submitDialog(){
                this.$refs["editForm"].validate((valid)=>{
                    if(valid){
                        if(this.editForm.flag === 'one'){
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
                        }else{
                            let params = {
                                viewId:this.animViewIdedit,
                                newName:this.editForm.inputName,
                            }
                            MODELAPI.CHANGENAMEANIM(params).then((res)=>{
                                if(res.data.code === 200){
                                    this.getListsAnimations();
                                    this.$message({
                                        type: "success",
                                        message: '修改成功',
                                    });
                                    this.dialogVisible = false;
                                }
                            }).catch(()=>{})
                        }
                    }
                })
            },
            // 视图列表的×
            dialogVisibleClose(){ 
                this.$refs["editForm"].resetFields();
                this.editForm.inputName = '';
                this.dialogVisible = false;
            },
            // 查询视点动画列表
            getListsAnimations(){
                setTimeout(()=>{
                    let params = {
                      taskId:this.getProps.taskId
                    }
                    this.viewPointLists = [];
                    MODELAPI.SERACHCIEWANIMATION(params)
                    .then((res)=>{
                        if(res.data.code === 200){
                            if(res.data.data === undefined){
                                this.viewPointLists = [];
                                this.animNewarr = [];
                            }else{
                                this.viewPointLists = res.data.data;
                                this.animNewarr = res.data.data;
                            }
                        }
                    }).catch(()=>{});
                })
            },
            // 视点动画列表搜索
            searchAnim(){
                if(this.inputTwo.trim() !== ''){
                    let newArrSear = this.viewPointLists.filter((item)=>{
                        if(item.name.indexOf(this.inputTwo.trim())>-1){
                            return item;
                        }
                    })
                    this.viewPointLists = newArrSear;
                }
            },
            // 视点动画列表搜索框失去焦点
            animBlur(){
                if(this.inputTwo === ''){
                   this.viewPointLists = this.animNewarr;
                }
                this.activeAnimation = -1;
                this.num2 = 0;
            },
            // 点击 创建视点动画
            plusProEdit(){
                // this.proEditFlag = true;
                this.activeAnimation=-1;
                this.num2 = 0;
                this.newBlockView = true;
                this.newViewForm.name = '';
                this.flagTime = ''; // 将flagTime置空表示点击的是新建空视图动画
            },
            // 点击视点动画图片
            picAnimation(item,ind){
                if(this.activeAnimation === ind){
                    this.num2 += 1;
                    if(this.num2 % 2 === 1){
                        this.activeAnimation = -1; 
                        // this.proEditFlag=false;  
                    }
                }else{
                    this.num2 = 0;
                    this.activeAnimation = ind; 
                    //  this.proEditFlag=false;     
                    this.viewsPointesGet(item.viewId);     
                    this.logoClick('stop');   // 停止视图动画   
                }
                this.animViewId = item.viewId;
            },
            // 预览和编辑框的叉号
            proEditClose(){
                this.activeAnimation=-1;
                this.num2 = 0;
                // this.proEditFlag=false; 
                this.logoClick('stop');  // 停止视图动画
            },
            // 编辑视点动画的名称
            editPro(e,flags){
                this.dialogVisible = true;
                // this.editForm.inputName = e.name;
                this.editForm.flag = flags;
                this.editForm.inputName = e.name;
                this.animViewIdedit = e.viewId;
                this.editForm.name2 = e.name;
            },
            // 关闭新创建空视图列表弹框
            closeNewView(){
                this.newBlockView = false;
                this.newTime.time = '';
                if(this.flagTime==='1'){
                    this.$refs["newTime"].resetFields();
                }
                this.newTime.time = '';
            },
             // 新创建空视图列表弹框（或改变视点间的时间） 确定按钮
            sureNewView(){
                 if(this.flagTime === ''){
                    this.$refs["newViewForm"].validate((valid)=>{
                        if(valid){
                            let params = {
                                taskId:this.getProps.taskId,
                                name:this.newViewForm.name
                            }
                        MODELAPI.CREATEANIM(params).then((res)=>{
                            if(res.data.code === 200){
                                this.newBlockView = false;
                                this.getListsAnimations();
                                this.$message({
                                    type: "success",
                                    message: "新建成功",
                                });
                            }
                        })
                      }
                    })
                }else{
                    this.$refs["newTime"].validate((valid)=>{
                        if(valid){
                            let params = {
                                viewId:this.animViewId,
                                tid:this.newTime.timeTid,
                                time:this.newTime.time
                            }
                            MODELAPI.UPDATEPLAYTIME(params).then((res)=>{
                                if(res.data.code === 200){
                                    this.newBlockView = false;
                                    this.viewsPointesGet(this.animViewId);
                                    this.$message({
                                        type: "success",
                                        message: '修改成功',
                                    });
                                }
                            }).catch(()=>{})
                         }
                    })
                }
            },
            delAnimation(e){
                this.$confirm('此操作将删除该视图动画, 是否继续?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        let params = {
                            viewId:e.viewId
                        }
                        MODELAPI.DELETEANIM(params).then((res)=>{
                            if(res.data.code === 200){
                                this.$message({
                                    type: 'success',
                                    message: '删除成功!'
                                });
                                this.getListsAnimations();
                                this.activeAnimation=-1;
                                this.num2 = 0;
                            }
                        })
                    }).catch(() => {
                        this.$message({
                            type: 'info',
                            message: '已取消删除'
                        });          
                });
            },
            // 根据视图动画id获取视图动画里的视点
            viewsPointesGet(idView){
                let params = {
                    viewId:idView
                }
                MODELAPI.GETANIMBYVIEW(params).then((res)=>{
                    if(res.data.code===200){
                        this.animaViewPointer = res.data.data;
                        if(res.data.data.length<=1){
                            this.picTime = Number(0);
                        }else{
                            this.picTime = 0;
                            res.data.data.forEach((item)=>{
                                this.picTime = this.picTime + Number(item.time);
                            })
                           this.picTime = this.picTime - Number(res.data.data[res.data.data.length-1].time);
                        }
                    }
                }).catch(()=>{})
            },
            // 点击编辑预览的视点的加号时
            addView(flags){
                if(this.addViewTimeFlage === true){
                    this.addViewTimeFlage =false;
                    let params = {
                        viewId: this.animViewId,
                        taskId: this.getProps.taskId,
                        orderInfo: flags === 'one' ? 1 : (flags + 2)
                    }
                    MODELAPI.ADDVIEWSTOANIM(params).then((res)=>{
                        if(res.data.code === 200){
                            setTimeout(()=>{
                                this.viewsPointesGet(this.animViewId);
                                this.getListsAnimations();
                            },1000)
                        }else{
                            this.$message({
                                type: 'error',
                                message: res.data.message
                            });
                        }
                    }).catch(()=>{}).finally(()=>{
                        setTimeout(()=>{
                            this.addViewTimeFlage = true;
                        },3000);
                    });
                }else{
                    this.$message.warning('2秒后可操作做');
                }
                
            },
            // 点击视图动画里面的视点图片
            selectPoints(index){
                if(this.activePoints === index){
                    this.num3 += 1;
                    if(this.num3 % 2 === 1){
                        this.activePoints = -1;   
                      
                    }
                }else{
                    this.num3 = 0;
                    this.activePoints = index; 
                }
            },
            // 删除视图动画中的视点
            delPoints(index,e){
                this.$confirm('此操作将删除该视点, 是否继续?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        let params = {
                            viewId:this.animViewId,
                            taskId:this.getProps.taskId,
                            tid:e.tid
                        }
                        MODELAPI.REMOVEANIMPOINTERS(params).then((res)=>{
                            if(res.data.code === 200){
                                this.$message({
                                    type: 'success',
                                    message: '删除成功!'
                                });
                                this.getListsAnimations();
                                this.viewsPointesGet(this.animViewId);
                                this.activePoints = -1;
                                this.num3 = 0;
                            }
                        })
                    }).catch(() => {
                        this.$message({
                            type: 'info',
                            message: '已取消删除'
                        });          
                });
            },
            // 改变视点间的动画时间
            changePointTime(e){
                this.flagTime = '1';
                this.newBlockView = true;
                this.newTime.timeTid = e.tid;
                this.getListsAnimations();
            },
            // 点击播放按钮
            startPlay(){
                let params = {
                    viewId:this.animViewId,
                    taskId:this.getProps.taskId,
                    time: this.clickPlayTime || 0
                }
                MODELAPI.VIEWANIMPREVIEW(params).then((res)=>{
                    if(res.data.code === 200){
                        this.playFlags = '2';
                        this.moveStart();
                    }
                })
            },
            moveStart(){
                let proEditDown = document.querySelector('.proEditDown');
                let allWidth = document.querySelector('.allWidth');
                let startPost = document.querySelector('.startPost');
                let proEditMain = document.querySelector('.proEditMain');
                let stepTime = Number(( this.picTime * 1000 / allWidth.offsetWidth ).toFixed(5));
                console.log('🚀🚀🚀',this.picTime,stepTime);
                // 如果没有进度条
                if(allWidth.offsetWidth < proEditMain.offsetWidth){
                     this.noTimer = setInterval(()=>{
                        startPost.style.left = parseInt(startPost.style.left) + 1 + 'px';
                        this.startLang = parseInt(startPost.style.left);
                        if(parseInt(startPost.style.left) >= allWidth.offsetWidth-6){
                            startPost.style.left = allWidth.offsetWidth-6 + 'px';
                             setTimeout(()=>{
                                startPost.style.left =  6 +'px';
                                this.startLang = parseInt(startPost.style.left);
                                this.playFlags = '1';
                                this.clickPlayTime = 0
                                clearInterval(this.noTimer);
                             },1000);
                        }
                    },stepTime);
                }else{
                    let dom = document.querySelector('.proEditDown');
                    this.twoTimer = setInterval(()=>{
                        startPost.style.left = parseInt(startPost.style.left) + 1 + 'px';
                        this.startLang = parseInt(startPost.style.left);
                        if(parseInt(startPost.style.left) >= proEditDown.offsetWidth - 25){
                             startPost.style.left = proEditDown.offsetWidth - 25 + 'px'
                             clearInterval(this.twoTimer);
                             this.threeTimer = setInterval(()=>{
                                dom.scrollLeft = dom.scrollLeft + 1;
                                if(dom.scrollWidth === dom.clientWidth + dom.scrollLeft){
                                        startPost.style.left = proEditDown.offsetWidth - 25 + 'px';
                                        setTimeout(()=>{
                                            dom.scrollLeft = 0;
                                            this.playFlags = '1';
                                            this.clickPlayTime = 0
                                            startPost.style.left =  6 +'px';
                                            clearInterval(this.threeTimer);
                                        },1000);
                                }
                             },stepTime);
                        }
                    },stepTime);
                }
            },
            // 点击暂停、播放、停止时
            logoClick(difLogo){
                let params = {
                   taskId:this.getProps.taskId,
                   status:difLogo,
                   viewId:this.animViewId,
                }
                MODELAPI.PLAYOPERATION(params).then((res)=>{
                    if(res.data.code === 200){
                        let proEditMain = document.querySelector('.proEditMain');
                        let allWidth = document.querySelector('.allWidth');
                        let startPost = document.querySelector('.startPost');
                        let dom = document.querySelector('.proEditDown');
                        if(difLogo==='pause'){
                            this.playFlags = '3';
                            if(allWidth.offsetWidth < proEditMain.offsetWidth){
                                clearInterval(this.noTimer);
                            }else{
                                clearInterval(this.twoTimer);
                                clearInterval(this.threeTimer);
                            }
                        }else if(difLogo==='replay'){
                            this.playFlags = '2';
                            this.moveStart();
                        }else{
                            this.playFlags = '1';
                            clearInterval(this.noTimer);
                            clearInterval(this.twoTimer);
                            clearInterval(this.threeTimer);
                            startPost.style.left = 6 + 'px';
                            dom.scrollLeft=0;
                            this.clickPlayTime = null;
                        }
                    }else{
                        clearInterval(this.noTimer);
                        clearInterval(this.twoTimer);
                        clearInterval(this.threeTimer);
                        this.getPlayTime();
                    }
                }).catch(()=>{})
            },
            // 按下播放条
            pushMouse(e){
                let proEditMain = document.querySelector('.proEditMain');
                let startPost = document.querySelector('.startPost');
                let proEditDown = document.querySelector('.proEditDown');
                let allWidth = document.querySelector('.allWidth');
                // 获取 鼠标在 播放条内的位置
                let x = e.pageX - proEditMain.offsetLeft-startPost.offsetLeft;
                // 计算赋值
                startPost.style.left = e.pageX - proEditMain.offsetLeft - x +'px';
                this.startLang = parseInt(startPost.style.left);
                window.onmousemove = function(e){
                    // 计算赋值
                    startPost.style.left = e.pageX - proEditMain.offsetLeft - x +'px';
                    this.startLang = parseInt(startPost.style.left);
                    // console.log('999',e.pageX,e.pageX - proEditMain.offsetLeft - 6);
                    // 如果进度条的定位小于等于6px
                    if(e.pageX - proEditMain.offsetLeft - x <= 6){
                        startPost.style.left = 6 + 'px';
                        this.startLang = parseInt(startPost.style.left);
                    }
                    // 如果没有进度条
                    if(allWidth.offsetWidth < proEditMain.offsetWidth){
                        // 如果进度条的定位超过图片总长度时
                        if(e.pageX - proEditMain.offsetLeft - x >= allWidth.offsetWidth ){
                            startPost.style.left = allWidth.offsetWidth - 6 +'px';
                            this.startLang = parseInt(startPost.style.left);
                            window.onmousemove = null;
                        }
                    }
                    // 如果有进度条时
                    if(allWidth.offsetWidth > proEditMain.offsetWidth){
                        let dom = document.querySelector('.proEditDown');
                        if((e.pageX - proEditMain.offsetLeft - x) >= proEditDown.offsetWidth - 25){
                            startPost.style.left = proEditDown.offsetWidth-25 + 'px';
                            this.startLang = parseInt(startPost.style.left);
                        }
                        // 将进度条的left值 赋值 给进度条
                        dom.scrollLeft = e.pageX - proEditMain.offsetLeft - x - 6;
                    }
                }
                // 按下时监听鼠标移动区域
                document.addEventListener("mousemove", this.moveEvent,false);

            },
            moveEvent(e){
                    var event = e || window.event;
                    var target = event.target || event.srcElement;
                    if(document.querySelector('.outCircle').contains(target) || document.querySelector('.startPost').contains(target)) {
                        console.log("in");
                    } else {
                        console.log("out");
                        this.releaseMouse();
                    }
            },
            // 松开播放条
            releaseMouse(e){
              console.log('🚀🚀🚀q',e);
                window.onmousemove = null;
                document.removeEventListener("mousemove",this.moveEvent,false);
                this.getPlayTime();
            },
            // 根据内容长度计算播放条所在位置的时间
            getPlayTime(){
                let proEditMain = document.querySelector('.proEditMain');
                let allWidth = document.querySelector('.allWidth');
                let startPost = document.querySelector('.startPost');
                let dom = document.querySelector('.proEditDown');
                this.playFlags = '1';
                if(allWidth.offsetWidth < proEditMain.offsetWidth){
                  this.clickPlayTime = ((parseInt(startPost.style.left) / allWidth.offsetWidth) * this.picTime).toFixed(2);
                }else{
                  this.clickPlayTime = (((parseInt(startPost.style.left) + dom.scrollLeft) / allWidth.offsetWidth) * this.picTime).toFixed(2);
                }
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
            cursor: pointer;
        }
    }
  }
  .picProview{
    ::v-deep .el-dialog{
        margin-top: 8vh !important;
        height: 80%;
    }
    ::v-deep .el-dialog__body{
        padding: 0 20px !important;
        height: 90%;
    }
  } 
 .nonePic{
        font-size: 16px;
        color: #7e7f7f;
        margin: 50px auto;
        text-align: center;
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
                .downWordes{
                    overflow: hidden;
                    text-overflow:ellipsis;
                    white-space: nowrap;
                }
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
        display: none;
        ::v-deep .el-progress-bar .el-progress-bar__outer{
            background-color: rgba(255,255,255,0);
        }
        ::v-deep .el-progress-bar__inner{
            height: 50%;
        }
        ::v-deep .el-progress__text{
            color:#5DBB57;
        }
    }
     .startPost{
            position: absolute;
            // left: 6px;
            top: 60px;
            width: 14px;
            height: 133px;
            z-index: 9999;
            .outCircle{
                width: 46px;
                height: 44px;
                position: absolute;
                top: -15px;
                left: -16px;
            }
            .bigCircle{
                position: absolute;
                left: 0;
                top: 0;
                width: 14px;
                height: 14px;
                background-color: #E1790E;
                border-radius: 7px;
                cursor: move;
                .smallCircle{
                    width: 7px;
                    height: 7px;
                    background-color: #FFD04F;
                    border-radius: 3.5px;
                    margin: 4px 0 0 3px;
               }
            }
            .postDown{
                width: 2px;
                height: 100%;
                background-color: #E1790E;
                margin: 0 0 14px 6px;
             }
        }
      .noAllowed{
        pointer-events: none;
      }
//   预览下半部分
    .proEditDown{
        position: relative;
        display: flex;
        width: 100%;
        height: 143px;
        padding: 0 0 0 12px;
        transform: scaleY(-1); // 利用翻转 将滚动条放到上方
        overflow-x: scroll;
        .onlyPlus{
            width: 26px;
            height: 26px;
            position: absolute;
            top: 48%;
            left: 48%;
            cursor: pointer;
        }
        .viewMorePic{
            position: relative;
            flex-shrink:0;
            width: 120px;
            height: 80px;
            transform: scaleY(-1); // 父盒子翻转后 将子盒子再翻转回来
            margin-right: 10px;
            margin-top: 17px;
            .pointBor{
                border: 1px solid #fff;
                cursor: pointer;
            }
            .pointsClose{
                position: absolute;
                top: 1px;
                right: 1px;
                font-size: 18px;
                color: #fff;
                cursor: pointer;
            }
           .firstAdd{
                position: absolute;
                top: 28px;
                left: -13px;
                width: 25px;
                height: 25px;
                cursor: pointer;
           }
           
           .videoWords{
                position: absolute;
                top: -25px;
                right: -28px;
                width: 50px;
                height: 18px;
                color: #C0C0C2;
                font-size: 12px;
                line-height: 18px;
                text-align: center;
                background: #181A1E;
                border-radius: 2px;
                border: 1px solid #727272;
                cursor: pointer;
           }
        }
        .videosPlus{
                position: absolute;
                top: 28px;
                right: -13px;
                width: 25px;
                height: 25px;
                cursor: pointer;
                user-select: none;
           }
        .videosPlus:last-child{
            right: -18px;
        }
    }
    
</style>
