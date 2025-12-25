<template>
  <div class="drawing" v-if="levels.tab2Index === 1">
    <div class="drawingLevel1" v-if="levels.level === 1">
      <div class="comTitle">导入图纸</div>
      <div class="drawingCon" @click="toLevel2()">
        <div class="drawingImg"><svg-icon icon-class="drawing" /></div>
        <div class="drawingName">图纸</div>
      </div>
    </div>
    <!-- <div class="drawingLevel2" v-if="levels.level === 2 && levels.hideContent">
      <div class="drawingLevel2Item" v-for="(item, index) in drawingList" :key="index" @click="onDrawing(item)">
        <SingleUpload v-if="item.id === 1" ref="SingleUpload" class="drawingLevel2Img" :accept="uploadAccept"
          url="/buildSystem/blueprintImport" :params="{ taskId: data.taskId, fileUpload: null }">
          <svg-icon slot="icon" :icon-class="item.svgUrl" />
        </SingleUpload>
        <div v-else class="drawingLevel2Img" :class="{ activeDraw: item.check }">
          <svg-icon :icon-class="item.svgUrl" />
        </div>
        <div class="drawingName">{{ item.name }}</div>
      </div>
    </div> -->
    <div class="drawingLevel2" v-if="levels.level === 2 && levels.hideContent && cadLevel == 1">
      <div v-for="(item, index) in drawingList" :key="index" @click="onDrawing(item)">
        <!-- <SingleUpload v-if="item.id === 1" ref="SingleUpload" :accept="uploadAccept" url="/buildSystem/blueprintImport"
          :params="{ taskId: data.taskId, fileUpload: null }">
          <el-button slot="button" type="primary" size="small">上传图纸</el-button>
        </SingleUpload> -->
        <SingleUpload v-if="item.id === 1" ref="SingleUpload" :accept="uploadAccept" url="/cadManage/uploadCadFile"
          :params="{ taskId: data.taskId, fileUpload: null }" @success="getList">
          <el-button slot="button" type="primary" size="small">上传图纸</el-button>
        </SingleUpload>
        <el-button v-else type="primary" size="small">导入在线图纸</el-button>
      </div>
    </div>

    <!-- 导入在线图纸 -->
    <ImportOnlineDrawings ref="ImportOnlineDrawingsRef" :data="{ ...data }" @success="getList" />

    <div class="content" v-if="levels.level === 2 && levels.groupName == '图纸'">
      <div class="contentItem" v-for="(item, index) in (cadLevel == 1 ? cadList : cadList2)" :key="index"
        @click="openCadList(item)">
        <div class="img-container">
          <!-- 操作栏 -->
          <div class="subOperate" v-if="cadLevel == 1">
            <el-button type="primary" icon="el-icon-delete" size="mini" @click.stop="deleteRow(item)"></el-button>
          </div>
          <!-- 图纸 -->
          <el-image class="img" :src="item.thumbnail" lazy v-if="item.status == 4">
            <div slot="placeholder" class="image-slot">
              <img src="@/assets/default/listCAD.png" />
            </div>
            <div slot="error" class="image-slot">
              <img src="@/assets/default/listCAD.png" />
            </div>
          </el-image>
          <div v-else-if="item.status == 5" class="loading-mask">
            <div>解析失败</div>
          </div>
          <div v-else class="loading-mask">
            <i class="el-icon-loading loading-icon"></i>
          </div>
        </div>
        <div :title="cadLevel == 1 ? item.fileName : `${item.fileName}_${index + 1}`">{{ cadLevel == 1 ? item.fileName
          :
          `${item.fileName}_${index + 1}` }}
        </div>
      </div>
      <!-- <el-empty :image="require('@/assets/noData.png')" :image-size="100"
        v-if="levels.level === 2 ? !contentLevel2List.length : !contentList.length"></el-empty> -->
    </div>
  </div>
</template>

<script>
import { doAction } from "@/api/userCenter/index";
import SingleUpload from '@/components/Upload/drawingUpload.vue';
import ImportOnlineDrawings from './importOnlineDrawings.vue';
import { selectCadFile, blueprintImportOurbim, deleteCadFile } from "@/api/userCenter/resourcePool.js";

