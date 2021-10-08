<template>
  <div id="echarts">
    <div class="dsaasdad"></div>
    <div class="header-wrap">智慧地下管网</div>
    <div class="left-right left">
      <div class="chart-title">
        <div class="chart-title-head">接入设备</div>
        <div class="chart-title-body"></div>
        <div class="chart-title-foot"></div>
      </div>
      <div class="equ-wrap">
        <div class="equ-item">
          <div>
            <img src="./icon1.png" alt="" />
          </div>
          <div>
            <div class="equ-text">大用户水表</div>
            <div class="equ-num-wrap">
              <span class="equ-num">20</span>
              <span class="equ-com">个</span>
            </div>
          </div>
        </div>
        <div class="equ-item">
          <div>
            <img src="./icon2.png" alt="" />
          </div>
          <div>
            <div class="equ-text">压力计</div>
            <div class="equ-num-wrap">
              <span class="equ-num">50</span>
              <span class="equ-com">个</span>
            </div>
          </div>
        </div>
      </div>
      <div class="chart-title">
        <div class="chart-title-head">区域报警统计</div>
        <div class="chart-title-body"></div>
        <div class="chart-title-foot"></div>
      </div>
      <div id="myChart1"></div>
      <div class="chart-title">
        <div class="chart-title-head">报警事件统计</div>
        <div class="chart-title-body"></div>
        <div class="chart-title-foot"></div>
      </div>
      <div class="warn-row">
        <div>
          <span style="font-size: 14px">同年比较：</span>
          <span style="font-size: 18px">15%</span>
        </div>
        <img src="./chart1.png" />
      </div>
      <div id="myChart2"></div>
      <div class="bottom">
        <div class="bottom-btn">综合监视</div>
        <div class="bottom-btn">中央管理网</div>
        <div class="bottom-btn">排水管网</div>
        <div class="bottom-btn">燃气管网</div>
      </div>
    </div>
    <div class="left-right right">
      <div class="chart-title">
        <div class="chart-title-head">接入设备状态</div>

        <div class="chart-title-body"></div>
        <div class="chart-title-foot"></div>
      </div>
      <div class="equ-num-text">
        <span style="font-size: 16px">日平均报警数 </span>
        <span style="font-size: 24px">22/100</span>
      </div>
      <div id="myChart3"></div>
      <div class="chart-title">
        <div class="chart-title-head">核心压力检测</div>
        <div class="chart-title-body"></div>
        <div class="chart-title-foot"></div>
      </div>
      <div id="myChart4"></div>
      <div class="chart-title">
        <div class="chart-title-head">聚合流量检测</div>
        <div class="chart-title-body"></div>
        <div class="chart-title-foot"></div>
      </div>
      <div class="max-min-row">
        <span>最小流量：</span>
        <span style="font-size: 18px">5</span>
        <span style="margin-left: 15px">最大流量：</span>
        <span style="font-size: 18px">50</span>
      </div>
      <div id="myChart5"></div>
    </div>

    <!-- 
    
    <div id="myChart3"></div>
    <div id="myChart4"></div> -->
  </div>
</template>

