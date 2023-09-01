<!-- 后期处理 -->
<template>
    <div class="laterPeriod">
        <el-collapse v-model="activeNames">
            <!-- <el-collapse-item name="1">
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
            </el-collapse-item> -->
            <!-- <div class="line"></div> -->
            <el-collapse-item name="3" title="相机镜头设置">
                <el-collapse-item name="4" v-if="form.bloom">
                    <template slot="title">
                        <div class="laterTitle">
                            <el-checkbox v-model="form.checked">泛光</el-checkbox>
                        </div>
                    </template>
                    <div class="laterContent">
                        <div class="laterItem">
                            <div class="laterItem-name">模式</div>
                            <el-select v-model="form.bloom.method" placeholder="请选择" size="small" style="width: 100%;" class="laterItem-right" @keydown.native.stop @change="setWeather">
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
                                <el-slider v-model="form.bloom.intensity" :min="0" :max="8" :step="0.1" class="slider" @change="setWeather"></el-slider>
                                <el-input v-model="form.bloom.intensitySliderInput" placeholder="内容" size="small" class="laterItem-input" @keydown.native.stop @change="setWeather"></el-input>
                            </div>
                        </div>
                    </div>
                </el-collapse-item>
                <el-collapse-item name="5" v-if="form.exposure">
                    <template slot="title">
                        <div class="laterTitle">
                            <el-checkbox v-model="form.checked">曝光</el-checkbox>
                        </div>
                    </template>
                    <div class="laterContent">
                        <div class="laterItem">
                            <div class="laterItem-name">测光模式</div>
                            <el-select v-model="form.exposure.meteringMode" placeholder="请选择" size="small" style="width: 100%;" class="laterItem-right" @keydown.native.stop @change="setWeather">
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
                                <el-slider v-model="form.exposure.exposureCompensation" :min="-15" :max="15" :step="1" class="slider" @change="setWeather"></el-slider>
                                <el-input v-model="form.exposure.exposureCompensationSliderInput" placeholder="内容" size="small" class="laterItem-input" @keydown.native.stop @change="setWeather"></el-input>
                            </div>
                        </div>
                        <!-- <div class="laterItem">
                            <div class="laterItem-name">补偿曲线</div>
                            <el-select v-model="form.value" placeholder="请选择" size="small" style="width: 100%;" class="laterItem-right" @keydown.native.stop>
                                <el-option
                                    v-for="item in []"
                                    :key="item.key"
                                    :label="item.value"
                                    :value="item.key">
                                </el-option>
                            </el-select>
                        </div> -->
                        <div class="laterItem">
                            <div class="laterItem-name">最小亮度</div>
                            <div class="laterItem-right flexBetween">
                                <el-slider v-model="form.exposure.minBrightness" :min="-10" :max="20" :step="0.1" class="slider" @change="setWeather"></el-slider>
                                <el-input v-model="form.exposure.minBrightnessSliderInput" placeholder="内容" size="small" class="laterItem-input" @keydown.native.stop @change="setWeather"></el-input>
                            </div>
                        </div>
                        <div class="laterItem">
                            <div class="laterItem-name">最大亮度</div>
                            <div class="laterItem-right flexBetween">
                                <el-slider v-model="form.exposure.maxBrightness" :min="-10" :max="20" :step="0.1" class="slider" @change="setWeather"></el-slider>
                                <el-input v-model="form.exposure.maxBrightnessSliderInput" placeholder="内容" size="small" class="laterItem-input" @keydown.native.stop @change="setWeather"></el-input>
                            </div>
                        </div>
                        <div class="laterItem">
                            <div class="laterItem-name">减速</div>
                            <div class="laterItem-right flexBetween">
                                <el-slider v-model="form.exposure.speedDown" :min="0.02" :max="20" :step="0.01" class="slider" @change="setWeather"></el-slider>
                                <el-input v-model="form.exposure.speedDownSliderInput" placeholder="内容" size="small" class="laterItem-input" @keydown.native.stop @change="setWeather"></el-input>
                            </div>
                        </div>
                        <div class="laterItem">
                            <div class="laterItem-name">加速</div>
                            <div class="laterItem-right flexBetween">
                                <el-slider v-model="form.exposure.speedUp" :min="0.02" :max="20" :step="0.01" class="slider" @change="setWeather"></el-slider>
                                <el-input v-model="form.exposure.speedUpSliderInput" placeholder="内容" size="small" class="laterItem-input" @keydown.native.stop @change="setWeather"></el-input>
                            </div>
                        </div>
                    </div>
                </el-collapse-item>
                <el-collapse-item name="6" v-if="form.dirtMask">
                    <template slot="title">
                        <div class="laterTitle">
                            <el-checkbox v-model="form.checked">脏轨遮罩</el-checkbox>
                        </div>
                    </template>
                    <div class="laterContent">
                        <div class="laterItem">
                            <div class="laterItem-name">遮罩贴图</div>
                            <div class="laterItem-right color">
                                <el-color-picker @change="changeColor" v-model="form.dirtMask.dirtMaskTexture" show-alpha></el-color-picker>
                            </div>
                        </div>
                        <div class="laterItem">
                            <div class="laterItem-name">遮罩颜色</div>
                            <div class="laterItem-right color colorLine">
                                <el-color-picker v-model="form.dirtMask.dirtMaskTint" show-alpha @change="setWeather"></el-color-picker>
                                <span>{{ form.dirtMask.dirtMaskTint }}</span>
                            </div>
                        </div>
                        <div class="laterItem">
                            <div class="laterItem-name">遮罩强度</div>
                            <div class="laterItem-right flexBetween">
                                <el-slider v-model="form.dirtMask.dirtMaskIntensity" :min="0" :max="8" :step="1" class="slider" @change="setWeather"></el-slider>
                                <el-input v-model="form.dirtMask.dirtMaskIntensitySliderInput" placeholder="内容" size="small" class="laterItem-input" @keydown.native.stop @change="setWeather"></el-input>
                            </div>
                        </div>
                    </div>
                </el-collapse-item>
                <el-collapse-item name="7" v-if="form.lensFlares">
                    <template slot="title">
                        <div class="laterTitle">
                            <el-checkbox v-model="form.checked">镜头光晕</el-checkbox>
                        </div>
                    </template>
                    <div class="laterContent">
                        <div class="laterItem">
                            <div class="laterItem-name">光晕颜色</div>
                            <div class="laterItem-right color colorLine">
                                <el-color-picker v-model="form.lensFlares.tint" show-alpha @change="setWeather"></el-color-picker>
                                <span>{{ form.lensFlares.tint }}</span>
                            </div>
                        </div>
                        <div class="laterItem">
                            <div class="laterItem-name">光晕强度</div>
                            <div class="laterItem-right flexBetween">
                                <el-slider v-model="form.lensFlares.intensity" :min="0" :max="16" :step="1" class="slider" @change="setWeather"></el-slider>
                                <el-input v-model="form.lensFlares.intensitySliderInput" placeholder="内容" size="small" class="laterItem-input" @keydown.native.stop @change="setWeather"></el-input>
                            </div>
                        </div>
                    </div>
                </el-collapse-item>
                <el-collapse-item name="8" v-if="form.camera">
                    <template slot="title">
                        <div class="laterTitle">
                            <el-checkbox v-model="form.checked">镜头景深</el-checkbox>
                        </div>
                    </template>
                    <div class="laterContent">
                        <div class="laterItem">
                            <div class="laterItem-name">焦距(cm)</div>
                            <div class="laterItem-right flexBetween">
                                <el-slider v-model="form.camera.focalDistance" :min="0" :max="10000" :step="1" class="slider" @change="setWeather"></el-slider>
                                <el-input v-model="form.camera.focalDistanceSliderInput" placeholder="内容" size="small" class="laterItem-input" @keydown.native.stop @change="setWeather"></el-input>
                            </div>
                        </div>
                        <div class="laterItem">
                            <div class="laterItem-name">光圈孔径</div>
                            <div class="laterItem-right flexBetween">
                                <el-slider v-model="form.camera.aperture" :min="1" :max="64" :step="1" class="slider" @change="setWeather"></el-slider>
                                <el-input v-model="form.camera.apertureSliderInput" placeholder="内容" size="small" class="laterItem-input" @keydown.native.stop @change="setWeather"></el-input>
                            </div>
                        </div>
                        <div class="laterItem">
                            <div class="laterItem-name">景深虚化半径</div>
                            <div class="laterItem-right flexBetween">
                                <el-slider v-model="form.camera.depthBlurRadius" :min="0" :max="4" :step="0.1" class="slider" @change="setWeather"></el-slider>
                                <el-input v-model="form.camera.depthBlurRadiusSliderInput" placeholder="内容" size="small" class="laterItem-input" @keydown.native.stop @change="setWeather"></el-input>
                            </div>
                        </div>
                        <div class="laterItem">
                            <div class="laterItem-name">暗角强度</div>
                            <div class="laterItem-right flexBetween">
                                <el-slider v-model="form.camera.vignetteIntensity" :min="0" :max="5" :step="0.1" class="slider" @change="setWeather"></el-slider>
                                <el-input v-model="form.camera.vignetteIntensitySliderInput" placeholder="内容" size="small" class="laterItem-input" @keydown.native.stop @change="setWeather"></el-input>
                            </div>
                        </div>
                    </div>
                </el-collapse-item>
            </el-collapse-item>
            <div class="line"></div>
            <el-collapse-item name="9" title="颜色分级设置" v-if="form.temperature">
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
                                <el-slider v-model="form.temperature.temp" :min="1500" :max="15000" :step="1" class="slider" @change="setWeather"></el-slider>
                                <el-input v-model="form.temperature.tempSliderInput" placeholder="内容" size="small" class="laterItem-input" @keydown.native.stop @change="setWeather"></el-input>
                            </div>
                        </div>
                        <div class="laterItem">
                            <div class="laterItem-name">色调</div>
                            <div class="laterItem-right flexBetween">
                                <el-slider v-model="form.temperature.tint" :min="-1" :max="1" :step="0.1" class="slider" @change="setWeather"></el-slider>
                                <el-input v-model="form.temperature.tintSliderInput" placeholder="内容" size="small" class="laterItem-input" @keydown.native.stop @change="setWeather"></el-input>
                            </div>
                        </div>
                    </div>
                </el-collapse-item>
                <el-collapse-item name="11" v-if="form.colorGradingGlobal">
                    <template slot="title">
                        <div class="laterTitle">
                            <el-checkbox v-model="form.checked">全局调色</el-checkbox>
                        </div>
                    </template>
                    <div class="laterContent" v-if="form.colorGradingGlobal.saturationSliderInput">
                        <div class="laterItem">
                            <div class="laterItem-name" style="width: 56px;">饱和度 R</div>
                            <div class="laterItem-right flexBetween">
                                <el-slider v-model="form.colorGradingGlobal.saturation[0]" :min="0" :max="2" :step="0.1" class="slider" @change="setWeather"></el-slider>
                                <el-input v-model="form.colorGradingGlobal.saturationSliderInput[0]" placeholder="内容" size="small" class="laterItem-input" @keydown.native.stop @change="setWeather"></el-input>
                            </div>
                        </div>
                        <div class="laterItem">
                            <div class="laterItem-name" style="width: 56px;text-align: right;">G</div>
                            <div class="laterItem-right flexBetween">
                                <el-slider v-model="form.colorGradingGlobal.saturation[1]" :min="0" :max="2" :step="0.1" class="slider" @change="setWeather"></el-slider>
                                <el-input v-model="form.colorGradingGlobal.saturationSliderInput[1]" placeholder="内容" size="small" class="laterItem-input" @keydown.native.stop @change="setWeather"></el-input>
                            </div>
                        </div>
                        <div class="laterItem">
                            <div class="laterItem-name" style="width: 56px;text-align: right;">G</div>
                            <div class="laterItem-right flexBetween">
                                <el-slider v-model="form.colorGradingGlobal.saturation[2]" :min="0" :max="2" :step="0.1" class="slider" @change="setWeather"></el-slider>
                                <el-input v-model="form.colorGradingGlobal.saturationSliderInput[2]" placeholder="内容" size="small" class="laterItem-input" @keydown.native.stop @change="setWeather"></el-input>
                            </div>
                        </div>
                        <div class="laterItem">
                            <div class="laterItem-name" style="width: 56px;text-align: right;">G</div>
                            <div class="laterItem-right flexBetween">
                                <el-slider v-model="form.colorGradingGlobal.saturation[3]" :min="0" :max="2" :step="0.1" class="slider" @change="setWeather"></el-slider>
                                <el-input v-model="form.colorGradingGlobal.saturationSliderInput[3]" placeholder="内容" size="small" class="laterItem-input" @keydown.native.stop @change="setWeather"></el-input>
                            </div>
                        </div>
                        <div class="laterItem">
                            <div class="laterItem-name" style="width: 56px;">对比度 R</div>
                            <div class="laterItem-right flexBetween">
                                <el-slider v-model="form.colorGradingGlobal.contrast[0]" :min="0" :max="2" :step="0.1" class="slider" @change="setWeather"></el-slider>
                                <el-input v-model="form.colorGradingGlobal.contrastSliderInput[0]" placeholder="内容" size="small" class="laterItem-input" @keydown.native.stop @change="setWeather"></el-input>
                            </div>
                        </div>
                        <div class="laterItem">
                            <div class="laterItem-name" style="width: 56px;text-align: right;">G</div>
                            <div class="laterItem-right flexBetween">
                                <el-slider v-model="form.colorGradingGlobal.contrast[1]" :min="0" :max="2" :step="0.1" class="slider" @change="setWeather"></el-slider>
                                <el-input v-model="form.colorGradingGlobal.contrastSliderInput[1]" placeholder="内容" size="small" class="laterItem-input" @keydown.native.stop @change="setWeather"></el-input>
                            </div>
                        </div>
                        <div class="laterItem">
                            <div class="laterItem-name" style="width: 56px;text-align: right;">B</div>
                            <div class="laterItem-right flexBetween">
                                <el-slider v-model="form.colorGradingGlobal.contrast[2]" :min="0" :max="2" :step="0.1" class="slider" @change="setWeather"></el-slider>
                                <el-input v-model="form.colorGradingGlobal.contrastSliderInput[2]" placeholder="内容" size="small" class="laterItem-input" @keydown.native.stop @change="setWeather"></el-input>
                            </div>
                        </div>
                        <div class="laterItem">
                            <div class="laterItem-name" style="width: 56px;text-align: right;">W</div>
                            <div class="laterItem-right flexBetween">
                                <el-slider v-model="form.colorGradingGlobal.contrast[3]" :min="0" :max="2" :step="0.1" class="slider" @change="setWeather"></el-slider>
                                <el-input v-model="form.colorGradingGlobal.contrastSliderInput[3]" placeholder="内容" size="small" class="laterItem-input" @keydown.native.stop @change="setWeather"></el-input>
                            </div>
                        </div>
                    </div>
                </el-collapse-item>
            </el-collapse-item>
            <div class="line"></div>
            <el-collapse-item name="12" title="个性化渲染滤镜" v-if="form.ambientOcclusion">
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
                                <el-slider v-model="form.ambientOcclusion.intensity" :min="0" :max="1" :step="0.1" class="slider" @change="setWeather"></el-slider>
                                <el-input v-model="form.ambientOcclusion.intensitySliderInput" placeholder="内容" size="small" class="laterItem-input" @keydown.native.stop @change="setWeather"></el-input>
                            </div>
                        </div>
                        <div class="laterItem">
                            <div class="laterItem-name">半径</div>
                            <div class="laterItem-right flexBetween">
                                <el-slider v-model="form.ambientOcclusion.radius" :min="0.1" :max="500" :step="0.1" class="slider" @change="setWeather"></el-slider>
                                <el-input v-model="form.ambientOcclusion.radiusSliderInput" placeholder="内容" size="small" class="laterItem-input" @keydown.native.stop @change="setWeather"></el-input>
                            </div>
                        </div>
                    </div>
                </el-collapse-item>
                <!-- <el-collapse-item name="14">
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
                </el-collapse-item> -->
                <el-collapse-item name="15">
                    <template slot="title">
                        <div class="laterTitle">
                            <el-checkbox v-model="form.checked">后处理材质滤镜</el-checkbox>
                        </div>
                    </template>
                    <div class="laterContent">
                        <div class="laterItem">
                            <div class="laterItem-name">后处理材质</div>
                            <el-select v-model="form.ppMatModeIndex" placeholder="请选择" size="small" style="width: 100%;" class="laterItem-right" @keydown.native.stop @change="setWeather">
                                <el-option
                                    v-for="item in styleList"
                                    :key="item.key"
                                    :label="item.value"
                                    :value="item.key">
                                </el-option>
                            </el-select>
                        </div>
                        <!-- <div class="laterItem">
                            <div class="laterItem-name">线框颜色</div>
                            <div class="laterItem-right color colorLine">
                                <el-color-picker @change="changeColor" v-model="form.lightColor" show-alpha></el-color-picker>
                                <span>#E44B4B</span>
                            </div>
                        </div> -->
                    </div>
                </el-collapse-item>
            </el-collapse-item>
        </el-collapse>
    </div>
