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
        <a href="">{{ $t('introduction') }}</a>
      </div>
      <div class="nav">
        <a href="">{{ $t('Solution') }}</a>
      </div>
      <div class="nav">
        <a href="">{{ $t('cases') }}</a>
      </div>
      <div class="nav">
        <a href="">{{ $t('Pricing') }}</a>
      </div>
      <div class="nav">
        <a href="">{{ $t('consultation') }}</a>
      </div>
      <!-- 下拉菜单 -->
      <div class="nav">
        <el-dropdown>
          <span class="el-dropdown-link">
            {{ $t('consultation')
            }}<i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item>{{ $t('APIdov') }}</el-dropdown-item>
            <el-dropdown-item>{{ $t('project') }}</el-dropdown-item>
            <el-dropdown-item>{{ $t('Mcenter') }}</el-dropdown-item>
            <el-dropdown-item>{{ $t('Service') }}</el-dropdown-item>
            <el-dropdown-item>{{ $t('log') }}</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
      <!-- 搜索框 -->
      <transition>
        <div class="serach" v-show="islive">
          <div class="menu">
            <el-dropdown @command="checkitem">
              <span class="el-dropdown-link">
                {{ classify }}<i class="el-icon-arrow-down el-icon--right"></i>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item :command="$t('whole')">{{
                  $t('whole')
                }}</el-dropdown-item>
                <el-dropdown-item :command="$t('info')">{{
                  $t('info')
                }}</el-dropdown-item>
                <el-dropdown-item :command="$t('case')">{{
                  $t('case')
                }}</el-dropdown-item>
                <el-dropdown-item :command="$t('activity')">{{
                  $t('activity')
                }}</el-dropdown-item>
                <el-dropdown-item :command="$t('Model')">{{
                  $t('Model')
                }}</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
          <div class="in">
            <el-input v-model="input" placeholder="请输入搜索内容"> </el-input>
          </div>
        </div>
      </transition>
      <div class="big" :class="{ leftMar: !islive }">
        <span @click="toshow" class="span"><i class="el-icon-search"></i></span>
      </div>
      <!-- 登录 -->
      <div class="nav">
        <a href=""><i class="el-icon-s-custom"></i>{{ $t('register') }}</a>
      </div>
      <!-- 注册 -->
      <div class="nav">
        <a href=""><i class="el-icon-edit"></i>{{ $t('login') }}</a>
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
                  <el-avatar shape="circle" :size="100" :src="url"></el-avatar>
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
          <el-button plain class="one" @click="isShow = 1">{{
            $t('app')
          }}</el-button>
          <el-button plain @click="isShow = 2">{{ $t('release') }}</el-button>
          <el-button plain @click="isShow = 3">{{
            $t('management')
          }}</el-button>
          <el-button plain @click="isShow = 4">{{ $t('Create') }}</el-button>
          <el-button plain @click="isShow = 5">{{ $t('Account') }}</el-button>
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
              <el-button type="primary">{{ $t('link') }}</el-button>
            </div>
          </div>
          <!-- 表格 -->
          <table>
            <tr>
              <th>应用ID</th>
              <th>应用名称</th>
              <th>最大并发数量</th>
              <th>状态</th>
              <th>上传日期</th>
              <th>操作</th>
            </tr>
            <tr>
              <td>ID43321432</td>
              <td>钱龙广场1.0</td>
              <td>5</td>
              <td>转换完成</td>
              <td>2021-01-0112：34</td>
              <td>
                <button>分享</button>
                <button>编辑</button>
                <button>删除</button>
              </td>
            </tr>
            <tr>
              <td>ID43321432</td>
              <td>钱龙广场1.0</td>
              <td>5</td>
              <td>转换完成</td>
              <td>2021-01-0112：34</td>
              <td>
                <button>分享</button>
                <button>编辑</button>
                <button>删除</button>
              </td>
            </tr>
            <tr>
              <td>ID43321432</td>
              <td>钱龙广场1.0</td>
              <td>5</td>
              <td>转换完成</td>
              <td>2021-01-0112：34</td>
              <td>
                <button>分享</button>
                <button>编辑</button>
                <button>删除</button>
              </td>
            </tr>
          </table>
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
          您还可上传2个项目
          <div class="btn">
            <el-button type="primary">下一步</el-button>
          </div>
        </div>
        <!-- 账单管理 -->
        <div class="content" v-show="isShow == 5">
          <!-- 下拉菜单 -->
          <div class="dropdown">
            <div>
              <button><i icon="el-icon-postcard"></i> 账户管理</button>
            </div>
            <div>
              <button @click="isHand = 6">个人信息</button>
            </div>
            <div>
              <button @click="isHand = 7">授权码</button>
            </div>
            <div>
              <button @click="isHand = 8">服务订单</button>
            </div>
            <div>
              <button @click="isHand = 9">团队</button>
            </div>
            <div>
              <button @click="isHand = 10">修改密码</button>
            </div>
          </div>
          <!-- 个人信息 -->
          <div class="neirong" v-show="isHand == 6">
            <div class="geren">
              个人信息：
            </div>
            <table>
              <tr>
                <td>ID</td>
                <td>Mark</td>
              </tr>
              <tr>
                <td>签名</td>
                <td>Mark@OurBIM</td>
              </tr>
              <tr>
                <td>邮箱</td>
                <td>vanjian@ourbim.com</td>
              </tr>
              <tr>
                <td>手机号</td>
                <td>13333333333</td>
              </tr>
              <tr>
                <td>公司</td>
                <td>万间科技</td>
              </tr>
              <tr>
                <td>职位</td>
                <td>产品</td>
              </tr>
            </table>
            <div class="xia">
              <el-button type="primary">主要按钮</el-button>
            </div>
          </div>
          <!-- 授权码 -->
          <div class="neirong" v-show="isHand == 7">
            授权码：

            <el-input v-model="input" placeholder="请输入内容"></el-input>
            <el-button type="primary">主要按钮</el-button>
          </div>
          <!-- 服务订单 -->
          <div class="neirong" v-show="isHand == 8">
            <table class="dingdan">
              <tr>
                <th>编号</th>
                <th>时间</th>
                <th>服务</th>
                <th>授权码</th>
                <th>状态</th>
                <th>金额</th>
              </tr>
              <tr>
                <td>20210101123456123</td>
                <td>2021-01-01 12:34:56</td>
                <td>高级开发版</td>
                <td>高级开发版</td>
                <td>失效</td>
                <td>50,000.00</td>
              </tr>
              <tr>
                <td>20210101123456123</td>
                <td>2021-01-01 12:34:56</td>
                <td>高级开发版</td>
                <td>高级开发版</td>
                <td>失效</td>
                <td>50,000.00</td>
              </tr>
              <tr>
                <td>20210101123456123</td>
                <td>2021-01-01 12:34:56</td>
                <td>高级开发版</td>
                <td>高级开发版</td>
                <td>失效</td>
                <td>50,000.00</td>
              </tr>
              <tr>
                <td>20210101123456123</td>
                <td>2021-01-01 12:34:56</td>
                <td>高级开发版</td>
                <td>高级开发版</td>
                <td>失效</td>
                <td>50,000.00</td>
              </tr>
            </table>
          </div>
          <!-- 团队 -->
          <div class="neirong" v-show="isHand == 9">
            <el-table
              :data="tableData"
              style="width: 100%"
              row-key="id"
              border
              :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
            >
              <el-table-column prop="use" label="应用" width="180">
              </el-table-column>
              <el-table-column prop="time" label="成立时间" width="180">
              </el-table-column>
              <el-table-column prop="role" label="角色"> </el-table-column>
              <el-table-column prop="handle" label="操作"> </el-table-column>
            </el-table>
          </div>
          <!-- 修改密码 -->
          <div class="neirong" v-show="isHand == 10">
            <div class="geren">
              修改密码：
            </div>
            <table>
              <tr>
                <td>原密码</td>
                <td>请输入</td>
              </tr>
              <tr>
                <td>新密码</td>
                <td>请输入</td>
              </tr>
              <tr>
                <td>确认密码</td>
                <td>请输入</td>
              </tr>
              <tr>
                <td>手机号</td>
                <td>请输入</td>
              </tr>
              <tr>
                <td>验证码</td>
                <td>请输入</td>
              </tr>
            </table>
          </div>
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
      islive: false,
      input: '',
      isShow: 1,
      classify: '全部',
      isHand: 6,
      url:
        'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg',
      tableData: [
        {
          id: '1',
          use: '钱龙房产',
          time: '2021-01-01 12:34:56',
          children: [
            {
              id: 11,
              handle: 'lalal',
              role: '王小虎',
              address: '上海市普陀区金沙江路 1519 弄'
            },
            {
              id: 12,
              handle: '66666666',
              role: '虎',
              address: '上海市普陀区金沙江路 1519 弄'
            }
          ]
        },
        {
          id: '2',
          use: '钱龙',
          time: '2021-01-01 12:34:56',
          children: [
            {
              id: 21,
              date: '2016-05-01',
              name: '王小虎',
              address: '上海市普陀区金沙江路 1519 弄'
            },
            {
              id: 22,
              date: '2016-05-01',
              name: '王小虎',
              address: '上海市普陀区金沙江路 1519 弄'
            }
          ]
        }
      ]
    }
  },
  methods: {
    checkitem (item) {
      this.classify = item
    },
    English () {
      this.$i18n.locale = 'en'
      this.classify = 'whole'
    },
    Chinese () {
      this.$i18n.locale = 'zh'
      this.classify = '全部'
    },
    handleClick () {
      alert('button click')
    },
    // 分页
    handleCurrentChange () {},
    toshow () {
      this.islive = !this.islive
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
      position: relative;
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
    .leftMar {
      margin-left: 256px;
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
    background-color: #f0f2f5;
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
        overflow: hidden;
        .record {
          width: 100%;
          height: 40px;
          position: relative;
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
        .btn {
          width: 100px;
          margin: 0 auto;
        }
        table {
          width: 100%;
          margin-top: 5px;
          margin-bottom: 50px;
          border-collapse: collapse;
          font-size: 16px;
          tr {
            height: 50px;
          }
          th {
            background-color: #fafafa;
          }
          td {
            background-color: #fff;
          }
        }
        table,
        th,
        td {
          border: 1px solid black;
          text-align: center;
        }
        .dropdown {
          width: 200px;
          height: 300px;
          float: left;
          margin-right: 100px;
          div {
            width: 100%;
            height: 50px;
            border-bottom: 1px solid #f2f2f2;
            line-height: 50px;

            margin-right: 50px;
            button:focus {
              background-color: #fff;
            }
            button {
              padding-left: 50px;
              height: 100%;
              width: 100%;
              border: none;
              outline: none;
              font-size: 16px;
              text-align: left;
              background-color: #f9f9f9;
            }
            button:hover {
              color: #41b19c;
              cursor: pointer;
            }
          }
        }
        .neirong {
          float: left;
          width: 1000px;
          // background-color: orange;
          .geren {
            float: left;
          }
          .xinxi {
            float: left;
          }
          table,
          th,
          td {
            border: 1px solid black;
            text-align: center;
          }
          table {
            width: 400px;
          }
          .el-input {
            width: 400px;
          }
          .dingdan {
            width: 100%;
          }
          .demo-table-expand {
            font-size: 0;
          }
          .demo-table-expand label {
            width: 90px;
            color: #99a9bf;
          }
          .demo-table-expand .el-form-item {
            margin-right: 0;
            margin-bottom: 0;
            width: 50%;
          }
        }
        .xia {
          text-align: center;
          margin-bottom: 100px;
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
