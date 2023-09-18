<template>
    <el-container class="container">
        <!-- 顶部导航栏 -->
        <el-header>
            <div class="head">
                <div class="headLeft">
                    <a href="http://www.ourbim.com"><img class="logo-index" src="./img/logo.png" alt="" /></a>
                    <el-menu :default-active="$route.path" text-color="#333333" active-text-color="#FF6600" class="nav-menu" mode="horizontal">
                        <template v-for="(item, index) in menuList">
                            <el-menu-item :index="item.url" v-if="!item.children" :key="index">
                                <a :href="item.url" class="aMenu">{{ item.name }}</a>
                            </el-menu-item>
                            <el-submenu v-else :index="item.url" popper-class="popper-class" :key="index + 1">
                                <template slot="title">{{ item.name }}</template>
                                <el-menu-item :index="childItem.url" v-for="(childItem, childIndex) in item.children" :key="childIndex">
                                    <a :href="childItem.url" class="aMenu" :target="childItem.blank ? '_blank' : ''">{{ childItem.name }}</a>
                                </el-menu-item>
                            </el-submenu>
                        </template>
                    </el-menu>
                </div>
                <!--项目中心-->
                <div class="rights">
                    <el-button @click="toManage" type="primary" size="mini" class="headerBtn blueBtn">
                        <svg-icon icon-class="ourbimCloud" style="font-size: 14px;"/>
                        OurBIM Cloud
                    </el-button>
                    <!-- 头像 -->
                    <el-dropdown class="avatar">
                        <img class="avatarImg" :src="user.imgUrl ? user.imgUrl : require('./img/man.png')" alt="" />
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item @click.native="toLogin">{{ $t("quit") }}</el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                    <!--预约演示-->
                    <el-popover placement="bottom" width="auto" trigger="hover" popper-class="order">
                        <div class="orderContent">
                            <div class="orderItem" v-for="(item, index) in orderList" :key="index">
                                <div class="code"><img :src="item.codeImg" alt="" /></div>
                                <div class="address">{{ item.address }}</div>
                                <div class="user">
                                    <div><img src="../Layout/img/user.png" alt="" />{{ item.name }}</div>
                                    <div><img src="../Layout/img/phone.png" alt="" />{{ item.phone }}</div>
                                </div>
                            </div>
                        </div>
                        <el-button slot="reference" type="primary" size="mini" class="headerBtn orangeBtn">
                            <img src="./img/yuyue.png" alt="" />
                            预约演示
                        </el-button>
                    </el-popover>
                </div>
            </div>
        </el-header>
        <!-- 内容区 -->
        <el-main>
            <!-- 头部统计部分 -->
            <el-row :gutter="20" class="statistics" type="flex" style="flex-flow: row wrap;">
                <el-col :md="10" :xs="10" :sm="10" :lg="4" :span="16">
                    <div class="statisticsBox user">
                        <img :src="user.imgUrl || require('./img/man.png')" />
                        <div class="userRight">
                            <span class="name">{{ user.name || user.mobile }}</span>
                            <span class="userID">ID:{{ user.userid }}</span>
                        </div>
                    </div>
                </el-col>
                <el-col :md="14" :xs="14" :sm="14" :lg="8">
                    <div class="statisticsBox server">
                        <div class="statisticsTitle">公有云服务器使用</div>
                        <div class="serverBox">
                            <div class="serverItem">
                                <div class="serverPer">{{ user.spacePer }}%</div>
                                <el-progress :text-inside="true" :stroke-width="16" :percentage="Number(user.spacePer) || 0" :show-text="false" color="#02AAF0"></el-progress>
                                <div class="serverUsed">
                                    <img src="./img/cunchu.png" alt="" />
                                    <span>已用储存 {{ user.currentCountSpace }}GB/{{ user.countSpace }}GB</span>
                                </div>
                            </div>
                            <div class="serverItem">
                                <div class="flexBetween">
                                    <div class="serverPer">{{ user.bfPer }}%</div>
                                    <div class="serverTotal">已用总并发 0/0</div>
                                </div>
                                <div id="erupt"></div>
                                <div class="serverUsed">
                                    <img src="./img/jiedian.png" alt="" />
                                    <span>已用云VR/AR/MR并发 0/0
                                        <p>已用预启动并发 {{ user.currentCountBF }}/{{ user.countBF }}</p>
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </el-col>
                <el-col :md="10" :xs="10" :sm="10" :lg="5">
                    <div class="statisticsBox period">
                        <div class="statisticsTitle">服务有效期</div>
                        <div class="time">{{ user.countStartTime }} 至 {{ user.countendTime }}</div>
                        <el-button type="primary" size="small" class="grayBtn" style="width: 130px;"
                            @click="toOrder">延长有效期</el-button>
                    </div>
                </el-col>
                <el-col :md="14" :xs="14" :sm="14" :lg="7">
                    <div class="statisticsBox account">
                        <div class="statisticsTitle">账户信息</div>
                        <div class="accountBox">
                            <div class="accountItem">
                                <div class="text">账户余额：<span>{{ user.isPay }}</span><span>服务点</span></div>
                                <el-button type="primary" size="small" class="orangeBtn"
                                    style="width: 120px;background-color:#FF7F28">立即充值</el-button>
                            </div>
                            <div class="accountItem">
                                <div class="text">授权码：<span style="color:#00AAF0">0</span><span>个</span></div>
                                <el-button type="primary" size="small" class="grayBtn">查看</el-button>
                                <el-button type="primary" size="small" class="grayBtn">申请授权码</el-button>
                            </div>
                        </div>
                    </div>
                </el-col>
            </el-row>
            <!-- 主体内容区 -->
            <div class="wrap">
                <!-- 导航菜单 -->
                <div class="nav" :class="fold ? 'nav' : 'closeNav'">
                    <!-- 收缩 -->
                    <div class="packUp" @click="fold=!fold"><svg-icon icon-class="packUp" /></div>
                    <el-menu :collapse="!fold" :default-active="activeMenu" :collapse-transition="false" class="tac" text-color="#999999" active-text-color="#ffffff" router
                        background-color="#fff">
                        <el-submenu :index="item.path" v-for="(item, index) in routes" :key="index">
                            <template slot="title">
                                <svg-icon class="icon" :icon-class="item.meta.icon" />
                                <span class="title">{{ item.meta.title }}</span>
                            </template>
                            <el-menu-item :index="`${item.path}${item.path==='/'?'':'/'}${childItem.path}`"
                                v-for="(childItem, childIndex) in item.children" :key="childIndex">{{ childItem.meta.title}}</el-menu-item>
                        </el-submenu>
                    </el-menu>
                </div>
                <!--主体区域二级路由组件渲染的地方-->
                <div class="content">
                    <router-view></router-view>
                </div>
            </div>
        </el-main>
        <!-- 尾部 -->
        <Footer/>
    </el-container>
