<!-- 后期处理 -->
<template>
    <div class="laterPeriod">
        <el-collapse v-model="activeNames">
            <el-collapse-item name="1" v-if="form.reflections">
                <template slot="title">
                    <div class="laterTitle">
                        <el-checkbox v-model="form.checkedreflections" @change="changeCheck('reflections',$event)"></el-checkbox>全局光照和反射
                    </div>
                </template>
                <div class="laterContent">
                    <div class="laterItem">
                        <div class="laterItem-name">反射方式</div>
                        <el-select v-model="form.reflections.method" :disabled="!form.checkedreflections" placeholder="请选择" size="small" style="width: 100%;" class="laterItem-right" @keydown.native.stop @change="setWeather">
                            <el-option
                                v-for="item in illuminationList"
                                :key="item.key"
                                :label="item.value"
                                :value="item.key">
                            </el-option>
                        </el-select>
                    </div>
                    <!-- <div class="laterItem">
                        <div class="laterItem-name">光照类型</div>
                        <div class="laterItem-right flexBetween">
                            <el-slider v-model="form.value1" class="slider"></el-slider>
                            <el-input v-model="form.value1" placeholder="内容" size="small" class="laterItem-input" @keydown.native.stop></el-input>
                        </div>
                    </div> -->
                    <div class="laterItem">
                        <div class="laterItem-name">反射质量</div>
                        <div class="laterItem-right flexBetween" v-if="form.reflections.method==='Lumen'">
                            <el-slider v-model="form.reflections.lumenReflections.qualitySliderInput" :disabled="!form.checkedreflections" :min="form.reflections.lumenReflections.qualityMin" :max="form.reflections.lumenReflections.qualityMax" :step="0.1" class="slider" @change="setWeatherInput('reflections.lumenReflections.quality',$event)"></el-slider>
                            <el-input v-model.number="form.reflections.lumenReflections.quality" :disabled="!form.checkedreflections" type="number" placeholder="内容" size="small" class="laterItem-input" @keydown.native.stop @change="setWeather"></el-input>
                        </div>
                        <div class="laterItem-right flexBetween" v-if="form.reflections.method==='ScreenSpace'">
                            <el-slider v-model="form.reflections.screenSpaceReflections.qualitySliderInput" :disabled="!form.checkedreflections" :min="0" :max="100" :step="1" class="slider" @change="setWeatherInput('reflections.screenSpaceReflections.quality',$event)"></el-slider>
                            <el-input v-model.number="form.reflections.screenSpaceReflections.quality" :disabled="!form.checkedreflections" type="number" placeholder="内容" size="small" class="laterItem-input" @keydown.native.stop @change="setWeather"></el-input>
                        </div>
                    </div>
                </div>
            </el-collapse-item>
            <div class="line"></div>
            <el-collapse-item name="3" title="相机镜头设置">
                <el-collapse-item name="4" v-if="form.bloom">
                    <template slot="title">
                        <div class="laterTitle">
                            <el-checkbox v-model="form.checkedbloom" @change="changeCheck('bloom',$event)"></el-checkbox>泛光
                        </div>
                    </template>
                    <div class="laterContent">
                        <div class="laterItem">
                            <div class="laterItem-name">模式</div>
                            <el-select v-model="form.bloom.method" :disabled="!form.checkedbloom" placeholder="请选择" size="small" style="width: 100%;" class="laterItem-right" @keydown.native.stop @change="setWeather">
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
                                <el-slider v-model="form.bloom.intensitySliderInput" :disabled="!form.checkedbloom" :min="0" :max="8" :step="0.1" class="slider" @change="setWeatherInput('bloom.intensity',$event)"></el-slider>
                                <el-input v-model.number="form.bloom.intensity" :disabled="!form.checkedbloom" type="number" placeholder="内容" size="small" class="laterItem-input" @keydown.native.stop @change="setWeather"></el-input>
                            </div>
                        </div>
                    </div>
                </el-collapse-item>
                <el-collapse-item name="5" v-if="form.exposure">
                    <template slot="title">
                        <div class="laterTitle">
                            <el-checkbox v-model="form.checkedexposure" @change="changeCheck('exposure',$event)"></el-checkbox>曝光
                        </div>
                    </template>
                    <div class="laterContent">
                        <div class="laterItem">
                            <div class="laterItem-name">测光模式</div>
                            <el-select v-model="form.exposure.meteringMode" :disabled="!form.checkedexposure" placeholder="请选择" size="small" style="width: 100%;" class="laterItem-right" @keydown.native.stop @change="setWeather">
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
                                <el-slider v-model="form.exposure.exposureCompensationSliderInput" :disabled="!form.checkedexposure" :min="-15" :max="15" :step="1" class="slider" @change="setWeatherInput('exposure.exposureCompensation',$event)"></el-slider>
                                <el-input v-model.number="form.exposure.exposureCompensation" :disabled="!form.checkedexposure" type="number" placeholder="内容" size="small" class="laterItem-input" @keydown.native.stop @change="setWeather"></el-input>
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
                                <el-slider v-model="form.exposure.minBrightnessSliderInput" :disabled="!form.checkedexposure" :min="-10" :max="20" :step="0.1" class="slider" @change="setWeatherInput('exposure.minBrightness',$event)"></el-slider>
                                <el-input v-model.number="form.exposure.minBrightness" :disabled="!form.checkedexposure" type="number" placeholder="内容" size="small" class="laterItem-input" @keydown.native.stop @change="setWeather"></el-input>
                            </div>
                        </div>
                        <div class="laterItem">
                            <div class="laterItem-name">最大亮度</div>
                            <div class="laterItem-right flexBetween">
                                <el-slider v-model="form.exposure.maxBrightnessSliderInput" :disabled="!form.checkedexposure" :min="-10" :max="20" :step="0.1" class="slider" @change="setWeatherInput('exposure.maxBrightness',$event)"></el-slider>
                                <el-input v-model.number="form.exposure.maxBrightness" :disabled="!form.checkedexposure" type="number" placeholder="内容" size="small" class="laterItem-input" @keydown.native.stop @change="setWeather"></el-input>
                            </div>
                        </div>
                        <div class="laterItem">
                            <div class="laterItem-name">减速</div>
                            <div class="laterItem-right flexBetween">
                                <el-slider v-model="form.exposure.speedDownSliderInput" :disabled="!form.checkedexposure" :min="0.02" :max="20" :step="0.01" class="slider" @change="setWeatherInput('exposure.speedDown',$event)"></el-slider>
                                <el-input v-model.number="form.exposure.speedDown" :disabled="!form.checkedexposure" type="number" placeholder="内容" size="small" class="laterItem-input" @keydown.native.stop @change="setWeather"></el-input>
                            </div>
                        </div>
                        <div class="laterItem">
                            <div class="laterItem-name">加速</div>
                            <div class="laterItem-right flexBetween">
                                <el-slider v-model="form.exposure.speedUpSliderInput" :disabled="!form.checkedexposure" :min="0.02" :max="20" :step="0.01" class="slider" @change="setWeatherInput('exposure.speedUp',$event)"></el-slider>
                                <el-input v-model.number="form.exposure.speedUp" :disabled="!form.checkedexposure" type="number" placeholder="内容" size="small" class="laterItem-input" @keydown.native.stop @change="setWeather"></el-input>
                            </div>
                        </div>
                    </div>
                </el-collapse-item>
                <el-collapse-item name="6" v-if="form.dirtMask">
                    <template slot="title">
                        <div class="laterTitle">
                            <el-checkbox v-model="form.checkeddirtMask" @change="changeCheck('dirtMask',$event)"></el-checkbox>脏轨遮罩
                        </div>
                    </template>
                    <div class="laterContent">
                        <div class="laterItem">
                            <div class="laterItem-name">遮罩贴图</div>
                            <div class="laterItem-right color">
                                <SingleUpload v-model="form.dirtMask.dirtMaskTexture" accept="image/png" url="/weather/uploadImg" :params="{ taskId: data.taskId,fileUpload:'' }" @success="setWeather" :disabled="!form.checkeddirtMask" class="upload"/>
                            </div>
                        </div>
                        <div class="laterItem">
                            <div class="laterItem-name">遮罩颜色</div>
                            <div class="laterItem-right color colorLine">
                                <el-color-picker v-model="form.dirtMask.dirtMaskTint" :disabled="!form.checkeddirtMask" show-alpha @change="setWeather"></el-color-picker>
                                <span>{{ form.dirtMask.dirtMaskTint }}</span>
                            </div>
                        </div>
                        <div class="laterItem">
                            <div class="laterItem-name">遮罩强度</div>
                            <div class="laterItem-right flexBetween">
                                <el-slider v-model="form.dirtMask.dirtMaskIntensitySliderInput" :disabled="!form.checkeddirtMask" :min="0" :max="8" :step="1" class="slider" @change="setWeatherInput('dirtMask.dirtMaskIntensity',$event)"></el-slider>
                                <el-input v-model.number="form.dirtMask.dirtMaskIntensity" :disabled="!form.checkeddirtMask" type="number" placeholder="内容" size="small" class="laterItem-input" @keydown.native.stop @change="setWeather"></el-input>
                            </div>
                        </div>
                    </div>
                </el-collapse-item>
                <el-collapse-item name="7" v-if="form.lensFlares">
                    <template slot="title">
                        <div class="laterTitle">
                            <el-checkbox v-model="form.checkedlensFlares" @change="changeCheck('lensFlares',$event)"></el-checkbox>镜头光晕
                        </div>
                    </template>
                    <div class="laterContent">
                        <div class="laterItem">
                            <div class="laterItem-name">光晕颜色</div>
                            <div class="laterItem-right color colorLine">
                                <el-color-picker v-model="form.lensFlares.tint" :disabled="!form.checkedlensFlares" show-alpha @change="setWeather"></el-color-picker>
                                <span>{{ form.lensFlares.tint }}</span>
                            </div>
                        </div>
                        <div class="laterItem">
                            <div class="laterItem-name">光晕强度</div>
                            <div class="laterItem-right flexBetween">
                                <el-slider v-model="form.lensFlares.intensitySliderInput" :disabled="!form.checkedlensFlares" :min="0" :max="16" :step="1" class="slider" @change="setWeatherInput('lensFlares.intensity',$event)"></el-slider>
                                <el-input v-model.number="form.lensFlares.intensity" :disabled="!form.checkedlensFlares" type="number" placeholder="内容" size="small" class="laterItem-input" @keydown.native.stop @change="setWeather"></el-input>
                            </div>
                        </div>
                    </div>
                </el-collapse-item>
                <el-collapse-item name="8" v-if="form.camera">
                    <template slot="title">
                        <div class="laterTitle">
                            <el-checkbox v-model="form.checkedcamera" @change="changeCheck('camera',$event)"></el-checkbox>镜头景深
                        </div>
                    </template>
                    <div class="laterContent">
                        <div class="laterItem">
                            <div class="laterItem-name">焦距(cm)</div>
                            <div class="laterItem-right flexBetween">
                                <el-slider v-model="form.camera.focalDistanceSliderInput" :disabled="!form.checkedcamera" :min="0" :max="10000" :step="1" class="slider" @change="setWeatherInput('camera.focalDistance',$event)"></el-slider>
                                <el-input v-model.number="form.camera.focalDistance" :disabled="!form.checkedcamera" type="number" placeholder="内容" size="small" class="laterItem-input" @keydown.native.stop @change="setWeather"></el-input>
                            </div>
                        </div>
                        <div class="laterItem">
                            <div class="laterItem-name">光圈孔径</div>
                            <div class="laterItem-right flexBetween">
                                <el-slider v-model="form.camera.apertureSliderInput" :disabled="!form.checkedcamera" :min="1" :max="64" :step="1" class="slider" @change="setWeatherInput('camera.aperture',$event)"></el-slider>
                                <el-input v-model.number="form.camera.aperture" :disabled="!form.checkedcamera" type="number" placeholder="内容" size="small" class="laterItem-input" @keydown.native.stop @change="setWeather"></el-input>
                            </div>
                        </div>
                        <div class="laterItem">
                            <div class="laterItem-name">景深虚化半径</div>
                            <div class="laterItem-right flexBetween">
                                <el-slider v-model="form.camera.depthBlurRadiusSliderInput" :disabled="!form.checkedcamera" :min="0" :max="4" :step="0.1" class="slider" @change="setWeatherInput('camera.depthBlurRadius',$event)"></el-slider>
                                <el-input v-model.number="form.camera.depthBlurRadius" :disabled="!form.checkedcamera" type="number" placeholder="内容" size="small" class="laterItem-input" @keydown.native.stop @change="setWeather"></el-input>
                            </div>
                        </div>
                        <div class="laterItem">
                            <div class="laterItem-name">暗角强度</div>
                            <div class="laterItem-right flexBetween">
                                <el-slider v-model="form.camera.vignetteIntensitySliderInput" :disabled="!form.checkedcamera" :min="0" :max="5" :step="0.1" class="slider" @change="setWeatherInput('camera.vignetteIntensity',$event)"></el-slider>
                                <el-input v-model.number="form.camera.vignetteIntensity" :disabled="!form.checkedcamera" type="number" placeholder="内容" size="small" class="laterItem-input" @keydown.native.stop @change="setWeather"></el-input>
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
                            <el-checkbox v-model="form.checkedtemperature" @change="changeCheck('temperature',$event)"></el-checkbox>白平衡
                        </div>
                    </template>
                    <div class="laterContent">
                        <div class="laterItem">
                            <div class="laterItem-name">色温</div>
                            <div class="laterItem-right flexBetween">
                                <el-slider v-model="form.temperature.tempSliderInput" :disabled="!form.checkedtemperature" :min="1500" :max="15000" :step="1" class="slider" @change="setWeatherInput('temperature.temp',$event)"></el-slider>
                                <el-input v-model.number="form.temperature.temp" :disabled="!form.checkedtemperature" type="number" placeholder="内容" size="small" class="laterItem-input" @keydown.native.stop @change="setWeather"></el-input>
                            </div>
                        </div>
                        <div class="laterItem">
                            <div class="laterItem-name">色调</div>
                            <div class="laterItem-right flexBetween">
                                <el-slider v-model="form.temperature.tintSliderInput" :disabled="!form.checkedtemperature" :min="-1" :max="1" :step="0.1" class="slider" @change="setWeatherInput('temperature.tint',$event)"></el-slider>
                                <el-input v-model.number="form.temperature.tint" :disabled="!form.checkedtemperature" type="number" placeholder="内容" size="small" class="laterItem-input" @keydown.native.stop @change="setWeather"></el-input>
                            </div>
                        </div>
                    </div>
                </el-collapse-item>
                <el-collapse-item name="11" v-if="form.colorGradingGlobal">
                    <template slot="title">
                        <div class="laterTitle">
                            <el-checkbox v-model="form.checkedcolorGradingGlobal" @change="changeCheck('colorGradingGlobal',$event)"></el-checkbox>全局调色
                        </div>
                    </template>
                    <div class="laterContent" v-if="form.colorGradingGlobal.saturationSliderInput">
                        <div class="laterItem">
                            <div class="laterItem-name" style="width: 56px;">饱和度 R</div>
                            <div class="laterItem-right flexBetween">
                                <el-slider v-model="form.colorGradingGlobal.saturationSliderInput[0]" :disabled="!form.checkedcolorGradingGlobal" :min="0" :max="2" :step="0.1" class="slider" @change="setWeatherInput('colorGradingGlobal.saturation.0',$event)"></el-slider>
                                <el-input v-model.number="form.colorGradingGlobal.saturation[0]" :disabled="!form.checkedcolorGradingGlobal" type="number" placeholder="内容" size="small" class="laterItem-input" @keydown.native.stop @change="setWeather"></el-input>
                            </div>
                        </div>
                        <div class="laterItem">
                            <div class="laterItem-name" style="width: 56px;text-align: right;">G</div>
                            <div class="laterItem-right flexBetween">
                                <el-slider v-model="form.colorGradingGlobal.saturationSliderInput[1]" :disabled="!form.checkedcolorGradingGlobal" :min="0" :max="2" :step="0.1" class="slider" @change="setWeatherInput('colorGradingGlobal.saturation.1',$event)"></el-slider>
                                <el-input v-model.number="form.colorGradingGlobal.saturation[1]" :disabled="!form.checkedcolorGradingGlobal" type="number" placeholder="内容" size="small" class="laterItem-input" @keydown.native.stop @change="setWeather"></el-input>
                            </div>
                        </div>
                        <div class="laterItem">
                            <div class="laterItem-name" style="width: 56px;text-align: right;">B</div>
                            <div class="laterItem-right flexBetween">
                                <el-slider v-model="form.colorGradingGlobal.saturationSliderInput[2]" :disabled="!form.checkedcolorGradingGlobal" :min="0" :max="2" :step="0.1" class="slider" @change="setWeatherInput('colorGradingGlobal.saturation.2',$event)"></el-slider>
                                <el-input v-model.number="form.colorGradingGlobal.saturation[2]" :disabled="!form.checkedcolorGradingGlobal" type="number" placeholder="内容" size="small" class="laterItem-input" @keydown.native.stop @change="setWeather"></el-input>
                            </div>
                        </div>
                        <div class="laterItem">
                            <div class="laterItem-name" style="width: 56px;text-align: right;">W</div>
                            <div class="laterItem-right flexBetween">
                                <el-slider v-model="form.colorGradingGlobal.saturationSliderInput[3]" :disabled="!form.checkedcolorGradingGlobal" :min="0" :max="2" :step="0.1" class="slider" @change="setWeatherInput('colorGradingGlobal.saturation.3',$event)"></el-slider>
                                <el-input v-model.number="form.colorGradingGlobal.saturation[3]" :disabled="!form.checkedcolorGradingGlobal" type="number" placeholder="内容" size="small" class="laterItem-input" @keydown.native.stop @change="setWeather"></el-input>
                            </div>
                        </div>
                        <div class="laterItem">
                            <div class="laterItem-name" style="width: 56px;">对比度 R</div>
                            <div class="laterItem-right flexBetween">
                                <el-slider v-model="form.colorGradingGlobal.contrastSliderInput[0]" :disabled="!form.checkedcolorGradingGlobal" :min="0" :max="2" :step="0.1" class="slider" @change="setWeatherInput('colorGradingGlobal.contrast.0',$event)"></el-slider>
                                <el-input v-model.number="form.colorGradingGlobal.contrast[0]" :disabled="!form.checkedcolorGradingGlobal" type="number" placeholder="内容" size="small" class="laterItem-input" @keydown.native.stop @change="setWeather"></el-input>
                            </div>
                        </div>
                        <div class="laterItem">
                            <div class="laterItem-name" style="width: 56px;text-align: right;">G</div>
                            <div class="laterItem-right flexBetween">
                                <el-slider v-model="form.colorGradingGlobal.contrastSliderInput[1]" :disabled="!form.checkedcolorGradingGlobal" :min="0" :max="2" :step="0.1" class="slider" @change="setWeatherInput('colorGradingGlobal.contrast.1',$event)"></el-slider>
                                <el-input v-model.number="form.colorGradingGlobal.contrast[1]" :disabled="!form.checkedcolorGradingGlobal" type="number" placeholder="内容" size="small" class="laterItem-input" @keydown.native.stop @change="setWeather"></el-input>
                            </div>
                        </div>
                        <div class="laterItem">
                            <div class="laterItem-name" style="width: 56px;text-align: right;">B</div>
                            <div class="laterItem-right flexBetween">
                                <el-slider v-model="form.colorGradingGlobal.contrastSliderInput[2]" :disabled="!form.checkedcolorGradingGlobal" :min="0" :max="2" :step="0.1" class="slider" @change="setWeatherInput('colorGradingGlobal.contrast.2',$event)"></el-slider>
                                <el-input v-model.number="form.colorGradingGlobal.contrast[2]" :disabled="!form.checkedcolorGradingGlobal" type="number" placeholder="内容" size="small" class="laterItem-input" @keydown.native.stop @change="setWeather"></el-input>
                            </div>
                        </div>
                        <div class="laterItem">
                            <div class="laterItem-name" style="width: 56px;text-align: right;">W</div>
                            <div class="laterItem-right flexBetween">
                                <el-slider v-model="form.colorGradingGlobal.contrastSliderInput[3]" :disabled="!form.checkedcolorGradingGlobal" :min="0" :max="2" :step="0.1" class="slider" @change="setWeatherInput('colorGradingGlobal.contrast.3',$event)"></el-slider>
                                <el-input v-model.number="form.colorGradingGlobal.contrast[3]" :disabled="!form.checkedcolorGradingGlobal" type="number" placeholder="内容" size="small" class="laterItem-input" @keydown.native.stop @change="setWeather"></el-input>
                            </div>
                        </div>
                    </div>
                </el-collapse-item>
            </el-collapse-item>
            <div class="line"></div>
            <el-collapse-item name="12" title="个性化渲染滤镜">
                <el-collapse-item name="13" v-if="form.ambientOcclusion">
                    <template slot="title">
                        <div class="laterTitle">
                            <el-checkbox v-model="form.checkedambientOcclusion" @change="changeCheck('ambientOcclusion',$event)"></el-checkbox>环境光遮蔽（AO）
                        </div>
                    </template>
                    <div class="laterContent">
                        <div class="laterItem">
                            <div class="laterItem-name">强度</div>
                            <div class="laterItem-right flexBetween">
                                <el-slider v-model="form.ambientOcclusion.intensitySliderInput" :disabled="!form.checkedambientOcclusion" :min="0" :max="1" :step="0.1" class="slider" @change="setWeatherInput('ambientOcclusion.intensity',$event)"></el-slider>
                                <el-input v-model.number="form.ambientOcclusion.intensity" :disabled="!form.checkedambientOcclusion" type="number" placeholder="内容" size="small" class="laterItem-input" @keydown.native.stop @change="setWeather"></el-input>
                            </div>
                        </div>
                        <div class="laterItem">
                            <div class="laterItem-name">半径</div>
                            <div class="laterItem-right flexBetween">
                                <el-slider v-model="form.ambientOcclusion.radiusSliderInput" :disabled="!form.checkedambientOcclusion" :min="0.1" :max="500" :step="0.1" class="slider" @change="setWeatherInput('ambientOcclusion.radius',$event)"></el-slider>
                                <el-input v-model.number="form.ambientOcclusion.radius" :disabled="!form.checkedambientOcclusion" type="number" placeholder="内容" size="small" class="laterItem-input" @keydown.native.stop @change="setWeather"></el-input>
                            </div>
                        </div>
                    </div>
                </el-collapse-item>
                <el-collapse-item name="14" v-if="form.misc">
                    <template slot="title">
                        <div class="laterTitle">
                            <el-checkbox v-model="form.checkedmisc"></el-checkbox>LUT模版
                        </div>
                    </template>
                    <div class="laterContent">
                        <div class="laterItem">
                            <div class="laterItem-name">LUT</div>
                            <el-select v-model="form.misc.colorGradingLUTIndex" :disabled="!form.checkedmisc" placeholder="请选择" size="small" style="width: 100%;" class="laterItem-right" @keydown.native.stop @change="setWeather">
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
                            <el-checkbox v-model="form.checked"></el-checkbox>后处理材质滤镜
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
                                <el-color-picker v-model="form.lightColor" show-alpha></el-color-picker>
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
import SingleUpload from '@/components/Upload/singleUpload.vue'
import { getWeather, setWeather } from '@/api/userCenter/weather.js'
export default {
    components: { SingleUpload },
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
                misc:{
                    colorGradingLUTIndex:0
                },
                reflections:{
                    lumenReflections:{
                        quality:1
                    },
                    screenSpaceReflections:{
                        quality:1
                    },
                    method:'Lumen'
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
                radius:200,
                quality:1
            },
            illuminationList: [
                {
                    key:'Lumen',
                    value:'Lumen全局光照'
                },
                {
                    key:'ScreenSpace',
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
                    key:0,
                    value:'置空'
                },
                {
                    key:1,
                    value:'秋天氛围'
                },
                {
                    key:2,
                    value:'电影胶片'
                },
                {
                    key:3,
                    value:'电影氛围'
                },
                {
                    key:4,
                    value:'现代城市'
                },
                {
                    key:5,
                    value:'咖啡氛围'
                },
                {
                    key:6,
                    value:'好莱坞电影'
                },
                {
                    key:7,
                    value:'地貌景观'
                },
                {
                    key:8,
                    value:'怀旧氛围'
                },
                {
                    key:9,
                    value:'复古电影'
                },
                {
                    key:10,
                    value:'灰白暖调'
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
                const addParams = (data)=>{
                    Object.keys(data).forEach(e=>{
                        if(Object.prototype.toString.call(data[e]) === '[object Object]'){
                            for (let key in data[e]) {
                                if(Object.prototype.toString.call(data[e][key]) === '[object Object]'){
                                    addParams(data[e])
                                }else if(this.SliderInputForm.hasOwnProperty(key)){
                                    this.$set(data[e],`${key}SliderInput`,JSON.parse(JSON.stringify(data[e][key])))
                                }
                            }
                            this.$set(data,`checked${e}`,this.hasAllProperties(data[e],this.$options.data().form[e]))
                        }
                    })
                }
                addParams(this.form)
            })
        },
        // 对象是否包含另一个对象的属性
        hasAllProperties(obj1, obj2) {
            let count = 0
            const total = (obj1, obj2)=>{
                if(Object.prototype.toString.call(obj1) !== '[object Object]') return
                for (let key in obj2) {
                    if(Object.prototype.toString.call(obj2[key]) === '[object Object]'){
                        total(obj1[key],obj2[key])
                    }else if (obj1!==null && (JSON.stringify(obj1[key]) === JSON.stringify(obj2[key]))) {
                        ++count
                    }
                }
            }
            total(obj1, obj2)
            // 计算参数总数和
            const countParams = (obj)=> {
                let counts = 0;
                for (let key in obj) {
                    if (Object.prototype.toString.call(obj[key]) === '[object Object]') {
                        counts += countParams(obj[key]);
                    } else {
                        counts++;
                    }
                }
                return counts;
            }
            if(typeof obj2 === 'object' && count === countParams(obj2)){
                return false;
            }
            return true
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
        setWeather(){
            let data = JSON.parse(JSON.stringify(this.form))
            data.dirtMask.dirtMaskTint = this.formatColor(data.dirtMask.dirtMaskTint)
            data.lensFlares.tint = this.formatColor(data.lensFlares.tint)
            data.dirtMask.dirtMaskTexture = data.dirtMask.dirtMaskTexture.match('[^/]+(?!.*/)')[0];
            // 删除表单参数
            const deleteParams = (delData)=>{
                Object.keys(delData).forEach(e=>{
                    if(Object.prototype.toString.call(delData[e]) === '[object Object]'){
                        for (let key in delData[e]) {
                            if(Object.prototype.toString.call(delData[e][key]) === '[object Object]'){
                                deleteParams(delData[e])
                            }else if(this.SliderInputForm.hasOwnProperty(key)){
                                this.$delete(delData[e],`${key}SliderInput`)
                            }
                        }
                        this.$delete(delData,`checked${e}`)
                    }
                })
            }
            deleteParams(data)

            setWeather({taskId:this.data.taskId},data).then(res=>{
                this.$message.success('设置成功')
                this.getWeather()
            })
        },
        setWeatherInput(keyStr,value){
            const keyArr = keyStr.split('.')
            if(keyArr.length===3){
                this.form[keyArr[0]][keyArr[1]][keyArr[2]] = Number(value)
            }else{               
                this.form[keyArr[0]][keyArr[1]] = Number(value)
            }
            this.setWeather()
        },
        // 复选框
        changeCheck(type,e){
            if(!e){
                this.form[type] = this.$options.data().form[type]
                this.setWeather()
            }
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
        /deep/.el-checkbox{
            margin-right: 10px;
        }
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
/deep/.el-input__inner{
    padding:0 0 0 8px;
}
.upload {
    /deep/.el-upload{
        width: 56px;
        height: 56px;
        background: #24262B;
        border-radius: 2px;
        border: 1px solid #727272;
    }
}
</style>