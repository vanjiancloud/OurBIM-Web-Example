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
              prefix-icon="el-icon-search"
            ></el-input>
            <div class="threeLogo">
                <span v-for="(item,index) in topLogos" :key="index">
                  <img :src="item.img" alt="">
                </span>
            </div>
        </div>
        <div class="pictures">
            <div class="picBox">
                <div class="boxPhoto">
                    <!-- <img :src="require(assets/images/view/view1.png)" alt=""> -->
                </div>
                <div class="picInfo">
                    <!-- <span>view-2022/06/29</span>
                    <span>11:28:34</span> -->
                </div>
            </div>
        </div>
    </div>
</template>

<script>
  export default {
        data() {
            return {
              input: '',
              topLogos: [
                {
                    name: "更新视图",
                    value: 0,
                    img: require("@/assets/images/view/view1.png"),
                },
                {
                    name: "导出截图",
                    value: 1,
                    img: require("@/assets/images/view/view2.png"),
                },
                {
                    name: "创建视图",
                    value: 2,
                    img: require("@/assets/images/view/view3.png"),
                },
              ],
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
    ::v-deep .el-input__icon{
        font-size: 20px;
         color: #fff;
        line-height: 30px !important;
        margin-left: 8px;
        cursor: pointer;
    }
    .threeLogo{
        display: flex;
        justify-content: space-between;
        width: 120px;
        height: 24px;
        span{
            width: 24px;
            height: 24px;
            cursor: pointer;
            img{
                width: 100%;
                height: 100%;
            }
        }
    }
  }
}
//  .pictures{
//     height: 484px;
//     width: 100%;
//     padding-left: 16px;
//      .picBox{
//         width: 120px;
//         height: 138px;
//         margin: 16px 10px 0 0;
//         .boxPhoto{
//             width: 120px;
//             height: 96px;
//             img{
//                 width: 100%;
//                 height: 100%;
//             }
//         }
//         .picInfo{
//             height: 34px;
//             width: 120px;
//             display: flex;
//             flex-direction: column;
//             align-items: center;
//         }
//     }
//   }
</style>
