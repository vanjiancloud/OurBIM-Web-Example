<template>
  <!-- 我的发布 -->
  <div class="box">
    <!-- 头部 -->
    <my-header></my-header>
    <!-- 中间 -->
    <my-main></my-main>
    <!-- 手写内容 -->
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
        <!-- 列表展示 -->
        <div class="list">
          <div class="lis">
            <ul style="padding: 0;margin: 0;">
              <li>
                <div class="img">
                  <img src="../components/aotu.jpg" alt="" class="tupian" />
                </div>
                <div class="write">
                  <h3>测试模型 .skp</h3>
                  下载次数：1234
                </div>
                <div class="line"></div>
                <div class="photo">
                  <div class="big">
                    <img src="../components/vue.jpg" alt="" class="min" />
                  </div>
                  <span>夺命VUE</span>
                </div>
              </li>
              <li>
                <div class="img">
                  <img src="../components/aotu.jpg" alt="" class="tupian" />
                </div>
                <div class="write">
                  <h3>测试模型 .skp</h3>
                  下载次数：1234
                </div>
                <div class="line"></div>
                <div class="photo">
                  <div class="big">
                    <img src="../components/vue.jpg" alt="" class="min" />
                  </div>
                  <span>夺命VUE</span>
                </div>
              </li>
              <li>
                <div class="img">
                  <img src="../components/aotu.jpg" alt="" class="tupian" />
                </div>
                <div class="write">
                  <h3>测试模型 .skp</h3>
                  下载次数：1234
                </div>
                <div class="line"></div>
                <div class="photo">
                  <div class="big">
                    <img src="../components/vue.jpg" alt="" class="min" />
                  </div>
                  <span>夺命VUE</span>
                </div>
              </li>
              <li>
                <div class="img">
                  <img src="../components/aotu.jpg" alt="" class="tupian" />
                </div>
                <div class="write">
                  <h3>测试模型 .skp</h3>
                  下载次数：1234
                </div>
                <div class="line"></div>
                <div class="photo">
                  <div class="big">
                    <img src="../components/vue.jpg" alt="" class="min" />
                  </div>
                  <span>夺命VUE</span>
                </div>
              </li>
              <li>
                <div class="img">
                  <img src="../components/aotu.jpg" alt="" class="tupian" />
                </div>
                <div class="write">
                  <h3>测试模型 .skp</h3>
                  下载次数：1234
                </div>
                <div class="line"></div>
                <div class="photo">
                  <div class="big">
                    <img src="../components/vue.jpg" alt="" class="min" />
                  </div>
                  <span>夺命VUE</span>
                </div>
              </li>
              <li>
                <div class="img">
                  <img src="../components/aotu.jpg" alt="" class="tupian" />
                </div>
                <div class="write">
                  <h3>测试模型 .skp</h3>
                  下载次数：1234
                </div>
                <div class="line"></div>
                <div class="photo">
                  <div class="big">
                    <img src="../components/vue.jpg" alt="" class="min" />
                  </div>
                  <span>夺命VUE</span>
                </div>
              </li>
              <li>
                <div class="img">
                  <img src="../components/aotu.jpg" alt="" class="tupian" />
                </div>
                <div class="write">
                  <h3>测试模型 .skp</h3>
                  下载次数：1234
                </div>
                <div class="line"></div>
                <div class="photo">
                  <div class="big">
                    <img src="../components/vue.jpg" alt="" class="min" />
                  </div>
                  <span>夺命VUE</span>
                </div>
              </li>
              <li>
                <div class="img">
                  <img src="../components/aotu.jpg" alt="" class="tupian" />
                </div>
                <div class="write">
                  <h3>测试模型 .skp</h3>
                  下载次数：1234
                </div>
                <div class="line"></div>
                <div class="photo">
                  <div class="big">
                    <img src="../components/vue.jpg" alt="" class="min" />
                  </div>
                  <span>夺命VUE</span>
                </div>
              </li>
            </ul>
          </div>
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
    <!-- 尾部 -->
    <my-footer></my-footer>
  </div>
</template>

<script>
import MyFooter from '../components/myFooter.vue'
import myHeader from '../components/myHeader.vue'
import MyMain from '../components/myMain.vue'
export default {
  components: { myHeader, MyMain, MyFooter }
}
</script>

<style lang="less" scoped>
.box {
  .container {
    .content {
      margin-left: 41px;
      overflow: hidden;
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
          height: 668px;
          li {
            width: 310px;
            height: 300px;
            margin-right: 30px;
            margin-bottom: 34px;
            float: left;
            list-style: none;
            box-sizing: border-box;
            overflow: hidden;
            .img {
              width: 315px;
              height: 200px;
              .tupian {
                width: 100%;
                height: 100%;
              }
            }
            .write {
              height: 100px;
              background-color: #fff;
              padding-top: 5px;
              padding-left: 20px;
            }
            .line {
              width: 300px;
              height: 1px;
              background-color: #e4e4e4;
            }
            .btn {
              width: 300px;
              height: 100px;
              background-color: #fff;
              padding-left: 15px;
              line-height: 100px;
            }
            .photo {
              width: 300px;
              height: 100px;
              background-color: #fff;
              padding-left: 15px;
              line-height: 100px;
              .big {
                width: 60px;
                height: 60px;
                border-radius: 50%;
                float: left;
                margin-top: 20px;
                .min {
                  width: 100%;
                  height: 100%;
                }
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
