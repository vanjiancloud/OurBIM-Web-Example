<template>
    <div class="roam_navigate">
        <div class="romaHead">
            <span class="title">漫游导航</span>
            <span class="el-icon-close closeIcon"></span>
        </div>
        <div class="middle">
            <el-radio-group v-model="radio" class="singleSelect" @change="changeRadio">
                <el-radio :label="2" class="needBlock"><span class="viewModel">{{personView[0].name}}</span></el-radio>
                <el-radio :label="1" class="needBlock"><span class="viewModel">{{personView[1].name}}</span></el-radio>
                <el-radio class="needNone selfView" disabled>
                    <div>
                        <el-checkbox @change="weight" v-model="checkWeight" :disabled="radio===1 ? false : true" class="firstSelect">{{checkListArr[0].name}}</el-checkbox>
                        <el-checkbox @change="broke" v-model="checkBroken" :disabled="radio===1 ? false : true">{{checkListArr[1].name}}</el-checkbox>
                    </div>
                    <div class="turnHeight">
                        <span>{{words[0]}}</span>
                        <input @blur="adjustHeight" class="oneHeight" type="number" :disabled="radio!==1 || this.checkWeight === false ? true : false"  value="1.72">
                        <span>m</span>
                    </div>
                </el-radio>
                <el-radio :label="3" class="needBlock"><span class="viewModel">{{personView[2].name}}</span></el-radio>
                <el-radio class="needNone followView" disabled>
                    <div class="upTwo">
                        <el-select @change="changeSelect" :disabled="radio===3 ? false : true" v-model="value" placeholder="请选择对象" size="mini">
                            <el-option
                                v-for="item in options"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                            </el-option>
                        </el-select>
                        <div class="turnHeight">
                            <span>{{words[0]}}</span>
                            <input class="twoHeight" type="number" :disabled="radio===3 ? false : true" value="1.72">
                            <span>m</span>
                        </div>
                    </div>
                    <div class="startTest"><el-checkbox :disabled="radio===3 ? false : true" @change="threeBroke" v-model="checkTest">{{words[1]}}</el-checkbox></div>
                    <div class="putDown"><el-button :disabled="radio===3 ? false : true" type="primary" size="small">{{words[2]}}</el-button></div>
                    <div class="show-speed">
                       <span>{{words[3]}}</span>
                        <el-slider class="speedView"
                            v-model="speedValue"
                            @change="speedChange"
                            :min="1"
                            :max="8"
                            :disabled = "radio === 2 ? true : false"
                        ></el-slider>
                    </div>
                </el-radio>
            </el-radio-group>
        </div>
        <div class="bottom">
            <el-checkbox-group v-model="checkListBottom" @change="changeBottom">
                <el-checkbox :label="checkBottomWords[0].name"></el-checkbox>
                <el-checkbox :label="checkBottomWords[1].name"></el-checkbox>
            </el-checkbox-group>
        </div>
    </div>
</template>

<script>
import MODELAPI from '../../api/model_api';

