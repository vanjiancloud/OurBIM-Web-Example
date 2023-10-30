<template>
    <el-container class="container">
        <!-- 顶部导航栏 -->
        <el-header>
            <div class="head">
                <div class="headLeft">
                    <a href="http://www.ourbim.com"><img class="logo-index" :src="require('@/assets/images/logo/logo_home.png')" alt="" /></a>
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
            <div class="statistics">
                <div class="statisticsBox user">
                    <img :src="user.imgUrl || require('./img/man.png')" />
                    <div class="userRight">
                        <span class="name">{{ user.name || user.mobile }}</span>
                        <span class="userID">ID:{{ user.userid }}</span>
                    </div>
                </div>
                <div class="statisticsBox server">
                    <div class="statisticsTitle">公有云服务使用</div>
                    <!-- 按需计费 -->
                    <div class="flexSpaceBetween needFee" v-if="total.billingMode !== '1'">
                        <div style="width: 40%;margin-right: 4%;">
                            <div class="needFeeNum">{{ Number(total.useStore).toFixed(2) }}<span>GB</span></div>
                            <div class="needFeeTitle">
                                <img src="./img/cunchu.png" alt="" />
                                上传数据统计
                            </div>
                        </div>
                        <div class="serverItem">
                            <div class="needTotalTitle">实时并发统计</div>
                            <div class="flexSpaceBetween needNum">
                                <div>
                                    <div class="needFeeNum">{{ total.use3dConcurrency }}<span>个</span></div>
                                    <div class="needFeeTitle">
                                        3D并发
                                    </div>
                                </div>
                                <div>
                                    <div class="needFeeNum">{{ total.useArConcurrency+total.useVrConcurrency+total.useMrConcurrency }}<span>个</span></div>
                                    <div class="needFeeTitle">
                                        VR/AR/MR并发
                                    </div>
                                </div>
                                <div>
                                    <div class="needFeeNum">{{ total.usePreConcurrency }}<span style="color: #6A7C87;font-size: 24px;">/{{ total.preConcurrency }}</span><span style="color: #6A7C87;">个</span></div>
                                    <div class="needFeeTitle">
                                        预启动并发
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="serverBox" v-else>
                        <div class="serverItem">
                            <div class="serverPer" :class="{colorGray:!total.useStore}">{{ total.useStore&&(total.useStore/total.store*100).toFixed(2) || 0 }}%</div>
                            <el-progress :text-inside="true" :stroke-width="16" :percentage="Number(total.useStore/total.store*100) || 0" :show-text="false" color="#02AAF0"></el-progress>
                            <div class="serverUsed">
                                <img src="./img/cunchu.png" alt="" />
                                <span>已用储存 {{ total.useStore }}GB/{{ total.store }}GB</span>
                            </div>
                        </div>
                        <div class="serverItem">
                            <div class="flexBetween">
                                <div class="serverPer" :class="{colorGray:!total.useConcurrency}">{{ total.useConcurrency&&(total.useConcurrency/total.countConcurrency*100).toFixed(2)||0 }}%</div>
                                <div class="serverTotal">总并发 {{ total.useConcurrency }}/{{ total.countConcurrency }}</div>
                            </div>
                            <div id="erupt"></div>
                            <div class="serverUsed">
                                <img src="./img/jiedian.png" alt="" />
                                <span>云VR/AR/MR {{ total.useArConcurrency+total.useVrConcurrency+total.useMrConcurrency }}/{{ total.countConcurrency }}
                                    <p>预启动 {{ total.usePreConcurrency }}/{{ total.preConcurrency }}</p>
                                </span>
                            </div>
                        </div>
                        <div class="period serverItem">
                            <div class="statisticsTitle">服务有效期</div>
                            <div class="time">{{ total.startUseTime }} 至 {{ total.endUseTime }}</div>
                            <el-button type="primary" size="small" class="grayBtn" style="width: 130px;"
                                @click="$router.push('/server/parameter')">延长有效期</el-button>
                        </div>
                    </div>
                </div>
                <div class="statisticsBox account">
                    <div class="statisticsTitle">账户信息</div>
                    <div class="accountBox">
                        <div class="accountItem" style="text-align: right;">
                            <div class="text">账户余额：<span :class="{colorGray:!total.money}">{{ total.money || 0 }}</span><span>资源点</span></div>
                            <el-button type="primary" size="small" class="orangeBtn"
                                style="border:0;width: 120px;background-color:#FF7F28" @click="$router.push('/expense/recharge')">立即充值</el-button>
                        </div>
                        <div class="accountItem" style="min-width:195px;">
                            <div class="text">授权码：<span style="color:#00AAF0" :class="{colorGray:!total.codeSum}">{{ total.codeSum || 0 }}</span><span>个</span></div>
                            <el-button type="primary" size="small" class="grayBtn"  @click="toOrder">查看</el-button>
                            <el-button type="primary" size="small" class="grayBtn"  @click="toOrder">申请授权码</el-button>
                        </div>
                    </div>
                </div>
            </div>
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

