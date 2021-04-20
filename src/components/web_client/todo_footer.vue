<!--
 * @Author: zk
 * @Date: 2021-03-04 14:00:23
 * @LastEditors: zk
 * @LastEditTime: 2021-04-20 14:18:58
 * @description: 
-->
<template>
  <div>
    <div class="handle-mask" @click.stop="" v-if="isMask"></div>
    <div class="todo-footer">
      <div class="todo-main">
        <!-- 视角 -->
        <div class="image-main">
          <el-tooltip
            placement="top"
            v-model="personTool"
            transition="el-fade-in-linear"
            manual
          >
            <div slot="content">
              <div
                class="person-list"
                v-for="(item, index) in personList"
                :key="index"
              >
                <div
                  @click="changePerson(item.value)"
                  :class="activePerson === item.value ? 'active-person' : ''"
                  v-text="item.name"
                ></div>
              </div>
            </div>
            <el-tooltip
              class="item"
              effect="dark"
              :enterable="false"
              :content="imgList[0].title"
              placement="top"
            >
              <img
                class="footer-image"
                :src="imgList[0].url"
                @click.stop="handleOrder(0)"
                mode=""
              />
            </el-tooltip>
          </el-tooltip>
        </div>
        <!-- 移动速度 -->
        <div class="image-main">
          <el-tooltip
            class="item"
            :enterable="false"
            effect="dark"
            :content="imgList[1].title"
            placement="top"
          >
            <img
              @click.stop="handleOrder(1)"
              class="footer-image"
              :src="imgList[1].url"
              mode=""
            />
          </el-tooltip>
          <el-collapse-transition>
            <div class="show-speed" v-if="imgList[1].state === 1">
              <el-slider
                v-model="imgList[1].data.speed"
                :min="1"
                :max="8"
                @mousedown.native="openMask"
                @click.native.stop=""
                @change="changeSpeed"
              ></el-slider>
            </div>
          </el-collapse-transition>
        </div>
        <div class="cut-apart"></div>
        <!-- 剖切 -->
        <div class="image-main">
          <el-tooltip
            class="item"
            effect="dark"
            :enterable="false"
            :content="imgList[2].title"
            placement="top"
          >
            <img
              @click.stop="handleOrder(2)"
              class="footer-image"
              :src="imgList[2].url"
              mode=""
            />
          </el-tooltip>
          <el-collapse-transition>
            <div class="show-slice" v-if="imgList[2].state === 1">
              <el-tooltip
                v-for="(item, index) in sliceList"
                :key="index"
                class="item"
                :enterable="false"
                effect="dark"
                :content="item.content"
                placement="left"
              >
                <div>
                  <img
                    class="slice-img"
                    @click.stop="changeSlice(item, index)"
                    :src="activeSlice === index ? item.activeImg : item.img"
                    mode=""
                  />
                </div>
              </el-tooltip>
            </div>
          </el-collapse-transition>
        </div>
        <!-- 测量 -->
        <div class="image-main">
          <el-tooltip
            class="item"
            effect="dark"
            :enterable="false"
            :content="imgList[3].title"
            placement="top"
          >
            <img
              @click.stop="handleOrder(3)"
              class="footer-image"
              :src="imgList[3].url"
              mode=""
            />
          </el-tooltip>
          <el-collapse-transition>
            <div class="show-cutting" v-if="imgList[3].state === 1">
              <el-tooltip
                v-for="(item, index) in cuttingList"
                :key="index"
                class="item"
                :enterable="false"
                effect="dark"
                :content="item.content"
                placement="left"
              >
                <img
                  class="cutting-img"
                  @click.stop="changeGauge(index)"
                  :src="item.img"
                  mode=""
                />
              </el-tooltip>
              <el-tooltip
                popper-class="tooltip-bgi"
                placement="right-end"
                v-model="angleTool"
                :enterable="false"
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
                        popper-class="popper-bgi"
                        @change="changeGauge(3)"
                        v-model="setForm.unit"
                        :placeholder="$t('webClient.setting[0].tips')"
                      >
                        <el-option
                          :label="item"
                          :value="index"
                          v-for="(item, index) in unitList"
                          :key="index"
                        ></el-option>
                      </el-select>
                    </el-form-item>
                    <el-form-item :label="$t('webClient.setting[1].label')">
                      <el-select
                        size="mini"
                        popper-class="popper-bgi"
                        @change="changeGauge(4)"
                        v-model="setForm.accuracy"
                        :placeholder="$t('webClient.setting[1].tips')"
                      >
                        <el-option
                          :label="item"
                          :value="index"
                          v-for="(item, index) in accuracyList"
                          :key="index"
                        ></el-option>
                      </el-select>
                    </el-form-item>
                  </el-form>
                </div>
                <el-tooltip
                  class="item"
                  effect="dark"
                  :enterable="false"
                  :content="cuttingTips[3]"
                  placement="left"
                >
                  <img
                    class="cutting-img"
                    :src="
                      angleTool
                        ? require('@/assets/images/todo/check/set.png')
                        : require('@/assets/images/todo/unchecked/set.png')
                    "
                    @click.stop="showAngle"
                    mode=""
                  />
                </el-tooltip>
              </el-tooltip>
            </div>
          </el-collapse-transition>
        </div>
        <!-- 标签 -->
        <div class="image-main">
          <el-tooltip
            class="item"
            effect="dark"
            :enterable="false"
            :content="imgList[4].title"
            placement="top"
          >
            <img
              @click.stop="handleOrder(4)"
              class="footer-image"
              :src="imgList[4].url"
              mode=""
            />
          </el-tooltip>
        </div>
        <!-- 小地图 -->
        <div class="image-main">
          <el-tooltip
            class="item"
            effect="dark"
            :enterable="false"
            :content="imgList[5].title"
            placement="top"
          >
            <img
              @click.stop="handleOrder(5)"
              class="footer-image"
              :src="imgList[5].url"
              mode=""
            />
          </el-tooltip>
        </div>
        <!-- 关注视点 -->
        <div class="image-main">
          <el-tooltip
            popper-class="follow-bgi"
            placement="top"
            :enterable="false"
            v-model="followTool"
            transition="el-fade-in-linear"
            manual
          >
            <div slot="content" class="follow-main">
              <div class="follow-list" v-if="pointList">
                <div
                  class="follow-table"
                  v-for="(item, index) in pointList"
                  :key="index"
                >
                  <div
                    class="follow-text"
                    v-text="item.name"
                    @click="JumpFollow(item)"
                  ></div>
                  <div class="close-follow">
                    <i class="el-icon-edit" @click="EditFollow(item)"></i>
                    <i class="el-icon-close" @click="DeleteFollow(item)"></i>
                  </div>
                </div>
              </div>
              <div class="add-follow" @click="InsertFollow">
                <i class="el-icon-plus"></i>
              </div>
            </div>
            <el-tooltip
              class="item"
              effect="dark"
              :enterable="false"
              :content="imgList[6].title"
              placement="top"
            >
              <img
                @click.stop="handleOrder(6)"
                class="footer-image"
                :src="imgList[6].url"
                mode=""
              />
            </el-tooltip>
          </el-tooltip>
        </div>
        <!-- 模型动画 -->
        <div class="image-main">
          <el-tooltip
            class="item"
            effect="dark"
            :enterable="false"
            :content="imgList[7].title"
            placement="top"
          >
            <img
              @click.stop="handleOrder(7)"
              class="footer-image"
              :src="imgList[7].url"
              mode=""
            />
          </el-tooltip>
        </div>
        <!-- 分解模型 -->
        <div class="image-main">
          <el-tooltip
            class="item"
            effect="dark"
            :enterable="false"
            :content="imgList[8].title"
            placement="top"
          >
            <img
              @click.stop="handleOrder(8)"
              class="footer-image"
              :src="imgList[8].url"
              mode=""
            />
          </el-tooltip>
          <el-collapse-transition>
            <div class="show-speed" v-if="imgList[8].state === 1">
              <el-slider
                v-model="imgList[8].data.value"
                :min="0"
                :max="10"
                :step="1"
                @mousedown.native="openMask"
                @click.native.stop=""
                @change="changeResolve"
              ></el-slider>
            </div>
          </el-collapse-transition>
        </div>
        <!-- 渲染环境 -->
        <div class="image-main">
          <el-tooltip
            class="item"
            effect="dark"
            :enterable="false"
            :content="imgList[9].title"
            placement="top"
          >
            <img
              @click.stop="handleOrder(9)"
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
                    popper-class="popper-bgi"
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
        <!-- 浏览器 -->
        <div class="image-main">
          <el-tooltip
            class="item"
            effect="dark"
            :enterable="false"
            :content="imgList[10].title"
            placement="top"
          >
            <img
              @click.stop="handleOrder(10)"
              class="footer-image"
              :src="imgList[10].url"
              mode=""
            />
          </el-tooltip>
        </div>
        <!-- 属性 -->
        <div class="image-main">
          <el-tooltip
            class="item"
            effect="dark"
            :enterable="false"
            :content="imgList[11].title"
            placement="top"
          >
            <img
              @click.stop="handleOrder(11)"
              class="footer-image"
              :src="imgList[11].url"
              mode=""
            />
          </el-tooltip>
        </div>
      </div>
      <!-- 编辑关注视点 -->
      <el-dialog
        :title="dialogPointData.title"
        :visible.sync="dialogEdit"
        @close="closeFollow"
        :close-on-click-modal="false"
        width="20%"
      >
        <el-form
          v-if="followInfo"
          :model="followInfo"
          :rules="rulesFollow"
          ref="ruleFollow"
        >
          <el-form-item
            :label="dialogPointData.label"
            label-width="60px"
            prop="name"
          >
            <el-input @click.native.stop v-model="followInfo.name"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button
            @click="dialogEdit = false"
            v-text="dialogPointData.cancel"
          ></el-button>
          <el-button
            type="primary"
            @click="UpdateFollow"
            v-text="dialogPointData.confirm"
          ></el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import MODELAPI from "@/api/model_api";

