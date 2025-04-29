<!-- 公有云订阅（按年/按需） -->
<template>
    <div class="priceBox">
        <!-- 预付费版 -->
        <div class="priceItem">
            <div class="priceTitle">预付费版</div>
            <div class="price1 need-price">按需计费</div>
            <div class="instructions" style="margin-top: 29px;">所有类型团队规模</div>
            <Dot type="kf">
                <el-button round slot="reference" type="primary" class="button3">联系客服</el-button>
            </Dot>
            <div class="list">
                <div class="listItem">
                    <div class="listItemTitle">存储空间</div>
                    <div class="listItemValue orange">不限</div>
                </div>
                <div class="listItem">
                    <div class="listItemTitle">
                        总并发数量
                        <Dot type="concurrency"/>
                    </div>
                    <div class="listItemValue orange">不限</div>
                </div>
                <div class="listItem">
                    <div class="listItemTitle">VR/AR并发数</div>
                    <div class="listItemValue orange">不限</div>
                </div>
                <div class="listItem">
                    <div class="listItemTitle">链接无操作时限</div>
                    <div class="listItemValue orange">不限</div>
                </div>
                <div class="listItem">
                    <div class="listItemTitle">项目及模型数量</div>
                    <div class="listItemValue orange">不限</div>
                </div>
                <div class="listItem">
                    <div class="listItemTitle">BIM解析服务</div>
                    <div class="listItemValue">
                        <Dot type="prepayment"/>
                        0.10点<span>/MB</span>
                    </div>
                </div>
                <div class="listItem">
                    <div class="listItemTitle">GIS解析服务</div>
                    <div class="listItemValue">
                        <Dot type="prepayment"/>
                        0.05点<span>/MB</span>
                    </div>
                </div>
                <div class="listItem">
                    <div class="listItemTitle">云3D渲染服务</div>
                    <div class="listItemValue">
                        <Dot type="prepayment"/>
                        0.30点<span>/分钟</span>
                    </div>
                </div>
                <div class="listItem">
                    <div class="listItemTitle">云VR渲染服务</div>
                    <div class="listItemValue">
                        <Dot type="prepayment"/>
                        0.50点<span>/分钟</span>
                    </div>
                </div>
                <div class="listItem">
                    <div class="listItemTitle">云AR渲染服务</div>
                    <div class="listItemValue">
                        <Dot type="prepayment"/>
                        0.50点<span>/分钟</span>
                    </div>
                </div>
                <div class="listItem">
                    <div class="listItemTitle">CAD服务模块</div>
                    <div class="listItemValue">✔</div>
                </div>
                <div class="listItem">
                    <div class="listItemTitle">引擎交互服务</div>
                    <div class="listItemValue">✔</div>
                </div>
                <div class="listItem">
                    <div class="listItemTitle">实时云协同服务</div>
                    <div class="listItemValue">✔</div>
                </div>
                <div class="listItem">
                    <div class="listItemTitle">API接口服务</div>
                    <div class="listItemValue">✔</div>
                </div>
                <div class="listItem">
                    <div class="listItemTitle">预启动服务
                        <Dot type="preStart"/>
                    </div>
                    <div class="listItemValue" style="color:#FF6907;">¥12,000<span>/并发/年</span></div>
                </div>
                <div class="listItem">
                    <div class="listItemTitle">开发培训教程</div>
                    <div class="listItemValue">✔</div>
                </div>
                <div class="listItem">
                    <div class="listItemTitle">5x8技术支持</div>
                    <div class="listItemValue">✔</div>
                </div>
            </div>
        </div>
        <!-- 标准版 -->
        <div class="priceItem">
            <div class="priceTitle">标准版</div>
            <div class="price1" style="font-size:35px;margin-top: 14px;"><span style="font-size:24px;color:#FF8434">¥</span>3,900<span>/月</span></div>
            <div class="price1" style="font-size:21px;margin-top: 0px;"><span style="font-size:13px">或 ¥ </span>42,800<span style="font-size:13px">/年</span></div>
            <div class="instructions" style="margin-top: 17px;">适合 15-50 人规模团队</div>
            <Dot type="kf">
                <el-button round slot="reference" type="primary" class="button3">联系客服</el-button>
            </Dot>
            <div class="list">
                <div class="listItem">
                    <div class="listItemTitle">存储空间</div>
                    <div class="listItemValue">200GB</div>
                </div>
                <div class="listItem">
                    <div class="listItemTitle">
                        总并发数量
                        <Dot type="concurrency"/>
                    </div>
                    <div class="listItemValue">8</div>
                </div>
                <div class="listItem">
                    <div class="listItemTitle">VR/AR并发数</div>
                    <div class="listItemValue">4</div>
                </div>
                <div class="listItem">
                    <div class="listItemTitle">链接无操作时限</div>
                    <div class="listItemValue orange">不限</div>
                </div>
                <div class="listItem">
                    <div class="listItemTitle">项目及模型数量</div>
                    <div class="listItemValue orange">不限</div>
                </div>
                <div class="listItem">
                    <div class="listItemTitle">BIM解析服务</div>
                    <div class="listItemValue">✔</div>
                </div>
                <div class="listItem">
                    <div class="listItemTitle">GIS解析服务</div>
                    <div class="listItemValue">✔</div>
                </div>
                <div class="listItem">
                    <div class="listItemTitle">云3D渲染服务</div>
                    <div class="listItemValue">✔</div>
                </div>
                <div class="listItem">
                    <div class="listItemTitle">云VR渲染服务</div>
                    <div class="listItemValue">✔</div>
                </div>
                <div class="listItem">
                    <div class="listItemTitle">云AR渲染服务</div>
                    <div class="listItemValue">✔</div>
                </div>
                <div class="listItem">
                    <div class="listItemTitle">CAD服务模块</div>
                    <div class="listItemValue">✔</div>
                </div>
                <div class="listItem">
                    <div class="listItemTitle">引擎交互服务</div>
                    <div class="listItemValue">✔</div>
                </div>
                <div class="listItem">
                    <div class="listItemTitle">实时云协同服务</div>
                    <div class="listItemValue">✔</div>
                </div>
                <div class="listItem">
                    <div class="listItemTitle">API接口服务</div>
                    <div class="listItemValue">✔</div>
                </div>
                <div class="listItem">
                    <div class="listItemTitle">预启动服务
                        <Dot type="preStart"/>
                    </div>
                    <div class="listItemValue" style="color:#FF6907;">¥12,000<span>/并发/年</span></div>
                </div>
                <div class="listItem">
                    <div class="listItemTitle">总并发数扩容</div>
                    <div class="listItemValue" style="color:#FF6907;">¥5,000<span>/个/年</span></div>
                </div>
                <div class="listItem">
                    <div class="listItemTitle">云VR/AR并发数扩容</div>
                    <div class="listItemValue" style="color:#FF6907;">¥3,000<span>/个/年</span></div>
                </div>
                <div class="listItem">
                    <div class="listItemTitle">开发培训教程</div>
                    <div class="listItemValue">✔</div>
                </div>
                <div class="listItem">
                    <div class="listItemTitle">5x8技术支持</div>
                    <div class="listItemValue">✔</div>
                </div>
                <div class="listItem">
                    <div class="listItemTitle">专属服务微信群</div>
                    <div class="listItemValue">✔</div>
                </div>
                <div class="listItem">
                    <div class="listItemTitle">专属技术支持</div>
                    <div class="listItemValue">✔</div>
                </div>
            </div>
        </div>
        <!-- 旗舰版 -->
        <div class="priceItem" style="border: 2px solid #FE7615;padding: 23px 20px;">
            <div class="tips">
                <span>更多人选择</span>
                <img class="bg" src="@/assets/images/recharge/price/leftBg.png"/>
                <img class="jinpai" src="@/assets/images/recharge/price/jinpai.png"/>
            </div>
            <div class="priceTitle" style="color:#8E4800">旗舰版</div>
            <div class="price1" style="font-size:35px;margin-top: 14px;"><span style="font-size:24px;color:#FF8434">¥</span>7,900<span>/月</span></div>
            <div class="price1" style="font-size:21px;margin-top: 0px;"><span style="font-size:13px">或 ¥ </span>88,000<span style="font-size:13px">/年</span></div>
            <div class="instructions" style="margin-top: 17px;">适合 50-300 人规模团队</div>
            <Dot type="kf">
                <el-button round slot="reference" type="primary" class="button3">联系客服</el-button>
            </Dot>
            <div class="list">
                <div class="listItem">
                    <div class="listItemTitle">存储空间</div>
                    <div class="listItemValue">1000GB</div>
                </div>
                <div class="listItem">
                    <div class="listItemTitle">
                        总并发数量
                        <Dot type="concurrency"/>
                    </div>
                    <div class="listItemValue">25</div>
                </div>
                <div class="listItem">
                    <div class="listItemTitle">VR/AR并发数</div>
                    <div class="listItemValue">8</div>
                </div>
                <div class="listItem">
                    <div class="listItemTitle">链接无操作时限</div>
                    <div class="listItemValue orange">不限</div>
                </div>
                <div class="listItem">
                    <div class="listItemTitle">项目及模型数量</div>
                    <div class="listItemValue orange">不限</div>
                </div>
                <div class="listItem">
                    <div class="listItemTitle">BIM解析服务</div>
                    <div class="listItemValue">✔</div>
                </div>
                <div class="listItem">
                    <div class="listItemTitle">GIS解析服务</div>
                    <div class="listItemValue">✔</div>
                </div>
                <div class="listItem">
                    <div class="listItemTitle">云3D渲染服务</div>
                    <div class="listItemValue">✔</div>
                </div>
                <div class="listItem">
                    <div class="listItemTitle">云VR渲染服务</div>
                    <div class="listItemValue">✔</div>
                </div>
                <div class="listItem">
                    <div class="listItemTitle">云AR渲染服务</div>
                    <div class="listItemValue">✔</div>
                </div>
                <div class="listItem">
                    <div class="listItemTitle">CAD服务模块</div>
                    <div class="listItemValue">✔</div>
                </div>
                <div class="listItem">
                    <div class="listItemTitle">引擎交互服务</div>
                    <div class="listItemValue">✔</div>
                </div>
                <div class="listItem">
                    <div class="listItemTitle">实时云协同服务</div>
                    <div class="listItemValue">✔</div>
                </div>
                <div class="listItem">
                    <div class="listItemTitle">API接口服务</div>
                    <div class="listItemValue">✔</div>
                </div>
                <div class="listItem">
                    <div class="listItemTitle">预启动服务
                        <Dot type="preStart"/>
                    </div>
                    <div class="listItemValue" style="color:#FF6907;">¥12,000<span>/并发/年</span></div>
                </div>
                <div class="listItem">
                    <div class="listItemTitle">总并发数扩容</div>
                    <div class="listItemValue" style="color:#FF6907;">¥5,000<span>/个/年</span></div>
                </div>
                <div class="listItem">
                    <div class="listItemTitle">云VR/AR并发数扩容</div>
                    <div class="listItemValue" style="color:#FF6907;">¥3,000<span>/个/年</span></div>
                </div>
                <div class="listItem">
                    <div class="listItemTitle">开发培训教程</div>
                    <div class="listItemValue">✔</div>
                </div>
                <div class="listItem">
                    <div class="listItemTitle">5x8技术支持</div>
                    <div class="listItemValue">✔</div>
                </div>
                <div class="listItem">
                    <div class="listItemTitle">专属服务微信群</div>
                    <div class="listItemValue">✔</div>
                </div>
                <div class="listItem">
                    <div class="listItemTitle">专属技术支持</div>
                    <div class="listItemValue">✔</div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import Dot from "./PartDot";
export default {
    components: { Dot },
    props: {},
    data() {
        return {};
    },
    watch: {},
    computed: {},
    created() { },
    mounted() { },
    methods: {},
};
</script>
<style lang="less" scoped>
@import '@/assets/css/price.less';
.orange{
    color: #FF6907!important;
}
.button1{
    .button();
    border: 1px solid #FF6000!important;
    color: #FF8434!important;
    &:hover{
        background: rgba(255, 132, 52, 0.2);
    }
}
.button2{
    .button();
    background: #FF6600;
    border: 1px solid #FF6000!important;
}
.button3{
    .button();
    margin-top: 22px;
    background: linear-gradient(142deg, #FBC070 0%, #FF6600 100%);
    border: 0;
    padding: 13px 23px;
}
.need-price{
    margin-top: 44px !important;
}
</style>
