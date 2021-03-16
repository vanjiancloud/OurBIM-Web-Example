<!--
 * @Author: zk
 * @Date: 2021-03-04 14:00:23
 * @LastEditors: zk
 * @LastEditTime: 2021-03-15 17:26:56
 * @description: 
-->
<template>
  <div class="todo-footer">
    <div class="todo-main">
      <div class="image-main">
        <el-tooltip
          class="item"
          effect="dark"
          :content="imgList[0].title"
          placement="top"
        >
          <img
            @click="handleOrder(0)"
            class="footer-image"
            :src="imgList[0].url"
            mode=""
          />
        </el-tooltip>
      </div>
      <div class="image-main">
        <el-tooltip
          class="item"
          effect="dark"
          :content="imgList[1].title"
          placement="top"
        >
          <img
            @click="handleOrder(1)"
            class="footer-image"
            :src="imgList[1].url"
            mode=""
          />
        </el-tooltip>
        <el-collapse-transition>
          <div class="show-speed" v-if="imgList[1].state === 1">
            <el-slider v-model="imgList[1].data.speed"></el-slider>
          </div>
        </el-collapse-transition>
      </div>
      <div class="cut-apart"></div>
      <div class="image-main">
        <el-tooltip
          class="item"
          effect="dark"
          :content="imgList[2].title"
          placement="top"
        >
          <img
            @click="handleOrder(2)"
            class="footer-image"
            :src="imgList[2].url"
            mode=""
          />
        </el-tooltip>
      </div>
      <div class="image-main">
        <el-tooltip
          class="item"
          effect="dark"
          :content="imgList[3].title"
          placement="top"
        >
          <img
            @click="handleOrder(3)"
            class="footer-image"
            :src="imgList[3].url"
            mode=""
          />
        </el-tooltip>
        <el-collapse-transition>
          <div class="show-cutting" v-if="imgList[3].state === 1">
            <el-tooltip
              class="item"
              effect="dark"
              :content="cuttingTips[0]"
              placement="left"
            >
              <img
                class="cutting-img"
                src="@/assets/images/todo/unchecked/position.png"
                mode=""
              />
            </el-tooltip>
            <el-tooltip
              class="item"
              effect="dark"
              :content="cuttingTips[1]"
              placement="left"
            >
              <img
                class="cutting-img"
                src="@/assets/images/todo/unchecked/gauge.png"
                mode=""
              />
            </el-tooltip>
            <el-tooltip
              class="item"
              effect="dark"
              :content="cuttingTips[2]"
              placement="left"
            >
              <img
                class="cutting-img"
                src="@/assets/images/todo/unchecked/angle.png"
                mode=""
              />
            </el-tooltip>
            <el-tooltip
              popper-class="tooltip-bgi"
              placement="right-end"
              v-model="angleTool"
              transition="el-fade-in-linear"
              manual
            >
              <div slot="content">
                <el-form
                  class="set-form"
                  ref="form"
                  :model="setForm"
                  label-width="80px"
                >
                  <el-form-item :label="$t('webClient.setting[0].label')">
                    <el-select
                      size="mini"
                      v-model="setForm.unit"
                      :placeholder="$t('webClient.setting[0].tips')"
                    >
                      <el-option label="区域一" value="shanghai"></el-option>
                      <el-option label="区域二" value="beijing"></el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item :label="$t('webClient.setting[1].label')">
                    <el-select
                      size="mini"
                      v-model="setForm.unit"
                      :placeholder="$t('webClient.setting[1].tips')"
                    >
                      <el-option label="区域一" value="shanghai"></el-option>
                      <el-option label="区域二" value="beijing"></el-option>
                    </el-select>
                  </el-form-item>
                </el-form>
              </div>
              <el-tooltip
                class="item"
                effect="dark"
                :content="cuttingTips[3]"
                placement="left"
              >
                <img
                  class="cutting-img"
                  src="@/assets/images/todo/unchecked/set.png"
                  @click.stop="showAngle"
                  mode=""
                />
              </el-tooltip>
            </el-tooltip>
          </div>
        </el-collapse-transition>
      </div>
      <div class="image-main">
        <el-tooltip
          class="item"
          effect="dark"
          :content="imgList[4].title"
          placement="top"
        >
          <img
            @click="handleOrder(4)"
            class="footer-image"
            :src="imgList[4].url"
            mode=""
          />
        </el-tooltip>
      </div>
      <div class="image-main">
        <el-tooltip
          class="item"
          effect="dark"
          :content="imgList[5].title"
          placement="top"
        >
          <img
            @click="handleOrder(5)"
            class="footer-image"
            :src="imgList[5].url"
            mode=""
          />
        </el-tooltip>
      </div>
      <div class="image-main">
        <el-tooltip
          popper-class="follow-bgi"
          placement="top"
          v-model="followTool"
          transition="el-fade-in-linear"
          manual
        >
          <div slot="content" class="follow-main">
            <div class="follow-list">
              <div class="follow-table">
                <div class="follow-text">asdfasdf阿斯蒂芬啊士大夫方法</div>
                <div class="close-follow">
                  <i class="el-icon-close"></i>
                </div>
              </div>
            </div>
            <div class="add-follow">
              <i class="el-icon-plus"></i>
            </div>
          </div>
          <el-tooltip
            class="item"
            effect="dark"
            :content="imgList[6].title"
            placement="top"
          >
            <img
              @click="handleOrder(6)"
              class="footer-image"
              :src="imgList[6].url"
              mode=""
            />
          </el-tooltip>
        </el-tooltip>
      </div>
      <div class="image-main">
        <el-tooltip
          class="item"
          effect="dark"
          :content="imgList[7].title"
          placement="top"
        >
          <img
            @click="handleOrder(7)"
            class="footer-image"
            :src="imgList[7].url"
            mode=""
          />
        </el-tooltip>
      </div>
      <div class="image-main">
        <el-tooltip
          class="item"
          effect="dark"
          :content="imgList[8].title"
          placement="top"
        >
          <img
            @click="handleOrder(8)"
            class="footer-image"
            :src="imgList[8].url"
            mode=""
          />
        </el-tooltip>
        <el-collapse-transition>
          <div class="show-speed" v-if="imgList[8].state === 1">
            <el-slider v-model="imgList[8].data.speed"></el-slider>
          </div>
        </el-collapse-transition>
      </div>
      <div class="image-main">
        <el-tooltip
          class="item"
          effect="dark"
          :content="imgList[9].title"
          placement="top"
        >
          <img
            @click="handleOrder(9)"
            class="footer-image"
            :src="imgList[9].url"
            mode=""
          />
        </el-tooltip>
        <el-collapse-transition>
          <div class="show-weather" v-if="imgList[9].state === 1">
            <el-form class="set-form" :model="setForm" label-width="80px">
              <el-form-item :label="$t('webClient.weather[0].label')">
                <el-select
                  size="mini"
                  v-model="setForm.weather"
                  :placeholder="$t('webClient.weather[0].value')"
                >
                  <el-option label="区域一" value="shanghai"></el-option>
                  <el-option label="区域二" value="beijing"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item :label="$t('webClient.weather[1].label')">
                <div
                  class="show-speed weahter-speed"
                  v-if="imgList[9].state === 1"
                >
                  <el-slider v-model="imgList[9].data.speed"></el-slider>
                </div>
              </el-form-item>
            </el-form>
          </div>
        </el-collapse-transition>
      </div>
      <div class="cut-apart"></div>
      <div class="image-main">
        <el-tooltip
          class="item"
          effect="dark"
          :content="imgList[10].title"
          placement="top"
        >
          <img
            @click="handleOrder(10)"
            class="footer-image"
            :src="imgList[10].url"
            mode=""
          />
        </el-tooltip>
      </div>
      <div class="image-main">
        <el-tooltip
          class="item"
          effect="dark"
          :content="imgList[11].title"
          placement="top"
        >
          <img
            @click="handleOrder(11)"
            class="footer-image"
            :src="imgList[11].url"
            mode=""
          />
        </el-tooltip>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      cuttingTips: [],
      imgList: [
        {
          state: 1,
          url: require("@/assets/images/todo/check/visual_angle.png"),
          name: "visual_angle.png",
          title: "视角",
        },
        {
          state: 0,
          url: require("@/assets/images/todo/unchecked/speed.png"),
          name: "speed.png",
          data: {
            speed: 50,
          },
          title: "移动速度",
        },
        {
          state: 0,
          url: require("@/assets/images/todo/unchecked/cutting.png"),
          name: "cutting.png",
          title: "剪裁盒",
        },
        {
          state: 0,
          url: require("@/assets/images/todo/unchecked/meter.png"),
          name: "meter.png",
          title: "测量",
        },
        {
          state: 0,
          url: require("@/assets/images/todo/unchecked/label.png"),
          name: "label.png",
          title: "标签",
        },
        {
          state: 0,
          url: require("@/assets/images/todo/unchecked/map.png"),
          name: "map.png",
          title: "小地图",
        },
        {
          state: 0,
          url: require("@/assets/images/todo/unchecked/follow.png"),
          name: "follow.png",
          title: "关注视角",
        },
        {
          state: 0,
          url: require("@/assets/images/todo/unchecked/animation.png"),
          name: "animation.png",
          title: "模型动画",
        },
        {
          state: 0,
          url: require("@/assets/images/todo/unchecked/resolve.png"),
          name: "resolve.png",
          data: {
            speed: 50,
          },
          title: "分解模型",
        },
        {
          state: 0,
          url: require("@/assets/images/todo/unchecked/weather.png"),
          name: "weather.png",
          data: {
            speed: 50,
          },
          title: "渲染环境",
        },
        {
          state: 0,
          url: require("@/assets/images/todo/unchecked/tree.png"),
          name: "tree.png",
          title: "浏览器",
        },
        {
          state: 0,
          url: require("@/assets/images/todo/unchecked/attribute.png"),
          name: "attribute.png",
          title: "属性",
        },
      ],
      oldState: 0,
      angleTool: false,
      followTool: false,
      setForm: {
        unit: null,
        weather: null,
      },
    };
  },
  created () {
	  this.$i18n.locale = this.$route.query.locale
	  if (this.$i18n.locale) {
		  this.cuttingTips = this.$t('webClient.tooltipList.subtool')
		  this.$t('webClient.tooltipList.tool').forEach((item, index) => {			  
			  this.imgList[index].title = item
		  });
	  }
  },
  mounted() {
    window.addEventListener("click", this.clickOther);
  },
  beforeDestroy() {
    // 实例销毁之前对点击事件进行解绑
    window.removeEventListener("click", this.clickOther);
  },
  methods: {
    clickOther() {
      this.angleTool = false;
      this.followTool = false;
    },
    editTool(e) {
      let oldUrl = require(`@/assets/images/todo/unchecked/${this.imgList[e].name}`);
      this.imgList[e].url = oldUrl;
      this.imgList[e].state = 0;
    },
    resetpPrson() {
      /**
       * @Author: zk
       * @Date: 2021-03-12 11:39:50
       * @description: 重置为第三人称
       */
      this.imgList[0].state = 1;
      let oldUrl = require(`@/assets/images/todo/check/${this.imgList[0].name}`);
      this.imgList[0].url = oldUrl;
		//   this.imgList[0].title = this.$t('webClient.tooltipList.person[1]')      
    },
    showAngle() {
      this.angleTool = true;
    },
    handleOrder(e) {
      // if(e === 0 || e === 1 || e === 2){
      if (e === 0) {
		//   let realPerson = this.imgList[0].state === 0 ? 1 : 0
		//   this.imgList[0].title = this.$t('webClient.tooltipList.person['+ realPerson +']')
      }
      // 重置状态
      if (e !== this.oldState && e !== 10 && e !== 11) {
        let oldUrl = require(`@/assets/images/todo/unchecked/${
          this.imgList[this.oldState].name
        }`);
        this.imgList[this.oldState].url = oldUrl;
        this.imgList[this.oldState].state = 0;
        this.oldState = e;
      }
      // 选中状态
      let realImg = null;
      if (this.imgList[e].state === 0) {
        realImg = require(`@/assets/images/todo/check/${this.imgList[e].name}`);
      } else {
        realImg = require(`@/assets/images/todo/unchecked/${this.imgList[e].name}`);
      }
      if (e === 6) {
        event.stopPropagation();
        this.followTool = this.imgList[e].state === 0 ? true : false;
      }
      this.imgList[e].url = realImg;
      this.imgList[e].state = this.imgList[e].state === 0 ? 1 : 0;
      // }
      this.$emit("listenTodo", {
        state: this.imgList[e].state,
        type: e,
      });
    },
  },
};
</script>