<script type="text/javascript">
export default {
  //   name: "Echarts",
  data() {
    return {};
  },
  methods: {
    echartsInit1() {
      // 找到容器
      let myChart = this.$echarts.init(document.getElementById("myChart1"));
      // 开始渲染
      let option = {
        textStyle: {
          color: "#fff",
        },
        title: {
          // text: "Referer of a Website",
          // subtext: "Fake Data",
          left: "center",
        },
        tooltip: {
          trigger: "item",
        },
        // legend: {
        //   orient: "vertical",
        //   left: "left",
        // },
        series: [
          {
            name: "区域报警统计",
            type: "pie",
            radius: "80%",
            data: [
              { value: 1048, name: "A区" },
              { value: 735, name: "B区" },
              { value: 580, name: "C区" },
              { value: 484, name: "D区" },
              { value: 300, name: "E区" },
            ],
            emphasis: {
              itemStyle: {
                // shadowBlur: 10,
                // shadowOffsetX: 0,
                shadowColor: "#fff",
              },
            },
          },
        ],
      };
      myChart.setOption(option);
    },
    echartsInit2() {
      let myChart = this.$echarts.init(document.getElementById("myChart2"));
      let option = {
        legend: {},
        tooltip: {},
        color: ["#02ECB9", "#1B9EDB"],
        textStyle: {
          color: "#fff",
        },
        dataset: {
          dimensions: ["product", "2020", "2021"],
          source: [
            { product: "1月", 2020: 15.3, 2021: 18.6 },
            { product: "2月", 2020: 8.6, 2021: 11.2 },
            { product: "3月", 2020: 18.4, 2021: 22.3 },
            { product: "4月", 2020: 24.6, 2021: 26.3 },
            { product: "5月", 2020: 12.3, 2021: 14.5 },
            { product: "6月", 2020: 11.2, 2021: 17.2 },
            { product: "7月", 2020: 15.2, 2021: 17.0 },
            { product: "8月", 2020: 22.3, 2021: 20.1 },
            { product: "9月", 2020: 25.6, 2021: 24.6 },
          ],
        },
        xAxis: { type: "category" },
        yAxis: {
          type: "value",
          splitLine: {
            show: true,
            lineStyle: {
              color: "rgba(0,0,0,0.1)",
            },
          },
        },
        grid: {
          top: 30,
          bottom: 20,
          left: "7%",
          right: "5%",
          // borderColor: "#fff"
        },
        // Declare several bar series, each will be mapped
        // to a column of dataset.source by default.
        series: [{ type: "bar" }, { type: "bar" }],
      };
      myChart.setOption(option);
    },
    _pie3() {
      let dataArr = [];
      for (let i = 0; i < 8; i++) {
        if (i % 2 === 0) {
          dataArr.push({
            name: (i + 1).toString(),
            value: 25,
            itemStyle: {
              normal: {
                color: "rgba(88,142,197,0.5)",
              },
            },
          });
        } else {
          dataArr.push({
            name: (i + 1).toString(),
            value: 20,
            itemStyle: {
              normal: {
                color: "rgba(0,0,0,0)",
              },
            },
          });
        }
      }
      return dataArr;
    },
    echartsInit3() {
      let value = 0.22;
      let value1 = 0.22;
      let data = [value, value1];
      let myChart = this.$echarts.init(document.getElementById("myChart3"));
      let option = {
        series: [
          {
            type: "liquidFill",
            radius: "67%",
            center: ["50%", "50%"],
            color: [
              {
                type: "linear",
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [
                  {
                    offset: 1,
                    color: "#6CDEFC",
                  },
                  {
                    offset: 0,
                    color: "#429BF7",
                  },
                ],
                globalCoord: false,
              },
            ],
            data: data,
            backgroundStyle: {
              borderWidth: 1,
              color: "RGBA(51, 66, 127, 0.7)",
            },
            label: {
              normal: {
                formatter: (value * 100).toFixed(1) + "%",
                textStyle: {
                  fontSize: 28,
                  color: "#fff",
                },
              },
            },
            outline: {
              show: true,
              itemStyle: {
                borderWidth: 0,
              },
              borderDistance: 0,
            },
          },
          {
            type: "pie",
            zlevel: 1,
            silent: true,
            center: ["50%", "50%"],
            radius: ["75%", "74%"],
            hoverAnimation: false,
            color: "rgba(88,142,197,0.5)",
            label: {
              normal: {
                show: false,
              },
            },
            labelLine: {
              normal: {
                show: false,
              },
            },
            data: [1],
          },
          {
            type: "pie",
            zlevel: 2,
            silent: true,
            center: ["50%", "50%"],
            radius: ["83%", "80%"],
            startAngle: 50,
            hoverAnimation: false,
            label: {
              normal: {
                show: false,
              },
            },
            labelLine: {
              normal: {
                show: false,
              },
            },
            data: this._pie3(),
          },
          {
            type: "pie",
            zlevel: 3,
            silent: true,
            center: ["50%", "50%"],
            radius: ["78%", "79%"],
            label: {
              normal: {
                show: false,
              },
            },
            labelLine: {
              normal: {
                show: false,
              },
            },
            data: this._pie3(),
          },
        ],
      };
      myChart.setOption(option);
    },
    echartsInit4() {
      let myChart = this.$echarts.init(document.getElementById("myChart4"));
      let option = {
        textStyle: {
          color: "#fff",
        },
        xAxis: {
          type: "category",
          data: [
            "11:00",
            "12:00",
            "13:00",
            "14:00",
            "15:00",
            "16:00",
            "17:00",
            "18:00",
            "19:00",
            "20:00",
          ],
        },
        yAxis: {
          type: "value",
          splitLine: {
            show: true,
            lineStyle: {
              color: "rgba(0,0,0,0.1)",
            },
          },
        },
        grid: {
          top: 30,
          bottom: 20,
          left: "8%",
          right: "0%",
          // borderColor: "#fff"
        },
        series: [
          {
            data: [2, 5, 10, 25, 31, 62, 33, 45, 71, 64],
            type: "line",
          },
        ],
      };
      myChart.setOption(option);
    },
    echartsInit5() {
      let myChart = this.$echarts.init(document.getElementById("myChart5"));
      let xLabel = ["11.00", "12.00", "13.00", "14.00", "15.00", "16.00"];
      let goToSchool = ["40", "60", "22", "85", "50", "40"];
      let goOutSchool = ["20", "50", "12", "65", "30", "60"];

      let option = {
        // backgroundColor: "#0e1c47",//背景颜色
        tooltip: {
          trigger: "axis",
          backgroundColor: "transparent",
          axisPointer: {
            lineStyle: {
              color: {
                type: "linear",
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [
                  {
                    offset: 0,
                    color: "rgba(126,199,255,0)", // 0% 处的颜色
                  },
                  {
                    offset: 0.5,
                    color: "rgba(126,199,255,1)", // 100% 处的颜色
                  },
                  {
                    offset: 1,
                    color: "rgba(126,199,255,0)", // 100% 处的颜色
                  },
                ],
                global: false, // 缺省为 false
              },
            },
          },
          formatter: (p) => {
            let dom = `<div style="width: 79px;
	height: 50px;;color:#fff;position: relative;">
        <svg style="position: absolute;top: 50%;
    left: 50%;
    transform: translateX(-50%) translateY(-50%);" class="svg" xmlns="http://www.w3.org/2000/svg" width="100" height="71" viewBox="0 0 84 55">
      <defs>
        <style>
          .cls-1 {
            fill: #07172c;
            fill-opacity: 0.8;
            stroke: #a7d8ff;
            stroke-linejoin: round;
            stroke-opacity: 0.2;
            stroke-width: 1px;
            fill-rule: evenodd;
          }

        </style>
      </defs>
      <path id="矩形_419" data-name="矩形 419" class="cls-1" d="M266,595h74v50H266V624.046L261,620l5-3.984V595Z"
        transform="translate(-258.5 -592.5)" />
    </svg>
        <div style="padding: 4px 8px 4px 14px;display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;position: relative;z-index: 1;">
            <div style="margin-bottom: 4px;width:100%;display:${
              p[0] ? "flex" : "none"
            };justify-content:space-between;align-items:center;">
                <span style="font-size:14px;color:#7ec7ff;">${
                  p[0] ? p[0].seriesName : ""
                }</span>
                <span style="font-size:14px;color:#fff;">${
                  p[0] ? p[0].data : ""
                }</span>
            </div>
            <div style="width:100%;height:100%;display:${
              p[1] ? "flex" : "none"
            };justify-content:space-between;align-items:center;">
                <span style="font-size:14px;color:#7ec7ff;">${
                  p[1] ? p[1].seriesName : ""
                }</span>
                <span style="font-size:14px;color:#fff;">${
                  p[1] ? p[1].data : ""
                }</span>
            </div>
        </div>
    </div>`;
            return dom;
          },
        },
        legend: {
          align: "left",
          right: "5%",
          top: "14%",
          type: "plain",
          textStyle: {
            color: "#7ec7ff",
            fontSize: 16,
          },
          // icon:'rect',
          itemGap: 25,
          itemWidth: 18,
          icon: "path://M0 2a2 2 0 0 1 2 -2h14a2 2 0 0 1 2 2v0a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2z",

          data: [
            {
              name: "222",
            },
            {
              name: "111",
            },
          ],
        },
        grid: {
          top: "18%",
          left: "15%",
          right: "5%",
          bottom: "25%",
          // containLabel: true
        },
        xAxis: [
          {
            type: "category",
            boundaryGap: false,
            axisLine: {
              //坐标轴轴线相关设置。数学上的x轴
              show: true,
              lineStyle: {
                color: "rgba(0,0,0,0)",
              },
            },

            axisLabel: {
              //坐标轴刻度标签的相关设置
              textStyle: {
                color: "#fff", //坐标轴文字
                padding: 16,
                fontSize: 14,
              },
              formatter: function (data) {
                return data;
              },
            },
            // splitLine: {
            //   show: true,
            //   lineStyle: {
            //     color: "#192a44",//竖线颜色
            //   },
            // },
            axisTick: {
              show: false,
            },
            data: xLabel,
          },
        ],
        yAxis: [
          {
            // name: "人数",
            nameTextStyle: {
              color: "#7ec7ff",
              fontSize: 16,
              padding: 10,
            },
            min: 0,
            splitLine: {
              show: true,
              lineStyle: {
                color: "rgba(0,0,0,0.1)",
              },
            },
            axisLine: {
              show: true,
              lineStyle: {
                color: "#0487F3", //y主轴颜色
              },
            },
            axisLabel: {
              show: true,
              textStyle: {
                color: "#fff",
                padding: 16,
              },
              formatter: function (value) {
                if (value === 0) {
                  return value;
                }
                return value;
              },
            },
            axisTick: {
              show: false,
            },
          },
        ],
        series: [
          {
            // name: "222",
            type: "line",
            symbol: "circle", // 默认是空心圆（中间是白色的），改成实心圆
            showAllSymbol: true,
            symbolSize: 0,
            smooth: true,
            lineStyle: {
              normal: {
                width: 1,
                color: "rgba(25,163,223,1)", // 线条颜色
              },
              borderColor: "rgba(0,0,0,.4)",
            },
            itemStyle: {
              color: "rgba(25,163,223,1)",
              borderColor: "#646ace",
              borderWidth: 2,
            },
            tooltip: {
              show: true,
            },
            areaStyle: {
              //区域填充样式
              normal: {
                //线性渐变，前4个参数分别是x0,y0,x2,y2(范围0~1);相当于图形包围盒中的百分比。如果最后一个参数是‘true’，则该四个值是绝对像素位置。
                color: this.$echarts.graphic.LinearGradient(
                  0,
                  0,
                  0,
                  1,
                  [
                    {
                      offset: 0,
                      color: "rgba(25,163,223,.3)",
                    },
                    {
                      offset: 1,
                      color: "rgba(25,163,223, 0)",
                    },
                  ],
                  false
                ),
                shadowColor: "rgba(25,163,223, 0.5)", //阴影颜色
                shadowBlur: 20, //shadowBlur设图形阴影的模糊大小。配合shadowColor,shadowOffsetX/Y, 设置图形的阴影效果。
              },
            },
            data: goToSchool,
          },
          {
            // name: "111",
            type: "line",
            symbol: "circle", // 默认是空心圆（中间是白色的），改成实心圆
            showAllSymbol: true,
            symbolSize: 0,
            smooth: true,
            lineStyle: {
              normal: {
                width: 1,
                color: "rgba(10,219,250,1)", // 曲线线条颜色
              },
              borderColor: "rgba(0,0,0,.4)",
            },
            itemStyle: {
              color: "rgba(10,219,250,1)",
              borderColor: "#646ace",
              borderWidth: 2,
            },
            tooltip: {
              show: true,
            },
            areaStyle: {
              //区域填充样式
              normal: {
                //线性渐变，前4个参数分别是x0,y0,x2,y2(范围0~1);相当于图形包围盒中的百分比。如果最后一个参数是‘true’，则该四个值是绝对像素位置。
                color: this.$echarts.graphic.LinearGradient(
                  0,
                  0,
                  0,
                  1,
                  [
                    {
                      offset: 0,
                      color: "rgba(10,219,250,.3)",
                    },
                    {
                      offset: 1,
                      color: "rgba(10,219,250, 0)",
                    },
                  ],
                  false
                ),
                shadowColor: "rgba(10,219,250, 0.5)", //阴影颜色
                shadowBlur: 20, //shadowBlur设图形阴影的模糊大小。配合shadowColor,shadowOffsetX/Y, 设置图形的阴影效果。
              },
            },
            data: goOutSchool,
          },
        ],
      };
      myChart.setOption(option);
    },
  },

  mounted() {
    this.echartsInit1();
    this.echartsInit2();
    this.echartsInit3();
    this.echartsInit4();
    this.echartsInit5();
  },
};
</script>