export default {
    props:{
        taskId:{
          type: String,
          default: ""
        }
    },
    data(){
        return {
            radio:2, //三种模式默认选中
            personView: [
                {
                name: "第三人称模式",
                value: 0,
                },
                {
                name: "第一人称模式",
                value: 1,
                },
                {
                name: "跟随对象模式",
                value: 2,
                },
            ],
            checkWeight:false, // 重力 
            checkBroken:false, // 碰撞
            checkListArr:[
                {
                name: "重力模式",
                value: 0,
                },
                {
                name: "开启碰撞检测",
                value: 1,
                }
            ],
            value:4, // 下拉框
            options:[            
                      {
                        value:4,
                        label:'男性-管理员',
                        English:'M_Administrator',
                        classify:'people',
                        tall:'1.72'
                      },
                      {
                        value:5,
                        label:'男性-工程师',
                        English:'M_Engineer',
                        classify:'people',
                        tall:'1.72'
                      },
                      {
                        value:6,
                        label:'男性-工人',
                        English:'M_Worker',
                        classify:'people',
                        tall:'1.72'
                      },
                      {
                        value:7,
                        label:'男性-小孩',
                        English:'M_Child',
                        classify:'people',
                        tall:'1.2'
                      },                                                                      
                      {
                        value:8,
                        label:'女性-管理员',
                        English:'W_Administrator',
                        classify:'people',
                        tall:'1.65'
                      },
                       {
                        value:9,
                        label:'女性-工程师',
                        English:'W_Engineer',
                        classify:'people',
                        tall:'1.65'
                      },
                      {
                        value:10,
                        label:'女性-工人',
                        English:'W_Worker',
                        classify:'people',
                        tall:'1.65'
                      },
                      {
                        value:11,
                        label:'女性-小孩',
                        English:'W_Child',
                        classify:'people',
                        tall:'1.2'
                      },
                      {
                        value:12,
                        label:'车辆-轮椅',
                        English:'V_WheelChair',
                        classify:'people',
                        tall:'1.0'
                      },
                      {
                        value:13,
                        label:'车辆-轿车',
                        English:'V_Car',
                        classify:'cars',
                        tall:'1.6'
                      },
                      {
                        value:14,
                        label:'车辆-消防车',
                        English:'V_Fire',
                        classify:'cars',
                        tall:'3.0'
                      },
                       {
                        value:15,
                        label:'车辆-救护车',
                        English:'V_Ambulance',
                        classify:'cars',
                        tall:'2.6'
                      },
                       {
                        value:16,
                        label:'车辆-公交车',
                        English:'V_Bus',
                        classify:'cars',
                        tall:'3.0'
                      },
                       {
                        value:17,
                        label:'车辆-卡车',
                        English:'V_Truck',
                        classify:'cars',
                        tall:'2.6'
                      },                   
            ],
            defaultProps: {
                children: "children",
                label: "name",
            },
            checkTest:false, // 碰撞检测
            words:['高度','开启碰撞检测','放置对象','速度'],
            speedValue:2,  // 速度
            checkListBottom:['viewCurb'], //底部的两个选框
            checkBottomWords:[{
                name: "导航地图",
                value: 1,
            },{
                name: "viewCurb",
                value: 2,
            }],
            params:{
                taskid:'',
                action:'switchViewMode',
                viewMode:'2',
                projectionMode:'1',
                enableGravity:'true', // 重力
                enableAllCollision:'true', // 碰撞
                speedLevel:'',  // 速度
                characterHeight:'',  // 视角高度
                dollName:'', // 人物/车辆名
                dollHeight:'' // 对象高度cm
            }
        }
    },
    created(){
        console.log('idid',this.taskId);
    },
    mounted(){
    },
    watch:{
        radio:{
            handler(val,oldVal){
                if(val === undefined){
                    this.radio = oldVal
                }
            },
            immediate:true
        }
    },
    methods:{
        requestFun(){
            MODELAPI.UPDATEORDER(this.params).then((res)=>{
                if(res.data.code === 0){
                    this.$message.success(res.data.message);
                }else{
                    this.$message.error(res.data.message);
                }
            }).catch(()=>{})
        },
        // 单选框的radio的值变化时触发
        changeRadio(val){
            console.log('999',this.taskId,val);
            this.params.taskid = this.taskId;
            // 第一人称
            if(val === 1){
                // 默认开启 重力 和 碰撞
                this.checkWeight = true;
                this.checkBroken = true;
                this.params.viewMode = val;
                this.params.characterHeight = document.querySelector('.oneHeight').value * 100;
                this.params.speedLevel = this.speedValue;
                this.requestFun();
            }
            // 跟随对象模式
            if(val === 3){
                // 默认开启碰撞
                this.checkTest = true;
                let targetIn =  this.options.find((item)=>{
                  return item.value === this.value;
                })
                this.params.dollName === targetIn.English;
                this.params.dollHeight === document.querySelector('.twoHeight').value * 100;
                this.params.speedLevel = this.speedValue;
            }
        },
        // 第一人称中的多选
        weight(val){
            if(val === true){
                this.checkBroken = true;
            }else{
                this.checkBroken = false;
            }
            this.params.enableGravity = val;
            this.params.enableAllCollision= this.checkBroken;
            this.requestFun();
        },
        broke(value){
             this.params.enableAllCollision = value;
             this.requestFun();
        },
        // 第一人称中的高度
        adjustHeight(){
            this.params.characterHeight = document.querySelector('.oneHeight').value * 100;
            this.requestFun();
        },
        // 第三人称
        threeBroke(val){
             console.log('threeBroke',val);
        },
        // 跟随对象模式
        // 下拉选框变化时触发
        changeSelect(val){
            console.log('fff',val);
           let selectIn =  this.options.find((item)=>{
               return item.value === val
            })
            if(selectIn.classify === 'people'){
                this.speedValue = 2
            }else{
                this.speedValue = 4
            }
            document.querySelector('.twoHeight').value = selectIn.tall;
        },
        // 速度
        speedChange(val){
            this.params.speedLevel = val;
            this.requestFun();
        },
        // 底部多选框
        changeBottom(){
            // 地图
            if(this.checkListBottom.includes(this.checkBottomWords[0].name)){
                 this.$emit("listenTodo", {
                    state: 1,
                    type: 5,
                });
            }else{
               this.$emit("listenTodo", {
                    state: 0,
                    type: 5,
                });
            }
            // viewCube
             if(this.checkListBottom.includes(this.checkBottomWords[1].name)){
                 this.$emit("listenTodo", {
                    name: 'viewCube',
                    flag: true,
                });
            }else{
               this.$emit("listenTodo", {
                    name: 'viewCube',
                    flag: false,
                });
            }
        }
    }
}
</script>