</template>

<script>
import { getWeather, setWeather } from '@/api/userCenter/weather.js'
export default {
    components: {},
    props:{
        data: {
            type: Object,
            default: ()=>{},
        },
    },
    data() {
        return {
            activeNames: ['1'],
            form:{
                bloom:{
                    method:'BM_SOG',
                    intensity:0.675,
                },
                exposure:{
                    meteringMode:'AEM_Histogram',
                    exposureCompensation:1,
                    minBrightness:0,
                    maxBrightness:8,
                    speedDown:1,
                    speedUp:3
                },
                dirtMask:{
                    dirtMaskTexture:'',
                    dirtMaskTint: 'rgba(0.5,0.5,0.5,1)',
                    dirtMaskIntensity:0,
                },
                lensFlares:{
                    tint: 'rgba(1,1,1,1)',
                    intensity:1
                },
                temperature:{
                    temp:6500,
                    tint:0,
                },
                colorGradingGlobal:{
                    saturation:[1,1,1,1],
                    contrast:[1,1,1,1]
                },
                ambientOcclusion:{
                    intensity:0.5,
                    radius:200,
                },
                camera:{
                    focalDistance:0,
                    aperture:4,
                    depthBlurRadius:0,
                    vignetteIntensity:0.4
                },
                ppMatModeIndex:0
            },
            // 滚动轴后面的输入框
            SliderInputForm:{
                intensity:0.675,
                exposureCompensation:1,
                minBrightness:0,
                maxBrightness:8,
                speedDown:1,
                speedUp:3,
                dirtMaskIntensity:0,
                focalDistance:0,
                aperture:4,
                depthBlurRadius:0,
                vignetteIntensity:0.4,
                temp:6500,
                tint:0,
                saturation:[1,1,1,1],
                contrast:[1,1,1,1],
                radius:200
            },
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
                    key:'BM_SOG',
                    value:'标准模式'
                },
                {
                    key:'BM_FFT',
                    value:'卷积模式'
                }
            ],//模式
            photometryModeList:[
                {
                    key:'AEM_Histogram',
                    value:'自动曝光直方图模式'
                },
                {
                    key:'AEM_Basic',
                    value:'基本自动曝光模式'
                },
                {
                    key:'AEM_Manual',
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
                    key:0,
                    value:'正常模式选中边框高亮'
                },
                {
                    key:1,
                    value:'纯色模式-无阴影'
                },
                {
                    key:2,
                    value:'纯色模式-有阴影'
                },
                {
                    key:3,
                    value:'风格化模式-条纹'
                },
                {
                    key:4,
                    value:'风格化模式-草图'
                },
                {
                    key:5,
                    value:'风格化模式-点画'
                },
                {
                    key:6,
                    value:'风格化模式-铅笔图'
                },
                {
                    key:7,
                    value:'描边模式-黑色'
                },
                {
                    key:8,
                    value:'描边模式-发光'
                }
            ],//材质风格
        };
    },
    watch: {},
    computed: {},
    created() {
        this.getWeather()
    },
    mounted() {},
    methods: {
        getWeather(){
            getWeather({appId:this.data.appId}).then((res)=>{
                this.form = res.data
                this.$set(this.form.dirtMask,'dirtMaskTint',this.arrToRgb(res.data.dirtMask.dirtMaskTint) || this.$options.data().form.dirtMask.dirtMaskTint)
                this.$set(this.form.lensFlares,'tint',this.arrToRgb(res.data.lensFlares.tint) || this.$options.data().form.lensFlares.tint)
                // 添加表单参数
                Object.keys(this.form).forEach(e=>{
                    if(typeof this.form[e] === 'object'){
                        for (let key in this.form[e]) {
                            if(this.SliderInputForm.hasOwnProperty(key)){
                                this.$set(this.form[e],`${key}SliderInput`,this.form[e][key])
                            }
                        }
                    }
                })
                console.log('🚀🚀🚀',this.form);
            })
        },
        // 颜色数组变rgba
        arrToRgb(arr){
            if(!arr || !arr.length) return null
            return `rgba(${Number(arr[0])},${Number(arr[1])},${Number(arr[2])},${Number(arr[3])})`
        },
        // 去掉rgba,去掉空格,转数组
        formatColor(color){
            let colorStr = color && color.slice(5,color.length-1).replace(/\s*/g, '') || ''
            return colorStr.split(',')
        },
        changeColor(e){
            console.log('🚀🚀🚀',e);
        },
        setWeather(){
            let data = JSON.parse(JSON.stringify(this.form))
            data.dirtMask.dirtMaskTint = this.formatColor(data.dirtMask.dirtMaskTint)
            data.lensFlares.tint = this.formatColor(data.lensFlares.tint)
            // 添加表单参数
            Object.keys(data).forEach(e=>{
                if(typeof data[e] === 'object'){
                    for (let key in data[e]) {
                        if(this.SliderInputForm.hasOwnProperty(key)){
                            this.$delete(data[e],`${key}SliderInput`)
                        }
                    }
                }
            })
            console.log('🚀🚀🚀',data);
            setWeather({taskId:this.data.taskId},data).then(res=>{
                this.$message.success('设置成功')
            })
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