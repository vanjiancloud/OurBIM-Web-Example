<template>
    <div class="roam_navigate" v-show="false">
        <div class="romaHead">
            <span class="title">漫游导航</span>
            <span class="el-icon-close closeIcon"></span>
        </div>
        <div class="middle">
            <el-radio-group v-model="radio" class="singleSelect">
                <el-radio :label="0"><span class="viewModel">{{personView[0].name}}</span></el-radio>
                <el-radio :label="1"><span class="viewModel">{{personView[1].name}}</span></el-radio>
                <el-radio class="needNone">
                    <el-checkbox-group v-model="checkList">
                        <el-checkbox :label="checkListArr[0].name"></el-checkbox>
                        <el-checkbox :label="checkListArr[1].name"></el-checkbox>
                    </el-checkbox-group>
                    <div class="turnHeight">
                        <span>{{words[0]}}</span>
                        <input type="number">
                    </div>
                </el-radio>
                <el-radio :label="2"><span class="viewModel">{{personView[2].name}}</span></el-radio>
                <el-radio class="needNone">
                    <el-select v-model="value" placeholder="请选择">
                        <el-option
                        v-for="item in options"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                        </el-option>
                    </el-select>
                    <div class="turnHeight">
                        <span>{{words[0]}}</span>
                        <input type="number">
                    </div>
                    <el-checkbox v-model="checkTest">{{words[1]}}</el-checkbox>
                    <el-button type="primary">{{words[2]}}</el-button>
                </el-radio>
            </el-radio-group>
        </div>
    </div>
</template>

<script>
export default {
    data(){
        return {
            radio:0, //三种模式默认选中
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
            words:['高度','开启碰撞检测','放置对象']
        }
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
    padding: 16px 0 0 23px;
    .singleSelect{
        display: flex;
        flex-direction: column;
       ::v-deep .needNone .el-radio__input{
            display: none;
        }
    }
  }
}
</style>