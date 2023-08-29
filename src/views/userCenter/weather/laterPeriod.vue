<!-- 后期处理 -->
<template>
    <div class="laterPeriod">
        <el-collapse v-model="activeNames">
            <el-collapse-item name="1">
                <template slot="title">
                    <div class="laterTitle">
                        <el-checkbox v-model="form.checked">全局光照和反射</el-checkbox>
                    </div>
                </template>
                <div class="laterContent">
                    <div class="laterItem">
                        <div class="laterItem-name">类型</div>
                        <el-select v-model="form.value" placeholder="请选择" size="small" style="width: 100%;" class="laterItem-right" @keydown.native.stop>
                            <el-option
                                v-for="item in illuminationList"
                                :key="item.key"
                                :label="item.value"
                                :value="item.key">
                            </el-option>
                        </el-select>
                    </div>
                    <div class="laterItem">
                        <div class="laterItem-name">光照类型</div>
                        <div class="laterItem-right flexBetween">
                            <el-slider v-model="form.value1" class="slider"></el-slider>
                            <el-input v-model="form.value1" placeholder="内容" size="small" class="laterItem-input" @keydown.native.stop></el-input>
                        </div>
                    </div>
                    <div class="laterItem">
                        <div class="laterItem-name">反射质量</div>
                        <div class="laterItem-right flexBetween">
                            <el-slider v-model="form.value1" class="slider"></el-slider>
                            <el-input v-model="form.value1" placeholder="内容" size="small" class="laterItem-input" @keydown.native.stop></el-input>
                        </div>
                    </div>
                </div>
            </el-collapse-item>
            <div class="line"></div>
            <el-collapse-item name="3" title="相机镜头设置">
                <el-collapse-item name="4">
                    <template slot="title">
                        <div class="laterTitle">
                            <el-checkbox v-model="form.checked">泛光</el-checkbox>
                        </div>
                    </template>
                    <div class="laterContent">
                        <div class="laterItem">
                            <div class="laterItem-name">模式</div>
                            <el-select v-model="form.value" placeholder="请选择" size="small" style="width: 100%;" class="laterItem-right" @keydown.native.stop>
                                <el-option
                                    v-for="item in modeList"
                                    :key="item.key"
                                    :label="item.value"
                                    :value="item.key">
                                </el-option>
                            </el-select>
                        </div>
                        <div class="laterItem">
                            <div class="laterItem-name">强度</div>
                            <div class="laterItem-right flexBetween">
                                <el-slider v-model="form.value1" class="slider"></el-slider>
                                <el-input v-model="form.value1" placeholder="内容" size="small" class="laterItem-input" @keydown.native.stop></el-input>
                            </div>
                        </div>
                    </div>
                </el-collapse-item>
                <el-collapse-item name="5">
                    <template slot="title">
                        <div class="laterTitle">
                            <el-checkbox v-model="form.checked">曝光</el-checkbox>
                        </div>
                    </template>
                    <div class="laterContent">
                        <div class="laterItem">
                            <div class="laterItem-name">测光模式</div>
                            <el-select v-model="form.value" placeholder="请选择" size="small" style="width: 100%;" class="laterItem-right" @keydown.native.stop>
                                <el-option
                                    v-for="item in photometryModeList"
                                    :key="item.key"
                                    :label="item.value"
                                    :value="item.key">
                                </el-option>
                            </el-select>
                        </div>
                        <div class="laterItem">
                            <div class="laterItem-name">曝光补偿</div>
                            <div class="laterItem-right flexBetween">
                                <el-slider v-model="form.value1" class="slider"></el-slider>
                                <el-input v-model="form.value1" placeholder="内容" size="small" class="laterItem-input" @keydown.native.stop></el-input>
                            </div>
                        </div>
                        <div class="laterItem">
                            <div class="laterItem-name">补偿曲线</div>
                            <el-select v-model="form.value" placeholder="请选择" size="small" style="width: 100%;" class="laterItem-right" @keydown.native.stop>
                                <el-option
                                    v-for="item in []"
                                    :key="item.key"
                                    :label="item.value"
                                    :value="item.key">
                                </el-option>
                            </el-select>
                        </div>
                        <div class="laterItem">
                            <div class="laterItem-name">最小亮度</div>
                            <div class="laterItem-right flexBetween">
                                <el-slider v-model="form.value1" class="slider"></el-slider>
                                <el-input v-model="form.value1" placeholder="内容" size="small" class="laterItem-input" @keydown.native.stop></el-input>
                            </div>
                        </div>
                        <div class="laterItem">
                            <div class="laterItem-name">最大亮度</div>
                            <div class="laterItem-right flexBetween">
                                <el-slider v-model="form.value1" class="slider"></el-slider>
                                <el-input v-model="form.value1" placeholder="内容" size="small" class="laterItem-input" @keydown.native.stop></el-input>
                            </div>
                        </div>
                        <div class="laterItem">
                            <div class="laterItem-name">减速</div>
                            <div class="laterItem-right flexBetween">
                                <el-slider v-model="form.value1" class="slider"></el-slider>
                                <el-input v-model="form.value1" placeholder="内容" size="small" class="laterItem-input" @keydown.native.stop></el-input>
                            </div>
                        </div>
                        <div class="laterItem">
                            <div class="laterItem-name">加速</div>
                            <div class="laterItem-right flexBetween">
                                <el-slider v-model="form.value1" class="slider"></el-slider>
                                <el-input v-model="form.value1" placeholder="内容" size="small" class="laterItem-input" @keydown.native.stop></el-input>
                            </div>
                        </div>
                    </div>
                </el-collapse-item>
                <el-collapse-item name="6">
                    <template slot="title">
                        <div class="laterTitle">
                            <el-checkbox v-model="form.checked">脏轨遮罩</el-checkbox>
                        </div>
                    </template>
                    <div class="laterContent">
                        <div class="laterItem">
                            <div class="laterItem-name">遮罩贴图</div>
                            <div class="laterItem-right color">
                                <el-color-picker @change="changeColor" v-model="form.lightColor" show-alpha></el-color-picker>
                            </div>
                        </div>
                        <div class="laterItem">
                            <div class="laterItem-name">遮罩颜色</div>
                            <div class="laterItem-right color colorLine">
                                <el-color-picker @change="changeColor" v-model="form.lightColor" show-alpha></el-color-picker>
                                <span>#E44B4B</span>
                            </div>
                        </div>
                        <div class="laterItem">
                            <div class="laterItem-name">遮罩强度</div>
                            <div class="laterItem-right flexBetween">
                                <el-slider v-model="form.value1" class="slider"></el-slider>
                                <el-input v-model="form.value1" placeholder="内容" size="small" class="laterItem-input" @keydown.native.stop></el-input>
                            </div>
                        </div>
                    </div>
                </el-collapse-item>
                <el-collapse-item name="7">
                    <template slot="title">
                        <div class="laterTitle">
                            <el-checkbox v-model="form.checked">镜头光晕</el-checkbox>
                        </div>
                    </template>
                    <div class="laterContent">
                        <div class="laterItem">
                            <div class="laterItem-name">光晕颜色</div>
                            <div class="laterItem-right color colorLine">
                                <el-color-picker @change="changeColor" v-model="form.lightColor" show-alpha></el-color-picker>
                                <span>#E44B4B</span>
                            </div>
                        </div>
                        <div class="laterItem">
                            <div class="laterItem-name">光晕强度</div>
                            <div class="laterItem-right flexBetween">
                                <el-slider v-model="form.value1" class="slider"></el-slider>
                                <el-input v-model="form.value1" placeholder="内容" size="small" class="laterItem-input" @keydown.native.stop></el-input>
                            </div>
                        </div>
                    </div>
                </el-collapse-item>
                <el-collapse-item name="8">
                    <template slot="title">
                        <div class="laterTitle">
                            <el-checkbox v-model="form.checked">镜头景深</el-checkbox>
                        </div>
                    </template>
                    <div class="laterContent">
                        <div class="laterItem">
                            <div class="laterItem-name">焦距(cm)</div>
                            <div class="laterItem-right flexBetween">
                                <el-slider v-model="form.value1" class="slider"></el-slider>
                                <el-input v-model="form.value1" placeholder="内容" size="small" class="laterItem-input" @keydown.native.stop></el-input>
                            </div>
                        </div>
                        <div class="laterItem">
                            <div class="laterItem-name">光圈孔径</div>
                            <div class="laterItem-right flexBetween">
                                <el-slider v-model="form.value1" class="slider"></el-slider>
                                <el-input v-model="form.value1" placeholder="内容" size="small" class="laterItem-input" @keydown.native.stop></el-input>
                            </div>
                        </div>
                        <div class="laterItem">
                            <div class="laterItem-name">景深虚化半径</div>
                            <div class="laterItem-right flexBetween">
                                <el-slider v-model="form.value1" class="slider"></el-slider>
                                <el-input v-model="form.value1" placeholder="内容" size="small" class="laterItem-input" @keydown.native.stop></el-input>
                            </div>
                        </div>
                        <div class="laterItem">
                            <div class="laterItem-name">暗角强度</div>
                            <div class="laterItem-right flexBetween">
                                <el-slider v-model="form.value1" class="slider"></el-slider>
                                <el-input v-model="form.value1" placeholder="内容" size="small" class="laterItem-input" @keydown.native.stop></el-input>
                            </div>
                        </div>
                    </div>
                </el-collapse-item>
            </el-collapse-item>
            <div class="line"></div>
            <el-collapse-item name="9" title="颜色分级设置">
                <el-collapse-item name="10">
                    <template slot="title">
                        <div class="laterTitle">
                            <el-checkbox v-model="form.checked">白平衡</el-checkbox>
                        </div>
                    </template>
                    <div class="laterContent">
                        <div class="laterItem">
                            <div class="laterItem-name">色温</div>
                            <div class="laterItem-right flexBetween">
                                <el-slider v-model="form.value1" class="slider"></el-slider>
                                <el-input v-model="form.value1" placeholder="内容" size="small" class="laterItem-input" @keydown.native.stop></el-input>
                            </div>
                        </div>
                        <div class="laterItem">
                            <div class="laterItem-name">色调</div>
                            <div class="laterItem-right flexBetween">
                                <el-slider v-model="form.value1" class="slider"></el-slider>
                                <el-input v-model="form.value1" placeholder="内容" size="small" class="laterItem-input" @keydown.native.stop></el-input>
                            </div>
                        </div>
                    </div>
                </el-collapse-item>
                <el-collapse-item name="11">
                    <template slot="title">
                        <div class="laterTitle">
                            <el-checkbox v-model="form.checked">全局调色</el-checkbox>
                        </div>
                    </template>
                    <div class="laterContent">
                        <div class="laterItem">
                            <div class="laterItem-name" style="width: 56px;">饱和度 R</div>
                            <div class="laterItem-right flexBetween">
                                <el-slider v-model="form.value1" class="slider"></el-slider>
                                <el-input v-model="form.value1" placeholder="内容" size="small" class="laterItem-input" @keydown.native.stop></el-input>
                            </div>
                        </div>
                        <div class="laterItem">
                            <div class="laterItem-name" style="width: 56px;text-align: right;">G</div>
                            <div class="laterItem-right flexBetween">
                                <el-slider v-model="form.value1" class="slider"></el-slider>
                                <el-input v-model="form.value1" placeholder="内容" size="small" class="laterItem-input" @keydown.native.stop></el-input>
                            </div>
                        </div>
                        <div class="laterItem">
                            <div class="laterItem-name" style="width: 56px;text-align: right;">B</div>
                            <div class="laterItem-right flexBetween">
                                <el-slider v-model="form.value1" class="slider"></el-slider>
                                <el-input v-model="form.value1" placeholder="内容" size="small" class="laterItem-input" @keydown.native.stop></el-input>
                            </div>
                        </div>
                        <div class="laterItem">
                            <div class="laterItem-name" style="width: 56px;text-align: right;">Y</div>
                            <div class="laterItem-right flexBetween">
                                <el-slider v-model="form.value1" class="slider"></el-slider>
                                <el-input v-model="form.value1" placeholder="内容" size="small" class="laterItem-input" @keydown.native.stop></el-input>
                            </div>
                        </div>
                        <div class="laterItem">
                            <div class="laterItem-name" style="width: 56px;">对比度 R</div>
                            <div class="laterItem-right flexBetween">
                                <el-slider v-model="form.value1" class="slider"></el-slider>
                                <el-input v-model="form.value1" placeholder="内容" size="small" class="laterItem-input" @keydown.native.stop></el-input>
                            </div>
                        </div>
                        <div class="laterItem">
                            <div class="laterItem-name" style="width: 56px;text-align: right;">G</div>
                            <div class="laterItem-right flexBetween">
                                <el-slider v-model="form.value1" class="slider"></el-slider>
                                <el-input v-model="form.value1" placeholder="内容" size="small" class="laterItem-input" @keydown.native.stop></el-input>
                            </div>
                        </div>
                        <div class="laterItem">
                            <div class="laterItem-name" style="width: 56px;text-align: right;">B</div>
                            <div class="laterItem-right flexBetween">
                                <el-slider v-model="form.value1" class="slider"></el-slider>
                                <el-input v-model="form.value1" placeholder="内容" size="small" class="laterItem-input" @keydown.native.stop></el-input>
                            </div>
                        </div>
                        <div class="laterItem">
                            <div class="laterItem-name" style="width: 56px;text-align: right;">Y</div>
                            <div class="laterItem-right flexBetween">
                                <el-slider v-model="form.value1" class="slider"></el-slider>
                                <el-input v-model="form.value1" placeholder="内容" size="small" class="laterItem-input" @keydown.native.stop></el-input>
                            </div>
                        </div>
                    </div>
                </el-collapse-item>
            </el-collapse-item>
            <div class="line"></div>
            <el-collapse-item name="12" title="个性化渲染滤镜">
                <el-collapse-item name="13">
                    <template slot="title">
                        <div class="laterTitle">
                            <el-checkbox v-model="form.checked">环境光遮蔽（AO）</el-checkbox>
                        </div>
                    </template>
                    <div class="laterContent">
                        <div class="laterItem">
                            <div class="laterItem-name">强度</div>
                            <div class="laterItem-right flexBetween">
                                <el-slider v-model="form.value1" class="slider"></el-slider>
                                <el-input v-model="form.value1" placeholder="内容" size="small" class="laterItem-input" @keydown.native.stop></el-input>
                            </div>
                        </div>
                        <div class="laterItem">
                            <div class="laterItem-name">半径</div>
                            <div class="laterItem-right flexBetween">
                                <el-slider v-model="form.value1" class="slider"></el-slider>
                                <el-input v-model="form.value1" placeholder="内容" size="small" class="laterItem-input" @keydown.native.stop></el-input>
                            </div>
                        </div>
                    </div>
                </el-collapse-item>
                <el-collapse-item name="14">
                    <template slot="title">
                        <div class="laterTitle">
                            <el-checkbox v-model="form.checked">LUT模版</el-checkbox>
                        </div>
                    </template>
                    <div class="laterContent">
                        <div class="laterItem">
                            <div class="laterItem-name">LUT</div>
                            <el-select v-model="form.value" placeholder="请选择" size="small" style="width: 100%;" class="laterItem-right" @keydown.native.stop>
                                <el-option
                                    v-for="item in LUTList"
                                    :key="item.key"
                                    :label="item.value"
                                    :value="item.key">
                                </el-option>
                            </el-select>
                        </div>
                    </div>
                </el-collapse-item>
                <el-collapse-item name="15">
                    <template slot="title">
                        <div class="laterTitle">
                            <el-checkbox v-model="form.checked">后处理材质滤镜</el-checkbox>
                        </div>
                    </template>
                    <div class="laterContent">
                        <div class="laterItem">
                            <div class="laterItem-name">后处理材质</div>
                            <el-select v-model="form.value" placeholder="请选择" size="small" style="width: 100%;" class="laterItem-right" @keydown.native.stop>
                                <el-option
                                    v-for="item in styleList"
                                    :key="item.key"
                                    :label="item.value"
                                    :value="item.key">
                                </el-option>
                            </el-select>
                        </div>
                        <div class="laterItem">
                            <div class="laterItem-name">线框颜色</div>
                            <div class="laterItem-right color colorLine">
                                <el-color-picker @change="changeColor" v-model="form.lightColor" show-alpha></el-color-picker>
                                <span>#E44B4B</span>
                            </div>
                        </div>
                    </div>
                </el-collapse-item>
            </el-collapse-item>
        </el-collapse>
    </div>
