<template>
  <div class="box">
    <!-- 头部 -->
    <my-header></my-header>
    <!-- 内容 -->
    <my-main></my-main>
    <!-- 需要写的内容 -->
    <div class="content">
      <!-- 消息提示 -->
      <div class="record">
        <!-- 消息提示 -->
        <div class="left">
          您共有3个应用
        </div>
      </div>
      <!-- 列表展示 -->
      <div class="list">
        <ul style="padding: 0;margin: 0;">
          <li>
            <div class="img">
              <img src="../components/timg.jpg" alt="" class="tupian" />
            </div>
            <div class="write">
              <h3>钱龙广场1.0</h3>
              节点: 0/5
            </div>
            <div class="line"></div>
            <div class="btn">
              <el-button>进入应用</el-button>
            </div>
          </li>
          <li>
            <div class="img">
              <img src="../components/timg.jpg" alt="" class="tupian" />
            </div>
            <div class="write">
              <h3>钱龙广场1.0</h3>
              节点: 0/5
            </div>
            <div class="line"></div>
            <div class="btn">
              <el-button>进入应用</el-button>
            </div>
          </li><li>
            <div class="img">
              <img src="../components/timg.jpg" alt="" class="tupian" />
            </div>
            <div class="write">
              <h3>钱龙广场1.0</h3>
              节点: 0/5
            </div>
            <div class="line"></div>
            <div class="btn">
              <el-button>进入应用</el-button>
            </div>
          </li><li>
            <div class="img">
              <img src="../components/timg.jpg" alt="" class="tupian" />
            </div>
            <div class="write">
              <h3>钱龙广场1.0</h3>
              节点: 0/5
            </div>
            <div class="line"></div>
            <div class="btn">
              <el-button>进入应用</el-button>
            </div>
          </li><li>
            <div class="img">
              <img src="../components/timg.jpg" alt="" class="tupian" />
            </div>
            <div class="write">
              <h3>钱龙广场1.0</h3>
              节点: 0/5
            </div>
            <div class="line"></div>
            <div class="btn">
              <el-button>进入应用</el-button>
            </div>
          </li><li>
            <div class="img">
              <img src="../components/timg.jpg" alt="" class="tupian" />
            </div>
            <div class="write">
              <h3>钱龙广场1.0</h3>
              节点: 0/5
            </div>
            <div class="line"></div>
            <div class="btn">
              <el-button>进入应用</el-button>
            </div>
          </li><li>
            <div class="img">
              <img src="../components/timg.jpg" alt="" class="tupian" />
            </div>
            <div class="write">
              <h3>钱龙广场1.0</h3>
              节点: 0/5
            </div>
            <div class="line"></div>
            <div class="btn">
              <el-button>进入应用</el-button>
            </div>
          </li><li>
            <div class="img">
              <img src="../components/timg.jpg" alt="" class="tupian" />
            </div>
            <div class="write">
              <h3>钱龙广场1.0</h3>
              节点: 0/5
            </div>
            <div class="line"></div>
            <div class="btn">
              <el-button>进入应用</el-button>
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
        background="blue"
        :total="400"
      >
      </el-pagination>
    </div>
    <!-- 尾部 -->
    <my-footer></my-footer>
  </div>
</template>

<script>
import myMain from '../components/my-main.vue'
import myHeader from '../components/my-header.vue'
import MyFooter from '../components/my-footer.vue'

export default {
  components: { myMain, myHeader, MyFooter },
  data () {
    return {}
  },
  methods: {
    handleClick () {
      alert('button click')
    },
    // 分页之当前页
    handleCurrentChange (val) {
      console.log(`当前页: ${val}`)
    }
  }
}
</script>

<style lang="less" scoped>
.box {
  width: 100%;
  height: 100%;
  .content {
    width: 1300px;
    margin-left: 60px;
    .record {
      width: 100%;
      height: 40px;
      position: relative;
      // background-color: red;
      margin-top: -20px;

      .left {
        height: 40px;
      }
    }
    .list {
      width: 1300px;
      height: 840px;
      // background-color: palevioletred;
      margin-top: 5px;
      li {
        width: 300px;
        height: 400px;
        // background-color: green;
        margin-left: 20px;
        margin-bottom: 20px;
        float: left;
        list-style: none;
        box-sizing: border-box;
        overflow: hidden;
        .img {
          width: 300px;
          height: 210px;
          .tupian {
            width: 100%;
            height: 100%;
          }
        }
        .write {
          width: 300px;
          height: 89px;
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
      }
    }
  }
  .page {
    width: 550px;
    margin: 0 auto;
    margin-bottom: 40px;
  }
}
</style>