export default {
  props: {
    setProps: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      rulesFollow: {
        name: [
          {
            required: true,
            message: "请输入名称",
            trigger: "blur",
          },
        ],
      },
      sliceList: [
        {
          content: null,
          img: require("@/assets/images/todo/unchecked/slice/move.png"),
          activeImg: require("@/assets/images/todo/check/slice/move.png"),
        },
        {
          content: null,
          img: require("@/assets/images/todo/unchecked/slice/rotate.png"),
          activeImg: require("@/assets/images/todo/check/slice/rotate.png"),
        },
        {
          content: null,
          img: require("@/assets/images/todo/unchecked/slice/reverse.png"),
          activeImg: require("@/assets/images/todo/check/slice/reverse.png"),
        },
        {
          content: null,
          img: require("@/assets/images/todo/unchecked/slice/appoint.png"),
          activeImg: require("@/assets/images/todo/check/slice/appoint.png"),
        },
        {
          content: null,
          img: require("@/assets/images/todo/unchecked/slice/reset.png"),
          activeImg: require("@/assets/images/todo/check/slice/reset.png"),
        },
      ],
      cuttingList: [
        {
          content: null,
          img: require("@/assets/images/todo/unchecked/position.png"),
          activeImg: require("@/assets/images/todo/check/position.png"),
          name: "position",
        },
        {
          content: null,
          img: require("@/assets/images/todo/unchecked/gauge.png"),
          activeImg: require("@/assets/images/todo/check/gauge.png"),
          name: "gauge",
        },
        {
          content: null,
          img: require("@/assets/images/todo/unchecked/angle.png"),
          activeImg: require("@/assets/images/todo/check/angle.png"),
          name: "angle",
        },
      ],
      activeSlice: null,
      isMask: false,
      unitList: ["m", "cm", "mm", "ft", "in"],
      accuracyList: ["0", "0.1", "0.01"],
      getProps: null,
      followInfo: null,
      pointList: [],
      cuttingTips: [],
      personList: [
        {
          name: "第一人称",
          value: 0,
        },
        {
          name: "第三人称",
          value: 1,
        },
        {
          name: "跟随人物",
          value: 2,
        },
      ],
      imgList: [
        {
          state: 0,
          url: require("@/assets/images/todo/unchecked/visual_angle.png"),
          name: "visual_angle.png",
          title: "视角",
        },
        {
          state: 0,
          url: require("@/assets/images/todo/unchecked/speed.png"),
          name: "speed.png",
          data: {
            speed: 4,
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
            value: 0,
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
      activePerson: 1,
      oldState: 0,
      dialogEdit: false,
      angleTool: false,
      followTool: false,
      personTool: false,
      setForm: {
        unit: 0,
        accuracy: 2,
        weather: null,
      },
      deleteData: {
        title: "提示",
        content: "此操作将永久删除该记录, 是否继续?",
        confirm: "确定",
        cancel: "取消",
        successMessage: "删除成功",
        errorMessage: "删除失败",
      },
      dialogPointData: {
        title: "提示",
        label: "名称",
        confirm: "确认",
        cancel: "取消",
        successMessage: "修改成功！",
        saveMessage: "添加成功！",
      },
      actionData: {
        successMessage: "指令下发成功",
        cancelMessage: "指令下发失败",
        addLoadMessage: "正在执行添加视角，请稍候……",
      },
    };
  },
  watch: {
    setProps: {
      handler() {
        if (this.setProps.taskId) {
          this.getProps = this.setProps;
          this.ListPoint();
        }
      },
      // 代表在wacth里声明了firstName这个方法之后立即先去执行handler方法
      deep: true,
    },
  },
  created() {
    if (this.setProps.taskId) {
      this.getProps = this.setProps;
      this.ListPoint();
    }
    if (this.$route.query.locale) {
      this.$i18n.locale = this.$route.query.locale;
    } else {
      this.$i18n.locale = "zh";
    }
    if (this.$i18n.locale) {
      this.actionData.successMessage = this.$t("webClient.loadBox.message[2]");
      this.actionData.cancelMessage = this.$t("webClient.loadBox.message[3]");
      this.actionData.addLoadMessage = this.$t("webClient.loadBox.message[5]");
      this.deleteData = this.$t("webClient.deleteList[0]");
      this.dialogPointData = this.$t("webClient.dialogList[0]");
      this.cuttingTips = this.$t("webClient.tooltipList.subtool");
      if (this.$t("webClient.tooltipList.sliceTool")) {
        this.$t("webClient.tooltipList.sliceTool").forEach((item, index) => {
          this.sliceList[index].content = item;
        });
      }
      if (this.$t("webClient.tooltipList.subtool")) {
        for (let index = 0; index < 3; index++) {
          this.cuttingList[index].content = this.$t(
            "webClient.tooltipList.subtool"
          )[index];
        }
      }
      this.$t("webClient.tooltipList.toolPerson").forEach((item, index) => {
        this.personList[index].name = item;
      });
      this.$t("webClient.tooltipList.tool").forEach((item, index) => {
        this.imgList[index].title = item;
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
    closeFollow() {
      /**
       * @Author: zk
       * @Date: 2021-04-08 15:40:38
       * @description: 关闭连接
       */
      this.$refs["ruleFollow"].resetFields();
      this.$emit("listenFollow", false);
    },
    openMask() {
      /**
       * @Author: zk
       * @Date: 2021-03-25 11:38:29
       * @description: 打开遮罩
       */
      this.isMask = true;
    },
    changeSlice(e, indexes) {
      /**
       * @Author: zk
       * @Date: 2021-04-08 17:55:39
       * @description: 剖切 0 移动 1 旋转 2 反选 3 指定 4 重置
       */
      if (indexes === 2) {
        indexes === this.activeSlice
          ? (this.activeSlice = null)
          : (this.activeSlice = indexes);
      } else {
        this.activeSlice = indexes;
      }
      this.$emit("listenTodo", {
        state: this.imgList[2].state,
        type: 2,
        data: indexes,
      });
    },
    changeGauge(e) {
      /**
       * @Author: zk
       * @Date: 2021-03-24 15:43:44
       * @description: 测量 0 坐标 1 距离 2 角度 3 单位 4 精度
       */
      let realSet = null;
      if (e === 0 || e === 1 || e === 2) {
        this.cuttingList[e].img = require("@/assets/images/todo/check/" +
          this.cuttingList[e].name +
          ".png");
      }
      if (e === 3) {
        realSet = this.unitList[this.setForm.unit]
          ? this.unitList[this.setForm.unit]
          : "m";
      }
      if (e === 4) {
        realSet = this.accuracyList[this.setForm.accuracy]
          ? this.accuracyList[this.setForm.accuracy]
          : "0.01";
      }
      this.$emit("listenTodo", {
        state: this.imgList[3].state,
        type: 3,
        data: e,
        set: realSet,
      });
    },
    changeSpeed(e) {
      /**
       * @Author: zk
       * @Date: 2021-03-24 09:28:51
       * @description: 设置移动速度
       */
      this.isMask = false;
      this.$emit("listenTodo", {
        state: this.imgList[1].state,
        type: 1,
        data: e,
      });
    },
    changeResolve(e) {
      /**
       * @Author: zk
       * @Date: 2021-04-14 11:06:54
       * @description: 设置分解模型
       */
      this.isMask = false;
      this.$emit("listenTodo", {
        state: this.imgList[8].state,
        type: 8,
        data: e,
      });
    },
    changePerson(e) {
      /**
       * @Author: zk
       * @Date: 2021-03-16 18:03:10
       * @description: 切换人称
       */
      if (e !== 2) {
        this.activePerson = e;
        this.$emit("listenPerson", e);
      }
      this.imgList[0].state = 0;
      this.imgList[0].url = require(`@/assets/images/todo/unchecked/${this.imgList[0].name}`);
      this.personTool = false;
    },
    clickOther() {
      /**
       * @Author: zk
       * @Date: 2021-03-17 09:51:33
       * @description: 关闭tool
       */
      if (this.isMask) {
        return;
      }
      this.angleTool = false;
      this.followTool = false;
      this.personTool = false;
      let oldUrl = require(`@/assets/images/todo/unchecked/${
        this.imgList[this.oldState].name
      }`);
      this.imgList[this.oldState].url = oldUrl;
      this.imgList[this.oldState].state = 0;
      // 分解模型
      if (this.oldState === 8) {
        this.imgList[8].data.value = 0;
        this.$emit("listenTodo", {
          state: this.imgList[8].state,
          type: 8,
          data: 0,
        });
      }
      // 剖切
      if (this.oldState === 2) {
        if (this.imgList[this.oldState].state === 0) {
          this.activeSlice = null;
          this.$emit("listenTodo", {
            state: 0,
            type: this.oldState,
          });
          this.oldState = 0;
        }
      }
      // 测量
      if (this.oldState === 3) {
        this.cuttingList.forEach((item, e) => {
          this.cuttingList[e].img = require("@/assets/images/todo/unchecked/" +
            this.cuttingList[e].name +
            ".png");
        });
        this.$emit("listenTodo", {
          state: this.imgList[this.oldState].state,
          type: this.oldState,
        });
        this.oldState = 0;
      }
    },
    editTool(e) {
      let oldUrl = require(`@/assets/images/todo/unchecked/${this.imgList[e].name}`);
      this.imgList[e].url = oldUrl;
      this.imgList[e].state = 0;
    },
    resetPerson(e) {
      /**
       * @Author: zk
       * @Date: 2021-03-12 11:39:50
       * @description: 重置为第三人称
       */
      this.activePerson = e;
    },
    showAngle() {
      /**
       * @Author: zk
       * @Date: 2021-03-24 16:05:57
       * @description: 设置单位
       */
      this.angleTool = this.angleTool ? false : true;
    },
    InsertFollow() {
      /**
       * @Author: zk
       * @Date: 2021-03-17 10:46:58
       * @description: 添加视点
       */
      let params = {
        taskid: this.getProps.taskId,
        id: 9,
      };
      this.UpdateOrder(params).then(() => {
        this.followTool = false;
        this.ListPoint();
        this.dialogEdit = false;
        let oldUrl = require(`@/assets/images/todo/unchecked/${this.imgList[6].name}`);
        this.imgList[6].url = oldUrl;
        this.imgList[6].state = 0;
      });
    },
    EditFollow(e) {
      /**
       * @Author: zk
       * @Date: 2021-03-17 10:43:44
       * @description: 编辑视点
       */
      this.followInfo = JSON.parse(JSON.stringify(e));
      this.dialogEdit = true;
      this.$emit("listenFollow", true);
    },
    UpdateFollow() {
      /**
       * @Author: zk
       * @Date: 2021-03-17 11:36:27
       * @description: 更新视点
       */
      this.$refs["ruleFollow"].validate((valid) => {
        if (valid) {
          MODELAPI.UPDATEFOLLOWPOINT(this.followInfo)
            .then((res) => {
              if (res.data.code === 0) {
                this.ListPoint();
                this.$message({
                  type: "success",
                  message: this.dialogPointData.successMessage,
                });
              }
            })
            .catch((err) => {});
          this.dialogEdit = false;
          let oldUrl = require(`@/assets/images/todo/unchecked/${this.imgList[6].name}`);
          this.imgList[6].url = oldUrl;
          this.imgList[6].state = 0;
        } else {
          return false;
        }
      });
    },
    DeleteFollow(e) {
      /**
       * @Author: zk
       * @Date: 2021-03-17 10:35:16
       * @description: 删除视点
       */
      this.followInfo = e;
      this.$confirm(this.deleteData.content, this.deleteData.title, {
        confirmButtonText: this.deleteData.confirm,
        cancelButtonText: this.deleteData.cancel,
        type: "warning",
      })
        .then(() => {
          let params = {
            tid: this.followInfo.tid,
          };
          MODELAPI.DElETEFOLLOWPOINT(params)
            .then((res) => {
              if (res.data.code === 0) {
                this.ListPoint();
                this.$message({
                  type: "success",
                  message: this.deleteData.successMessage,
                });
              }
            })
            .catch((err) => {});
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: this.deleteData.cancelMessage,
          });
        });
      this.dialogEdit = false;
      let oldUrl = require(`@/assets/images/todo/unchecked/${this.imgList[6].name}`);
      this.imgList[6].url = oldUrl;
      this.imgList[6].state = 0;
    },
    JumpFollow(e) {
      /**
       * @Author: zk
       * @Date: 2021-03-17 10:50:04
       * @description: 跳转视点
       */
      this.followInfo = e;
      let params = {
        taskid: this.getProps.taskId,
        id: 10,
        camerashotId: e.tid,
      };
      if (this.followInfo.available === "0") {
        this.$message({
          type: "warning",
          message: this.actionData.addLoadMessage,
        });
        return;
      } else {
        this.UpdateOrder(params);
        if (e.viewMode) {
          this.activePerson = e.viewMode === "1" ? 0 : 1;
        }
        if (e.projectionMode) {
          // this.activePerson = e.viewMode === "1" ? 0 : 1
          this.$emit("listenMode", Number(e.projectionMode));
        }
      }
    },
    resetPointList(e) {
      /**
       * @Author: zk
       * @Date: 2021-03-23 15:49:31
       * @description: 补充关注视角列表
       */
      for (const key in this.pointList) {
        if (Object.hasOwnProperty.call(this.pointList, key)) {
          const item = this.pointList[key];
          if (item.tid === e.tid) {
            this.pointList[key] = e;
            return;
          }
        }
      }
    },
    ListPoint() {
      /**
       * @Author: zk
       * @Date: 2021-03-17 10:30:51
       * @description: 获取视点列表
       */
      let params = {
        taskid: this.getProps.taskId,
      };
      this.pointList = [];
      MODELAPI.LISTFOLLOWPOINT(params)
        .then((res) => {
          if (res.data.code === 0) {
            this.pointList = res.data.data;
          }
        })
        .catch((err) => {});
    },
    handleOrder(e) {
      // 功能未开放
      if (e === 4 || e === 5 || e === 7 || e === 9) {
        return;
      }
      // 剖切 分解模型 返回第三人称
      if (e === 2 || e === 8) {
        this.activePerson = 1
      }
      // 选中状态
      let realImg = null;
      if (this.imgList[e].state === 0) {
        realImg = require(`@/assets/images/todo/check/${this.imgList[e].name}`);
      } else {
        realImg = require(`@/assets/images/todo/unchecked/${this.imgList[e].name}`);
      }
      this.imgList[e].url = realImg;
      this.imgList[e].state = this.imgList[e].state === 0 ? 1 : 0;

      // 关闭刨切和测量
      if (this.oldState === 2 || this.oldState === 3) {
        this.activeSlice = null;
        this.cuttingList.forEach((item, e) => {
          this.cuttingList[e].img = require("@/assets/images/todo/unchecked/" +
            this.cuttingList[e].name +
            ".png");
          this.angleTool = false;
        });
        if (e === this.oldState) {
          this.$emit("listenTodo", {
            state: this.imgList[e].state,
            type: e,
          });
          return;
        } else {
          if (!(this.oldState === 3 && e === 2)) {
            if (this.imgList[this.oldState].state === 1) {
              this.$emit("listenTodo", {
                state: 0,
                type: this.oldState,
              });
            }
          }
        }
      }
      // 分解模型
      if (this.oldState === 8) {
        this.imgList[8].data.value = 0;
        if (this.imgList[this.oldState].state === 1 && e !== 2) {
          this.$emit("listenTodo", {
            state: 0,
            type: this.oldState,
            data: 0,
          });
        }
      }
      // 重置状态
      if (e !== this.oldState && e !== 10 && e !== 11) {
        this.angleTool = false;
        this.followTool = false;
        this.personTool = false;
        let oldUrl = require(`@/assets/images/todo/unchecked/${
          this.imgList[this.oldState].name
        }`);
        this.imgList[this.oldState].url = oldUrl;
        this.imgList[this.oldState].state = 0;
        this.oldState = e;
      }

      if (e === 0) {
        this.personTool = this.imgList[e].state === 1 ? true : false;
      }
      if (e === 6) {
        this.followTool = this.imgList[e].state === 1 ? true : false;
      }
      if (e !== 0) {
        this.$emit("listenTodo", {
          state: this.imgList[e].state,
          type: e,
        });
      }
    },
    async UpdateOrder(e) {
      await MODELAPI.UPDATEORDER(e)
        .then((res) => {
          if (res.data.code === 0) {
            this.$message({
              message: this.actionData.successMessage,
              type: "success",
            });
          } else {
            this.$message({
              message: this.actionData.cancelMessage,
              type: "error",
            });
          }
        })
        .catch(() => {});
    },
  },
};
</script>

<style lang="less" scoped>
.todo-footer {
  position: absolute;
  bottom: 26px;
  width: 100%;
  left: 0;
  display: flex;
  justify-content: center;

  .todo-main {
    width: 800px;
    padding: 10px;
    background: rgba(0, 0, 0, 0.6);
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
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
      top: -151px;
      padding-bottom: 5px;
      background-color: rgba(0, 0, 0, 0.6);

      .cutting-img {
        margin-top: 10px;
        width: 20px;
        height: 20px;
      }
    }
    // 剖切
    .show-slice {
      position: absolute;
      width: 60%;
      left: 20%;
      border-radius: 10px 10px 0 0;
      top: -195px;
      padding-bottom: 5px;
      background-color: rgba(0, 0, 0, 0.6);

      .slice-img {
        margin-top: 10px;
        // width: 20px;
        // height: 20px;
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
      height: 30px;
      cursor: pointer;
    }
  }
}

.set-bgi {
  background-color: rgba(0, 0, 0, 0.6);
}
.person-list {
  line-height: 200%;
  text-align: center;
  cursor: pointer;
}
.active-person {
  color: #ea640d;
}
.follow-bgi {
  .follow-main {
    .follow-list {
      max-height: 200px;
      overflow-y: auto;
      margin-bottom: 10px;

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

      .follow-table {
        width: 260px;
        height: 36px;
        background: rgba(0, 0, 0, 0.3);
        cursor: pointer;
        border-radius: 5px;
        padding: 0 10px;
        display: flex;
        justify-content: center;
        align-items: center;

        .follow-text {
          margin-right: 10px;
          width: auto;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .close-follow {
          flex-shrink: 0;
          width: 30px;
          display: flex;
          align-items: center;
          margin-left: auto;
          i {
            width: 50%;
          }
        }

        margin-bottom: 10px;
      }
    }

    .add-follow {
      width: 280px;
      height: 36px;
      display: flex;
      justify-content: center;
      align-items: center;
      background: rgba(0, 0, 0, 0.3);
      border-radius: 5px;
      cursor: pointer;
    }
  }
}
.handle-mask {
  width: 100vw;
  height: 100vh;
  position: fixed;
  top: 0;
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
    .is-focus {
      border-color: rgba(0, 0, 0, 0.6) !important;
    }
  }
}
.popper-bgi {
  background: rgba(0, 0, 0, 0.6);
  border: transparent;
  .el-select-dropdown__item {
    color: #ffffff !important;
  }
  .el-select-dropdown__item.hover,
  .el-select-dropdown__item:hover {
    background: rgba(0, 0, 0, 0.1) !important;
  }
  .selected {
    color: #409eff !important;
  }
  .popper__arrow {
    border-top-color: rgba(0, 0, 0, 0.6) !important;
    &::after {
      border-top-color: rgba(0, 0, 0, 0.6) !important;
    }
  }
}
</style>
