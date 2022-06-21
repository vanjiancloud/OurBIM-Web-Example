<template>
    <div class="roam_navigate" v-show="true">
        <div class="romaHead">
            <span class="title">漫游导航</span>
            <span class="el-icon-close closeIcon"></span>
        </div>
        <div class="middle">
            <el-radio-group v-model="radio" class="singleSelect">
                <el-radio :label="2" class="needBlock"><span class="viewModel">{{personView[0].name}}</span></el-radio>
                <el-radio :label="1" class="needBlock"><span class="viewModel">{{personView[1].name}}</span></el-radio>
                <el-radio class="needNone selfView">
                    <div>
                        <el-checkbox-group v-model="checkList">
                            <el-checkbox :disabled="radio===1 ? false : true" :label="checkListArr[0].name" class="firstSelect"></el-checkbox>
                            <el-checkbox :disabled="radio===1 ? false : true" :label="checkListArr[1].name"></el-checkbox>
                        </el-checkbox-group>
                    </div>
                    <div class="turnHeight">
                        <span>{{words[0]}}</span>
                        <input type="number"  placeholder="m" :disabled="radio===1 ? false : true">
                    </div>
                </el-radio>
                <el-radio :label="3" class="needBlock"><span class="viewModel">{{personView[2].name}}</span></el-radio>
                <el-radio class="needNone followView">
                    <div class="upTwo">
                        <el-select :disabled="radio===3 ? false : true" v-model="value" placeholder="请选择对象" size="mini">
                            <el-option
                                v-for="item in options"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                            </el-option>
                        </el-select>
                        <div class="turnHeight">
                            <span>{{words[0]}}</span>
                            <input type="number" placeholder="m" :disabled="radio===3 ? false : true">
                        </div>
                    </div>
                    <div class="startTest"><el-checkbox :disabled="radio===3 ? false : true" v-model="checkTest">{{words[1]}}</el-checkbox></div>
                    <div class="putDown"><el-button :disabled="radio===3 ? false : true" type="primary" size="small">{{words[2]}}</el-button></div>
                    <div class="show-speed">
                       <span>{{words[3]}}</span>
                        <el-slider class="speedView"
                            v-model="speedValue"
                            :min="1"
                            :max="8"
                            :disabled = "radio === 2 ? true : false"
                        ></el-slider>
                    </div>
                </el-radio>
            </el-radio-group>
        </div>
        <div class="bottom">
            <el-checkbox-group v-model="checkListBottom">
                <el-checkbox label="导航地图"></el-checkbox>
                <el-checkbox label="ViewCurb"></el-checkbox>
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
            checkList:[], // 重力 碰撞检测
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
            value:'', // 下拉框选中的值
            options:[
                {
                    value: '选项1',
                    label: '黄金糕'
                }, {
                    value: '选项2',
                    label: '双皮奶'
                }
            ],
            checkTest:false, // 碰撞检测
            words:['高度','开启碰撞检测','放置对象','速度'],
            speedValue:2,  // 速度
            checkListBottom:[] //底部的两个选框
        }
    },
    created(){
        
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

    }
}
</script>

<style lang="less" scoped>
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
                width: 70px;
                height: 17px;
                margin-left: 9px;
            }
             .turnHeight span{
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
                    width: 70px;
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