<!-- 几何信息 -->
<template>
    <div class="geometry">
        <el-empty :image="require('@/assets/noData.png')" :image-size="100" v-if="!geometryObjForm.id"></el-empty>
        <template v-else>
            <!-- 坐标 -->
            <div class="coordinate geometryItem" v-if="geometryObjForm.id && geometryObjForm.public">
                <div class="comTitle">
                    <img v-if="geometryObjForm.lightType === 'pointLight'" src="@/assets/images/component/title4.png" />
                    <img v-if="geometryObjForm.lightType === 'spotLight'" src="@/assets/images/component/title3.png" />
                    <img v-if="geometryObjForm.lightType === 'sphereReflectionCapture'" src="@/assets/images/component/title1.png" />
                    <img v-if="geometryObjForm.name === '水流仿真体'" src="@/assets/images/component/title5.png" />
                    <img v-if="geometryObjForm.name === '水源'" src="@/assets/images/component/title6.png" />
                    <img v-if="geometryObjForm.name === '喷泉'" src="@/assets/images/component/title7.png" />
                    <img v-if="geometryObjForm.name === '挡水坝'" src="@/assets/images/component/title8.png" />
                    {{ geometryObjForm.name }}
                </div>
                <div class="coordinateTitle">坐标：</div>
                <div class="coordinateItemInput">
                    X<el-input-number v-model="geometryObjForm.location.x" controls-position="right" size="mini"
                        @keydown.native.stop @change="editCom()" />
                    Y<el-input-number v-model="geometryObjForm.location.y" controls-position="right" size="mini"
                        @keydown.native.stop @change="editCom()" />
                    Z<el-input-number v-model="geometryObjForm.location.z" controls-position="right" size="mini"
                        @keydown.native.stop @change="editCom()" />
                    <i class="el-icon-refresh-right"></i>
                </div>
                <div class="coordinateTitle">角度：</div>
                <div class="coordinateItemInput">
                    P<el-input-number v-model="geometryObjForm.rotation.p" controls-position="right" size="mini"
                        @keydown.native.stop @change="editCom()" />
                    Y<el-input-number v-model="geometryObjForm.rotation.y" controls-position="right" size="mini"
                        @keydown.native.stop @change="editCom()" />
                    R<el-input-number v-model="geometryObjForm.rotation.r" controls-position="right" size="mini"
                        @keydown.native.stop @change="editCom()" />
                    <i class="el-icon-refresh-right"></i>
                </div>
                <div class="coordinateTitle">比例：</div>
                <div class="coordinateItemInput">
                    X<el-input-number v-model="geometryObjForm.scale.x" controls-position="right" size="mini"
                        @keydown.native.stop @change="editCom()" />
                    Y<el-input-number v-model="geometryObjForm.scale.y" controls-position="right" size="mini"
                        @keydown.native.stop @change="editCom()" />
                    Z<el-input-number v-model="geometryObjForm.scale.z" controls-position="right" size="mini"
                        @keydown.native.stop @change="editCom()" />
                    <i class="el-icon-refresh-right"></i>
                </div>
            </div>
            <!-- 光源参数 -->
            <div class="pointolite" v-if="['spotLight', 'pointLight', 'areaLight', 'sphereReflection'].includes(geometryObjForm.lightType)">
                <div class="comTitle">
                    <img src="@/assets/images/component/title2.png" />光源参数
                </div>
                <div class="switchBox">
                    <span class="itemSpan"
                        v-if="geometryObjForm.lightType !== 'sphereReflection'"><span>灯光开关</span><el-switch
                            @change="changeLight" v-model="geometryObjForm.affectsWorld" active-value="true"
                            inactive-value="false" active-color="#409EFF" inactive-color="#727272"></el-switch></span>
                    <span class="itemSpan"
                        v-if="geometryObjForm.lightType !== 'sphereReflection'"><span>阴影开关</span><el-switch
                            @change="changeLight" v-model="geometryObjForm.castShadow" active-value="true"
                            inactive-value="false" active-color="#409EFF" inactive-color="#727272"></el-switch></span>
                    <span class="itemSpan"
                        v-if="geometryObjForm.lightType === 'sphereReflection'"><span>反射开关</span><el-switch
                            @change="changeLight" v-model="geometryObjForm.visiableOfReflection" active-value="true"
                            inactive-value="false" active-color="#409EFF" inactive-color="#727272"></el-switch></span>
                </div>
                <div class="colorBox itemSpan" v-if="geometryObjForm.lightType !== 'sphereReflection'">
                    <span>光源颜色</span>
                    <div>
                        <el-color-picker @change="changeLight" v-model="geometryObjForm.lightColor" show-alpha></el-color-picker>
                        <span>{{ geometryObjForm.lightColor && formatColor(geometryObjForm.lightColor)}}</span>
                    </div>
                </div>
                <!-- 反射源类型 -->
                <div class="sliderBox" v-if="['sphereReflection'].includes(geometryObjForm.lightType)">
                    <div style="margin-top:15px">反射源类型</div>
                    <el-radio-group v-model="geometryObjForm.reflectionSourceType" @change="changeLight">
                        <el-radio label="CapturedScene" size="large">捕获场景</el-radio>
                        <el-radio label="SpecifiedCubemap" size="large">立体贴图</el-radio>
                    </el-radio-group>
                </div>
                <template v-for="(item, index) in lightArr">
                    <div class="sliderBox" :key="index" v-if="item.limits && item.limits.length? item.limits.includes(geometryObjForm.lightType) : true">
                        <p>{{ item.name }}</p>
                        <div class="sliderParmer">
                            <el-slider class="slider" @change="changeLight(item.key, $event)" v-model="geometryObjForm[item.key + '1']"
                                :min="item.min" :max="item.max" :step="item.step"></el-slider>
                            <el-input class="sliderInput" v-model.trim="geometryObjForm[item.key]"
                                @change="changeLight(item.key, $event)" size="small"
                                v-only-number="{ min: 0, precision: 1 }" />
                            <span class="sliderNum">{{ item.unit }}</span>
                        </div>
                    </div>
                </template>
            </div>

            <!-- ####################################################特效水start#################################################### -->
            <!-- 水流仿真体 -->
            <template v-if="geometryObjForm.name === '水流仿真体'">
                <div class="flow geometryItem">
                    <div class="comTitle">
                        <img src="@/assets/images/component/title2.png" />仿真区域设置
                    </div>
                    <div class="flowItem" v-if="flowForm.areaResolution">
                        <span>仿真区域分辨率： X</span>
                        <el-input-number v-model="flowForm.areaResolutionX" controls-position="right" size="mini"
                            @keydown.native.stop @change="editFlow()" />
                        Y<el-input-number v-model="flowForm.areaResolutionY" controls-position="right" size="mini"
                            @keydown.native.stop @change="editFlow()" />
                    </div>
                    <!-- <div class="flowItem">
                        <span>仿真区域尺寸(M)：X</span>
                        <el-input-number v-model="flowForm.areaResolution" controls-position="right" size="mini"
                            @keydown.native.stop @change="editFlow()" />
                        Y<el-input-number v-model="flowForm.areaResolution" controls-position="right" size="mini"
                            @keydown.native.stop @change="editFlow()" />
                    </div> -->
                    <div class="flowItem">
                        <span>仿真区域像素尺寸：</span>
                        <el-input class="input" v-model="flowForm.areaPixelSize" v-only-number="{precision:0}" size="mini"
                            @keydown.native.stop @change="editFlow()" />
                    </div>
                    <div class="flowItem">
                        <span>仿真区域高度(cm)：</span>
                        <el-input class="input" v-model="flowForm.simulationHeight" v-only-number="{min:0,precision:1}" size="mini"
                            @keydown.native.stop @change="editFlow()" />
                    </div>
                    <div class="flowItem">
                        <el-checkbox v-model="flowForm.debugPreview" @change="editFlow()">调试模式</el-checkbox>
                    </div>
                </div>
                <div class="flow geometryItem">
                    <div class="comTitle">水表面仿真</div>
                    <div class="flowItem">
                        <span>水表面类型：</span>
                        <el-select v-model="flowForm.fluxSurface" placeholder="请选择" size="mini" style="width: 50%;" @change="editFlow()">
                            <el-option
                                v-for="item in waterSurfaceList"
                                :key="item.key"
                                :label="item.name"
                                :value="item.key">
                            </el-option>
                        </el-select>
                    </div>
                </div>
                <div class="flow geometryItem">
                    <div class="comTitle">仿真计算</div>
                    <div class="flowItem">
                        <span>迭代计算时长(s）：</span>
                        <el-input class="input" v-model="flowForm.simulationDuration" v-only-number="{precision:1}" size="mini"
                            @keydown.native.stop @change="editFlow()" />
                    </div>
                    <div class="flowItem">
                        <span>迭代计算间隔：</span>
                        <el-input class="input" v-model="flowForm.iterativeInterval" v-only-number="{precision:4}" size="mini"
                            @keydown.native.stop @change="editFlow()" />
                    </div>
                </div>
                <div class="flowBtn flexBetween">
                    <el-button class="blueBtn" type="primary" size="small" @click="flowOperate('start')">开 始</el-button>
                    <el-button class="grayPlain" plain type="primary" size="small" @click="flowOperate('close')">停 止</el-button>
                    <el-button class="bluePlainBtn1" plain type="primary" size="small" @click="flowOperate('restart')">重 启</el-button>
                </div>
            </template>
            <!-- 水源 -->
            <div class="water geometryItem" v-if="geometryObjForm.name === '水源'">
                <div class="comTitle">
                    <img src="@/assets/images/component/title2.png" />水源设置
                </div>
                <div class="waterItem">
                    <span>水量：</span>
                    <el-input class="input" v-model="waterForm.volume" v-only-number="{min:0,precision:1}" size="mini"
                        @keydown.native.stop @change="editWater()" />
                </div>
                <div class="waterItem">
                    <span>水流速度<span style="font-size:12px">(m/s)</span>：</span>
                    X<el-input-number v-model="waterForm.velocityX" controls-position="right" size="mini"
                            @keydown.native.stop @change="editWater()" />
                    Y<el-input-number v-model="waterForm.velocityY" controls-position="right" size="mini"
                        @keydown.native.stop @change="editWater()" />
                </div>
                <div class="waterItem">
                    <span>水源形状：</span>
                    <el-select v-model="waterForm.shape" placeholder="请选择" size="mini" style="width: 50%;" @change="editWater()">
                        <el-option
                            v-for="item in shapeList"
                            :key="item.key"
                            :label="item.name"
                            :value="item.key">
                        </el-option>
                    </el-select>
                </div>
                <div class="waterItem">
                    <span>水源模式：</span>
                    <el-select v-model="waterForm.mode" placeholder="请选择" size="mini" style="width: 50%;" @change="editWater()">
                        <el-option
                            v-for="item in modeList"
                            :key="item.key"
                            :label="item.name"
                            :value="item.key">
                        </el-option>
                    </el-select>
                </div>
                <div class="waterItem">
                    <span>水流边缘：</span>
                    <el-input class="input" v-model="waterForm.edge" v-only-number="{min:0,precision:1}" size="mini"
                        @keydown.native.stop @change="editWater()" />
                </div>
                <div class="waterItem">
                    <span>区域影响强度：</span>
                    <el-input class="input" v-model="waterForm.intensity" v-only-number="{min:0,precision:1}" size="mini"
                        @keydown.native.stop @change="editWater()" />
                </div>
                <div class="waterItem">
                    <span>水源活动时长：</span>
                    <el-input class="input" v-model="waterForm.duration" v-only-number="{precision:1}" size="mini"
                        @keydown.native.stop @change="editWater()" />
                </div>
                <div class="waterItem">
                    <el-checkbox v-model="waterForm.bActivate" true-label="true" false-label="false" @change="editWater()">水源自动激活</el-checkbox>
                </div>
            </div>
            <!-- 挡水坝 -->
            <div class="geometryItem" v-if="geometryObjForm.name === '挡水坝'">
                <div class="comTitle">
                    <img src="@/assets/images/component/title2.png" />挡水坝设置
                </div>
                <el-checkbox v-model="splashDamForm.bVisible" true-label="true" false-label="false" @change="editSplashDam()">打破/拆除</el-checkbox>
            </div>
            <!-- 喷泉设置 -->
            <div class="coordinate geometryItem" v-if="geometryObjForm.name === '喷泉'">
                <div class="comTitle">
                    <img src="@/assets/images/component/title2.png" />喷泉设置
                </div>
                <div class="coordinateTitle">喷泉角度：</div>
                <div class="coordinateItemInput">
                    P<el-input-number v-model="fountainForm.fountainRotationP" controls-position="right" size="mini"
                        @keydown.native.stop @change="editFountain()" />
                    Y<el-input-number v-model="fountainForm.fountainRotationY" controls-position="right" size="mini"
                        @keydown.native.stop @change="editFountain()" />
                    R<el-input-number v-model="fountainForm.fountainRotationR" controls-position="right" size="mini"
                        @keydown.native.stop @change="editFountain()" />
                    <i class="el-icon-refresh-right"></i>
                </div>
                <div class="coordinateTitle">喷泉尺寸：</div>
                <div class="coordinateItemInput">
                    X<el-input-number v-model="fountainForm.fountainScaleX" controls-position="right" size="mini"
                        @keydown.native.stop @change="editFountain()" />
                    Y<el-input-number v-model="fountainForm.fountainScaleY" controls-position="right" size="mini"
                        @keydown.native.stop @change="editFountain()" />
                    Z<el-input-number v-model="fountainForm.fountainScaleZ" controls-position="right" size="mini"
                        @keydown.native.stop @change="editFountain()" />
                    <i class="el-icon-refresh-right"></i>
                </div>
                <div class="coordinateTitle">扩散宽度</div>
                <div class="slider">
                    <el-slider @change="editFountain()" v-model="fountainForm.spreadWidth"
                        :min="0" :max="1" :step="0.1"></el-slider>
                    <el-input class="sliderInput" v-model.trim="fountainForm.spreadWidth"
                        @change="editFountain()" size="small"
                        v-only-number="{ min: 0, precision: 1 }" />
                </div>
            </div>
            <!-- ####################################################特效水end#################################################### -->


            <!-- webui -->
            <div class="geometryItem webui" v-if="geometryObjForm.name === 'WebUi-3d'">
                <div class="comTitle">WebUI设置</div>
                <div class="webuiItem">
                    <span>是否跟随摄像头：</span>
                    <el-switch @change="editWebUI()" v-model="webuiForm.isFollowedCamera" :active-value="true"
                            :inactive-value="false" active-color="#409EFF" inactive-color="#727272"></el-switch>
                </div>
                <div class="webuiItem">
                    <span>宽度：</span>
                    <el-input class="input" v-model="webuiForm.width" v-only-number="{min:0,precision:1}" size="mini" style="width: 85px;"
                        @keydown.native.stop @change="editWebUI()" />
                    <span class="webuiUnit">cm</span>
                </div>
                <div class="webuiItem">
                    <span>高度：</span>
                    <el-input class="input" v-model="webuiForm.height" v-only-number="{min:0,precision:1}" size="mini" style="width: 85px;"
                        @keydown.native.stop @change="editWebUI()" />
                    <span class="webuiUnit">cm</span>
                </div>
                <div class="webuiItem">
                    <span>亮度：</span>
                    <el-input class="input" v-model="webuiForm.fengBrightness" v-only-number="{min:0,precision:1}" size="mini" style="width: 85px;"
                        @keydown.native.stop @change="editWebUI()" />
                </div>
                <div class="webuiItem colorBox">
                    <span>颜色及透明度</span>
                    <div>
                        <el-color-picker @change="editWebUI()" v-model="webuiForm.bgColor" show-alpha></el-color-picker>
                        <span>{{ webuiForm.bgColor && formatColor(webuiForm.bgColor)}}</span>
                    </div>
                </div>
                <div class="webuiItem">
                    <span>URL：</span>
                    <el-input class="input" v-model="webuiForm.url" type="textarea" :autosize="{ minRows: 2}" placeholder="请输入内容" size="mini"
                        @keydown.native.stop @change="editWebUI()" />
                </div>
            </div>
            <!-- 样条线 -->
            <div class="geometryItem webui" v-if="['矩形样条线', '圆形样条线'].includes(geometryObjForm.name)">
                <div class="comTitle">样条线设置</div>
                <div class="webuiItem" v-if="geometryObjForm.name === '矩形样条线'">
                    <span>宽度：</span>
                    <el-input class="input" v-model="lineForm.width" v-only-number="{min:0,precision:1}" size="mini" style="width: 85px;"
                        @keydown.native.stop @change="editLine()" />
                    <span class="webuiUnit">cm</span>
                </div>
                <div class="webuiItem" v-if="geometryObjForm.name === '矩形样条线'">
                    <span>高度：</span>
                    <el-input class="input" v-model="lineForm.height" v-only-number="{min:0,precision:1}" size="mini" style="width: 85px;"
                        @keydown.native.stop @change="editLine()" />
                    <span class="webuiUnit">cm</span>
                </div>
                <div class="webuiItem" v-if="geometryObjForm.name === '圆形样条线'">
                    <span>半径：</span>
                    <el-input class="input" v-model="lineForm.radius" v-only-number="{min:0,precision:1}" size="mini" style="width: 85px;"
                        @keydown.native.stop @change="editLine()" />
                    <span class="webuiUnit">cm</span>
                </div>
                <div class="coordinate">
                    <div class="coordinateTitle">开始点位置：</div>
                    <div class="coordinateItemInput">
                        X<el-input-number v-model="lineForm.beginLocation.x" controls-position="right" size="mini"
                            @keydown.native.stop @change="editLine()" />
                        Y<el-input-number v-model="lineForm.beginLocation.y" controls-position="right" size="mini"
                            @keydown.native.stop @change="editLine()" />
                        Z<el-input-number v-model="lineForm.beginLocation.z" controls-position="right" size="mini"
                            @keydown.native.stop @change="editLine()" />
                        <i class="el-icon-refresh-right"></i>
                    </div>
                </div>
                <div class="coordinate">
                    <div class="coordinateTitle">结束点位置：</div>
                    <div class="coordinateItemInput">
                        X<el-input-number v-model="lineForm.endLocation.x" controls-position="right" size="mini"
                            @keydown.native.stop @change="editLine()" />
                        Y<el-input-number v-model="lineForm.endLocation.y" controls-position="right" size="mini"
                            @keydown.native.stop @change="editLine()" />
                        Z<el-input-number v-model="lineForm.endLocation.z" controls-position="right" size="mini"
                            @keydown.native.stop @change="editLine()" />
                        <i class="el-icon-refresh-right"></i>
                    </div>
                </div>
            </div>
            <!-- 参数化尺寸参数 -->
            <!-- <div class="parameter geometryItem">
                    <div class="comTitle"><img src="@/assets/images/component/title2.png"/>参数化尺寸参数</div>
                    <div class="parameterItem">
                        <span>内半径</span>
                        <el-input v-model="form.input" placeholder="内容" size="mini" @keydown.native.stop/>mm
                        <i class="el-icon-refresh-right"></i>
                    </div>
                    <div class="parameterItem">
                        <span>外半径</span>
                        <el-input v-model="form.input" placeholder="内容" size="mini" @keydown.native.stop/>mm
                        <i class="el-icon-refresh-right"></i>
                    </div>
                    <div class="parameterItem">
                        <span>长度</span>
                        <el-input v-model="form.input" placeholder="内容" size="mini" @keydown.native.stop/>mm
                        <i class="el-icon-refresh-right"></i>
                    </div>
                </div> -->
            <!-- 文字信息 -->
            <!-- <div class="word">
                    <div class="wordTextarea">
                        <span>文字内容</span>
                        <el-input type="textarea" :autosize="{ minRows: 4, maxRows: 8}" placeholder="请输入内容" v-model="form.textarea2"></el-input>
                    </div>
                    <div class="componentTitle">大小字体</div>
                    <div class="wordDetail">
                        <span>高度</span>
                        <el-select v-model="form.value" placeholder="请选择" size="mini" style="width: 70px;">
                            <el-option
                            v-for="item in wordHeightList"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                            </el-option>
                        </el-select>
                        <span>字体</span>
                        <el-select v-model="form.value" placeholder="请选择" size="mini" style="width: 95px;">
                            <el-option
                            v-for="item in wordTypeList"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                            </el-option>
                        </el-select>
                    </div>
                    <div class="colorBox">
                        <span>颜色</span>
                        <div><el-color-picker v-model="form.color" show-alpha></el-color-picker><span>{{formatColor(form.color)}}</span></div>
                        <i class="el-icon-refresh-right"></i>
                    </div>
                </div> -->
        </template>
    </div>
</template>

<script>
import { moveModel } from "@/api/userCenter/componentManage.js";
import { updateComsCoordinate, fluidOperate, modifyComParams } from "@/api/userCenter/componentInformation.js";
export default {
    components: {},
    props: {
        data: {
            type: Object,
            default:()=> {}
        }
    },
    data() {
        return {
            lightArr:[
                {
                    key:'intensity',
                    name: '光源强度',
                    unit: 'cd',
                    limits: ['spotLight','pointLight','areaLight']
                },
                {
                    key:'radiationAngleOfInner',
                    name: '内辐射角',
                    unit: '°',
                    limits: ['spotLight']
                },
                {
                    key:'radiationAngleOfOuter',
                    name: '外辐射角',
                    unit: '°',
                    limits: ['spotLight']
                },
                {
                    key:'attenuationRadius',
                    name: '衰减半径',
                    unit: 'cm',
                    limits: ['spotLight','pointLight','areaLight']
                },
                {
                    key:'influenceRadius',
                    name: '影响半径',
                    unit: 'cm',
                    limits: ['sphereReflection']
                },
                {
                    key:'brightness',
                    name: '反射强度',
                    unit: '',
                    limits: ['sphereReflection'],
                    min:0,
                    max:1,
                    step:0.1
                },
                {
                    key:'sourceRadius',
                    name: '光源半径',
                    unit: 'cm',
                    limits: ['spotLight','pointLight']
                },
                {
                    key:'sourceLength',
                    name: '光源长度',
                    unit: 'cm',
                    limits: ['spotLight','pointLight']
                },
                {
                    key:'sourceHeight',
                    name: '光源高度',
                    unit: 'cm',
                    limits: ['areaLight']
                },
                {
                    key:'sourceWidth',
                    name: '光源宽度',
                    unit: 'cm',
                    limits: ['areaLight']
                },{
                    key:'barnDoorAngle',
                    name: '谷仓门角度',
                    unit: '。',
                    limits: ['areaLight']
                },{
                    key:'barnDoorLength',
                    name: '谷仓门长度',
                    unit: 'cm',
                    limits: ['areaLight']
                }
            ],
            wordHeightList: [], //字体高度
            wordTypeList: [], //字体
            // 水表面类型：
            waterSurfaceList:[
                {
                    key:'water',
                    name:'普通水流'
                },{
                    key:'river',
                    name:'河流水流'
                },{
                    key:'ocean',
                    name:'海洋水流'
                },
            ],
            // 水源形状：
            shapeList:[
                {
                    key:'circle',
                    name:'圆形'
                },{
                    key:'rectangle',
                    name:'矩形'
                },
            ],
            // 水源模式：
            modeList:[
                {
                    key:'add',
                    name:'不断增加水量'
                },{
                    key:'adjust',
                    name:'自适应'
                },{
                    key:'set',
                    name:'设置固定值'
                },
            ],
            geometryObjForm: {
                public:false,//是否是自定义构件
                model:false,//是否是整个模型
                id:'',//构件的id
                name: '',//光源名称
                lightType:'',//光源类型
                location: { x:'', y:'', z:'' },//坐标
                rotation: { p:'', y:'', r:'' },//角度
                scale: { x:1, y:1, z:1 },//比例,缩放
                affectsWorld: 'true',//灯光开关
                castShadow:'true',//阴影开关
                lightColor:'rgba(255,255,255,1)',//灯光颜色
                intensity:1,//灯光强度
                radiationAngleOfInner:44,//内辐射角
                radiationAngleOfOuter:44,//外辐射角
                attenuationRadius:100,//衰减半径
                sourceRadius:10,//光源半径
                sourceLength:200,//光源长度
                influenceRadius:10,//影响半径
                brightness:0.5,//光源亮度,反射强度
                sourceHeight:1,//光源高度
                sourceWidth:1,//光源宽度
                reflectionSourceType:'CapturedScene',//反射源类型
                barnDoorAngle:44,//谷仓门角度
                barnDoorLength:200,//谷仓门长度
                // 表单的
                intensity1:1,
                radiationAngleOfInner1:44,
                radiationAngleOfOuter1:44,
                attenuationRadius1:100,
                sourceRadius1:10,
                sourceLength1:200,
                influenceRadius1:10,
                brightness1:0.5,
                sourceHeight1:1,
                sourceWidth1:1,
                barnDoorAngle1:44,
                barnDoorLength1:200
            },
            // 水流仿真体
            flowForm:{
                areaResolution:'X=512 Y=512',
                areaResolutionX:512,
                areaResolutionY:512,
                areaPixelSize:20,
                simulationHeight:1500,
                fluxSurface:'water',
                simulationDuration:-1,
                iterativeInterval:0.008333333333,
                debugPreview:false
            },
            // 水源
            waterForm:{
                volume:0,
                velocity:'X=10 Y=10',
                velocityX:10,
                velocityY:10,
                shape:'circle',
                mode:'adjust',
                edge:1,
                intensity:1.0,
                duration:-1,
                bActivate:'false'
            },
            // 挡水坝
            splashDamForm:{
                bVisible:'false'
            },
            // 喷泉
            fountainForm:{
                fountainRotation:'P=0.0 Y=0.0 R=0.0',
                fountainRotationP:0,
                fountainRotationY:0,
                fountainRotationR:0,
                fountainScale:'X=1.0 Y=1.0 Z=1.0',
                fountainScaleX:1,
                fountainScaleY:1,
                fountainScaleZ:1,
                spreadWidth:0.4
            },
            //wenui
            webuiForm:{
                bgColor: 'rgba(0,0,0,0)',
                fengBrightness: '0.05',
                isFollowedCamera: true,
                width:'',
                height:'',
                url:''
            },
            // 样条线
            lineForm: {
                width: '10',
                height: '10',
                radius: '10',
                '开始点坐标': '',
                '结束点坐标': '',
                beginLocation: {
                    x:'',
                    y:'',
                    z:''
                },
                endLocation: {
                    x:'',
                    y:'',
                    z:''
                },
            }
        };
    },
    watch: {
        // 点击选择构件
        'data.selectPark'(val){
            if(!val || ['1','7'].includes(val.id)){
                this.geometryObjForm = this.$options.data().geometryObjForm
                this.flowForm = this.$options.data().flowForm
                this.waterForm = this.$options.data().waterForm
                this.splashDamForm = this.$options.data().splashDamForm
                this.fountainForm = this.$options.data().fountainForm
                this.webuiForm = this.$options.data().webuiForm
                this.lineForm = this.$options.data().lineForm
            }
            if(!val||val.id!=='1'){
                return
            }
            this.geometryObjForm.public = !!val.object
            if(val.object){
                this.geometryObjForm.id = val.mN
                this.geometryObjForm.model = val.model
                // 处理光源信息
                val.rsInfo.forEach(e=>{
                    if(['id','name','lightType'].includes(e.key)){
                        this.geometryObjForm[e.key] = e.value
                    }
                    // 坐标;比例,缩放
                    if(e.key==='location' || e.key==='scale'){
                        let value = e.value.split(' ')
                        this.geometryObjForm[e.key] = {
                            x: value[0].split('=')[1],
                            y: value[1].split('=')[1],
                            z: value[2].split('=')[1]
                        }
                    }
                    // 角度
                    if(e.key==='rotation'){
                        let value = e.value.split(' ')
                        this.geometryObjForm.rotation = {
                            p: value[0].split('=')[1],
                            y: value[1].split('=')[1],
                            r: value[2].split('=')[1]
                        }
                    }
                    // 阴影开关,灯光开关,反射开关,反射源类型
                    if(['castShadow','affectsWorld','visiableOfReflection','reflectionSourceType'].includes(e.key)){
                        this.geometryObjForm[e.key] = e.value
                    }
                    // 灯光颜色
                    if(e.key === 'lightColor'){
                        this.geometryObjForm.lightColor = this.arrToRgb(JSON.parse(e.value))
                    }
                    // 灯光强度,内辐射角,外辐射角,衰减半径,影响半径,光源半径,光源长度,光源亮度
                    if(['brightness','sourceLength','sourceRadius','influenceRadius','intensity','radiationAngleOfInner',
                    'radiationAngleOfOuter','attenuationRadius','barnDoorAngle','barnDoorLength','sourceWidth','sourceHeight'].includes(e.key)){
                        this.geometryObjForm[e.key] = Number(e.value)
                        this.$set(this.geometryObjForm, e.key+'1', Number(e.value))
                    }
                    // 水流仿真体
                    if(this.flowForm.hasOwnProperty(e.key)){
                        this.findParams(this.flowForm,e)
                        if(e.key==='areaResolution'){
                            this.flowForm.areaResolutionX = e.value.split(' ')[0].split('=')[1]
                            this.flowForm.areaResolutionY = e.value.split(' ')[1].split('=')[1]
                        }
                    }
                    // 水源
                    if(this.waterForm.hasOwnProperty(e.key)){
                        this.findParams(this.waterForm,e)
                        if(e.key==='velocity'){
                            this.waterForm.velocityX = e.value.split(' ')[0].split('=')[1]
                            this.waterForm.velocityY = e.value.split(' ')[1].split('=')[1]
                        }
                    }
                    // 挡水坝
                    if(this.splashDamForm.hasOwnProperty(e.key)){
                        this.findParams(this.splashDamForm,e)
                    }
                    // 喷泉
                    if(this.fountainForm.hasOwnProperty(e.key)){
                        if(e.key==='fountainRotation'){
                            this.fountainForm.fountainRotationP = e.value.split(' ')[0].split('=')[1]
                            this.fountainForm.fountainRotationY = e.value.split(' ')[1].split('=')[1]
                            this.fountainForm.fountainRotationR = e.value.split(' ')[2].split('=')[1]
                        }
                        if(e.key==='fountainScale'){
                            this.fountainForm.fountainScaleX = e.value.split(' ')[0].split('=')[1]
                            this.fountainForm.fountainScaleY = e.value.split(' ')[1].split('=')[1]
                            this.fountainForm.fountainScaleZ = e.value.split(' ')[2].split('=')[1]
                        }
                        if(e.key==='spreadWidth'){
                            this.fountainForm.spreadWidth = Number(e.value)
                        }
                    }
                    // webui
                    if(this.webuiForm.hasOwnProperty(e.name)){
                        if(e.name === 'bgColor'){
                            this.webuiForm.bgColor = this.arrToRgb(JSON.parse(e.value))
                        }else if(e.name === 'isFollowedCamera'){
                            this.webuiForm.isFollowedCamera = JSON.parse(e.value)
                        }else{
                            this.findParams(this.webuiForm,e)
                        }
                    }
                    // 样条线
                    if(this.lineForm.hasOwnProperty(e.name)){
                        if(e.name === '开始点坐标'){
                            let value = e.value.split(' ')
                            this.lineForm.beginLocation.x = value[0].split('=')[1]
                            this.lineForm.beginLocation.y = value[1].split('=')[1]
                            this.lineForm.beginLocation.z = value[2].split('=')[1]
                            // this.$set(this.lineForm, 'beginLngAndLatX', value[0].split('=')[1])
                            // this.$set(this.lineForm, 'beginLngAndLatY', value[1].split('=')[1])
                            // this.$set(this.lineForm, 'beginLngAndLatZ', value[2].split('=')[1])
                        } else if(e.name === '结束点坐标'){
                            let value = e.value.split(' ')
                            this.lineForm.endLocation.x = value[0].split('=')[1]
                            this.lineForm.endLocation.y = value[1].split('=')[1]
                            this.lineForm.endLocation.z = value[2].split('=')[1]
                            // this.$set(this.lineForm, 'endLngAndLatX', value[0].split('=')[1])
                            // this.$set(this.lineForm, 'endLngAndLatY', value[1].split('=')[1])
                            // this.$set(this.lineForm, 'endLngAndLatZ', value[2].split('=')[1])
                        }else{
                            this.findParams(this.lineForm,e)
                        }
                    }
                })
                this.$forceUpdate()
            }
        }
    },
    computed: {},
    created() { },
    mounted() { },
    methods: {
        findParams(obj,resObj){
            if(resObj.value){
                obj[resObj.key] = resObj.value
            }
        },
        // 颜色数组变rgba
        arrToRgb(arr){
            if(!arr || !arr.length) return null
            return `rgba(${Number(arr[0])},${Number(arr[1])},${Number(arr[2])},${Number(arr[3])>1?Number(arr[3])/255:Number(arr[3])})`
        },
        // 去掉rgba,去掉空格
        formatColor(color){
            return  color && color.slice(5,color.length-1).replace(/\s*/g, '') || ''
        },
        // 编辑构件属性接口
        editComApi(data){
            let params = {
                taskId: this.data.taskId,
                comId: this.geometryObjForm.id
            }
            modifyComParams(params, data).then(()=>{
                this.$message.success('操作成功！')
            })
        },
        // 改变光源信息
        changeLight(key,e){
            if(key){
                this.geometryObjForm[key] = +e
                this.geometryObjForm[key+'1'] = +e
            }
            let { sourceWidth,sourceHeight, influenceRadius, lightType, affectsWorld, castShadow, lightColor, intensity, radiationAngleOfInner, radiationAngleOfOuter, attenuationRadius, sourceRadius, sourceLength, brightness, visiableOfReflection, reflectionSourceType,barnDoorAngle,barnDoorLength } = this.geometryObjForm
            let data = {}
            let color = this.formatColor(lightColor)&&this.formatColor(lightColor).split(',')
            if(lightType==='spotLight'){
                // 聚光源
                data = {
                    lightType,
                    affectsWorld,castShadow,intensity,radiationAngleOfInner,radiationAngleOfOuter,
                    attenuationRadius,sourceRadius,sourceLength,
                    lightColor: color ? [color[0],color[1],color[2],color[3]*255] : ['255','255','255','255']
                }
            }else if(lightType==='pointLight'){
                // 点光源
                data = {
                    lightType,
                    affectsWorld,castShadow,intensity,attenuationRadius,sourceRadius,sourceLength,
                    lightColor: color ? [color[0],color[1],color[2],color[3]*255] : ['255','255','255','255']
                }
            }else if(lightType==='areaLight'){
                // 面光源,
                data = {
                    lightType,barnDoorAngle,barnDoorLength,
                    affectsWorld,castShadow,intensity,attenuationRadius,sourceHeight,sourceWidth,
                    lightColor: color ? [color[0],color[1],color[2],color[3]*255] : ['255','255','255','255']
                }
            }else if(lightType==='sphereReflection'){
                // 反射球
                data = {
                    lightType,
                    visiableOfReflection,reflectionSourceType,influenceRadius,brightness
                }
            }
            this.editComApi(data)
        },
        // 修改构件坐标
        editCom(){
            let params = {
                taskId: this.data.taskId
            }
            // 修改整个模型偏移
            if(this.geometryObjForm.model){
                let data = [{
                    childrenAppId: this.geometryObjForm.id,
                    location: this.geometryObjForm.location,
                    rotation: this.geometryObjForm.rotation,
                    scale: this.geometryObjForm.scale
                }]
                moveModel(params, data).then(()=>{
                    this.$message.success('修改坐标成功！')
                })
                return
            }
            let data = []
            if(this.isGis){
                data = [
                    {
                        uuid: this.geometryObjForm.id,
                        comName: this.geometryObjForm.name,
                        newLongLatHeight:{
                            longitude:'',
                            latitude:'',
                            altitude:''
                        }
                    }
                ]
            }else{
                data = [
                    {
                        uuid: this.geometryObjForm.id,
                        comName: this.geometryObjForm.name,
                        newLocation:this.geometryObjForm.location,
                        newRotation:this.geometryObjForm.rotation,
                        newScale:this.geometryObjForm.scale
                    }
                ]
            }
            updateComsCoordinate(params, data).then(()=>{
                this.$message.success('修改坐标成功！')
            })
        },
        // 水流仿真体编辑
        editFlow(){
            let data = {
                ...this.flowForm,
                areaResolution: `X=${this.flowForm.areaResolutionX} Y=${this.flowForm.areaResolutionY}`,
                type:3
            }
            this.editComApi(data)
        },
        // 水流仿真体按钮操作
        flowOperate(operateType){
            let data = {
                operateType,
                taskId: this.data.taskId,
                comId: this.geometryObjForm.id
            }
            fluidOperate(data).then(()=>{
                this.$message.success('操作成功！')
            })
        },
        // 水源编辑
        editWater(){
            let data = {
                ...this.waterForm,
                velocity: `X=${this.waterForm.velocityX} Y=${this.waterForm.velocityY}`,
                type:4
            }
            this.editComApi(data)
        },
        // 水源编辑
        editSplashDam(){
            let data = {
                ...this.splashDamForm,
                type:2
            }
            this.editComApi(data)
        },
        // 喷泉编辑
        editFountain(){
            let data = {
                spreadWidth:this.fountainForm.spreadWidth,
                fountainScale: `X=${this.fountainForm.fountainScaleX} Y=${this.fountainForm.fountainScaleY} Z=${this.fountainForm.fountainScaleZ}`,
                fountainRotation: `P=${this.fountainForm.fountainRotationP} Y=${this.fountainForm.fountainRotationY} R=${this.fountainForm.fountainRotationR}`,
                type:1
            }
            this.editComApi(data)
        },
        // webui编辑
        editWebUI(){
            let data = {
                type:5,
                ...this.webuiForm,
                bgColor: this.formatColor(this.webuiForm.bgColor) && this.formatColor(this.webuiForm.bgColor).split(',')
            }
            this.editComApi(data)
        },
        // 样条线修改
        editLine(){
            let { width, height, radius, beginLocation, endLocation } = this.lineForm 
            let data = {
                type: 6
            }
            if(this.geometryObjForm.name === '矩形样条线'){
                data = {
                    ...data,
                    meshType: 'rectangle',
                    width,
                    height,
                    beginLocation, endLocation
                }
            }else{
                data = {
                    ...data,
                    meshType: 'circle',
                    radius,
                    beginLocation, endLocation
                }
            }
            this.editComApi(data)
        }
    }
};
</script>
<style lang="less" scoped>
.geometryText{
    span{
        padding: 0 16px;
        &:first-child{
            padding-left: 0;
        }
    }
}
.switchBox{
    margin: 20px 0;
    .geometryText();
}
.colorBox{
    margin-bottom: 10px;
    display: flex;
    align-items: center;
    .geometryText();
    >div{
        background: #24262B;
        border-radius: 2px;
        border: 1px solid #727272;
        padding: 3px;
        display: flex;
        span{
            padding: 0 10px;
        }
    }
    i{
        margin-left: 8px;
    }
    /deep/ .el-color-picker{
        height: 22px;
        .el-color-picker__trigger{
            border:none;
            width: 56px;
            height: 22px;
            padding: 0;
            border-radius: 4px;
            overflow: hidden;
            .el-color-picker__color{
                border:none;
            }
        }
    }
}
.geometry{
    padding: 0 15px 20px !important;
    font-size: 14px;
    color: #ffffff;
    i{
        font-size: 20px;
        color: #9FAFC2;
        cursor: pointer;
        vertical-align: middle;
    }
    .geometryItem{
        border-bottom: 1px solid #464646;
        padding-bottom: 22px;
        &:last-child{
            border-bottom: 0;
        }
    }
    .coordinate{
        .coordinateTitle{
            margin: 12px 0;
        }
        .coordinateItemInput{
            text-align: center;
            font-size: 12px;
        }
    }
    .parameter{
        .parameterItem{
            margin-top: 16px;
            span{
                display: inline-block;
                width: 60px;
            }
            .el-input{
                width: 85px;
                margin-right: 10px;
            }
            i{
                margin-left: 24px;
            }
        }
    }
    .light{}
    .pointolite{
        padding-right: 15px;
        .sliderBox{
            display: initial;
        }
        .itemSpan{
            padding-right: 16px;
            font-size: 14px;
            >span{
                padding-right: 5px;
            }
            &:first-child{
                padding-left: 0;
            }
        }
        .sliderParmer{
            display: flex;
            align-items: center;
            justify-content: space-between;
            width: 100%;
            .slider{
                width: 60%;
            }
            .sliderInput{
                width: 70px;
                margin-left: 12px;
            }
            .sliderNum{
                width: 10px;
                min-width: initial;
            }
        }
    }
    .word{
        .wordTextarea{
            display: flex;
            margin: 20px 0;
            span{
                width: 90px;
            }
        }
        .wordDetail{
            display: flex;
            align-items: center;
            margin: 16px 0;
            .geometryText();
            span{
                padding: 0 13px;
            }
        }
    }
    .flow{
        .flowItem{
            font-size: 12px;
            margin-top: 16px;
            >span{
                width: 115px;
                display: inline-block;
            }
            .input{
                width: 90px;
            }
        }
    }
    .flowBtn{
        text-align: center;
        margin: 16px 0;
        /deep/.el-button{
            width: 70px;
        }
    }
    .water{
        .waterItem{
            font-size: 14px;
            margin-top: 16px;
            >span{
                width: 100px;
                display: inline-block;
            }
            .input{
                width: 90px;
            }
        }
    }
    .slider{
        display: flex;
        justify-content: space-between;
        .el-slider{
            width: 60%;
        }
        /deep/.el-slider__runway:not(.disabled){
            .el-slider__bar{
                background: linear-gradient(90deg, #C1EAFF 0%, #8ED1FF 100%);
                height: 8px;
            }
            .el-slider__button{
                background: #00C9FD;
                box-shadow: 0px 0px 4px 0px #FFFFFF;
                border: 2px solid #FFFFFF;
            }
        }
        .sliderInput{
            width: 70px;
        }
    }
    .webui{
        .webuiItem{
            display: flex;
            align-items: center;
            margin: 16px 0;
            .geometryText();
            span:first-child{
                flex: none;
            }
            span{
                padding: 0 13px;
            }
        }
    }
}
</style>