<style scoped lang="less">
.dsaasdad {
  position: fixed;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
  z-index: 9999;
  // background: rgba(0, 0, 0, 0.3);
  background: url(./shadow-bg.png) no-repeat;
  background-size: cover;
  -webkit-pointer-events: none;
  -moz-pointer-events: none;
  -ms-pointer-events: none;
  -o-pointer-events: none;
  pointer-events: none;
  z-index: 0;
}
div {
  box-sizing: border-box;
}
#myChart1 {
  width: 100%;
  height: 200px;
}
#myChart2 {
  width: 100%;
  height: 220px;
}
#myChart3 {
  width: 100%;
  height: 200px;
  // background-color: pink;
}
#myChart4 {
  width: 100%;
  height: 200px;
}
#myChart5 {
  width: 100%;
  height: 250px;
}
.header-wrap {
  overflow: hidden;
  width: 1926px;
  height: 86px;
  position: absolute;
  top: 0;
  left: 0;
  // left: 50%;
  // transform: translateX(-50%);
  background: url(./header1.png) no-repeat;
  // background: url(./header1.png) no-repeat, url(./top-shadow.png) no-repeat;
  background-size: cover;
  text-align: center;
  color: #fff;
  font-size: 36px;
  line-height: 55px;
}
.left-right {
  width: 362px;
  height: 800px;
  position: absolute;
  top: 86px;
  // background-color: pink;
}
.left {
  left: 46px;
}
.right {
  right: 46px;
}

