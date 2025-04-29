<template>
  <Drawer ref="Drawer" title="关键帧属性设置" direction="rtl" @onClose="close()"
    :class="{ 'changeDrawerBox': $parent.$parent.checkShow('modelAnimation') }">
    <el-form :model="form" class="animationEditForm" label-width="68px" label-position="left" size="mini">
      <template v-if="animationData.animationType === '0'">
        <el-form-item label="时间点">
          <el-input v-model="form.frameTimeHms" placeholder="时间点" @change="timeChange"></el-input>
        </el-form-item>
        <el-form-item label="坐标" label-width="48px">
          <div class="coordinateBox">
            <span>X</span>
            <el-input v-model="form.location.X" placeholder="x" v-only-number="{ precision: 6 }"
              @change="changePosition()"></el-input>
            <span>Y</span>
            <el-input v-model="form.location.Y" placeholder="y" v-only-number="{ precision: 6 }"
              @change="changePosition()"></el-input>
            <span>Z</span>
            <el-input v-model="form.location.Z" placeholder="z" v-only-number="{ precision: 6 }"
              @change="changePosition()"></el-input>
          </div>
        </el-form-item>
        <el-form-item label="角度" label-width="48px">
          <div class="coordinateBox">
            <span>P</span>
            <el-input v-model="form.rotation.P" placeholder="p" v-only-number="{ precision: 6 }"
              @change="changePosition()"></el-input>
            <span>Y</span>
            <el-input v-model="form.rotation.Y" placeholder="y" v-only-number="{ precision: 6 }"
              @change="changePosition()"></el-input>
            <span>R</span>
            <el-input v-model="form.rotation.R" placeholder="r" v-only-number="{ precision: 6 }"
              @change="changePosition()"></el-input>
          </div>
        </el-form-item>
        <el-form-item label="比例" label-width="48px">
          <div class="coordinateBox">
            <span>X</span>
            <el-input v-model="form.scale.X" placeholder="x" v-only-number="{ precision: 6 }"
              @change="changePosition()"></el-input>
            <span>Y</span>
            <el-input v-model="form.scale.Y" placeholder="y" v-only-number="{ precision: 6 }"
              @change="changePosition()"></el-input>
            <span>Z</span>
            <el-input v-model="form.scale.Z" placeholder="z" v-only-number="{ precision: 6 }"
              @change="changePosition()"></el-input>
          </div>
        </el-form-item>
      </template>
      <template v-if="animationData.animationType === '1'">
        <el-form-item label="时间点">
          <el-input v-model="form.frameTimeHms" placeholder="时间点" disabled></el-input>
        </el-form-item>
        <div class="content material_content">
          <el-checkbox :indeterminate="materialData.isIndeterminate" v-model="materialData.checkAll"
            @change="handleMaterialCheckAllChange">全选</el-checkbox>
          <el-checkbox-group v-model="materialData.materialCheckeds" @change="handleCheckedCitiesChange">
            <el-row :gutter="8">
              <el-col :span="8" v-for="(city, index) in materialData.citys" :key="index">
                <el-checkbox class="material_box" :label="city.value">
                  <div class="contentItem">
                    <el-image class="img" src="@/assets/default/charlet.png" lazy>
                      <div slot="placeholder" class="image-slot">
                        <img src="@/assets/default/charlet.png" />
                      </div>
                      <div slot="error" class="image-slot">
                        <img src="@/assets/default/charlet.png" />
                      </div>
                    </el-image>
                  </div>
                </el-checkbox>
              </el-col>
            </el-row>
          </el-checkbox-group>
        </div>
        <el-checkbox v-model="form.colorBox">颜色</el-checkbox>
        <el-form-item label="颜色">
          <div class="flex">
            <el-color-picker class="custom_color_picker" show-alpha color-format="rgb" v-model="form.color"
              style="margin-right: 4px;"></el-color-picker>
            <el-input v-model="form.color" placeholder=""></el-input>
            <svg-icon icon-class="refresh" class="svg" />
          </div>
        </el-form-item>
        <el-checkbox :value="true">透明度</el-checkbox>
        <el-form-item label="透明度">
          <el-input v-model="form.frameTimeHms" placeholder=""></el-input>
          <svg-icon icon-class="refresh" class="svg" />
        </el-form-item>
        <el-checkbox :value="true">闪烁</el-checkbox>
        <el-form-item label="亮度">
          <el-input v-model="form.frameTimeHms" placeholder=""></el-input>
          <svg-icon icon-class="refresh" class="svg" />
        </el-form-item>
        <el-form-item label="闪烁频率">
          <div class="flex">
            <el-input v-model="form.frameTimeHms" placeholder="" style="flex: 1;"></el-input>
            <span class="t2">次/秒</span>
          </div>
        </el-form-item>
        <el-checkbox :value="true">流动</el-checkbox>
        <el-form-item label="横向偏移">
          <el-input v-model="form.frameTimeHms" placeholder=""></el-input>
          <svg-icon icon-class="refresh" class="svg" />
        </el-form-item>
        <el-form-item label="纵向偏移">
          <el-input v-model="form.frameTimeHms" placeholder=""></el-input>
          <svg-icon icon-class="refresh" class="svg" />
        </el-form-item>
        <el-form-item label="角度">
          <el-input v-model="form.frameTimeHms" placeholder=""></el-input>
          <svg-icon icon-class="refresh" class="svg" />
        </el-form-item>
        <el-form-item label="横向比例">
          <el-input v-model="form.frameTimeHms" placeholder=""></el-input>
          <svg-icon icon-class="refresh" class="svg" />
        </el-form-item>
        <el-form-item label="纵向比例">
          <el-input v-model="form.frameTimeHms" placeholder=""></el-input>
          <svg-icon icon-class="refresh" class="svg" />
        </el-form-item>
      </template>
      <template v-if="animationData.animationType === '2'">
        <el-form-item label="时间点">
          <el-input v-model="form.frameTimeHms" placeholder="时间点" @change="timeChange"></el-input>
        </el-form-item>
        <el-form-item label="坐标" label-width="48px">
          <div class="coordinateBox">
            <span>X</span>
            <el-input v-model="form.location.X" placeholder="x" v-only-number="{ precision: 6 }"
              @change="changePosition()"></el-input>
            <span>Y</span>
            <el-input v-model="form.location.Y" placeholder="y" v-only-number="{ precision: 6 }"
              @change="changePosition()"></el-input>
            <span>Z</span>
            <el-input v-model="form.location.Z" placeholder="z" v-only-number="{ precision: 6 }"
              @change="changePosition()"></el-input>
          </div>
        </el-form-item>
        <el-form-item label="角度" label-width="48px">
          <div class="coordinateBox">
            <span>P</span>
            <el-input v-model="form.rotation.P" placeholder="p" v-only-number="{ precision: 6 }"
              @change="changePosition()"></el-input>
            <span>Y</span>
            <el-input v-model="form.rotation.Y" placeholder="y" v-only-number="{ precision: 6 }"
              @change="changePosition()"></el-input>
            <span>R</span>
            <el-input v-model="form.rotation.R" placeholder="r" v-only-number="{ precision: 6 }"
              @change="changePosition()"></el-input>
          </div>
        </el-form-item>
      </template>
      <!-- <template v-if="false">
        <el-form-item label="开始时间">
          <el-input v-model="animationData.frameTimeHms" placeholder="开始时间"></el-input>
        </el-form-item>
        <el-form-item label="结束时间">
          <el-input v-model="animationData.frameTimeHms" placeholder="结束时间"></el-input>
        </el-form-item>
        <el-form-item label="动画长度">
          <div class="flex">
            <el-input v-model="animationData.frameTimeHms" placeholder="结束时间"></el-input>
            <div class="t2">秒</div>
          </div>
        </el-form-item>
        <el-form-item label="动画间隔">
          <div class="flex">
            <el-input v-model="animationData.frameTimeHms" placeholder="结束时间"></el-input>
            <div class="t2">秒</div>
          </div>
        </el-form-item>
        <el-form-item label="动画顺序">
          <el-select v-model="value" placeholder="请选择">
            <el-option v-for="item in []" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="动画类型">
          <el-select v-model="value" placeholder="请选择">
            <el-option v-for="item in []" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
      </template>
      <template v-if="false">
        <el-form-item label="时间点">
          <el-input v-model="animationData.frameTimeHms" placeholder="时间点" disabled></el-input>
        </el-form-item>
        <el-checkbox :value="true">颜色</el-checkbox>
        <el-form-item label="颜色">
          <div class="flex">
            <el-color-picker class="custom_color_picker" value="#409EFF"></el-color-picker>
            <el-input v-model="animationData.frameTimeHms" placeholder=""></el-input>
            <svg-icon icon-class="refresh" class="svg" />
          </div>
        </el-form-item>
        <el-checkbox :value="true">透明度</el-checkbox>
        <el-form-item label="透明度">
          <div class="flex">
            <el-input v-model="animationData.frameTimeHms" placeholder=""></el-input>
            <svg-icon icon-class="refresh" class="svg" />
          </div>
        </el-form-item>
        <el-checkbox :value="true">闪烁</el-checkbox>
        <el-form-item label="初始亮度">
          <el-input v-model="animationData.frameTimeHms" placeholder=""></el-input>
          <svg-icon icon-class="refresh" class="svg" />
        </el-form-item>
        <el-form-item label="结束亮度">
          <el-input v-model="animationData.frameTimeHms" placeholder=""></el-input>
          <svg-icon icon-class="refresh" class="svg" />
        </el-form-item>
        <el-form-item label="闪烁频率">
          <div class="flex">
            <el-input v-model="animationData.frameTimeHms" placeholder="" style="flex: 1;"></el-input>
            <span class="t2">次/秒</span>
          </div>
        </el-form-item>
        <el-checkbox :value="true">流体</el-checkbox>
        <el-form-item label="横向偏移">
          <el-input v-model="animationData.frameTimeHms" placeholder=""></el-input>
          <svg-icon icon-class="refresh" class="svg" />
        </el-form-item>
        <el-form-item label="纵向偏移">
          <el-input v-model="animationData.frameTimeHms" placeholder=""></el-input>
          <svg-icon icon-class="refresh" class="svg" />
        </el-form-item>
        <el-form-item label="角度">
          <el-input v-model="animationData.frameTimeHms" placeholder=""></el-input>
          <svg-icon icon-class="refresh" class="svg" />
        </el-form-item>
        <el-form-item label="横向比例">
          <el-input v-model="animationData.frameTimeHms" placeholder=""></el-input>
          <svg-icon icon-class="refresh" class="svg" />
        </el-form-item>
        <el-form-item label="纵向比例">
          <el-input v-model="animationData.frameTimeHms" placeholder=""></el-input>
          <svg-icon icon-class="refresh" class="svg" />
        </el-form-item>
      </template>
      <template v-if="false">
        <el-form-item label="时间点">
          <el-input v-model="animationData.frameTimeHms" placeholder="时间点" disabled></el-input>
        </el-form-item>
        <el-form-item label="时间设置" label-position="top">
          <div class="flex">
            <el-slider :value="50" style="width: 70%;"></el-slider>
            <el-input v-model="animationData.frameTimeHms" placeholder="" style="width: 30%;margin: 0 10px;"></el-input>
          </div>
        </el-form-item>
        <div class="top_title">天气</div>
        <div class="weather">
          <div class="title flex_between">
            <div class="flex">
              <svg-icon icon-class="cloud" class="svg2" />云
            </div>
            <div><el-switch :value="true">
              </el-switch></div>
          </div>
          <div class="block" style="padding: 0 10px 20px 10px;">
            <el-slider :value="1" show-stops :step="1" :show-tooltip="false" :min="1" :max="4" :marks="{
              1: '晴',
              2: '晴天少云',
              3: '晴天多云',
              4: '阴'
            }">
            </el-slider>
          </div>
        </div>
        <div class="weather">
          <div class="title flex_between">
            <div class="flex"><svg-icon icon-class="rain" class="svg2" />雨</div>
            <div><el-switch :value="true">
              </el-switch></div>
          </div>
          <div class="block" style="padding: 0 10px 20px 10px;">
            <el-slider :value="1" show-stops :step="1" :show-tooltip="false" :min="1" :max="4" :marks="{
              1: '小雨',
              2: '中雨',
              3: '大雨',
              4: '暴雨'
            }">
            </el-slider>
          </div>
        </div>
        <div class="weather">
          <div class="title flex_between">
            <div class="flex"><svg-icon icon-class="snow" class="svg2" />雪</div>
            <div><el-switch :value="true">
              </el-switch></div>
          </div>
          <div class="block" style="padding: 0 10px 20px 10px;">
            <el-slider :value="1" show-stops :step="1" :show-tooltip="false" :min="1" :max="4" :marks="{
              1: '小雪',
              2: '中雪',
              3: '大雪',
              4: '暴雪'
            }">
            </el-slider>
          </div>
        </div>
        <div class="weather">
          <div class="title flex_between">
            <div class="flex"><svg-icon icon-class="fog" class="svg2" />雾</div>
            <div><el-switch :value="true">
              </el-switch></div>
          </div>
          <div class="block" style="padding: 0 10px 20px 10px;">
            <el-slider :value="1" show-stops :step="1" :show-tooltip="false" :min="1" :max="3" :marks="{
              1: '小雾',
              2: '中雾',
              3: '大雾',
            }">
            </el-slider>
          </div>
        </div>
      </template>
      <template v-if="false">
        <el-form-item label="开始时间点" label-width="88px">
          <el-input v-model="animationData.frameTimeHms" placeholder="时间点" disabled></el-input>
        </el-form-item>
        <div class="top_title">文本框大小</div>
        <el-form-item label="" label-width="0">
          <el-row :gutter="10" style="width: 100%;">
            <el-col :span="12">
              <div class="flex">
                <div class="t2">宽</div>
                <el-input v-model="animationData.frameTimeHms" placeholder="" style="margin: 0 8px;"></el-input>
                <div class="t2">px</div>
              </div>
            </el-col>
            <el-col :span="12">
              <div class="flex">
                <div class="t2">高</div>
                <el-input v-model="animationData.frameTimeHms" placeholder="" style="margin: 0 8px;"></el-input>
                <div class="t2">px</div>
              </div>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="文本框背景" label-width="88px">
          <div class="flex">
            <el-color-picker class="custom_color_picker" value="#409EFF"></el-color-picker>
            <el-input v-model="animationData.frameTimeHms" placeholder=""></el-input>
            <svg-icon icon-class="refresh" class="svg" />
          </div>
        </el-form-item>
        <el-form-item label="文字内容">
          <el-input type="textarea" :rows="3" placeholder="请输入内容" v-model="animationData.frameTimeHms">
          </el-input>
        </el-form-item>
        <el-form-item label="字体">
          <el-select v-model="value" placeholder="请选择">
            <el-option v-for="item in []" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="文字大小">
          <el-select v-model="value" placeholder="请选择">
            <el-option v-for="item in []" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="文字颜色">
          <div class="flex">
            <el-color-picker class="custom_color_picker" value="#409EFF"></el-color-picker>
            <el-input v-model="animationData.frameTimeHms" placeholder="">
            </el-input>
            <svg-icon icon-class="refresh" class="svg" />
          </div>
        </el-form-item>
        <el-form-item label="对齐方式">
          <div class="flex" style="height: 40px;">
            <svg-icon icon-class="align2" class="svg" />
            <el-divider direction="vertical" class="divider"></el-divider>
            <svg-icon icon-class="align_right2" class="svg" />
            <el-divider direction="vertical" class="divider"></el-divider>
            <svg-icon icon-class="align_left2" class="svg" />
            <el-divider direction="vertical" class="divider"></el-divider>
            <svg-icon icon-class="align_center2" class="svg" />
          </div>
        </el-form-item>
      </template>
      <template v-if="false">
        <el-form-item label="开始时间点" label-width="88px">
          <el-input v-model="animationData.frameTimeHms" placeholder="时间点" disabled></el-input>
        </el-form-item>
        <div class="top_title">上传声音文件</div>
        <el-form-item label="" label-width="0">
          <div class="flex">
            <el-upload action="#">
              <el-button size="small" type="primary" icon="el-icon-upload">上 传</el-button>
            </el-upload>
            <div style="color: #FF8838;font-size: 12px;margin-left: 10px;">支持mp3/wav格式</div>
          </div>
        </el-form-item>
        <div class="top_title">播放速度</div>
        <el-form-item label="" label-width="0">
          <div class="flex">
            <el-slider :value="50" style="width: 70%;"></el-slider>
            <el-input v-model="animationData.frameTimeHms" placeholder="" style="width: 30%;margin: 0 10px;"></el-input>
          </div>
          <el-checkbox :value="false">循环播放</el-checkbox>
        </el-form-item>
        <el-form-item label="播放时长">
          <el-input v-model="animationData.frameTimeHms" placeholder="时间点" disabled></el-input>
        </el-form-item>
      </template>
      <template v-if="false">
        <el-form-item label="时间点">
          <el-input v-model="animationData.frameTimeHms" placeholder="时间点" disabled></el-input>
        </el-form-item>
        <el-form-item label="跟随目标">
          <el-select v-model="value" placeholder="请选择已加入序列的模型">
            <el-option v-for="item in []" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="子目标">
          <el-select v-model="value" placeholder="请选择子目标模型">
            <el-option v-for="item in []" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
      </template>
      <template v-if="false">
        <el-form-item label="开始时间点" label-width="88px">
          <el-input v-model="animationData.frameTimeHms" placeholder="时间点" disabled></el-input>
        </el-form-item>
        <el-form-item label="结束时间点" label-width="88px">
          <el-input v-model="animationData.frameTimeHms" placeholder="时间点" disabled></el-input>
        </el-form-item>
        <el-form-item label="动画长度">
          <div class="flex">
            <el-input v-model="animationData.frameTimeHms" placeholder="结束时间"></el-input>
            <div class="t2">秒</div>
          </div>
        </el-form-item>
        <el-form-item label="动画间隔">
          <div class="flex">
            <el-input v-model="animationData.frameTimeHms" placeholder="结束时间"></el-input>
            <div class="t2">秒</div>
          </div>
        </el-form-item>
        <el-form-item label="动画顺序">
          <el-select v-model="value" placeholder="请选择">
            <el-option v-for="item in []" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="动画类型">
          <el-select v-model="value" placeholder="请选择">
            <el-option v-for="item in []" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <div class="content">
          <div class="contentItem" v-for="(item, index) in [1, 2, 3]" :key="index">
            <el-image class="img" src="@/assets/default/charlet.png" lazy>
              <div slot="placeholder" class="image-slot">
                <img src="@/assets/default/charlet.png" />
              </div>
              <div slot="error" class="image-slot">
                <img src="@/assets/default/charlet.png" />
              </div>
            </el-image>
            <div>{{ item.groupName }}</div>
          </div>
        </div>
        <el-checkbox :value="true">颜色</el-checkbox>
        <el-form-item label="颜色">
          <div class="flex">
            <el-color-picker class="custom_color_picker" value="#409EFF"></el-color-picker>
            <el-input v-model="animationData.frameTimeHms" placeholder=""></el-input>
            <svg-icon icon-class="refresh" class="svg" />
          </div>
        </el-form-item>
        <el-checkbox :value="true">透明度</el-checkbox>
        <el-form-item label="" label-width="0">
          <el-row :gutter="10" style="width: 100%;">
            <el-col :span="12">
              <div class="top_title">初始值</div>
              <div class="flex">
                <span>A</span>
                <el-input v-model="animationData.frameTimeHms" placeholder="" style="flex : 1;"></el-input>
                <svg-icon icon-class="refresh" class="svg" />
              </div>
            </el-col>
            <el-col :span="12">
              <div class="top_title">结束值</div>
              <div class="flex">
                <span>A</span>
                <el-input v-model="animationData.frameTimeHms" placeholder="" style="flex : 1"></el-input>
                <svg-icon icon-class="refresh" class="svg" />
              </div>
            </el-col>
          </el-row>
        </el-form-item>
        <el-checkbox :value="true">闪烁</el-checkbox>
        <el-form-item label="初始亮度">
          <el-input v-model="animationData.frameTimeHms" placeholder=""></el-input>
          <svg-icon icon-class="refresh" class="svg" />
        </el-form-item>
        <el-form-item label="结束亮度">
          <el-input v-model="animationData.frameTimeHms" placeholder=""></el-input>
          <svg-icon icon-class="refresh" class="svg" />
        </el-form-item>
        <el-form-item label="闪烁频率">
          <div class="flex">
            <el-input v-model="animationData.frameTimeHms" placeholder="" style="flex: 1;"></el-input>
            <span class="t2">次/秒</span>
          </div>
        </el-form-item>
        <el-checkbox :value="true">流动</el-checkbox>
        <el-row :gutter="10" style="width: 100%;">
          <el-col :span=12>
            <div class="top_title">初始值 <svg-icon icon-class="refresh" class="svg" /></div>
            <el-form-item label="横向偏移">
              <el-input v-model="animationData.frameTimeHms" placeholder=""></el-input>
            </el-form-item>
            <el-form-item label="纵向偏移">
              <el-input v-model="animationData.frameTimeHms" placeholder=""></el-input>
            </el-form-item>
            <el-form-item label="角度">
              <el-input v-model="animationData.frameTimeHms" placeholder=""></el-input>
            </el-form-item>
            <el-form-item label="横向比例">
              <el-input v-model="animationData.frameTimeHms" placeholder=""></el-input>
            </el-form-item>
            <el-form-item label="纵向比例">
              <el-input v-model="animationData.frameTimeHms" placeholder=""></el-input>
            </el-form-item>
          </el-col>
          <el-col :span=12>
            <div class="top_title">结束值 <svg-icon icon-class="refresh" class="svg" /></div>
            <el-form-item label="横向偏移">
              <el-input v-model="animationData.frameTimeHms" placeholder=""></el-input>
            </el-form-item>
            <el-form-item label="纵向偏移">
              <el-input v-model="animationData.frameTimeHms" placeholder=""></el-input>
            </el-form-item>
            <el-form-item label="角度">
              <el-input v-model="animationData.frameTimeHms" placeholder=""></el-input>
            </el-form-item>
            <el-form-item label="横向比例">
              <el-input v-model="animationData.frameTimeHms" placeholder=""></el-input>
            </el-form-item>
            <el-form-item label="纵向比例">
              <el-input v-model="animationData.frameTimeHms" placeholder=""></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </template> -->
      <div class="btn">
        <el-button class="grayPlain" type="primary" size="small" @click="onDelete">删 除</el-button>
        <el-button class="blueBtn1" type="primary" size="small" @click="onSubmit">确 定</el-button>
      </div>
    </el-form>
  </Drawer>
