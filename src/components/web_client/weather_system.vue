<template>
    <Drawer ref="Drawer" title="天气环境" direction="rtl" @onClose="close">
    <div class="systemWeather">
      <div class="weatherClassify">
          <div class="selectGroup">
              <el-radio-group v-model="radio" class="singleSelect" @input="radioChange">
                  <el-radio :label="0" class="envirTemplate" v-if="!isGis">
                      <div class="templateBox">
                          <div class="templateName">环境模板</div>
                          <div class="templateInfo" v-if="radio === 0">
                              <el-select v-model="valueTemplate" placeholder="请选择" size="mini" @change="valueChangeBtn">
                                  <el-option
                                      :key="index"
                                      v-for="(item,index) in lessOptions"
                                      :label="item.weatherName"
                                      :value="item.id">
                                  </el-option>
                              </el-select>
                          </div>
                      </div>
                  </el-radio>
                  <el-radio :label="1" class="solidBackground" v-if="!isGis">
                      <div class="boxSolidBackground">
                          <div class="solidName">纯色背景</div>
                          <div class="colorBox" v-if="radio === 1">
                              <div class="selectColor">
                                  <el-color-picker :disabled="radio == 1 ? false : true" v-model="color1" size="mini" color-format="rgb" @change="changeColor"></el-color-picker>
                              </div>
                              <div class="colorName">
                                  <el-input v-model="input" size="mini" @blur="inputBlur" :disabled="radio == 1 ? false : true"></el-input>
                              </div>
                          </div>
                          <div class="resetColor" v-if="radio === 1">
                              <i class="el-icon-refresh-right resetColorIcon" @click.stop="clickColorBtn"></i>
                          </div>
                      </div>                  
                  </el-radio>
                  <el-radio :label="2" class="mySetting">个性化设置</el-radio>
              </el-radio-group>
              <div class="boxTimeHour" v-if="radio == 2">
                  <div class="timeHour">
                      <div class="hourName">时间</div>
                      <div class="selectTime">
                          <el-time-picker
                              class="picker"
                              v-model="hourValue"
                              @change="hourClick"
                              :picker-options="{
                                  selectableRange: '00:00:00 - 23:59:59'
                              }"
                              :clearable="false"
                              size="mini"
                              format='HH:mm'
                              :disabled="radio == 2 ? false : true"
                          >
                          </el-time-picker>
                      </div>
                  </div>
                  <div class="hourSpeed">
                      <div class="speedName">时速</div>
                      <div class="speedNumber">
                          <el-input :disabled="radio == 2 ? false : true" :min="0" :step="0.01" :max="24" v-model="inputSpeed" @blur="hourSpeedBlur"></el-input>
                      </div>
                      <div class="speedInfo">小时/秒</div>
                  </div>
              </div>
              <div class="timeProgressBox" v-if="radio == 2">
                  <el-slider v-model="valueSlider"
                      @change="timeHourChange"
                      :min="0" 
                      :max="24" 
                      :step="0.01"
                      :marks="marks"
                      :disabled="radio == 2 ? false : true"
                  >
                  </el-slider>
              </div>
              <div class="boxTimeHour dateTimeBox dateTimeBox2" v-if="radio == 2">
                  <div class="timeHour dateTime">
                      <div class="hourName">日期</div>
                      <div class="selectTime selectDate">
                          <el-date-picker
                              class="picker"
                              v-model="valueDate"
                              type="date"
                              :clearable="false"
                              size="mini"
                              format='MM-dd'
                              @change="clickDateTime"
                              :disabled="radio == 2 ? false : true"
                          >
                          </el-date-picker>
                      </div>
                  </div>
                  <div class="hourSpeed latitudeBox">
                      <div class="speedName latitudeName">纬度</div>
                      <div class="speedNumber latitudeSelect">
                          <el-input :disabled="radio == 2 ? false : true" v-model="inputLatitude" @blur="latitudeChange"></el-input>
                      </div>
                      <div class="speedInfo latitudeInfo">°</div>
                  </div>
              </div>
              <div class="bottomBox" v-if="radio == 2"></div>
          </div>
      </div>
      <!-- 天气 -->
      <div class="mainWeather" v-if="radio == 2">
        <div class="titleWeather">天空</div>
        <div class="sun">
            <div>
                <span>太阳光颜色</span>
                <el-color-picker class="colorSelect" show-alpha v-model="form.sunLightColor" @change="colorChange"></el-color-picker>
            </div>
            <div>
                <span>太阳光强度</span>
                <el-slider v-model.number="form.sunLightIntensity" :min="0" :max="10" @change="colorChange"></el-slider>
            </div>
        </div>
        <!-- <div class="sun">
            <div>
                <span>天空光阴影</span>
                <el-switch v-model="form.sky" active-color="#409eff" inactive-color="#191a1c" @change="lightTypeChange($event,'sky')"></el-switch>
                <span style="margin-left:15px">方向光阴影</span>
                <el-switch v-model="form.direction" active-color="#409eff" inactive-color="#191a1c" @change="lightTypeChange($event,'direction')"></el-switch>
            </div>
        </div> -->
          <div class="titleWeather">天气</div>
          <div class="cloude">
              <div class="cloudeSelect">
                  <div class="imgCloude">
                      <img :src="require('@/assets/images/weatherSys/cloudeImage.png')" alt="">
                  </div>
                  <div class="nameCloude">云</div>
                  <div class="switchCloude">
                      <el-switch
                          v-model="valueCloude"
                          @change="btnWeatherClick('1')"
                          :disabled="radio == 2 ? false : true"
                          active-color="#409EFF"
                          inactive-color="#191a1c">
                      </el-switch>
                  </div>
              </div>
              <div class="timeProgressBox cloudeProgress" v-if="valueCloude">
                  <el-slider v-model="valueSliderCloude"
                      :min="0" 
                      :max="3" 
                      :step="1"
                      :marks="marksCloude"
                      :disabled = !this.valueCloude
                      @change="strongChange('cloude')"
                  >
                  </el-slider>
              </div>
          </div>
          <div class="cloude rain">
              <div class="cloudeSelect">
                <div class="imgCloude imageRain">
                    <img :src="require('@/assets/images/weatherSys/rainImage.png')" alt="">
                </div>
                <div class="nameCloude nameRain">雨</div>
                <div class="switchCloude">
                    <el-switch
                        v-model="valueRain"
                        :disabled="radio == 2 ? false : true"
                        @change="btnWeatherClick('2')"
                        active-color="#409EFF"
                        inactive-color="#191a1c">
                    </el-switch>
                </div>
              </div>
              <div class="timeProgressBox cloudeProgress" v-if="valueRain">
                  <el-slider v-model="valueSliderRain"
                      class="progressSnow" 
                      :min="0" 
                      :max="3" 
                      :step="1"
                      :marks="marksRain"
                      :disabled = !this.valueRain
                      @change="strongChange('rain')"
                  >
                  </el-slider>
              </div>
          </div>
          <div class="cloude sonw">
              <div class="cloudeSelect">
                  <div class="imgCloude imageSnow">
                      <img :src="require('@/assets/images/weatherSys/snowImage.png')" alt="">
                  </div>
                  <div class="nameCloude nameSnow">雪</div>
                  <div class="switchCloude">
                      <el-switch
                          v-model="valueSnow"
                          :disabled="radio == 2 ? false : true"
                          @change="btnWeatherClick('3')"
                          active-color="#409EFF"
                          inactive-color="#191a1c">
                      </el-switch>
                  </div>
              </div>
              <div class="timeProgressBox cloudeProgress" v-if="valueSnow">
                  <el-slider v-model="valueSliderSnow"
                      class="progressSnow"
                      :min="0" 
                      :max="3" 
                      :step="1"
                      :marks="marksSnow"
                      :disabled = !this.valueSnow
                      @change="strongChange('snow')"
                  >
                  </el-slider>
              </div>
          </div>
          <div class="cloude fog">
            <div class="cloudeSelect">
              <div class="imgCloude imageFog">
                  <img :src="require('@/assets/images/weatherSys/fogImage.png')" alt="">
              </div>
              <div class="nameCloude nameFog">雾</div>
              <div class="switchCloude">
                  <el-switch
                      v-model="valueFog"
                      :disabled="radio == 2 ? false : true"
                      @change="btnWeatherClick('4')"
                      active-color="#409EFF"
                      inactive-color="#191a1c">
                  </el-switch>
              </div>
            </div>
            <div class="timeProgressBox cloudeProgress" v-if="valueFog">
                  <el-slider v-model="valueSliderFog"
                      class="progressSnow"
                      :min="0" 
                      :max="2" 
                      :step="1"
                      :marks="marksFog"
                      :disabled = !this.valueFog
                      @change="strongChange('fog')"
                  >
                  </el-slider>
              </div>
          </div>
      </div>
      <!-- 风 -->
      <div class="wind" v-if="radio == 2">
          <div class="direction">
              <div class="windDirectin">风向</div>
              <div class="windSpeed">
                  <el-input type="number" :disabled="radio == 2 ? false : true" :min="0" :max="360" v-model="inputWind" @blur="blurWind" size="mini"></el-input>
              </div>
              <div class="windInfo">°</div>
          </div>
          <div class="remarks">取值0 ～360 ，东风0 ，顺时针方向</div>
          <div class="direction speed">
              <div class="windDirectin">风速</div>
              <div class="windSpeed">
                  <el-input type="number" :disabled="radio == 2 ? false : true" :min="1" :max="12" v-model="inputSpeedWind" @blur="blurWind" size="mini"></el-input>
              </div>
              <div class="windInfo speedNumber">m/s</div>
          </div>
      </div>
      <!-- 轮廓描边 -->
      <div class="contourLine" v-if="false">
          <el-checkbox v-model="checkedLine">模型描边轮廓线</el-checkbox>
      </div>
      <!-- 轮廓描边颜色 -->
      <div class="boxSolidBackground lineColor" v-if="false">
          <div class="solidName">颜色</div>
          <div class="colorBox">
              <div class="selectColor">
                  <el-color-picker v-model="colorLineSele" size="mini" color-format="rgb"></el-color-picker>
              </div>
              <div class="colorName">
                      <el-input v-model="lineInput" size="mini"></el-input>
              </div>
          </div>
      </div>
    </div>
    </Drawer>
  </template>
  
  <script>
  import { EventBus } from '@/utils/bus.js'
  import Drawer from "@/components/Drawer/index.vue";
  import MODELAPI, { setWeatherSun, setWeatherLight } from "@/api/model_api";
  import CHAILIAOAPI from "@/api/material_api";
  import moment from 'moment'
  export default {
    components: { Drawer },
      props:{
          appId: {
              type: String,
              default: "",
          },
          taskId: {
              type: String,
              default: "",
          },
      },
      data(){
          return {
              radio:0,
              valueTemplate:'', // 环境模板
              optionsTemplate:[], // 环境
              lessOptions:[], // 少了 参数化 和 轮廓线
              color1:'rgb(228,226,228)', // 纯色背景颜色绑定
              input:'11111', // 纯色背景颜色值
              hourValue:new Date(2023, 1, 11, 9, 36), // 选择时间，小时
              inputSpeed:'0.1', // 时速
              valueSlider:9.6, // 时速进度条
              marks: {
                  0: '0',
                  6: '6',
                  12: '12',
                  18: '18',
                  24: '24',
              },
              valueDate:new Date(2023, 5, 6), // 日期
              inputLatitude:'22.59', // 维度绑定值
              valueCloude:false, // 云开关
              marksCloude:{
                  0: '晴',
                  1: '晴天少云',
                  2: '晴天多云',
                  3: '阴',
              },
              valueSliderCloude:1, // 云选择条
              valueRain:false, // 雨
              valueSliderRain:1, // 雨滑块
              marksRain:{
                  0: '小雨',
                  1: '中雨',
                  2: '大雨',
                  3: '暴雨',
              },
              valueSnow:false, // 雪
              valueSliderSnow:1,
              marksSnow:{
                  0: '小雪',
                  1: '中雪',
                  2: '大雪',
                  3: '暴雪',
              },
              valueFog:false, // 雾
              valueSliderFog:1,// 雾
              marksFog:{
                  0: '小雾',
                  1: '中雾',
                  2: '大雾',
              },
              inputWind:'0', // 风向
              inputSpeedWind:'1', // 风速
              checkedLine:false, // 轮廓线单选
              colorLineSele:'rgb(71,93,152)', // 轮廓线颜色
              lineInput:'', // 轮廓线颜色值
            //   weatherStrong:'', // 某个天气的强度
              weatherIntensity:'0', // 天气强度
              cloudCoverage:'3.5', // 云密度
              rainSnow:'0', // 雨雪比例
              messageFlag:true,
              onlyTwoIds:null, // 参数化天气 和 轮廓的id
              isGis: false,
              form:{
                sunLightIntensity:4.65,
                sunLightColor: ''
              }
          }
      },
      created(){
          this.isGis = (this.$route.query.isGis&&eval(this.$route.query.isGis.toLowerCase())) || (this.$route.query.weatherBin&&eval(this.$route.query.weatherBin.toLowerCase())) || false
        },
      mounted(){
          if(this.isGis){
              document.querySelector('.weatherClassify').style.height = '200px';
            }
        },
      methods:{
        show() {
            this.$refs.Drawer.show()
            this.getWeatherList();
            this.changeColor(this.color1);
        },
        close(){
            this.$refs.Drawer.hide()
            EventBus.$emit('eventTool', 'renderingEnvironment')
        },
        rgbaToArr(color) {
            var arr = []
            if(color){
                const str = color.slice(5)
                const str1 = str.slice(0, str.length - 1)
                arr = str1.replace(/\s*/g,"").split(',')
            }
            return arr
        },
        // 数组变rgb
        arrToRgb(arr){
            let str = '';
            if(arr.length>0){
                str = `rgba(${arr[0]},${arr[1]},${arr[2]},${arr[3]})`
            }else{
                str = null
            }
            return str;
        },
        // 太阳光颜色和强度
        colorChange(){
            let data = {
                taskId: this.taskId,
                sunLightIntensity:this.form.sunLightIntensity
            }
            setWeatherSun(data,this.rgbaToArr(this.form.sunLightColor)).then(()=>{
                this.$message.success('修改成功')
                this.getWeatherParams()
            })
        },
        // 天气光参数设置------天空光和方向光阴影
        lightTypeChange(e,value){
            let params = {
                taskId: this.taskId,
                lightType:value,
                castsShadows:e?'enable':'disable'
            }
            setWeatherLight(params).then(()=>{
                this.$message.success('修改成功')
                this.getWeatherParams()
            })
        },
          radioChange(val){
              if(val == 2){
                if(!this.isGis){
                    this.changeWea(this.getTwoIds('parameter'));
                }else{
                    this.getWeatherParams('need');
                }
              }else if(val == 0){
                  if(this.valueTemplate){
                      this.changeWea(this.valueTemplate);
                  }else{
                      let number = null;
                      number = this.lessOptions.findIndex(item=>{
                         return item.weatherName === '默认'
                      })
                      this.valueTemplate = this.lessOptions[number].id;
                      this.changeWea(this.valueTemplate);
                  }
              }else if(val == 1){
                  this.changeWea(this.getTwoIds('backgroundColor'));
              }
          },
          getWeatherList(){ // 获取天气环境
              MODELAPI.LISTWEATHER({
                  appId: this.appId,
              }).then((res) => {
                  if (res.data.code === 0) {
                      this.optionsTemplate = res.data.data;
                      this.lessOptions = res.data.data.filter(item=>{
                          return (item.weatherName === '参数化天气' || item.weatherName === '轮廓线-可变背景色') ? false : true
                      })
                      if(!this.isGis){
                          this.getWeatherId(); // 获取当前天气
                      }else{
                            this.radio = 2
                            this.getWeatherParams('none');
                      }
                  } else {
                      this.optionsTemplate = [];
                  }
              });
          },
          valueChangeBtn(val){ // 选择天气改变时
              this.changeWea(val);
              // setTimeout(()=>{
                  // this.optionsTemplate.forEach(item=>{
                  //     if(item.id == val && item.weatherName === '参数化天气'){
                  //         this.setSun();
                  //         this.setTimeAndSpeed();
                  //         this.setWind();
                  //         if(this.valueCloude){
                  //             this.strongChange('cloude')
                  //         }else if(this.valueRain){
                  //             this.btnWeatherClick('2')
                  //         }else if(this.valueSnow){
                  //             this.strongChange('snow')
                  //         }else if(this.valueFog){
                  //             this.btnWeatherClick('4')
                  //         }
                  //     }
                  // })
              // },2000)
          },
          getWeatherParams(flag){ // 获取参数化天气信息
              let params = {
                  appId:this.appId,
              }
              CHAILIAOAPI.GETWEATHERPARAMS(params).then(res=>{
                  if(res.data.code === 0){
                      let allData = res.data.data;
                      if(allData.timeAndTimeSpeed){
                          allData.timeAndTimeSpeed.forEach(item=>{
                              if(item.key === 'timeOfDay'){
                                 this.hourValue = this.timeFromBack(item.value); // 时间
                                 this.valueSlider = this.hourMinuteChange(this.hourValue); // 修改时间相关连时间轴
                              }
                          })
                      }
                      if(allData.simulate){
                          let dateMouth = null;
                          let dateDay = null;
                          allData.simulate.forEach(item=>{
                              if(item.key === 'simulationSpeed'){ // 时速
                                 this.inputSpeed = (Number(item.value) / 3600).toFixed(2);
                                //  this.valueSlider = Number((Number(item.value) / 3600).toFixed(2));
                              }else if(item.key === 'mouth'){  // 日期
                                  dateMouth = Number(item.value);
                              }else if(item.key === 'day'){   // 日期 天
                                  dateDay = Number(item.value);
                              }else if(item.key === 'latitude'){ // 纬度
                                  this.inputLatitude = item.value;
                              }
                              if(dateMouth && dateDay){
                                  this.valueDate = new Date(2023, dateMouth - 1, dateDay)
                              }
                          })
                      }
                      if(allData.weatherBasic){
                          let bigStrongWether = -1;
                          let cloudeMore = -1;
                          let rainAndSnow = -1;
                          allData.weatherBasic.forEach(item=>{
                              if(item.key === 'windIntensity'){ // 风速
                                  this.inputSpeedWind = item.value;
                              }else if(item.key === 'windDirection'){ // 风向
                                  this.inputWind = item.value;
                              }else if(item.key === 'weatherIntensity'){ 
                                  bigStrongWether = item.value;
                              }else if(item.key === 'cloudCoverage'){ 
                                  cloudeMore = item.value;
                              }else if(item.key === 'rainSnow'){ 
                                  rainAndSnow = item.value;
                              }
                              if(bigStrongWether !== -1 && cloudeMore !== -1 && rainAndSnow !== -1){
                                  this.weatherNow(bigStrongWether,cloudeMore,rainAndSnow)
                              }
                          })
                      }
                      if(allData.sun){
                        allData.sun.forEach(e=>{
                            if(e.key==='sunLightIntensity'){
                                this.form[e.key] = +e.value
                            }else if(e.key==='sunLightColor'){
                                this.form[e.key] = this.arrToRgb(JSON.parse(e.value))
                            }else{
                                this.form[e.key] = e.value
                            }
                        })
                      }
                    //   方向光阴影
                      if(allData.setDirectionLight){
                        this.form.direction = allData.setDirectionLight.value==='enable'?true:false
                      }
                    //   天空光阴影
                      if(allData.setSkyLight){
                        this.form.sky = allData.setSkyLight.value==='enable'?true:false
                      }
                      if(flag==='need'){
                        setTimeout(()=>{
                            this.allRequest();
                        },3500)
                      }  
                  }else{
                    if(!res.data.data && this.radio == 2){
                        this.$message.warning(res.data.message)
                    }
                  }
              }).catch(()=>{})
          },
          weatherNow(bigStrongWether,cloudeMore,rainAndSnow){ // 根据数据回显天气
              if(bigStrongWether==='0' && cloudeMore==='0' && rainAndSnow==='0'){  // 云
                  this.valueCloude = true;
                  this.valueSliderCloude = 0;
              }else if(bigStrongWether==='0' && cloudeMore==='1.6' && rainAndSnow==='0'){
                  this.valueCloude = true;
                  this.valueSliderCloude = 1;
              }else if(bigStrongWether==='0' && cloudeMore==='3.5' && rainAndSnow==='0'){
                  this.valueCloude = true;
                  this.valueSliderCloude = 2;
              }else if(bigStrongWether==='0' && cloudeMore==='5' && rainAndSnow==='0'){
                  this.valueCloude = true;
                  this.valueSliderCloude = 3;
              }else if(bigStrongWether==='0.5' && cloudeMore==='5' && rainAndSnow==='0'){ // 雨
                  this.valueRain = true;
                  this.valueSliderRain = 0;
              }else if(bigStrongWether==='3.3' && cloudeMore==='6.5' && rainAndSnow==='0'){ 
                  this.valueRain = true;
                  this.valueSliderRain = 1;
              }else if(bigStrongWether==='6.6' && cloudeMore==='8.5' && rainAndSnow==='0'){ 
                  this.valueRain = true;
                  this.valueSliderRain = 2;
              }else if(bigStrongWether==='10' && cloudeMore==='10' && rainAndSnow==='0'){ 
                  this.valueRain = true;
                  this.valueSliderRain = 3;
              }else if(bigStrongWether==='0.5' && cloudeMore==='5' && rainAndSnow==='1'){ // 雪
                  this.valueSnow = true
                  this.valueSliderSnow = 0;
              }else if(bigStrongWether==='3.3' && cloudeMore==='6.5' && rainAndSnow==='1'){
                  this.valueSnow = true
                  this.valueSliderSnow = 1;
              }else if(bigStrongWether==='6.6' && cloudeMore==='8.5' && rainAndSnow==='1'){
                  this.valueSnow = true
                  this.valueSliderSnow = 2;
              }else if(bigStrongWether==='10' && cloudeMore==='10' && rainAndSnow==='1'){
                  this.valueSnow = true
                  this.valueSliderSnow = 3;
              }else if(bigStrongWether==='0' && cloudeMore==='6' && rainAndSnow==='0'){ // 雾
                  this.valueFog = true;
                  this.valueSliderFog = 0;
              }else if(bigStrongWether==='0' && cloudeMore==='8' && rainAndSnow==='0'){ 
                  this.valueFog = true;
                  this.valueSliderFog = 1;
              }else if(bigStrongWether==='0' && cloudeMore==='10' && rainAndSnow==='0'){ // 雾
                  this.valueFog = true;
                  this.valueSliderFog = 2;
              }
          },
          changeWea(weatherId){ // 改变天气请求
              let parasm = {
                  taskid:this.taskId,
                  action:'switchWeather',
                  weahterId:weatherId
              }
              MODELAPI.UPDATEORDER(parasm).then(res =>{
                  if(res.data.code === 0){
                      if(this.messageFlag){ // 防止重复提示
                          this.messageFlag = false;
                          this.$message.success(res.data.message);
                          this.messageChange()
                      }
                      this.optionsTemplate.forEach(item=>{
                          if(item.id === this.onlyTwoIds){
                              if(item.weatherName === '参数化天气'){
                                this.getWeatherParams('need');
                                // this.allRequest();
                              }else if(item.weatherName === '轮廓线-可变背景色'){
                                  setTimeout(() => {
                                      this.changeBackgroundColor(this.rgbChange(this.color1));
                                  }, 1500);
                              }
                          }
                      })
                  }else{
                      this.$message.error('天气切换失败');
                  }
              }).catch(()=>{})
          },
          changeColor(val){ // 纯色 颜色改变时
              if(val !== null){
                  this.input = val.slice(4,-1);
              }else if(val === null){
                  this.color1 = 'rgb(228,226,228)';
                  this.input = this.color1.slice(4,-1);
              }
              if(this.radio === 1){
                  this.changeBackgroundColor(this.rgbChange(this.color1));
              }
          },
          inputBlur(){ // 纯色 输入数据变化时
              this.color1 = 'rgb(' + this.input + ')';
              this.changeBackgroundColor(this.rgbChange(this.color1));
          },
          clickColorBtn(){ // 纯色 点击恢复按钮时
              if(this.radio != 1) return;
              this.color1 = 'rgb(228,226,228)';
              this.changeColor(this.color1);
          },
          changeBackgroundColor(rgb){ // 改变纯色背景
              let params = {
                  taskId:this.taskId,
                  rgbValue:rgb + 'ff'
              }
              CHAILIAOAPI.SETWEATHERCOLOR(params).then(res=>{
                  // console.log('rgba',res.data);
              }).catch(()=>{})
          },
          rgbChange(sRGB) { // rgb转换16进制
              let reg=/^(RGB|rgb)\((\d+),\s*(\d+),\s*(\d+)\)$/
              if(! reg.test(sRGB)) return sRGB
              let rgbArr = sRGB.replace(reg, '$2,$3,$4').split(',')
              let resultRgbArr = rgbArr.map(item=>{
                  if(+item>16) return (+item).toString(16)
                  return '0'+(+item).toString(16)
              })
              return resultRgbArr.join('')
          },
          timeHourChange(val){ // 小时的滑块
            this.hourValue = this.timeFromBack(val + '');
            this.setSun();
            this.setTimeAndSpeed();
            //   this.inputSpeed = val;
            //   this.setSun();
            //   this.setTimeAndSpeed();
          },
          hourSpeedBlur(){ // 时速失去焦点
            //   this.valueSlider = Number(this.inputSpeed);
              this.setSun();
              this.setTimeAndSpeed();
          },
          hourClick(val){ // 改变时间时
              this.valueSlider = this.hourMinuteChange(val); // 修改相关连时间轴
              this.setTimeAndSpeed();
              this.setSun();
          },
          setTimeAndSpeed(){ // 设置时间和时速
              let params = {
                  taskId:this.taskId,
                  timeOfDay: this.hourMinuteChange(this.hourValue),
                  animateTimeOfDay:true,
              }
              CHAILIAOAPI.SETTIMEWEATHERTIMEANDTIMESPEED(params).then(res=>{
                  if(res.data.code ===0){
                      if(this.messageFlag){
                          this.messageFlag = false;
                          this.$message.success(res.data.message);
                          this.messageChange()
                      }
                  }else{
                      this.$message.error(res.data.message)
                  }
              }).catch(()=>{})
          },
          clickDateTime(){ // 日期变化时
              this.setSun();
              this.setTimeAndSpeed();
          },
          latitudeChange(){ // 纬度改变
              this.setSun();
              this.setTimeAndSpeed();
          },
          setWeatherType(){ // 设置天气类型
              let params = {
                  taskId:this.taskId,
                //   weatherMode:this.weatherStrong;
              }
              let weather ={
                  weatherBasicControls:{
                      weatherIntensity:this.weatherIntensity,
                      cloudCoverage:this.cloudCoverage,
                      rainSnow:this.rainSnow,
                  }
              }
              CHAILIAOAPI.SETWEATHRTTYPE(params,JSON.stringify(weather)).then(res=>{
                  if(res.data.code ===0){
                      if(this.messageFlag){
                          this.messageFlag = false;
                          this.$message.success(res.data.message);
                          this.messageChange()
                      }
                  }else{
                      this.$message.error(res.data.message)
                  }
              }).catch(()=>{})
          },
          setSun(){ // 设置太阳方位
              let params = {
                  taskId:this.taskId,
              }
              let weather = {
                  simulate:{
                      simulateRealSun:true,
                      day:this.monthDateChange(this.valueDate,'day'),
                      month:this.monthDateChange(this.valueDate,'month'),
                      simulationSpeed:Number(this.inputSpeed) * 3600,
                      latitude:this.inputLatitude
                  }
              }
              CHAILIAOAPI.SETSUNLIGHTDIRECTION(params,JSON.stringify(weather)).then(res=>{
                  if(res.data.code ===0){
                      if(this.messageFlag){
                          this.messageFlag = false;
                          this.$message.success(res.data.message);
                          this.messageChange()
                      }
                  }else{
                      this.$message.error(res.data.message)
                  }
              }).catch(()=>{})
          },
          getWeatherId(){ // 获取当前天气的id
              let params = {
                  taskId:this.taskId
              }
              CHAILIAOAPI.GETCURRWEATHERID(params).then(res=>{
                  if(res.data.code === 0){
                      let index = null;
                      this.optionsTemplate.forEach(item=>{
                          if(item.id == res.data.data){
                              if(item.weatherName === '参数化天气'){
                                  this.radio = 2
                                  this.getWeatherParams('none');
                              }else if(item.weatherName === '轮廓线-可变背景色'){
                                  this.radio = 1
                                  setTimeout(() => {
                                      this.changeBackgroundColor(this.rgbChange(this.color1));
                                  }, 1000);
                              }else{
                                  this.radio = 0
                              }
                          }
                      })
                      if(this.radio == 0){
                          index = this.lessOptions.findIndex(item=>{
                              return item.id == res.data.data;
                          })
                          this.valueTemplate = this.lessOptions[index].id;
                      }
                  }
              })
          },
          hourMinuteChange(val){ // 时间占一天的比例
              let dataTime =  moment(val).format('HH:mm');
              let first = Number(dataTime.slice(0,2));
              let last = Number(dataTime.slice(3));
              return first + Number((last / 60).toFixed(2));
          },
          monthDateChange(val,flag){ // 日期转换
              let monthStr = moment(val).format('MM-DD');
              let first = null;
              if(flag === 'month'){
                  first = monthStr.slice(0,2);
              }else if(flag === 'day'){
                  first = monthStr.slice(3);
              }
              if(first.slice(0,1) === '0'){
                  first = first.slice(1)
              }
              return first;
          },
          btnWeatherClick(str){ // 天气开关
              if(str === '1'){
                  if(this.valueCloude){
                      this.wetherMutex('cloude')
                    //   this.weatherStrong = 'partlyCloudy'
                      this.valueSliderCloude = 1
                      this.weatherIntensity = '0',
                      this.cloudCoverage = '1.6',
                      this.rainSnow = '0'
                      this.setWeatherType();
                  }
              }else if(str === '2'){
                  if(this.valueRain){
                      this.wetherMutex('rain')
                    //   this.weatherStrong = 'rain'
                      this.weatherIntensity = '3.3',
                      this.cloudCoverage = '6.5',
                      this.rainSnow = '0'
                      this.setWeatherType();
                  }    
              }else if(str === '3'){
                  if(this.valueSnow){
                      this.wetherMutex('snow')
                    //   this.weatherStrong = 'snow'
                      this.valueSliderSnow = 1
                      this.weatherIntensity = '3.3',
                      this.cloudCoverage = '6.5',
                      this.rainSnow = '1'
                      this.setWeatherType();
                  }    
              }else if(str === '4'){
                  if(this.valueFog){
                      this.wetherMutex('fog')
                    //   this.weatherStrong = 'foggy'
                      this.weatherIntensity = '0',
                      this.cloudCoverage = '6',
                      this.rainSnow = '0'
                      this.setWeatherType();
                  }    
              }
              if(!this.valueCloude && !this.valueRain && !this.valueSnow && !this.valueFog){
                //   this.weatherStrong = 'cloudy'
                  this.valueSliderCloude = 0
                  this.weatherIntensity = '0',
                  this.cloudCoverage = '0',
                  this.rainSnow = '0'
                  this.setWeatherType();
              }
          },
          strongChange(flag){ // 云雨雪雾的强度
              if(flag === 'cloude'){
                  if(this.valueSliderCloude === 0){
                    //   this.weatherStrong = 'clearSkies'
                      this.weatherIntensity = '0',
                      this.cloudCoverage = '0',
                      this.rainSnow = '0'
                  }else if(this.valueSliderCloude === 1){
                    //   this.weatherStrong = 'partlyCloudy'
                      this.weatherIntensity = '0',
                      this.cloudCoverage = '1.6',
                      this.rainSnow = '0'
                  }else if(this.valueSliderCloude === 2){
                    //   this.weatherStrong = 'cloudy'
                      this.weatherIntensity = '0',
                      this.cloudCoverage = '3.5',
                      this.rainSnow = '0'
                  }else if(this.valueSliderCloude === 3){
                    //   this.weatherStrong = 'overcast'
                      this.weatherIntensity = '0',
                      this.cloudCoverage = '5',
                      this.rainSnow = '0'
                  }
                  this.setWeatherType()
              }else if(flag === 'rain'){
                  if(this.valueSliderRain === 0){
                    //   this.weatherStrong = 'lightSnow'
                      this.weatherIntensity = '0.5',
                      this.cloudCoverage = '5',
                      this.rainSnow = '0'
                  }else if(this.valueSliderRain === 1){
                    //   this.weatherStrong = 'snow'
                      this.weatherIntensity = '3.3',
                      this.cloudCoverage = '6.5',
                      this.rainSnow = '0'
                  }else if(this.valueSliderRain === 2){
                    //   this.weatherStrong = 'blizzard'
                      this.weatherIntensity = '6.6',
                      this.cloudCoverage = '8.5',
                      this.rainSnow = '0'
                  }else if(this.valueSliderRain === 3){
                    //   this.weatherStrong = 'blizzard'
                      this.weatherIntensity = '10',
                      this.cloudCoverage = '10',
                      this.rainSnow = '0'
                  }
                  this.setWeatherType()
              }else if(flag === 'snow'){
                  if(this.valueSliderSnow === 0){
                    //   this.weatherStrong = 'lightSnow'
                      this.weatherIntensity = '0.5',
                      this.cloudCoverage = '5',
                      this.rainSnow = '1'
                  }else if(this.valueSliderSnow === 1){
                    //   this.weatherStrong = 'snow'
                      this.weatherIntensity = '3.3',
                      this.cloudCoverage = '6.5',
                      this.rainSnow = '1'
                  }else if(this.valueSliderSnow === 2){
                    //   this.weatherStrong = 'blizzard'
                      this.weatherIntensity = '6.6',
                      this.cloudCoverage = '8.5',
                      this.rainSnow = '1'
                  }else if(this.valueSliderSnow === 3){
                    //   this.weatherStrong = 'blizzard'
                      this.weatherIntensity = '10',
                      this.cloudCoverage = '10',
                      this.rainSnow = '1'
                  }
                  this.setWeatherType()
              }else if(flag === 'fog'){
                  if(this.valueSliderFog === 0){
                    //   this.weatherStrong = 'lightSnow'
                      this.weatherIntensity = '0',
                      this.cloudCoverage = '6',
                      this.rainSnow = '0'
                  }else if(this.valueSliderFog === 1){
                    //   this.weatherStrong = 'snow'
                      this.weatherIntensity = '0',
                      this.cloudCoverage = '8',
                      this.rainSnow = '0'
                  }else if(this.valueSliderFog === 2){
                    //   this.weatherStrong = 'blizzard'
                      this.weatherIntensity = '0',
                      this.cloudCoverage = '10',
                      this.rainSnow = '0'
                  }
                  this.setWeatherType()
              }
          },
          blurWind(){ // 设置风向风速
              this.setWind()
          },
          setWind(){ // 风向
              let params = {
                  taskId:this.taskId,
                  windIntensity:this.inputSpeedWind,
                  windDirection:this.inputWind
              }
              CHAILIAOAPI.SETWINDDIRECTIONANDSPEED(params).then(res=>{
                  if(res.data.code ===0){
                      if(this.messageFlag){
                          this.messageFlag = false;
                          this.$message.success(res.data.message);
                          this.messageChange()
                      }
                  }else{
                      this.$message.error(res.data.message)
                  }
              }).catch(()=>{})
          },
          wetherMutex(flag){ // 天气互斥
              if(flag === 'cloude'){
                  this.valueRain =false;
                  this.valueSnow =false;
                  this.valueFog =false;
              }else if(flag === 'rain'){
                  this.valueCloude =false;
                  this.valueSnow =false;
                  this.valueFog =false;
              }else if(flag === 'snow'){
                  this.valueCloude =false;
                  this.valueRain =false;
                  this.valueFog =false;
              }else if(flag === 'fog'){
                  this.valueCloude =false;
                  this.valueRain =false;
                  this.valueSnow =false;
              }
          },
          timeFromBack(val){ // 获取的时间进行转换
              let first = Number(val.slice(0,2));
              let last = Math.floor(Number(val.slice(3)) / 100 * 60)
              return new Date(2023, 2, 6, first, last);
          },
          getTwoIds(flag){ // 参数化天气和轮廓线的id
              this.optionsTemplate.forEach(item=>{
                  if(flag === 'parameter' && item.weatherName === '参数化天气'){
                      this.onlyTwoIds = item.id;
                  }else if(flag === 'backgroundColor' && item.weatherName === '轮廓线-可变背景色'){
                      this.onlyTwoIds = item.id;
                  }
              })
              return this.onlyTwoIds
          },
          allRequest(){ // 个性化的全部请求
                  this.setSun();
                  this.setTimeAndSpeed();
                  this.setWind();
                  if(this.valueCloude){
                      this.strongChange('cloude')
                  }else if(this.valueRain){
                      this.strongChange('rain')
                  }else if(this.valueSnow){
                      this.strongChange('snow')
                  }else if(this.valueFog){
                    this.strongChange('fog')
                  }
          },
          messageChange(){
              setTimeout(()=>{
                  this.messageFlag = true;
              },3000)
          }
      }
  }
  </script>
  
  <style lang="less" scoped>
  .sun{
    background: rgba(51,51,51,0.7);
    border-radius: 6px;
    border: 1px solid #575A62;
    color: rgba(255, 255, 255, 0.7);
    font-size: 14px;
    margin-bottom: 10px;
    padding: 8px;
    >div{
        display: flex;
        align-items: center;
        span{
            margin-right: 10px;
        }
        /deep/ .el-slider{
            flex: 1;
        }
    }
  }
      .systemWeather{
          width: 100%;
          height: 100%;
          overflow-x: hidden;
          overflow-y: auto;
          &::-webkit-scrollbar {
            /*滚动条整体样式*/
            width: 6px;
            /*高宽分别对应横竖滚动条的尺寸*/
            height: 1px;
          }
  
          &::-webkit-scrollbar-thumb {
            /*滚动条里面小方块*/
            border-radius: 10px;
            background: rgba(0, 0, 0, 0.3);
          }
  
          &::-webkit-scrollbar-track {
            /*滚动条里面轨道*/
            border-radius: 10px;
            background: rgba(255, 255, 255, 0.295);
          }
          .weatherClassify{
              width: 272px;
              height: 300px;
              margin: 0 0 14px 15px;
            //   border-bottom: 1px solid #464646;
              .selectGroup{
                  .singleSelect{  // 单选组
                      display: flex;
                      flex-direction: column;
                      ::v-deep .el-radio{
                          height: 49px;
                          display: flex;
                          align-items: center;
                          margin-right:0;
                          border-top: 1px solid #464646;
                          .el-radio__inner{
                              width: 16px;
                              height: 16px;
                              background-color: #24262B;
                              border: 1px solid #9FAFC2;
                          }
                          .el-radio__input.is-checked{
                              .el-radio__inner{
                                  background-color: #20C6FF;
                              }
                          }
                      }
                      .envirTemplate{ // 环境模板
                          .templateBox{
                              display: flex;
                              align-items: center;
                              .templateName{
                                  color: rgba(255,255,255,0.7);
                              }
                              .templateInfo{
                                  margin-left: 8px;
                                  ::v-deep .el-select{
                                      width: 140px;  
                                      .el-input__inner{
                                          background-color: #24262B;
                                          border: 1px solid #727272;
                                          color: #fff;
                                      }                               
                                  }
                              }
                          }
                      }
                      .solidBackground{ // 纯色背景
                          .boxSolidBackground{
                              display: flex;
                              align-items: center;
                              .solidName{
                                  color: rgba(255,255,255,0.7);
                              }
                              .colorBox{
                                  display: flex;
                                  align-items: center;
                                  width: 150px;
                                  height: 32px;
                                  padding-left: 2px;
                                  margin-left: 8px;
                                  background: #24262B;
                                  border-radius: 2px;
                                  border: 1px solid #727272;
                                  .selectColor{
                                      width: 56px;
                                      height: 32px;
                                      ::v-deep .el-color-picker__trigger{
                                          height: 32px;
                                          width: 60px;
                                          border: none;
                                          .el-color-picker__color{
                                              border: none;
                                          }
                                          .el-color-picker__icon{
                                              color: rgba(255,255,255,0);
                                          }
                                      }
                                      ::v-deep .el-color-picker__mask{
                                          display: none;
                                      }
                                  }
                                  .colorName{
                                      width: 90px;
                                      height: 28px;     
                                      ::v-deep .el-input--mini .el-input__inner {
                                          border: none;
                                      }
                                      ::v-deep .el-input__inner{
                                          color: #fff;
                                          background-color: rgba(0,0,0,0);
                                          border: none;
                                          padding: 0 0 0 8px;
                                      }                  
                                  }
                              }
                              .resetColor{
                                  .resetColorIcon{
                                      font-size: 18px;
                                      color: #fff;
                                      margin-left: 5px;
                                  }
                              }
                          }
                      }
                      .mySetting{ // 个性化
                          ::v-deep .el-radio__label{
                              color: rgba(255,255,255,0.7);
                          }
                      }
                      ::v-deep .is-checked.envirTemplate {
                          .templateName{
                              color: #fff;
                          }
                      }
                      ::v-deep .is-checked.solidBackground {
                          .solidName{
                              color: #fff;
                          }
                      }
                      ::v-deep .is-checked.mySetting {
                          .el-radio__label{
                              color: #fff;
                          }
                      }
                      
                  }
                  .boxTimeHour{ // 个性化时间设置
                      width: 100%;
                      height: 28px;
                      margin-bottom: 24px;
                      display: flex;
                      font-size: 14px;
                      color: rgba(255,255,255,0.7);
                      .timeHour{
                          width: 116px;
                          height: 28px;
                          display: flex;
                          justify-content: space-between;
                          margin-right: 16px;
                          .hourName{
                              width: 28px;
                              height: 20px;
                              margin: auto 0;
                          }
                          .selectTime{
                              width: 80px;
                              height: 28px;
                              .picker{
                                  ::v-deep .el-input__inner{
                                      width: 36%;
                                      background-color: #24262B;
                                      border: 1px solid #727272;
                                      padding-right: 0;
                                      color: #fff;
                                  }
                              }
                          }
                      }
                      .hourSpeed{
                          width: 130px;
                          height: 28px;
                          display: flex;
                          justify-content: space-between;
                          .speedName{
                              width: 28px;
                              height: 20px;
                              margin: auto 0;
                          }
                          .speedNumber{
                              width: 50px;
                              height: 28px;
                              ::v-deep .el-input__inner{
                                  height: 28px;
                                  color: #fff;
                                  background-color: #24262B;
                                  border: 1px solid #727272;
                                  padding: 0 0 0 5px;
                              }
                          }
                          .speedInfo{
                              width: 42px;
                              height: 18px;
                              font-size: 12px;
                              margin: auto 0;
                          }
                      }
                  }
                  .timeProgressBox{ // 时间轴
                      width: 92%;
                      height: 36px;
                      margin: 0 0 16px 5px;
                      ::v-deep .el-slider::after,
                      ::v-deep .el-slider::before {
                          display: block;
                      }
                      ::v-deep .el-slider__runway{
                          background-color: #24262B;
                          .el-slider__bar{
                              background: linear-gradient(90deg, #C1EAFF 0%, #8ED1FF 100%);
                          }
                      }
                      ::v-deep .el-slider__button{
                          width: 10px;
                          height: 10px;
                          border: 2px solid #fff;
                          background-color: #00C9FD;
                      }
                      ::v-deep .el-slider__marks-text{
                          color: #fff;
                      }
                  }
                  .dateTimeBox{ // 日期与纬度
                      .dateTime{
                          width: 148px;
                          .selectDate{
                              width: 112px;
                              height: 28px;
                              .picker{
                                  ::v-deep .el-input__inner{
                                      width: 50%;
                                  }
                              }
                          }
                      }
                      .latitudeBox{
                          width: 106px;
                          .latitudeName{
                              width: 34px;
                          }
                          .latitudeSelect{
                              width: 60px;
                          }
                          .speedInfo.latitudeInfo{
                              width: 6px;        
                              margin: 0;          
                          }
                      }
                  }
                  .dateTimeBox2{
                    margin-bottom: 0;
                  }
                  .bottomBox{
                    width: 100%;
                    height: 18px;
                    border-bottom: 1px solid #464646;
                  }
              }
          }
          .mainWeather{ // 天气
            //   height: 306px;
              width: 280px;
              margin: 0 0 16px 7px;
              .titleWeather{
                  box-sizing: border-box;
                  width: 100%;
                  height: 20px;
                  font-size: 14px;
                  color: #fff;
                  margin-bottom: 8px;
                  padding-left: 8px;
              }
              .cloude{ // 云
                  box-sizing: border-box;
                  width: 100%;
                //   height: 90px;
                  background: rgba(51,51,51,0.7);
                  border-radius: 6px;
                  border: 1px solid #575A62;
                  padding: 8px 8px 0 8px;
                  margin-bottom: 6px;
                  .cloudeSelect{
                      width: 100%;
                      height: 24px;
                      margin-bottom: 14px;
                      display: flex;
                      .imgCloude{
                          width: 30px;
                          height: 20px;
                          margin: 2px 2px 0 0;
                          img{
                              width: 100%;
                              height: 100%;
                          }
                      }
                      .nameCloude{
                          width: 40px;
                          height: 20px;
                          font-size: 14px;
                          color: #fff;
                          margin-top: 2px;
                      }
                      .switchCloude{
                          width: 40px;
                          height: 20px;
                          margin-left: auto;
                          margin-top: 0px;
                      }
                  }
                  .cloudeProgress{
                      height: 39px;
                      ::v-deep .el-slider::after,
                      ::v-deep .el-slider::before {
                          display: block;
                      }
                      ::v-deep .el-slider__runway{
                          background-color: #191a1c;
                          .el-slider__bar{
                              background: linear-gradient(90deg, #C1EAFF 0%, #8ED1FF 100%);
                          }
                      }
                      ::v-deep .el-slider__button{
                          width: 10px;
                          height: 10px;
                          border: 2px solid #fff;
                          background-color: #00C9FD;
                      }
                      ::v-deep .el-slider__marks-text{
                          color: #fff;
                      }
                  }
              }
            //   .rainRain{
            //       width: 100%;
            //       height: 40px;
            //       display: flex;
            //       align-items: center;
            //       box-sizing: border-box;
            //       background: rgba(51,51,51,0.7);
            //       border-radius: 6px;
            //       border: 1px solid #575A62;
            //       padding: 0 8px;
            //       margin-bottom: 6px;
            //       .rainImage{
            //           width: 30px;
            //           height: 20px;
            //           margin-right: 2px;
            //           img{
            //               width: 100%;
            //               height: 100%;
            //           }
            //       }
            //       .rainName{
            //           width: 16px;
            //           height: 20px;
            //           font-size: 14px;
            //           color: #fff;
            //       }
            //       .rainSwitch{
            //           width: 40px;
            //           height: 20px;
            //           margin-left: auto;
            //       }
            //   }
              .rain{
                .imgCloude.imageRain{
                      width: 22px;
                      height: 20px;
                      margin-right: 11px;
                  }
                .nameCloude.nameRain{
                      margin-top: 2px;
                }
                .progressSnow{
                      ::v-deep .el-slider__marks .el-slider__marks-text:last-child{
                          width: 30px;
                          left: 98% !important;
                      }
                      ::v-deep .el-slider__marks .el-slider__marks-text:first-child{
                          left: 2% !important;
                      }
                }
              }
              .sonw{ // x雪
                  .imgCloude.imageSnow{
                      width: 22px;
                      height: 20px;
                      margin-right: 11px;
                  }
                  .nameCloude.nameSnow{
                      margin-top: 2px;
                  }
                  .progressSnow{
                      ::v-deep .el-slider__marks .el-slider__marks-text:last-child{
                          width: 30px;
                          left: 98% !important;
                      }
                      ::v-deep .el-slider__marks .el-slider__marks-text:first-child{
                          left: 2% !important;
                      }
                  }
              }
              .fog{  // 雾
                  .imgCloude.imageFog{
                      width: 22px;
                      height: 20px;
                      margin-right: 11px;
                  }
                  .nameCloude.nameFog{
                      margin-top: 2px;
                  }
                  .progressSnow{
                      ::v-deep .el-slider__marks .el-slider__marks-text:last-child{
                          width: 30px;
                          left: 98% !important;
                      }
                      ::v-deep .el-slider__marks .el-slider__marks-text:first-child{
                          left: 2% !important;
                      }
                  }
              }
          }
          .wind{ // 风
              box-sizing: border-box;
              width: 272px;
              height: 126px;
              margin: 0 0 15px 15px;
              padding-top: 15px;
              border-top: 1px solid #464646;
              border-bottom: 1px solid #464646;
              .direction{
                  width: 100%;
                  height: 28px;
                  display: flex;
                  color: rgba(255,255,255,0.7);
                  font-size: 14px;
                  margin-bottom: 4px;
                  .windDirectin{
                      width: 30px;
                      height: 20px;
                      margin: 4px 8px 0 0 ;
                  }
                  .windSpeed{
                      width: 60px;
                      height: 28px;
                      margin-right: 6px;
                      ::v-deep .el-input__inner{
                          height: 28px;
                          color: #fff;
                          background-color: #24262B;
                          border: 1px solid #727272;
                          padding: 0 8px;
                      }
                  }
                  .windInfo{
                      width: 36px;
                      height: 100%;
                      color: #fff;
                  }
              }
              .remarks{
                  width: 220px;
                  height: 20px;
                  margin: 0 0 16px 39px;
                  font-size: 12px;
                  color: #FFBB48;
              }
              .direction.speed{
                  .speedNumber{
                      line-height: 26px;
                      font-size: 14px;
                      color: rgba(255,255,255,0.7);
                  }
              }
          }
          .contourLine{
              width: 124px;
              height: 22px;
              margin: 0 0 8px 15px;
              ::v-deep .el-checkbox__label{
                  color: #fff;
              }
              ::v-deep .el-checkbox__inner{
                  border: 1px solid #9FAFC2;
                  background-color: #24262B;
              }
              ::v-deep .el-checkbox__input.is-checked .el-checkbox__inner{
                  background-color: #409EFF;
              }
          }
          // .lineColor{ // 轮廓线颜色
          //     width: 200px;
          //     height: 32px;
          //     margin-left: 15px;
          // }
          .boxSolidBackground.lineColor{
                              display: flex;
                              align-items: center;
                              margin-left: 15px;
                              .solidName{
                                  color: #fff;
                                  font-size: 14px;
                              }
                              .colorBox{
                                  display: flex;
                                  align-items: center;
                                  width: 150px;
                                  height: 32px;
                                  padding-left: 2px;
                                  margin-left: 8px;
                                  background: #24262B;
                                  border-radius: 2px;
                                  border: 1px solid #727272;
                                  .selectColor{
                                      width: 56px;
                                      height: 32px;
                                      ::v-deep .el-color-picker__trigger{
                                          height: 32px;
                                          width: 60px;
                                          border: none;
                                          .el-color-picker__color{
                                              border: none;
                                          }
                                          .el-color-picker__icon{
                                              color: rgba(255,255,255,0);
                                          }
                                      }
                                  }
                                  .colorName{
                                      width: 90px;
                                      height: 28px;     
                                      ::v-deep .el-input--mini .el-input__inner {
                                          border: none;
                                      }
                                      ::v-deep .el-input__inner{
                                          color: #fff;
                                          background-color: rgba(0,0,0,0);
                                          border: none;
                                          padding: 0 0 0 8px;
                                      }                  
                                  }
                              }
                              .resetColor{
                                  .resetColorIcon{
                                      font-size: 18px;
                                      color: #fff;
                                      margin-left: 5px;
                                  }
                              }
                          }
      }
  </style>
  