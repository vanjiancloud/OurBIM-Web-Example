<template>
  <!-- 我的发布 -->
  <div class="box">
    <!-- 头部 -->
    <my-header></my-header>
    <!-- 中间 -->
    <my-main></my-main>
    <!-- 主体内容 -->
    <div class="container">
      <div class="content">
        <!-- 消息提示和选择器 -->
        <div class="record">
          <!-- 消息提示 -->
          <div class="left">
            您共发布了123组作品
          </div>
          <!-- 选择器 -->
          <div class="right">
            <el-dropdown>
              <el-button plain>
                {{ $t('wholes')
                }}<i class="el-icon-arrow-down el-icon--right"></i>
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item>{{ $t('wholes') }}</el-dropdown-item>
                <el-dropdown-item>{{ $t('article') }}</el-dropdown-item>
                <el-dropdown-item>{{ $t('Models') }}</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
        </div>
        <!-- 列表和分页 -->
        <div class="list">
          <div class="lis">
            <ul style="padding: 0;margin: 0;">
              <li>
                <div class="img">
                  <img src="./banner.jpg" alt="" class="tupian" />
                </div>
                <div class="write">
                  <div class="one">
                    <div class="touxiang">
                      <img src="./touxiang.png" alt="" />
                    </div>
                    <div class="zi">
                      <h5>Mark</h5>
                      2021-02-08
                      </div>
                  </div>
                  <h3>测试模型 .skp</h3>
                  <div class="two">
                    <img src="./down.png" alt="">
                    1234
                  </div>
                </div>
              </li>

            </ul>
          </div>
          <!-- 分页 -->
          <div class="page">
            <el-pagination
              @current-change="handleCurrentChange"
              layout="prev, pager, next"
              background
              :total="400"
            >
            </el-pagination>
          </div>
        </div>
      </div>
    </div>
    <!-- 尾部 -->
    <my-footer></my-footer>
  </div>
</template>

<script>
import MyFooter from '../components/myFooter.vue'
import myHeader from '../components/myHeader.vue'
import MyMain from '../components/myMain.vue'
export default {
  components: { myHeader, MyMain, MyFooter },
  name: "issue",
  methods: {
    handleCurrentChange () {}
  }
}
</script>

<style lang="less" scoped>
.box {
  .container {
    background-color: #fff;
    margin-bottom: 100px;
    .content {
      margin-left: 41px;
      overflow: hidden;
      height: 961px;
      .record {
        width: 100%;
        height: 40px;
        margin-top: 38px;
        position: relative;
        .left {
          height: 40px;
        }
        .right {
          position: absolute;
          right: 50px;
          top: -20px;
        }
      }
      .list {
        .lis {
          width: 1379px;
          overflow: hidden;
          li {
            width: 310px;
            height: 345px;
            margin-right: 30px;
            margin-bottom: 34px;
            float: left;
            list-style: none;
            box-sizing: border-box;
            overflow: hidden;
            .img {
              width: 310px;
              height: 200px;
              .tupian {
                width: 100%;
                height: 100%;
              }
            }
            .write {
              width: 310px;
              height: 145px;
              background-color: #f1f1f1;
              position: relative;
              padding-top: 18px;
              padding-left: 21px;
              .one {
                margin-bottom: 18px;
                .touxiang {
                  width: 50px;
                  height: 50px;
                  float: left;
                  margin-right: 10px;
                  img {
                    width: 100%;
                    height: 100%;
                    border-radius: 50%;
                  }
                }
              }
              .two {
                position: absolute;
                right: 40px;
                bottom: 30px;

              }
            }
          }
        }
      }
    }
    .page {
      width: 550px;
      margin: 0 auto;
      margin-bottom: 40px;
    }
  }
}
</style>