</template>

<script>
import Mapping from '../animationAdd/components/map'
import { updateLinkage, saveAnimFrame, quitAnimation, deleteAnimFrame } from '@/api/userCenter/modelAnimation.js'
import Drawer from "@/components/Drawer/index.vue";
import { EventBus } from '@/utils/bus.js'
import { debounce } from 'lodash';

export default {
  components: { Drawer },
  props: {
    data: {
      type: Object,
      default: () => { }
    },
  },
  data() {
    return {
      drawerShow: false,
      animationData: {},
      form: {
        location: {},
        rotation: {},
        scale: {},
        frameTimeHms: null,
      },
      //材质动画相关配置数据
      materialData: {
        checkAll: false,
        isIndeterminate: false,
        citys: [
          { value: 1, url: 'https://fuss10.elemecdn.com/a/3f/3302e58f9a181d2509f3dc0fa68b0jpeg.jpeg', },
          { value: 2, url: 'https://fuss10.elemecdn.com/a/3f/3302e58f9a181d2509f3dc0fa68b0jpeg.jpeg', },
          { value: 3, url: 'https://fuss10.elemecdn.com/a/3f/3302e58f9a181d2509f3dc0fa68b0jpeg.jpeg', },
          { value: 4, url: 'https://fuss10.elemecdn.com/a/3f/3302e58f9a181d2509f3dc0fa68b0jpeg.jpeg', },
        ],
        materialCheckeds: [],
      },
    }
  },
  watch: {
    "data.animationKeyframe": {
      handler(val, oldValue) {
        if (val.id == '102' || (val.id == '101' && !this.animationData?.location && !this.animationData?.rotation && !this.animationData?.scale)) {
          // console.log('102联动事件-101编辑关键帧返回参数', val,);
          this.form.location = this.$options.data().form.location
          this.form.rotation = this.$options.data().form.rotation
          this.form.scale = this.$options.data().form.scale
          if (val?.linkageInfo?.location) {
            let value = val.linkageInfo.location.split(' ')
            this.form.location = {
              X: value[0].split('=')[1],
              Y: value[1].split('=')[1],
              Z: value[2].split('=')[1]
            }
          }
          if (val?.linkageInfo?.rotation) {
            let value = val.linkageInfo.rotation.split(' ')
            this.form.rotation = {
              P: value[0].split('=')[1],
              Y: value[1].split('=')[1],
              R: value[2].split('=')[1]
            }
          }
          if (val?.linkageInfo?.scale) {
            let value = val.linkageInfo.scale.split(' ')
            this.form.scale = {
              X: value[0].split('=')[1],
              Y: value[1].split('=')[1],
              Z: value[2].split('=')[1]
            }
          }
        }
      },
    },
  },
  computed: {},
  created() { },
  mounted() {
  },
  methods: {
    show(data) {
      this.drawerShow = true
      this.$refs.Drawer.show()
      // 手动清除选中内容 用以修复第一个关键帧创建时选中了面板的问题
      if (window.getSelection) {
        window.getSelection().removeAllRanges();
      } else if (document.selection) {
        document.selection.empty();
      }
      // 0 位置动画
      // 2 视点动画
      if (data && ['0', '2'].includes(data.animationType)) {
        this.animationData = data
        // 新建关键帧取websocket构件信息否则取当前点位数据
        if (data?.location && data?.rotation && data?.scale) {
          let value1 = data.location.split(' ')
          this.form.location = {
            X: value1[0].split('=')[1],
            Y: value1[1].split('=')[1],
            Z: value1[2].split('=')[1]
          }
          let value2 = data.rotation.split(' ')
          this.form.rotation = {
            P: value2[0].split('=')[1],
            Y: value2[1].split('=')[1],
            R: value2[2].split('=')[1]
          }
          if (data.animationType == '0') {
            let value3 = data.scale.split(' ')
            this.form.scale = {
              X: value3[0].split('=')[1],
              Y: value3[1].split('=')[1],
              Z: value3[2].split('=')[1]
            }
          }
        }
        // this.animationData.frameTime = Mapping.second2hms(data.frameTime / 1000)
        // this.animationData.frameTimeHms = Mapping.second2hms(data.frameTime / 1000)
        this.form.frameTimeHms = Mapping.second2hms(data.frameTime / 1000)
      }
      // 1 材质动画
      if (data && data.animationType == '1') {
        this.animationData = data;
        this.form.frameTimeHms = Mapping.second2hms(data.frameTime / 1000);
      }
    },
    // 修改 位置动画/视点动画 关键帧
    changePosition() {
      let linkageInfo = {
        location: `X=${this.form.location.X} Y=${this.form.location.Y} Z=${this.form.location.Z}`,
        rotation: `P=${this.form.rotation.P} Y=${this.form.rotation.Y} R=${this.form.rotation.R}`,
        scale: `X=${this.form.scale.X} Y=${this.form.scale.Y} Z=${this.form.scale.Z}`
      }
      let params = {
        taskId: this.data.taskId
      }
      let data = {
        operation: "linkagekeyframe",
        animationName: this.animationData.animationType == '0' ? "transform" : "viewpoint",
        animationID: this.animationData.animationEventId,
        keyframeID: this.animationData.id,
        linkageInfo: JSON.stringify(linkageInfo)
      }
      updateLinkage(params, data).then(() => {
        this.$message.success("修改成功");
        EventBus.$emit('animationRefresh');
      })
    },
    // 修改时间点事件
    timeChange(value) {
      // console.log(value)
      this.$emit('changeDotTime', this.animationData, value)
    },
    // 删除关键帧
    onDelete() {
      this.$confirm(`请确认是否删除？`, '删除关键帧', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        closeOnClickModal: false,
        type: 'warning'
      }).then(() => {
        deleteAnimFrame({ id: this.animationData.id }).then(() => {
          this.quit()
          this.$message.success("删除成功！")
          this.$emit("onDeleteFrame", this.animationData)
        })
      }).catch(() => { })
    },
    // 保存关键帧数据
    onSubmit() {
      let params = {
        animationEventId: this.animationData.animationID,
        location: `X=${this.form.location.X} Y=${this.form.location.Y} Z=${this.form.location.Z}`,
        rotation: `P=${this.form.rotation.P} Y=${this.form.rotation.Y} R=${this.form.rotation.R}`,
        scale: `X=${this.form.scale.X} Y=${this.form.scale.Y} Z=${this.form.scale.Z}`,
        componentId: this.data.animationKeyframe.componentId,
        id: this.animationData.id,
        frameTime: Mapping.hms2second(this.form.frameTimeHms),
      }
      // console.log(params, this.animationData)
      saveAnimFrame(params).then(() => {
        this.$message.success("保存成功！")
        EventBus.$emit('animationRefresh');
        this.quit();
        this.$emit('onSubmitSuccess')
      })
    },
    // 抽屉关闭事件
    close() {
      this.drawerShow = false
      this.$refs.Drawer.hide()
      this.$emit('onCloseSuccess')
    },
    // 退出动画编辑模式
    quit() {
      quitAnimation({ taskId: this.data.taskId }, { operation: "quitEdit" })
    },
    // 材质动画相关事件
    handleMaterialCheckAllChange(val) {
      this.materialData.materialCheckeds = val ? this.materialData.citys.map(a => a.value) : [];
      this.materialData.isIndeterminate = false;
    },
    handleCheckedCitiesChange(v) {
      let checkedCount = v.length;
      this.materialData.checkAll = checkedCount === this.materialData.citys.length;
      this.materialData.isIndeterminate = checkedCount > 0 && checkedCount < this.materialData.citys.length;
      EventBus.$emit('openToolPart', 'resource')
    },
  }
}
</script>
<style lang="less" scoped>
.flex {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  color: #fff;
}

