<template>
    <div class="view_photo" v-if="true">
        <div class="romaHead">
            <span class="title">视图列表</span>
            <span class="el-icon-close closeIcon"></span>
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
                      <i class="iconfont icon-a-gengxinshitu3" :style="{'font-size':'24px' }"></i>
                    </el-tooltip>
                </span>
                <span>
                    <el-tooltip class="item" effect="light" content="创建视图" placement="top">
                      <i class="iconfont icon-a-gengxinshitu2" :style="{'font-size':'23px' }"></i>
                    </el-tooltip>
                </span>
                <span>
                    <el-tooltip class="item" effect="light" content="导出截图" placement="top">
                      <i class="iconfont icon-a-gengxinshitu1" :style="{'font-size':'22px' }"></i>
                    </el-tooltip>
                </span>
            </div>
        </div>
        <div class="pictures">
            <div class="picBox"  v-for="(item,index) in 15" :key="index">
                <div class="boxPhoto" :class="{'borderWhite': index === active}" @click="selected(index)">
                    <img :src="require('@/assets/logo.png')" alt="">
                    <div class="bottom" :style="{'display':index === active ? 'block' : 'none'}">
                        <img :src="require('@/assets/images/view/view4.png')" alt="">
                        <img :src="require('@/assets/images/view/view5.png')" alt="">
                    </div>
                    <i class="el-icon-close err" :style="{'display':index === active ? 'block' : 'none'}"></i>
                </div>
                <div class="picInfo">
                    <span>view-2022/06/29</span>
                    <span>11:28:34</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
  export default {
        data() {
            return {
              input:'',  // 搜索绑定
              active:-1,
              num:0,    // 是否重复点击图片
          }
        },
        created(){
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
        methods:{
            // 点击选中
            selected(ind){
                if(this.active === ind){
                    this.num+=1;
                    if(this.num%2 === 1){
                        this.active = -1;   
                    }
                }else{
                    this.num = 0;
                    this.active = ind;                  
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
            margin-top: 8px;
            display: flex;
            flex-direction: column;
            align-items: center;
            span{
                font-size: 12px;
            }
        }
    }
  }
  .borderWhite{
    border: 1px solid red;
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

</style>