export default {
    name: "myHeader",
    components: { Footer },
    data() {
        return {
            timer: null,//定时器
            fold:true,//菜单是否展开
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
    computed: {
        user() {
            return this.$store.state.user.userInfo || {}
        },
        total() {
            return this.$store.state.user.total || {}
        },
        routes() {
            let routes = this.$router.options.routes
            let list = routes.length && routes.filter(e => { return !e.hidden })
            return list
        },
        activeMenu() {
            const route = this.$route;
            const { meta, path } = route;
            if (meta.activeMenu) {
                return meta.activeMenu;
            }
            return path;
        },
    },
    watch: {},
    created() {
        this.$store.dispatch('user/getUser')
        this.startTimer();
    },
    mounted() {
        this.$nextTick(() => {
            setTimeout(()=>{
                if(this.total.billingMode==='1'){
                    this.getEchart()
                }
            },200)
        })
    },
    destroyed() {
        this.stopTimer();
    },
    beforeRouteLeave(to, from, next) {
        this.stopTimer();
        next()
    },
    methods: {
        startTimer() {
            this.$store.dispatch('user/getTotal')
            this.timer = setInterval(() => {
                this.$store.dispatch('user/getTotal')
            }, 3000);
        },
        stopTimer() {
            if (this.timer) {
                clearInterval(this.timer);
                this.timer = null;
            }
        },
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
                    data: [this.total.useVrConcurrency],
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
                    data: [this.total.useVrConcurrency],
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
                    data: [this.total.useVrConcurrency],
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
            this.$router.push("/expense/code");
        },

        // 退出按钮
        toLogin() {
            this.$store.dispatch('user/logout').then(()=>{
                this.$router.push("/login");
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
.colorGray{
    color: #b7b7b7!important;
}
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
            display: flex;
            gap: 24px;

            .statisticsTitle {
                font-size: 18px;
                font-weight: 600;
                color: #096191;
                text-align: left;
            }

            .statisticsBox {
                background: #FFFFFF;
                border-radius: 12px;
                padding: 16px 1.2%;
                height: 100%;
                margin-bottom: 16px;
                height: 160px;
            }

            .user {
                min-width: 200px;
                width: 15%;
                font-size: 18px;
                font-family: PingFangSC-Medium, PingFang SC;
                font-weight: 500;
                color: #333333;
                background: #ffffff url(./img/useBg.png) bottom right no-repeat;
                background-position: bottom right;
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
                flex: 1;
                .needNum{
                    >div{
                        flex: 1;
                    }
                }
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
                    font-size: 14px;
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
                    gap: 3%;
                    .serverItem{
                        flex:1;
                    }
                }
                .needFee{
                    text-align: center;
                    .needTotalTitle{
                        font-size: 16px;
                        color: #333333;
                        margin-top: -22px;
                    }
                    .needFeeTitle{
                        font-size: 13px;
                        color: #999999;
                        img{
                            margin-right: 5px;
                            width: 18px;
                            height: auto;
                            vertical-align: middle;
                        }
                    }
                    .needFeeNum{
                        font-size: 24px;
                        font-weight: bold;
                        color: #02AAF0;
                        margin: 20px 0 15px 0;
                        span{
                            font-size: 16px;
                            padding-left: 5px;
                        }
                    }
                }

                .serverItem {
                    position: relative;
                    width: 100%;
                    &:last-child {

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
                padding-left: 3%;
                .time {
                    font-size: 13px;
                    font-weight: 400;
                    color: rgba(37, 34, 34, 0.78);
                    margin: 10px 0 18px 0;
                }
                .statisticsTitle{
                    font-size:16px;
                    color: #333333;
                    font-weight: inherit;
                    margin-top: -22px;
                }
            }

            .account {
                min-width: 446px;
                width: 28%;
                .accountBox {
                    display: flex;
                }

                .accountItem {
                    position: relative;
                    padding-right: 6%;

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
                        padding-left: 6%;
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

        @media screen and (max-width: 1470px) {
            .serverUsed{
                font-size: 10px!important;
            }
            .serverTotal{
                font-size: 13px!important;
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


