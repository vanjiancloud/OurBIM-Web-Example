<!-- 私有化订阅（按年/按需） -->
<template>
    <div class="priceBox">
        <!-- 预付费版 -->
        <div class="priceItem">
            <div class="priceTitle">预付费版</div>
            <div class="price1 need-price">按需计费</div>
            <div class="instructions" style="margin-top: 29px;">所有类型团队规模</div>
            <Dot type="kf">
                <el-button round slot="reference" type="primary" class="button2">联系客服</el-button>
            </Dot>
            <div class="list">
                <div class="listItem">
                    <div class="listItemTitle">存储空间</div>
                    <div class="listItemValue blue">不限</div>
                </div>
                <div class="listItem">
                    <div class="listItemTitle">
                        总并发数量
                        <Dot type="concurrency"/>
                    </div>
                    <div class="listItemValue blue">不限</div>
                </div>
                <div class="listItem">
                    <div class="listItemTitle">VR/AR并发数</div>
                    <div class="listItemValue blue">不限</div>
                </div>
                <div class="listItem">
                    <div class="listItemTitle">链接无操作时限</div>
                    <div class="listItemValue blue">不限</div>
                </div>
                <div class="listItem">
                    <div class="listItemTitle">项目及模型数量</div>
                    <div class="listItemValue blue">不限</div>
                </div>
                <div class="listItem">
                    <div class="listItemTitle">BIM解析服务</div>
                    <div class="listItemValue">
                        <Dot type="prepayment"/>
                        0.05点<span>/MB</span>
                    </div>
                </div>
                <div class="listItem">
                    <div class="listItemTitle">GIS解析服务</div>
                    <div class="listItemValue">
                        <Dot type="prepayment"/>
                        0.02点<span>/MB</span>
                    </div>
                </div>
                <div class="listItem">
                    <div class="listItemTitle">云3D渲染服务</div>
                    <div class="listItemValue">
                        <Dot type="prepayment"/>
                        0.20点<span>/分钟</span>
                    </div>
                </div>
                <div class="listItem">
                    <div class="listItemTitle">云VR渲染服务</div>
                    <div class="listItemValue">
                        <Dot type="prepayment"/>
                        0.30点<span>/分钟</span>
                    </div>
                </div>
                <div class="listItem">
                    <div class="listItemTitle">云AR渲染服务</div>
                    <div class="listItemValue">
                        <Dot type="prepayment"/>
                        0.30点<span>/分钟</span>
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
                    <div class="listItemValue blue">¥3,000<span>/并发/年</span></div>
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
            <div class="price1" style="font-size:35px;margin-top: 14px;"><span style="font-size:24px;color:#02AAF0">¥</span>2,900<span>/月</span></div>
            <div class="price1" style="font-size:21px;margin-top: 0px;"><span style="font-size:13px">或 ¥ </span>32,800<span style="font-size:13px">/年</span></div>
            <div class="instructions" style="margin-top: 17px;">适合 15-50 人规模团队</div>
            <Dot type="kf">
                <el-button round slot="reference" type="primary" class="button2">联系客服</el-button>
            </Dot>
            <div class="list">
                <div class="listItem">
                    <div class="listItemTitle">存储空间</div>
                    <div class="listItemValue blue">不限</div>
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
                    <div class="listItemValue blue">不限</div>
                </div>
                <div class="listItem">
                    <div class="listItemTitle">项目及模型数量</div>
                    <div class="listItemValue blue">不限</div>
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
                    <div class="listItemValue blue">¥3,000<span>/并发/年</span></div>
                </div>
                <div class="listItem">
                    <div class="listItemTitle">总并发数扩容</div>
                    <div class="listItemValue blue">¥3,000<span>/个/年</span></div>
                </div>
                <div class="listItem">
                    <div class="listItemTitle">云VR/AR并发数扩容</div>
                    <div class="listItemValue blue">¥2,000<span>/个/年</span></div>
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
        <div class="priceItem">
            <div class="priceTitle">旗舰版</div>
            <div class="price1" style="font-size:35px;margin-top: 14px;"><span style="font-size:24px;color:#02AAF0">¥</span>6,900<span>/月</span></div>
            <div class="price1" style="font-size:21px;margin-top: 0px;"><span style="font-size:13px">或 ¥ </span>78,000<span style="font-size:13px">/年</span></div>
            <div class="instructions" style="margin-top: 17px;">适合 50-300 人规模团队</div>
            <Dot type="kf">
                <el-button round slot="reference" type="primary" class="button2">联系客服</el-button>
            </Dot>
            <div class="list">
                <div class="listItem">
                    <div class="listItemTitle">存储空间</div>
                    <div class="listItemValue blue">不限</div>
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
                    <div class="listItemValue blue">不限</div>
                </div>
                <div class="listItem">
                    <div class="listItemTitle">项目及模型数量</div>
                    <div class="listItemValue blue">不限</div>
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
                    <div class="listItemValue blue">¥3,000<span>/并发/年</span></div>
                </div>
                <div class="listItem">
                    <div class="listItemTitle">总并发数扩容</div>
                    <div class="listItemValue blue">¥3,000<span>/个/年</span></div>
                </div>
                <div class="listItem">
                    <div class="listItemTitle">云VR/AR并发数扩容</div>
                    <div class="listItemValue blue">¥2,000<span>/个/年</span></div>
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
.price1{
    color: #02AAF0!important;
}
.blue{
    color: #02AAF0!important;
}
.button1{
    .button();
    background: #3E93FF;
    border: 1px solid #3E93FF!important;
}
.button2{
    .button();
    background: linear-gradient(143deg, #40D7FF 0%, #2BA8E7 100%);
    padding: 13px 23px;
    border: 0;
    margin-top: 22px;
}
.need-price{
    margin-top: 44px !important;
}
</style>
