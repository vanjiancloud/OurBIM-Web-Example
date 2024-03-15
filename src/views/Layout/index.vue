<template>
    <el-container class="container">
        <!-- 顶部导航栏 -->
        <el-header>
            <div class="head">
                <div class="headLeft"></div>
                <!--项目中心-->
                <div class="rights">
                    <!-- 头像 -->
                    <el-dropdown class="avatar">
                        <img class="avatarImg" :src="user.imgUrl ? user.imgUrl : require('./img/man.png')" alt="" />
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item @click.native="toLogin">退出</el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                </div>
            </div>
        </el-header>
        <!-- 内容区 -->
        <el-main>
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
            fold:true,//菜单是否展开
        };
    },
    computed: {
        user() {
            return this.$store.state.user.userInfo || {}
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
    created() {},
    mounted() {},
    destroyed() {},
    methods: {

        // 退出按钮
        toLogin() {
            this.$store.dispatch('user/logout').then(()=>{
                this.$router.push("/login");
            })
        },
    }
};
</script>

<style lang="less" scoped>

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
    }

    .el-main {
        padding: 24px 32px;

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


