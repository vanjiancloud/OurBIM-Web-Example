<!-- 个性化几何属性 -->
<template>
  <div class="geometry-attr">
    <el-form label-width="98px">
      <div v-for="(item, index) in memberInfo" :key="index">
        <el-form-item size="small"
          v-if="item.key !== 'rootTypeInfo' &&
            (item.controlType === 'input' || (item.controlType === 'select' && item.parentId && item.list && item.list.length))">
          <template #label>
            <div
              v-if="item.controlType === 'input' || (item.controlType === 'select' && item.parentId && item.list && item.list.length)">
              {{ item.label || item.name }}</div>
          </template>
          <!-- input -->
          <template v-if="item.controlType === 'input'">
            <el-input v-model="item.value" @change="onInput" :disabled="item.disable">
              <template #suffix v-if="item.unit">
                <span v-text="item.unit"></span>
              </template>
            </el-input>
          </template>
          <!-- select -->
          <el-select v-else-if="item.controlType === 'select' && item.parentId && item.list && item.list.length"
            v-model="item.id" @change="(e) => onSelect(e, item)" :disabled="item.disable">
            <el-option v-for="opt in item.list" :label="opt.name" :value="opt.id" :key="opt.id" />
          </el-select>
        </el-form-item>
        <el-form-item class="coordinate-item"
          v-if="['pipe', 'conn'].includes(rootTypeInfo) && (item.key === '开始点坐标' || item.key === '结束点坐标')"
          :label="item.label || item.name">
          <div class="flex">
            <div class="sub-title">X</div><el-input-number v-model="item.parseValue[0]" controls-position="right"
              size="mini" @keydown.native.stop @change="onInput()"></el-input-number>
            <div class="sub-title">Y</div><el-input-number v-model="item.parseValue[1]" controls-position="right"
              size="mini" @keydown.native.stop @change="onInput()"></el-input-number>
            <div class="sub-title">Z</div><el-input-number v-model="item.parseValue[2]" controls-position="right"
              size="mini" @keydown.native.stop @change="onInput()"></el-input-number>
          </div>
        </el-form-item>
      </div>
    </el-form>
    <el-button v-if="filterTop()" size="small" type="primary" @click="changeTop">面层设计</el-button>
  </div>
</template>
<script>
import { listMemberType, getObj, updateComsCoordinate } from "@/api/userCenter/componentInformation.js";
import { updateMemberInfo } from "@/api/projectManage/model.js";
import { cadblueprintSet } from "@/api/userCenter/resourcePool.js";