<style lang="less" scoped>
.todo-footer {
  position: absolute;
  bottom: 26px;
  width: 100%;
  min-width: 960px;
  // overflow-x: auto;
  left: 0;
  display: flex;
  justify-content: center;

  .todo-main {
    width: 960px;
    padding: 10px;
    background: rgba(0, 0, 0, 0.6);
    display: flex;

    // justify-content: space-around;
    .cut-apart {
      width: 2px;
      height: 100%;
      background-color: #ffffff;
    }

    .image-main {
      flex: 1;
      text-align: center;
      width: auto;
      position: relative;
    }

    .show-speed {
      position: absolute;
      top: -44px;
      width: 140%;
      left: -20%;

      /deep/ .el-slider__runway {
        background-color: rgba(0, 0, 0, 0.3);
        border: 1px solid #fff;
        border-radius: 10px;

        /deep/ .el-slider__bar {
          background-color: rgba(255, 255, 255, 0.3);
        }
      }

      /deep/ .el-slider__button-wrapper {
        /deep/ .el-slider__button {
          width: 10px;
          height: 10px;
          border: 1px solid rgba(255, 255, 255, 0.1);
        }
      }
    }

    .weahter-speed {
      position: static;
      width: 100%;

      /deep/ .el-slider__runway {
        margin: 32px 0 10px 0;
      }
    }

    .show-cutting {
      position: absolute;
      width: 50%;
      left: 25%;
      border-radius: 10px 10px 0 0;
      top: -147px;
      padding-bottom: 5px;
      background-color: rgba(0, 0, 0, 0.6);

      .cutting-img {
        margin-top: 10px;
        width: 20px;
        height: 20px;
      }
    }

    .show-weather {
      position: absolute;
      width: 200%;
      left: -60%;
      padding: 10%;
      border-radius: 10px 10px 0 0;
      top: -139px;
      background-color: rgba(0, 0, 0, 0.6);
    }

    .footer-image {
      width: 30px;
      height: 30px;
      cursor: pointer;
    }
  }
}