</template>

<script>
export default {
    components: {},
    props: {},
    data() {
        return {
            activeNames: ['1'],
            form:{},
            illuminationList: [
                {
                    key:'1',
                    value:'Lumen全局光照'
                },
                {
                    key:'2',
                    value:'屏幕空间全局光照（SSGI）'
                }
            ],//光照类型
            modeList: [
                {
                    key:'1',
                    value:'标准模式'
                },
                {
                    key:'2',
                    value:'卷积模式'
                }
            ],//模式
            photometryModeList:[
                {
                    key:'1',
                    value:'自动曝光直方图模式'
                },
                {
                    key:'2',
                    value:'基本自动曝光模式'
                },
                {
                    key:'3',
                    value:'手动模式'
                }
            ],//测光模式
            LUTList:[
                {
                    key:'1',
                    value:'反差冷'
                },
                {
                    key:'2',
                    value:'反差暖'
                },
                {
                    key:'3',
                    value:'日光'
                },
                {
                    key:'4',
                    value:'夏粉'
                }
            ],//LUT模板
            styleList:[
                {
                    key:'1',
                    value:'线框风格'
                },
                {
                    key:'2',
                    value:'黑白风格'
                },
                {
                    key:'3',
                    value:'蓝图风格'
                },
                {
                    key:'4',
                    value:'速写风格'
                }
            ],//材质风格
        };
    },
    watch: {},
    computed: {},
    created() { },
    mounted() { },
    methods: {
        changeColor(e){

        }
    }
};
</script>
<style lang="less" scoped>
.line{
    border: 1px solid #464646;
}
.laterPeriod{
    padding: 0 16px;
    height: calc(100% - 100px);
    overflow-x: hidden;
    overflow-y: auto;
    .laterTitle{
        font-size: 14px;
        font-weight: 400;
        color: #FFFFFF;
    }
    .laterContent{
        .laterItem{
            display: flex;
            justify-content: flex-start;
            align-items: center;
            margin-top: 16px;
            .laterItem-name{
                font-size: 14px;
                color: #BBBDBE;
                margin-right: 16px;
            }
            .laterItem-right{
                flex: 1;
            }
            .laterItem-input{
                width: 32%;
            }
            .slider{
                width: 60%;
                /deep/.el-slider__bar{
                    background: linear-gradient(90deg, #C1EAFF 0%, #8ED1FF 100%);
                    height: 8px;
                }
                /deep/.el-slider__button{
                    background: #00C9FD;
                    box-shadow: 0px 0px 4px 0px #FFFFFF;
                    border: 2px solid #FFFFFF;
                }
            }
            .color{
                /deep/.el-color-picker__trigger{
                    border: 1px solid #727272;
                }
                /deep/.el-color-picker__color{
                    border: 1px solid #4D4B4B;
                    border-radius: 4px;
                }
                /deep/.el-color-picker__icon{
                    display: none;
                }
            }
            .colorLine{
                border-radius: 2px;
                border: 1px solid #727272;
                display: flex;
                align-items: center;
                /deep/.el-color-picker__trigger{
                    border: 0;
                }
                span{
                    color: #FFFFFF;
                    font-size: 14px;
                    padding-left: 10px;
                }
            }
        }
    }
}
/deep/.el-checkbox__input.is-checked + .el-checkbox__label{
    color: #FFFFFF!important;
}
/deep/.el-checkbox__input.is-checked .el-checkbox__inner, /deep/.el-checkbox__input.is-indeterminate .el-checkbox__inner{
    background-color: #9FAFC2!important;
    border-color: #9FAFC2!important;
}
/deep/.el-checkbox__inner::after{
    border: 1px solid #2c3539!important;
    border-left:0!important;
    border-top:0!important;
}
</style>