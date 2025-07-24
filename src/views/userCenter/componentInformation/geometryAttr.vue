<!-- 个性化几何属性 -->
<template>
  <div class="geometry">
    <el-form label-width="80px">
      <div v-for="(item, index) in memberInfo" :key="index">
        <el-form-item size="small"
          v-if="item.key !== 'rootTypeInfo' && (item.controlType === 'input' || item.controlType === 'select' && item.parentId && item.list && item.list.length)">
          <template #label>
            <div
              v-if="item.controlType === 'input' || (item.controlType === 'select' && item.parentId && item.list && item.list.length)">
              {{
                item.label
                || item.name }}</div>
          </template>
          <!-- input -->
          <el-input v-if="item.controlType === 'input'" v-model="item.value" @change="onInput">
            <template #suffix v-if="item.unit">
              <span v-text="item.unit"></span>
            </template>
          </el-input>
          <!-- select -->
          <el-select v-else-if="item.controlType === 'select' && item.parentId && item.list && item.list.length"
            v-model="item.id" @change="(e) => onSelect(e, item)">
            <el-option v-for="opt in item.list" :label="opt.name" :value="opt.id" :key="opt.id" />
          </el-select>
          <!-- 展示 -->
          <!-- <el-input disabled v-else-if="item.key !== 'rootTypeInfo'" v-model="item.value"></el-input> -->
        </el-form-item>
      </div>
    </el-form>
    <el-button v-if="filterTop()" size="small" type="primary" @click="changeTop">面层设计</el-button>
  </div>
</template>
<script>
import { listMemberType, getObj } from "@/api/userCenter/componentInformation.js";
import { updateMemberInfo } from "@/api/projectManage/model.js";

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
      topData: ["generalWall", 'floor', 'ceiling'],
      listCache: {} // 修改2：新增请求缓存
    }
  },
  watch: {
    "data.selectPark": {
      handler(val) {
        if (val && val.object) {
          this.memberInfo = val.object
          // 修改3：初始化时预加载select列表（避免模板渲染时触发请求）
          this.memberInfo.forEach(item => {
            if (item.controlType == 'select' && item.parentId) {
              this.getList(item);
            }
          });
        }
      },
      deep: true,
      immediate: true,
    },
  },
  computed: {
    // memberInfo() {
    //   return this.data.selectPark.object
    // },
    // taskId(){
    //   return this.$store.state.design.taskId
    // },
    designStore() {
      return this.$store.state.design
    },
    topStore() {
      return this.$store.state.top
    },
  },
  created() {

  },
  mounted() {
    // console.log(JSON.parse(JSON.stringify(this.data.selectPark)), this.data)
  },
  destroyed() {

  },
  methods: {
    onInput() {
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
        this.memberInfo.forEach((ele, index) => {
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
        updateMemberInfo(params, data).then(res => {
          resolve(res.data)
        })
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
      this.memberInfo.filter(item => {
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
.geometry {
  margin-top: 20px;

  /deep/.el-form-item__label {
    color: #fff;
  }
}
</style>