</template>

<script>
import Footer from './footer.vue'
import { showDetail } from "@/api/my.js";
import { Getuserid } from "@/store/index.js";
import { Deluserid } from "@/store/index.js";

export default {
    name: "myHeader",
    components: { Footer },
    data() {
        return {
            fold:true,//菜单是否展开
            user: {},
            time: null, //定时器
            orderList: [
                {
                    name: '孙经理',
                    phone: '150 2261 8868',
                    address: '北方地区',
                    codeImg: require('./img/sun.png')
                },
                {
                    name: '苏经理',
                    phone: '177 7177 7957',
                    address: '中部地区',
                    codeImg: require('./img/su.jpg')
                },
                {
                    name: '小万',
                    phone: '186 2283 7275',
                    address: '南方地区',
                    codeImg: require('./img/wan.png')
                }
            ],
            // 菜单
            menuList: [
                {
                    name: '首页',
                    url: '/'
                },
                {
                    name: '功能介绍',
                    url: 'http://www.ourbim.com/introduce'
                }, {
                    name: '示例项目',
                    url: 'http://www.ourbim.com/sample_project'
                }, {
                    name: '应用场景',
                    url: 'http://www.ourbim.com/application_scenarios'
                }, {
                    name: '产品定价',
                    url: 'http://www.ourbim.com/product_pricing'
                }, {
                    name: '最新资讯',
                    url: 'http://www.ourbim.com/latest_news'
                }, {
                    name: '下载',
                    url: 'https://www.ourbim.com/download'
                }, {
                    name: '开发者',
                    url: '',
                    children: [
                        {
                            name: '开发指南',
                            url: 'http://www.ourbim.com/developer/developer_guide',
                        },
                        {
                            name: this.$t("APIdov"),
                            url: 'http://www.ourbim.com/developer/api_file',
                        },
                        {
                            name: '示例DEMO',
                            url: 'https://www.ourbim.com/developer/demo/index.html',
                            blank: true
                        },
                        {
                            name: this.$t("log"),
                            url: 'http://www.ourbim.com/developer/update_log',
                        }
                    ]
                },
            ]
        };
    },
    created() {
        //阻止回车键发送请求
        document.onkeydown = (e) => {
            let keyCode = window.event.keyCode;
            if (keyCode == "Enter" || keyCode == 32) {
                return false;
            }
        };
        this.showData();
    },
    mounted() {
        this.$nextTick(() => {
            this.getEchart()
        })
    },
    computed: {
        routes() {
            let routes = this.$router.options.routes
            let list = routes.length && routes.filter(e => { return !e.hidden })
            return list
        },
        /*使用计算属性来获取到当前点击的菜单的路由路径
          然后设置default-active中的值
          使得菜单在载入时就能对应高亮
        */
        activeMenu() {
            const route = this.$route;
            const { meta, path } = route;
            /*
             可以在路由配置文件中设置自定义的路由路径到
             meta.activeMenu属性中，来控制菜单自定义高亮显示
            */
            if (meta.activeMenu) {
                return meta.activeMenu;
            }
            return path;
        },
    },
    watch: {
        // 监听路由变化
        $route(to, from) {
            // this.showData();
        },
    },
    /* 把定时器放在activated事件里，当清除定时后，
    下次再次进入当前路由的话，可以再次唤起定时器 */
    activated() {
        this.time = setInterval(() => {
            // this.showData();
            // console.log('个人信息')
        }, 5000);
    },
    //页面实例销毁后清除定时
    destroyed() {
        // 清除定时器
        clearInterval(this.time);
    },
    methods: {
        // 总并发
        getEchart() {
            let echart = this.$echarts.init(document.getElementById("erupt"))
            let option = {
                xAxis: {
                    type: 'value',
                    axisLine: {
                        show: false, //隐藏y轴
                    },
                    axisTick: {
                        show: false,  //刻度线
                    },
                    axisLabel: {
                        show: false, //隐藏刻度值
                    },
                    splitLine: {
                        show: false
                    },
                },
                yAxis: {
                    type: 'category',
                    axisTick: {
                        show: false,  //刻度线
                    },
                    axisLine: {
                        show: false, //隐藏y轴
                    },
                    axisLabel: {
                        show: false, //隐藏刻度值
                    },
                    splitLine: {
                        show: false
                    },
                },
                grid: { // 让图表占满容器
                    top: "0px",
                    left: "0px",
                    right: "0px",
                    bottom: "0px"
                },
                series: [{
                    type: 'bar',
                    barWidth: 16,
                    itemStyle: {
                        barBorderRadius: 10,
                        color: new this.$echarts.graphic.LinearGradient(
                            0, 0, 0, 1,//4个参数用于配置渐变色的起止位置, 这4个参数依次对应右/下/左/上四个方位. 而0 0 0 1则代表渐变色从正上方开始
                            [
                                { offset: 1, color: '#02E2F0' },
                                { offset: 0, color: '#0aadb7' }
                            ]
                        )
                    },
                    barGap: '-100%',
                    data: [1],
                    zlevel: 3
                }, {
                    type: 'bar',
                    barWidth: 16,
                    itemStyle: {
                        barBorderRadius: 10,
                        color: new this.$echarts.graphic.LinearGradient(
                            0, 0, 0, 1,//4个参数用于配置渐变色的起止位置, 这4个参数依次对应右/下/左/上四个方位. 而0 0 0 1则代表渐变色从正上方开始
                            [
                                { offset: 1, color: '#029BF0' },
                                { offset: 0, color: '#0d7cb9' }
                            ]
                        )
                    },
                    barGap: '-100%',
                    data: [2],
                    zlevel: 2
                }, {
                    type: 'bar',
                    barWidth: 16,
                    itemStyle: {
                        barBorderRadius: 10,
                        color: new this.$echarts.graphic.LinearGradient(
                            0, 0, 0, 1,//4个参数用于配置渐变色的起止位置, 这4个参数依次对应右/下/左/上四个方位. 而0 0 0 1则代表渐变色从正上方开始
                            [
                                { offset: 1, color: '#0204F0' },
                                { offset: 0, color: '#0084FF' }
                            ]
                        )
                    },
                    barGap: '-100%',
                    data: [4],
                    zlevel: 1
                },
                {
                    // 这块用于设置圆角的背景色的，因为知道echarts最大值，所以写死了data的值
                    type: 'bar',
                    barWidth: 16,
                    itemStyle: {
                        normal: {  //normal 图形在默认状态下的样式;
                            barBorderRadius: 10,//柱条圆角半径,单位px.
                            color: '#EAEEF5'//柱条颜色
                        }
                    },
                    barGap: '-100%',
                    data: [10]
                }
                ]
            };
            echart.setOption(option);
            window.onresize = echart.resize;
        },
        // 项目中心按钮
        toManage() {
            this.$router.push("../manage");
        },

        // 延长有效期按钮
        toOrder() {
            this.$router.push("../order");
        },

        // 退出按钮
        toLogin() {
            this.$router.push("../login");
            // 刷新登陆页
            location.reload();
            if (sessionStorage.getItem("userInfo")) {
                sessionStorage.removeItem("userInfo");
            }
            Deluserid();
            clearInterval(this.time);
        },

        //展示当前用户信息
        showData() {
            showDetail({ userid: Getuserid() }).then((res) => {
                this.user = res.data
            })
        },

        // 去往创建应用
        toFound() {
            this.$router.push("../found");
        },

        // 去往账户管理
        toBill() {
            this.$router.push("../bill");
        },
    }
};
</script>