<style lang="less" scoped>
// 下拉框内部样式
//  ::v-deep .el-select-dropdown .el-scrollbar{
//     height: 200px !important;
//  }           
.roam_navigate {
  position: absolute;
  z-index: 9;
  height: 450px;
  top: 0;
  width: 400px;
  color: white;
  margin: 2vh 0 0 20px;
  border-radius: 10px;
  background-color: rgba(17,17,17,0.88);
  .romaHead{
    width: 400px;
    height: 54px;
    font-size: 16px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px rgb(79, 79, 79) solid;
    .title{
      margin-left: 16px;
    }
    .closeIcon{
      margin-right: 16px;
    }
  }
  // 中间
  .middle{
    padding: 16px 23px 0 23px;
    .singleSelect{
        display: flex;
        flex-direction: column;
       ::v-deep .needNone .el-radio__input{
            display: none;
        }
        .needBlock{
            color: #fff;
            margin-bottom: 16px;
        }
        ::v-deep .selfView .el-radio__label{
            display: flex;
            flex-direction: row;
            justify-content: space-around;
            margin-bottom: 16px;
            .turnHeight input{
                width: 60px;
                height: 17px;
                margin-left: 9px;
            }
             .turnHeight span:first-of-type{
                    margin-left: 10px;
                }
            .firstSelect{
                margin: 0 6px 0 16px;
            }
        }
        .followView {
            .upTwo {
                display: flex;
                justify-content: space-around;
                margin: -12px 0 14px 0;
                ::v-deep .el-select .el-input .el-input__inner{
                    height: 22px !important;
                    width: 160px;
                }
                .turnHeight input{
                    width: 60px;
                    height: 17px;
                    margin-left: 9px;
                }
            }
            ::v-deep .startTest .el-checkbox{
                    margin: 0 0 14px 20px;
                }
            .putDown{
                margin-left: 120px;
            }
            .show-speed{
                margin-bottom: 10px;
            }
        }
    }
  }
  .bottom{
    height: 50px;
    width: 90%;
    margin: 0 auto;
    padding-top: 20px;
    border-top: 1px rgb(79, 79, 79) solid;
  }
}
</style>