export default {
  props: {
    data: {
      type: Object,
      default: () => { }
    }
  },
  data() {
    return {
      memberInfo: [],
      rsInfo: [],
      topData: ["generalWall", 'floor', 'ceiling'],
      listCache: {} // 修改2：新增请求缓存
    }
  },
  watch: {
    "data.selectPark": {
      handler(val) {
        if (val && val.object) {
          this.memberInfo = val.object;
          this.rsInfo = val.rsInfo;
          // 机电管线和连接点特殊处理
          if (['pipe', 'conn'].includes(this.rootTypeInfo)) {
            this.memberInfo.forEach(item => {
              // 禁用长度
              if (item.key === 'length') {
                item.disable = true
              }
              // 处理开始点结束点坐标格式
              if (item.key === '开始点坐标' || item.key === '结束点坐标') {
                item.parseValue = this.parseCoordinateString(item.value)
              }
              // 厚度最大值限制 厚度 * 2 < 直径 && 厚度 * 2 < 截面宽度 && 厚度 * 2 < 截面高度
              if (item.key === 'thickness') {
                // 获取直径值
                const diameterItem = this.memberInfo.find(item => item.key === 'diameter');
                const diameter = diameterItem ? Number(diameterItem.value) : Infinity;
                // 获取截面宽度和高度
                const widthItem = this.memberInfo.find(item => item.key === 'width');
                const heightItem = this.memberInfo.find(item => item.key === 'height');
                const width = widthItem ? Number(widthItem.value) : Infinity;
                const height = heightItem ? Number(heightItem.value) : Infinity;
                // 计算厚度的最大允许值
                const maxThickness = Math.min(
                  diameter / 2,
                  width / 2,
                  height / 2
                );
                // 设置厚度item的max值
                if (maxThickness > 0 && isFinite(maxThickness)) {
                  item.max = maxThickness;
                }
              }
            })
          }
          // 初始化时预加载select列表（避免模板渲染时触发请求）
          if (Array.isArray(this.memberInfo)) {
            this.memberInfo.forEach(item => {
              if (item.min != null) item.min = Number(item.min);
              if (item.max != null) item.max = Number(item.max);
              if (item.controlType == 'select' && item.parentId) {
                this.getList(item);
              }
            });
          }
        }
      },
      deep: true,
      immediate: true,
    },
    memberInfo: {
      handler(val) {
        if (val) {
          this.$store.commit('design/changePipeGeometryAttr', val);
        }
      },
      deep: true,
      immediate: true,
    },
  },
  computed: {
    designStore() {
      return this.$store.state.design
    },
    topStore() {
      return this.$store.state.top
    },
    rootTypeInfo() {
      return this.memberInfo.find(item => item.key === 'rootTypeInfo')?.type
    }
  },
  created() {

  },
  mounted() {
  },
  destroyed() {

  },
  methods: {
    // input 最大值最小值校验
    clampValue(item) {
      const v = Number(item.value);
      if (isNaN(v)) {
        item.value = 0;
        return;
      }
      const min = item.min != null ? Number(item.min) : -Infinity;
      const max = item.max != null ? Number(item.max) : Infinity;
      item.value = Math.max(min, Math.min(max, v));
    },
    // 解析坐标字符串 "X=255.7413330078125 Y=0.0 Z=0.0" 为数组 [255.7413330078125, 0.0, 0.0]
    parseCoordinateString(coordStr) {
      if (!coordStr || typeof coordStr !== 'string') {
        return [0, 0, 0];
      }
      try {
        const coords = {};
        coordStr.split(' ').forEach(item => {
          const [key, val] = item.split('=');
          coords[key] = parseFloat(val);
        });
        return [coords.X || 0, coords.Y || 0, coords.Z || 0];
      } catch (error) {
        console.error('解析坐标字符串失败:', error);
        return [0, 0, 0];
      }
    },
    onInput() {
      // 先对所有需要校验的输入项进行校验
      this.memberInfo.forEach(item => {
        if (item.controlType === 'input' && (item.min != null || item.max != null)) {
          this.clampValue(item);
        }
      });
      this.changeMember(this.memberInfo).then(() => {
        this.$message.success("修改成功")
      })
    },
    onSelect(e, item) {
      if (item.isNeed) {
        this.changeMember(this.memberInfo).then(() => {
          this.$message.success("修改成功")
        })
      } else {
        let count = 0
        let parentId = null
        Array.isArray(this.memberInfo) && this.memberInfo.forEach((ele, index) => {
          if (ele.key === item.key) {
            parentId = ele.id
            count = index
          }
          if (ele.controlType === 'select' && index > count) {
            ele.id = null
            this.memberInfo[index].parentId = parentId
            this.getList(this.memberInfo[index])
          }
        });
      }
    },
    changeMember(e) {
      return new Promise((resolve, reject) => {
        let data = {
          params: {},
          uuids: [this.data.selectPark.mN]
        }
        let params = {
          taskId: this.data.taskId
        }
        e.forEach(item => {
          if (item.controlType === "input") {
            data.params[item.key] = item.value
          }
          if (item.key == 'type') {
            data.params.type = item.value
          }
          if (item.isNeed && item.id) {
            params.meshId = item.id
          }
        });
        // 
        let rootTypeInfo = e.find(item => item.key === 'rootTypeInfo')?.type;
        // 机电管线和连接点需要特殊处理
        if (['pipe', 'conn'].includes(rootTypeInfo)) {
          const params1 = {
            taskId: this.data.taskId,
          }
          let uuid = this.rsInfo.find(item => item.key === 'id').value;
          let location = this.rsInfo.find(item => item.key === 'location').value.split(' ');
          let rotation = this.rsInfo.find(item => item.key === 'rotation').value.split(' ');
          let scale = this.rsInfo.find(item => item.key === 'scale').value.split(' ');
          let beginLocation = e.find(item => item.key === '开始点坐标')?.parseValue;
          let endLocation = e.find(item => item.key === '结束点坐标')?.parseValue;
          let typeList = e.find(item => item.key === 'meshId')?.list || [];
          let type = typeList.find(a => a.id == e.find(item => item.key === 'meshId')?.id)?.type;
          const data1 = [
            {
              uuid,
              comName: data.params.name,
              newLocation: {
                x: location[0].split('=')[1],
                y: location[1].split('=')[1],
                z: location[2].split('=')[1]
              },
              newRotation: {
                x: rotation[0].split('=')[1],
                y: rotation[1].split('=')[1],
                z: rotation[2].split('=')[1]
              },
              newScale: {
                x: scale[0].split('=')[1],
                y: scale[1].split('=')[1],
                z: scale[2].split('=')[1]
              },
              // length: data.params.length,
              width: data.params.width,
              height: data.params.height,
              thickness: data.params.thickness,
              diameter: data.params.diameter,
              type,
              beginLocation: {
                x: beginLocation[0],
                y: beginLocation[1],
                z: beginLocation[2]
              },
              endLocation: {
                x: endLocation[0],
                y: endLocation[1],
                z: endLocation[2]
              }
            }
          ]
          updateComsCoordinate(params1, data1).then(res => {
            resolve(res.data)
          })
        }
        // 图纸特殊处理
        else if (data.params.type == 'blueprint') {
          const blueParams = {
            taskId: this.data.taskId,
            uuid: this.data.copyingPictures.id,
          }
          e.forEach(item => {
            blueParams[item.key] = item.value
          })
          cadblueprintSet(blueParams).then(res => {
            resolve(res.data)
          })
        }
        else {
          updateMemberInfo(params, data).then(res => {
            resolve(res.data)
          })
        }

      })
    },
    async getList(e) {
      const cacheKey = `${this.data.taskId}-${e.parentId}`;
      if (this.listCache[cacheKey]) { // 修改2：优先使用缓存
        // e.list = this.listCache[cacheKey];
        this.$set(e, 'list', this.listCache[cacheKey]);
        return true;
      }
      const params = {
        taskId: this.data.taskId,
        parentId: e.parentId
      }
      return await listMemberType(params).then(res => {
        if (!res.data) return;
        res.data.forEach(item => item.id = String(item.id));
        // e.list = res.data;
        this.$set(e, 'list', res.data);
        this.listCache[cacheKey] = res.data; // 修改2：缓存新请求的数据
        return true;
      })
    },
    // 是否显示面层设计
    filterTop() {
      if (!this.memberInfo) return
      let topIndex = -1
      Array.isArray(this.memberInfo) && this.memberInfo.filter(item => {
        if (!item.type) {
          return
        }
        topIndex = this.topData.findIndex(e => e === item.type)
      })
      return topIndex === -1 ? false : true
    },
    // 面层
    changeTop() {
      const { topType } = this.topStore;
      if (topType == 1) return
      const object = this.memberInfo;
      let topIndex = -1
      object.filter(item => {
        if (!item.type) {
          return
        }
        topIndex = this.topData.findIndex(e => e === item.type)
      })
      if (topIndex !== -1) {
        this.$store.dispatch('design/changeDrawType', 2);
        this.$store.commit('design/changeType', 1);
        this.$store.dispatch('top/changeTopDesign', 1);
        this.$store.commit('bim/setPlaneViewStatus', 2)
        this.$store.dispatch('bim/changeMode', { e: '2D', mode: true });
        // router.push('/design/model')
      }
      this.getPave()
    },
    getPave() {
      const { memberId: actorId } = this.designStore
      const params = {
        taskId: this.data.taskId,
        actorId
      }
      getObj(params)
    }
  }
}
</script>
<style lang="less" scoped>
.flex {
  display: flex;
  align-items: center;
  justify-content: flex-start;

  /deep/.el-input-number {
    flex: 1;
  }
}

.geometry-attr {
  margin-top: 20px;

  .sub-title {
    margin: 0 4px;
  }

  /deep/.el-form-item__label {
    color: #fff;
  }
}

// .custom-input-number {
//   /deep/&.el-input-number {
//     width: 100%;

//     .el-input__inner {
//       text-align: left;
//     }

//     .el-input-number__decrease,
//     .el-input-number__increase {
//       width: 12px;
//       background: none;
//       border: none;
//       color: #ffffff;
//       right: 4px;
//     }

//     // .input-number-with-suffix {
//     //   position: relative;
//     // }

//     .el-input-number__decrease::before {
//       content: '元';
//       position: absolute;
//       right: 40px;
//       /* 调整位置 */
//       top: 50%;
//       transform: translateY(-50%);
//       color: #999;
//     }
//   }
// }

// 坐标项的标签样式 - 模拟 label-position="top"
.coordinate-item {
  margin-bottom: 18px;

  /deep/ .el-form-item__label {
    display: block;
    text-align: right;
    line-height: 1.5;
  }

  /deep/ .el-form-item__content {
    margin-left: 0 !important;
    clear: both;
  }
}
</style>