<style lang="less" scoped>
.headerBtn {
    padding: 5px 12px;

    img {
        width: 14px;
        height: auto;
        margin-right: 3px;
        vertical-align: bottom;
    }
}

.order {
    .orderContent {
        display: flex;
        justify-content: flex-start;
        gap: 20px;

        .orderItem {
            width: 140px;

            .code {
                width: 100%;
                height: 140px;
                padding: 25px;
                background-color: #f4f5f7;

                img {
                    width: 100%;
                    height: 100%;
                }
            }

            .address {
                width: 100%;
                background-color: #ff6803;
                text-align: center;
                line-height: 22px;
                color: #ffffff;
                font-size: 12px;
            }

            .user {
                border: 1px solid #00aaf0;
                padding: 3px 5px;
                margin-top: 5px;
                font-size: 12px;

                img {
                    margin-right: 5px;
                }
            }
        }
    }
}

.aMenu {
    text-decoration: none;
    color: #333333;
    font-family: PingFang SC;
    font-size: 16px;

    &:hover {
        color: #ff6600 !important;
    }
}

.el-container {
    .el-header {
        width: 100%;
        background-color: #fff;
        padding: 0 32px;
        min-width: 1200px;

        .head {
            width: 100%;
            height: 60px;
            display: flex;
            justify-content: space-between;
            align-items: center;

            .headLeft {
                display: flex;
                align-items: center;
                flex: 1;
            }
        }

        .rights {
            display: flex;
            align-items: center;

            .avatar {
                margin: 0 20px;

                .avatarImg {
                    width: 40px;
                    height: 40px;
                    border-radius: 100%;
                    cursor: pointer;
                }
            }
        }

        .logo-index {
            width: 150px;
        }

        .nav-menu {
            border-bottom: none;
            margin-left: 6%;

            /deep/.el-menu-item {
                border-bottom: none;
                font-size: 16px;
                padding: 0 10px;
                background: #fff !important;
                margin-top: -2px;
            }

            /deep/ .el-submenu__title {
                font-size: 16px;
            }
        }
    }

    .el-main {
        padding: 24px 32px;

        .statistics {
            /deep/ .el-col {
                padding-bottom: 16px;
            }

            .statisticsTitle {
                font-size: 18px;
                font-weight: 600;
                color: #096191;
                text-align: left;
            }

            .statisticsBox {
                background: #FFFFFF;
                border-radius: 12px;
                padding: 16px 24px;
                height: 100%;
                margin-bottom: 16px;
            }

            .user {
                font-size: 18px;
                font-family: PingFangSC-Medium, PingFang SC;
                font-weight: 500;
                color: #333333;
                background: #ffffff url(./img/useBg.png) bottom right no-repeat;
                background-size: 70% 72%;
                display: flex;

                img {
                    width: 45px;
                    height: 45px;
                    border-radius: 100%;
                    vertical-align: text-top;
                    border: 1px solid #00acf0;
                }

                .userRight {
                    flex: 1;
                    overflow: hidden;

                    .name {
                        padding: 5px 0 0 30px;
                        font-weight: 600;
                    }

                    .userID {
                        background: #E8E9EA;
                        border-radius: 14px;
                        padding: 3px 13px;
                        color: #999999;
                        margin-top: 18px;
                        margin-left: 16px;
                        display: block;
                        word-wrap: break-word;
                        white-space: normal;
                        max-width: 85%;
                        width: fit-content;
                        font-size: 14px;
                    }
                }
            }

            .server {
                .serverPer {
                    font-weight: 500;
                    color: #02AAF0;
                    margin-top: 18px;
                    margin-bottom: 3px;
                }

                .serverTotal {
                    margin-top: 18px;
                    margin-bottom: 3px;
                    color: #333333;
                }

                .serverUsed {
                    font-size: 14px;
                    color: #999999;
                    margin-top: 10px;
                    display: flex;
                    align-items: flex-start;

                    img {
                        margin-right: 12px;
                    }
                }

                .serverBox {
                    display: flex;
                }

                .serverItem {
                    position: relative;
                    width: 100%;

                    &:first-child {
                        padding-right: 40px;
                    }

                    &:last-child {
                        padding-left: 40px;

                        &::before {
                            content: '';
                            display: block;
                            top: 0;
                            left: 0;
                            width: 1px;
                            height: 97px;
                            background: #CCCCCC;
                            position: absolute;
                        }
                    }

                    #erupt {
                        width: 100%;
                        height: 16px;
                    }
                }
            }

            .period {
                text-align: center;
                .time {
                    font-size: 14px;
                    font-weight: 400;
                    color: rgba(37, 34, 34, 0.78);
                    margin: 22px 0 18px 0;
                }
            }

            .account {
                .accountBox {
                    display: flex;
                }

                .accountItem {
                    position: relative;
                    padding-right: 33px;

                    .text {
                        margin: 19px 0 16px 0;
                        color: #333333;

                        span {
                            &:first-child {
                                color: #FF5900;
                                font-size: 18px;
                                font-weight: bold;
                                padding: 0 5px 0 10px;
                                font-family: ZhenyanGB-Regular, ZhenyanGB;
                            }

                            &:last-child {
                                color: #999999;
                                font-size: 12px;
                            }
                        }
                    }

                    &:last-child {
                        padding-left: 33px;
                        padding-right: 0px;

                        &::before {
                            content: '';
                            display: block;
                            top: 0;
                            left: 0;
                            width: 1px;
                            height: 97px;
                            background: #CCCCCC;
                            position: absolute;
                        }
                    }
                }
            }
        }

        @media screen and (min-width:1200px) and (max-width: 1741px) {
            .statistics {

                .serverBox,
                .accountBox {
                    flex-direction: column;

                    .serverItem,
                    .accountItem {
                        padding: 0 !important;

                        &:last-child::before {
                            width: 100%;
                            height: 1px;
                            margin-top: 12px;
                        }
                    }
                }
            }
        }

        .wrap {
            display: flex;
            justify-content: center;
            min-height: 800px;

            .nav {
                width: 200px;
                margin-right: 20px;
                border-radius: 6px;
                position: relative;

                .packUp{
                    width: 32px;
                    height: 32px;
                    background: #FFFFFF;
                    box-shadow: 0px 0px 4px 0px rgba(218,222,224,0.5);
                    border: 1px solid #E5E9ED;
                    position: absolute;
                    right: -16px;
                    top: 0;
                    z-index: 10;
                    border-radius: 100%;
                    color: #DBDFE4;
                    font-size: 16px;
                    cursor: pointer;
                    text-align: center;
                    line-height: 32px;
                    &:hover{
                        background-color: #00AAF0;
                        color: #ffffff;
                    }
                }
                
                .tac {
                    width: 100%;
                    height: 100%;
                    overflow-x: hidden;
                    overflow-y: auto;
                    border-right:0;
                    border-radius: 6px;

                    .icon {
                        font-size: 20px;
                        vertical-align: middle;
                        color: #87969e;
                        margin-left: 20px;
                    }

                    .title {
                        color: #333333;
                        font-size: 18px;
                        margin-left: 10px;
                    }

                    /deep/ .el-submenu__icon-arrow {
                        left: 15px;
                        right: initial;

                        &::before {
                            content: "\e790";
                            font-size: 14px;
                        }
                    }

                    // 每一项鼠标悬停状态
                    /deep/.el-menu-item:hover {
                        background-color: #ff6600 !important;
                        color: #fff !important;
                    }

                    // el-submenu 每一项鼠标悬停状态
                    /deep/.el-submenu__title:hover {
                        background-color: #ffffff!important;
                    }
                    /deep/.is-active {
                        color: #ffffff !important;
                        background: #ff6600 !important;

                        .icon,
                        .title,
                        .el-submenu__icon-arrow {
                            color: #ff6600;
                        }
                    }
                }
            }

            .closeNav{
                width: 80px;
                .packUp{
                    transform:rotate(180deg);
                }
                .tac .icon{
                    margin-left: 10px;
                }
            }

            .content {
                border-radius: 12px;
                flex: 1;
                background-color: #fff;
                overflow: hidden;
            }
        }
    }
}

.el-menu--popup-right-start{
    .el-menu-item:focus, .el-menu-item:hover{
        background: #ff6600!important;
        color: #ffffff!important;
    }
    .el-menu-item.is-active{
        background: #ff6600 !important;
    }
}
</style>