export default {
  components: { SingleUpload, ImportOnlineDrawings },
  props: {
    // 层级的数据
    levels: {
      type: Object,
      default: () => { }
    },
    // 其他参数
    data: {
      type: Object,
      default: () => { }
    }
  },
  data() {
    return {
      cadList: [],
      cadList2: [],
      cadLevel: 1,
      uploadAccept: '.dwg,.dxf,.pdf,.png',//'image/png'
      // 图纸
      drawingList: [
        {
          id: 1,
          name: '上传图纸',
          svgUrl: 'drawingAdd',
          check: false
        },
        // {
        //   id: 2,
        //   name: '调整图纸比例尺',
        //   svgUrl: 'drawingProportion',
        //   check: false
        // },
        {
          id: 3,
          name: '导入在线图纸',
          svgUrl: 'drawingAdd',
          check: false
        }
      ],
      timer: null,
    };
  },
  watch: {
    cadLevel: {
      handler(newVal, oldVal) {
        this.checkTimer(); // 直接调用统一检查方法
      }
    }
  },
  computed: {},
  created() { },
  mounted() {
  },
  beforeDestroy() {
    this.destroyTimer()
  },
  methods: {
    destroyTimer() {
      if (this.timer) {
        clearInterval(this.timer)
        this.timer = null
      }
    },
    checkTimer() {
      this.destroyTimer(); // 先清除旧定时器
      // 当cadLevel为1且存在未完成解析的文件时，启动定时器
      if (this.cadLevel == 1 && this.cadList.some(item => item.status != 4)) {
        this.timer = setInterval(() => {
          this.getList();
        }, 1000 * 5);
      }
    },
    setCadLevel(v) {
      this.cadLevel = v
    },
    getList() {
      selectCadFile({ taskId: this.data.taskId }).then(res => {
        this.cadList = res.data;
        this.checkTimer();
      })
    },
    openCadList(item) {
      if (item.status != 4) return
      if (item.fileImgs) {
        this.setCadLevel(2);
        this.$emit('setCadGroupName', item.fileName)
        this.cadList2 = item.fileImgs.split(',').map(a => {
          return {
            fileName: item.fileName,
            thumbnail: a,
            status: 4,
          }
        })
      } else {
        // console.log(item)
        blueprintImportOurbim({
          taskId: this.data.taskId,
          httpPath: item.thumbnail
        }).then(res => {
          this.$message.success(res.message)
        })
      }
    },
    // 删除图纸
    deleteRow(item) {
      const _this = this;
      this.$confirm(`此操作将删除该图纸, 是否继续?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        deleteCadFile({
          taskId: _this.data.taskId,
          id: item.id
        }).then(res => {
          _this.$message.success('删除成功！');
          _this.getList();
        })
      })
        .catch(() => { });
    },
    // 点击到第二层级
    toLevel2() {
      this.$emit('toDrawLevel', { level: 2, name: '图纸' })
      this.setCadLevel(1);
      this.getList()
    },
    // 点击相应的操作
    onDrawing(item) {
      switch (item.id) {
        // 上传图纸
        case 1:

          break;
        // 调整图纸比例尺
        case 2:
          if (!item.check) {
            item.check = true
            this.updateEdit({ action: 'distance' }, '调整图纸比例尺')
          } else {
            item.check = false
            this.updateEdit({ action: 'endMeasure' })
          }
          break;
        // 导入在线图纸
        case 3:
          this.$refs.ImportOnlineDrawingsRef.show();
          break;
        default:
          break;
      }
    },
    // action事件
    updateEdit(obj, type) {
      let params = {
        taskId: this.data.taskId,
        ...obj
      }
      doAction(params).then((res) => {
        if (type === '调整图纸比例尺') {
          this.$message.warning('请先在临摹图上拾取已知实际距离的两点')
          return
        }
        this.$message.success(res.message)
      })
    },
  },
};
</script>
<style lang="less" scoped>
.drawing {
  margin-bottom: 24px;
  margin-top: 10px;

  .drawingImg {
    height: 85px;
    background: linear-gradient(180deg, #74E2FF 0%, #00AAF0 100%);
    border-radius: 4px;
    line-height: 85px;
    text-align: center;

    svg {
      color: #ffffff;
      font-size: 46px;
      vertical-align: middle;
    }
  }

  .drawingName {
    font-size: 14px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #FFFFFF;
    text-align: center;
    padding: 8px 0;
  }

  .drawingCon {
    cursor: pointer;
    width: 85px;

    &:hover .drawingImg {
      background: #00A6DF;
    }
  }

  .drawingLevel1 {
    border-bottom: 1px solid #464646;
    padding-bottom: 7px;
  }

  .drawingLevel2 {
    display: flex;
    flex-wrap: wrap;
    align-content: flex-start;
    gap: 20px;
    padding: 0 25px;

    .drawingLevel2Item {
      width: (90/2%);
      cursor: pointer;

      .drawingLevel2Img {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 104px;
        background: #28292E;
        border-radius: 4px;
        border: 1px solid #727272;

        svg {
          font-size: 26px;
        }

        /deep/ .el-upload {
          background: none;
          border: none;
        }
      }

      .activeDraw {
        border: 1px solid #00B3F3;
        box-shadow: 0px 0px 5px 0px rgba(255, 255, 255, 0.5);
      }

      &:hover .drawingLevel2Img {
        .activeDraw();
      }
    }
  }
}

.content {
  display: flex;
  flex-wrap: wrap;
  align-content: flex-start;
  gap: 10px;
  margin-top: 20px;

  .contentItem {
    width: (92/3%);
    font-size: 12px;
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
      height: 85px;
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

.content {
  .contentItem {
    .img-container {
      position: relative;

      /* 关键定位属性 */
      .img {
        /* 保持原有img样式 */
      }

      .loading-mask {
        top: 0;
        left: 0;
        width: 100%;
        height: 85px;
        margin-bottom: 8px;
        /* 与图片高度一致 */
        background: rgba(37, 39, 40, 0.7);
        border-radius: 4px;
        display: flex;
        justify-content: center;
        align-items: center;

        .loading-icon {
          font-size: 24px;
          color: #fff;
          animation: rotate 1.5s linear infinite;
          /* 旋转动画 */
        }
      }

      .subOperate {
        position: absolute;
        right: 4px;
        top: 4px;
        z-index: 1;
        display: none;

        button {
          padding: 0;
          font-size: 14px;
          background: rgba(51, 51, 51, 0.8);
          border: 0;
          padding: 2px;

          &:not(:first-child) {
            margin-left: 4px;
          }
        }
      }

      &:hover .subOperate {
        display: block;
      }
    }
  }
}

/* 定义旋转动画 */
@keyframes rotate {
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
}
</style>
