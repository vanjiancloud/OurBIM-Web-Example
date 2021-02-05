<template>
  <div class="box">
    <!-- 头部 -->
    <div class="header">
      <!-- logo -->
      <div class="logo">
        <img src="./logo.png" alt="" class="img" />
      </div>
      <!-- 导航 -->
      <div class="nav">
        <a href="">功能介绍</a>
      </div>
      <div class="nav">
        <a href="">解决方案</a>
      </div>
      <div class="nav">
        <a href="">成功案例</a>
      </div>
      <div class="nav">
        <a href="">产品定价</a>
      </div>
      <div class="nav">
        <a href="">最新咨询</a>
      </div>
      <!-- 下拉菜单 -->
      <div class="nav">
        <el-dropdown>
          <span class="el-dropdown-link">
            开发者<i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item>API文档</el-dropdown-item>
            <el-dropdown-item>示例项目</el-dropdown-item>
            <el-dropdown-item>模型中心</el-dropdown-item>
            <el-dropdown-item>服务中心</el-dropdown-item>
            <el-dropdown-item>更新日志</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
      <!-- 搜索框 -->
      <div class="serach">
        <div class="menu">
          <el-dropdown>
            <span class="el-dropdown-link">
              全部<i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item>全部</el-dropdown-item>
              <el-dropdown-item>资讯</el-dropdown-item>
              <el-dropdown-item>案例</el-dropdown-item>
              <el-dropdown-item>活动</el-dropdown-item>
              <el-dropdown-item>模型</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
        <div class="in">
          <el-input v-model="input" placeholder="请输入搜索内容"> </el-input>
        </div>
      </div>
      <div class="big">
        <span class="span"><i class="el-icon-search"></i></span>
      </div>
      <!-- 登录 -->
      <div class="nav">
        <a href=""><i class="el-icon-s-custom"></i>登录</a>
      </div>
      <!-- 注册 -->
      <div class="nav">
        <a href=""><i class="el-icon-edit"></i>注册</a>
      </div>
      <!-- 国际化 -->
      <div class="national">
        <a @click="English" href="javascript:;">EN</a><br />
        <a @click="Chinese" href="javascript:;">中文(CH)</a>
      </div>
    </div>
    <!-- 内容 -->
    <div class="main">
      <!-- 上半部分 -->
      <div class="top">
        <!-- 用户信息展示 -->
        <div class="list">
          <div class="left">
            <div class="touxiang">
              <div class="demo-fit">
                <div class="block">
                  <span class="title"></span>
                  <el-avatar
                    shape="circle"
                    :size="100"
                    :src="url"
                  ></el-avatar>
                </div>
              </div>
              <div class="mark">
                <h3>Mark</h3>
                <span>Mark@ourbim</span>
              </div>
            </div>
            <div class="shuju">
              <div class="hezi">
                <span style="font-weight:bold">{{ $t('occupancy') }}</span
                ><br />
                {{ $t('storage') }}&nbsp;2.4Gb/10Gb <br />
                <span style="font-size: 30px;">78%</span>
                <el-progress :percentage="78"></el-progress>
                <div class="neicun">
                  {{ $t('node') }}
                </div>
              </div>
            </div>
          </div>
          <div class="right">
            <div class="qixian">
              {{ $t('service') }}
              <h2>{{ $t('daty') }}</h2>
              <el-button>{{ $t('Extension') }}</el-button>
            </div>
          </div>
        </div>
        <!-- tab栏 -->
        <div class="tab">
          <el-button plain class="one" @click="isShow = 1">我的应用</el-button>
          <el-button plain @click="isShow = 2">我的发布</el-button>
          <el-button plain @click="isShow = 3">应用管理</el-button>
          <el-button plain @click="isShow = 4">创建应用</el-button>
          <el-button plain @click="isShow = 5">账单管理</el-button>
        </div>
      </div>
      <!-- 中间部分 -->
      <div class="zhongjian"></div>
      <!-- 下半部分 -->
      <div class="bottom">
        <!-- 我的应用 -->
        <div class="content" v-show="isShow == 1">
          <!-- 消息提示 -->
          <div class="record">
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
        <!-- 我的发布 -->
        <div class="content" v-show="isShow == 2">
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
                  全部<i class="el-icon-arrow-down el-icon--right"></i>
                </el-button>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item>全部</el-dropdown-item>
                  <el-dropdown-item>文章</el-dropdown-item>
                  <el-dropdown-item>模型</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </div>
          </div>
          <!-- 列表展示 -->
          <div class="list">
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
        <!-- 应用管理 -->
        <div class="content" v-show="isShow == 3">
          <!-- 消息提示 -->
          <div class="record">
            <!-- 消息提示 -->
            <div class="left">
              您共有3个项目
            </div>
            <!-- 按钮 -->
            <div class="right">
              <el-button type="primary">添加团队链接</el-button>
            </div>
          </div>
          <!-- 表格 -->
          <div class="table">
            <el-table
              :data="tableData"
              :border="true"
              style="width:100%;"
              :header-cell-style="{ textAlign: 'center' }"
              :cell-style="{ textAlign: 'center' }"
            >
              <el-table-column prop="ID" label="">应用ID</el-table-column>
              <el-table-column prop="name" label="应用名称"> </el-table-column>
              <el-table-column prop="data" label="最大并发数量">
              </el-table-column>
              <el-table-column prop="state" label="状态"> </el-table-column
              ><el-table-column prop="date" label="上传日期"> </el-table-column
              ><el-table-column prop="handle" label="操作">
                <div class="link">
                  <a href="">分享</a>
                  <a href="">编辑</a>
                  <a href="" style="color:#E0001B">删除</a>
                </div>
              </el-table-column>
            </el-table>
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
        <!-- 创建应用 -->
        <div class="content" v-show="isShow == 4">
          <!-- 消息提示 -->
          <div class="message">
            您还可上传2个项目
          </div>
          <div class="btn">
            <el-button type="primary">下一步</el-button>
          </div>
        </div>
        <!-- 账单管理 -->
        <div class="content" v-show="isShow == 5">
          <el-tabs type="border-card" tab-position="left">
            <el-tab-pane label="用户管理">
              <div class="demo">
                用户管理
              </div>
              <span slot="label"><i class="el-icon-date"></i> 我的行程</span>
            </el-tab-pane>
            <el-tab-pane label="配置管理">配置管理</el-tab-pane>
            <el-tab-pane label="角色管理">角色管理</el-tab-pane>
            <el-tab-pane label="定时任务补偿">定时任务补偿</el-tab-pane>
          </el-tabs>
          <!-- dwadwdddw -->
          <!-- 垂直菜单 -->
          <el-menu
            class="el-menu-demo"
            mode="horizontal"

          >
            <el-submenu index="2">
              <template slot="title">我的工作台</template>
              <el-menu-item index="2-1">选项1</el-menu-item>
              <el-menu-item index="2-2">选项2</el-menu-item>
              <el-menu-item index="2-3">选项3</el-menu-item>
            </el-submenu>
          </el-menu>
        </div>
      </div>
    </div>
    <!-- 尾部 -->
    <div class="footer">
      <div class="url">
        Copyright © 2021 www.OurBIM.com, All Rights Reserved.
      </div>
      <div class="mobile">{{ $t('servicehotline') }}<br />022-8633-0370</div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      input: '',
      isShow: 1,
      url:
        'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg',
      tableData: [
        {
          ID: 'ID43321432',
          name: '钱龙广场1.0',
          data: '5',
          state: '转换完成',
          date: '2021-01-01 12：34'
        },
        {
          ID: 'ID43321432',
          name: '钱龙广场1.0',
          data: '5',
          state: '转换完成',
          date: '2021-01-01 12：34'
        },
        {
          ID: 'ID43321432',
          name: '钱龙广场1.0',
          data: '5',
          state: '转换完成',
          date: '2021-01-01 12：34'
        },
        {
          ID: 'ID43321432',
          name: '钱龙广场1.0',
          data: '5',
          state: '转换完成',
          date: '2021-01-01 12：34'
        },
        {
          ID: 'ID43321432',
          name: '钱龙广场1.0',
          data: '5',
          state: '转换完成',
          date: '2021-01-01 12：34'
        }
      ]
    }
  },
  methods: {
    handleCommand (command) {
      this.$message('click on item ' + command)
    },
    English () {
      this.$i18n.locale = 'en'
    },
    Chinese () {
      this.$i18n.locale = 'zh'
    },
    handleClick () {
      alert('button click')
    },
    // 分页
    handleCurrentChange () {
    }
  }
}
</script>
<style>
* {
  margin: 0;
  padding: 0;
}
</style>
<style lang="less" scoped>
.box {
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
  .header {
    width: 100%;
    height: 100px;
    background-color: #fff;
    .logo {
      width: 240px;
      float: left;
      margin: 0 25px;
      .img {
        width: 100%;
        height: 100%;
      }
    }
    .nav {
      height: 97px;
      float: left;
      padding: 0 15px;
      display: flex;
      align-items: center;
      a {
        text-decoration: none;
        font-size: 16px;
        color: #000;
      }
      a:hover {
        color: #409eff;
      }
      .el-dropdown-link {
        cursor: pointer;
        color: #000;
        font-size: 16px;
      }
      .el-icon-arrow-down {
        font-size: 16px;
      }
    }
    .nav:hover {
      border-top: 3px solid skyblue;
    }
    .serach {
      height: 100px;
      float: left;
      .menu {
        height: 100px;
        line-height: 100px;
        float: left;
        .el-dropdown-link {
          cursor: pointer;
          color: #000;
          font-size: 16px;
        }
        .el-icon-arrow-down {
          font-size: 16px;
        }
      }
      .in {
        height: 100px;
        float: left;
        line-height: 100px;
      }
    }
    .big {
      height: 100px;
      float: left;
      font-size: 26px;
      line-height: 100px;
    }
    .span:hover {
      color: #409eff;
    }
    .national {
      padding-top: 25px;
      a:hover {
        color: #409eff;
      }
    }
  }
  .main {
    width: 1300px;
    margin-top: 25px;
    margin-left: 60px;
    margin-right: 180px;
    margin-bottom: 25px;
    background-color: #f9f9f9;
    .top {
      width: 100%;
      .list {
        width: 100%;
        height: 180px;
        background-color: #fff;
        display: flex;
        .left {
          flex: 1;
          display: flex;
          .touxiang {
            flex: 1;
            display: flex;
            justify-content: center;
            align-items: center;
            .demo-fit {
              margin-right: 20px;
            }
            // .mark {

            // }
          }
          .shuju {
            flex: 1;
            .hezi {
              width: 340px;
              height: 147px;
              border: solid 1px #f0f2f5;
              margin: 5px 0;
              padding: 10px 20px;
              .neicun {
                width: 100%;
                height: 44px;
                margin-top: 15px;
                border-top: 1px solid #f0f2f5;
                line-height: 44px;
              }
            }
          }
        }
        .right {
          flex: 1;
          padding-top: 10px;
          .qixian {
            width: 350px;
            height: 160px;
            margin: 0 auto;
            margin-left: 200px;
            text-align: center;
            font-size: 16px;
            border-left: solid 1px #f0f2f5;
            border-right: solid 1px #f0f2f5;
          }
        }
      }
      .tab {
        width: 100%;
        height: 70px;
        background-color: #f9f9f9;
        padding-top: 25px;
        button {
          margin-right: 75px;
          font-size: 16px;
          font-weight: bold;
          border: none;
          background-color: transparent;
        }
        .one {
          margin-left: 60px;
        }
      }
    }
    .zhongjian {
      width: 100%;
      height: 25px;
      background-color: #f0f2f5;
    }
    .bottom {
      width: 100%;
      // height: 500px;
      .content {
        width: 100%;
        // margin-left: 60px;
        .record {
          width: 100%;
          height: 40px;
          position: relative;
          margin-top: -20px;

          .left {
            height: 40px;
          }
          .right {
            position: absolute;
            right: 20px;
            top: 0px;
          }
        }
        .list {
          width: 1300px;
          height: 840px;
          margin-top: 5px;
          li {
            width: 300px;
            height: 400px;
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
        .message {
          margin-top: -20px;
        }
        .btn {
          width: 100px;
          margin: 0 auto;
        }
        .table {
          width: 100%;
          margin-top: 5px;
          margin-bottom: 50px;
          .link {
            padding-left: 25px;
            a {
              margin-right: 28px;
              color: #02a7f0;
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
  .footer {
    width: 100%;
    height: 150px;
    background-color: #fff;
    .url {
      float: left;
      width: 600px;
      height: 50px;
      color: #cccccc;
      margin-top: 85px;
      margin-left: 250px;
    }
    .mobile {
      float: right;
      width: 300px;
      height: 50px;
      margin-top: 58px;
      margin-right: 50px;
    }
  }
}
</style>