.set-bgi {
  background-color: rgba(0, 0, 0, 0.6);
}

.follow-bgi {
  .follow-main {
    .follow-list {
      max-height: 100px;
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
        background: #09abf7;
      }

      &::-webkit-scrollbar-track {
        /*滚动条里面轨道*/
        border-radius: 10px;
        background: rgba(255, 255, 255, 0.295);
      }

      .follow-table {
        width: 80px;
        height: 26px;
        background: rgba(0, 0, 0, 0.3);
        cursor: pointer;
        border-radius: 5px;
        padding: 0 10px;
        display: flex;
        justify-content: center;
        align-items: center;

        .follow-text {
          // width: ;
          width: auto;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .close-follow {
          margin-left: auto;
        }

        margin-bottom: 10px;
      }
    }

    .add-follow {
      width: 100px;
      height: 26px;
      display: flex;
      justify-content: center;
      align-items: center;
      background: rgba(0, 0, 0, 0.3);
      border-radius: 5px;
      cursor: pointer;
    }
  }
}
</style>
<style lang="less">
.set-form {
  .el-form-item {
    margin-bottom: 0;
  }

  .el-form-item__content {
    margin-left: 0 !important;
  }

  .el-form-item__label {
    text-align: left;
    color: #ffffff;
    line-height: 26px;
  }

  .el-input,
  .el-select {
    .el-input__inner {
      background: rgba(255, 255, 255, 0.2);
      border: 1px solid rgba(255, 255, 255, 0.25);
      color: #ffffff;
    }
  }
}
</style>