.divider {
  background-color: #979797;
}

.divider2 {
  background-color: #464646;
}

.changeDrawerBox {
  height: 50vh;
  top: initial;
  bottom: 0;
  border-top: 1px solid #747374;
}

.animationEditForm {
  margin: 16px;
  overflow: auto;
  max-height: calc(100% - 70px);

  // new css
  .custom_color_picker {
    /deep/.el-color-picker__trigger {
      padding: 0;
      border: 0;
    }

    /deep/.el-color-picker__icon {
      display: none;
    }
  }

  /deep/.el-slider__button {
    border: 0;
    height: 12px;
    width: 12px;
  }

  /deep/.el-slider__bar {
    background-image: linear-gradient(to right, #C1EAFF, #00C9FD);

  }

  /deep/.el-slider__marks-text {
    font-size: 12px;
    white-space: nowrap;
  }

  .t2 {
    color: rgba(255, 255, 255, 0.7);
    font-size: 14px;
  }

  .flex_between {
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: #fff;
  }

  .svg {
    font-size: 16px;
    cursor: pointer;

    &:hover {
      background: #24262B;
    }
  }

  .svg2 {
    font-size: 24px;
    margin-right: 4px;
  }

  // 
  /deep/.el-form-item {
    // border-top: 1px solid #464646;

    &:first-child {
      border: none;
    }
  }

  /deep/.el-form-item__label {
    color: #ffffff;
  }

  /deep/.el-input {
    width: auto;
  }

  .coordinateBox {
    color: rgba(255, 255, 255, 0.7);
    display: flex;
    justify-content: center;
    width: 100%;
    font-size: 14px;

    span {
      padding: 0 4px;
      font-size: 12px;
      font-weight: 600;
    }

    /deep/.el-input {
      width: 70px;
    }
  }

  .btn {
    text-align: center;
    padding-bottom: 10px;
  }
}

.top_title {
  color: #fff;
  font-size: 14px;
  margin-bottom: 10px;
}

.weather {
  background-color: rgba(51, 51, 51, 0.7);
  border: 1px solid #575A62;
  border-radius: 6px;
  padding: 8px;

  &:not(:last-of-type) {
    margin-bottom: 10px;
  }

  .title {
    color: #fff;
    font-size: 14px;
  }

  /deep/.el-slider__runway {
    background-color: #24262B;
  }
}

.material_content {
  .material_box {
    width: 100%;

    /deep/.el-checkbox__input {
      position: absolute;
      bottom: 8px;
      left: 2px;
    }

    /deep/.el-checkbox__label {
      padding: 0;
      margin: 0;
    }
  }
}

.content {
  display: flex;
  flex-wrap: wrap;
  align-content: flex-start;
  gap: 10px;

  .contentItem {
    // width: (92/3%);
    // font-size: 12px;
    font-family: PingFangSC-Regular, PingFang SC;
    color: #ffffff;
    text-align: center;
    cursor: pointer;
    box-sizing: border-box;
    position: relative;

    &:hover .iconBottom {
      display: block;
    }

    .img {
      width: 100%;
      // height: 85px;
      object-fit: fill;
      margin-bottom: 8px;
      background: #28292E;
      border-radius: 4px;
      display: flex;
      justify-content: center;
      align-items: center;

      /deep/.el-image__error,
      /deep/.el-image__inner,
      /deep/.el-image__placeholder {
        max-width: 100%;
        max-height: 100%;
        width: auto;
        height: auto;
      }
    }

    >div {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .iconBottom {
      position: absolute;
      bottom: 25px;
      width: 100%;
      height: 32px;
      line-height: 32px;
      background: rgba(37, 39, 40, 0.77);
      border-radius: 0px 0px 2px 2px;
      text-align: center;
      display: none;

      i {
        margin: 0 10px;
      }
    }
  }
}
</style>