.chart-title {
  .chart-title-head {
    font-size: 18px;
    font-family: PingFang SC;
    font-weight: 500;
    color: #ffffff;
    text-shadow: 0px 4px 6px #fff;
    margin-bottom: 14px;
  }
  .chart-title-body {
    width: 123px;
    height: 6px;
    background: #00a2ed;
  }
  .chart-title-foot {
    width: 382px;
    height: 1px;
    background: #00a2ed;
    // border: 1px solid #ffffff;
    opacity: 0.4;
  }
}

.equ-wrap {
  padding: 10px 0;
  .equ-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px 20px 8px 30px;
    .equ-text {
      font-size: 14.15px;
      text-align: right;
      color: #fff;
    }
    .equ-num-wrap {
      text-align: right;
      .equ-num {
        color: #fff;
        color: #269cfa;
        font-size: 26.27px;
        padding: 0 10px;
      }
      .equ-com {
        color: #fff;
        font-size: 14.15px;
      }
    }
  }
}

.equ-num-text {
  color: #fff;
  margin-top: 13px;
}
.warn-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  // padding-right: 20px;
  padding: 6px 20px 6px 0;
  color: #fff;
}

.max-min-row {
  color: #fff;
  font-size: 14px;
  margin-top: 13px;
}
.bottom {
  position: absolute;
  left: 0;
  bottom: -40px;
  display: flex;
  .bottom-btn {
    width: 163px;
    height: 40px;
    // display: inline-block;
    background: url(./div.png) no-repeat;
    background-size: cover;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 20px;
    font-family: PingFang SC;
    font-weight: 500;
    color: #ffffff;
    opacity: 0.5;
    margin-right: 19px;
    cursor: pointer;
  }
}
</style>