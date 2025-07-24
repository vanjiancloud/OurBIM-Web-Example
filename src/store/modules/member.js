/*
 * @description: 构件信息（Vuex 版本）
 */
import { listMemberType, updateMemberInfo } from "@/api/projectManage/model.js";

function getTaskId(context) {
  const { taskId, isReady } = context.state.design; // 从 design 模块获取状态
  return new Promise((resolve, reject) => {
    if (!isReady) {
      this.$message.warning('模型加载中…');
      reject();
    }
    resolve(taskId);
  });
}

export default {
  namespaced: true, // 启用命名空间
  state: {
    systemInfo: null,
    tyleList: [],
    activeLib: '0', // 当前打开的tab 材质库0 贴图库1
  },
  mutations: {
    // 修改当前打开的库类型
    CHANGE_LIB(state, e) {
      state.activeLib = e;
    },
    // 修改系统信息
    CHANGE_SYSTEM(state, e) {
      state.systemInfo = e;
    },
    // 更新类型列表（可选，若需要同步修改 tyleList 时使用）
    SET_TYPE_LIST(state, list) {
      state.tyleList = list;
    }
  },
  actions: {
    // 切换当前库类型（通过 mutation 修改状态）
    changeLib({ commit }, e) {
      commit('CHANGE_LIB', e);
    },
    // 切换系统信息（通过 mutation 修改状态）
    changeSystem({ commit }, e) {
      commit('CHANGE_SYSTEM', e);
    },
    // 修改构件信息（保留异步逻辑，通过 rootState 访问 design 模块）
    changeMember({ rootState }, e) {
      return new Promise((resolve, reject) => {
        const { memberId, taskId } = rootState.design;
        const data = { params: {}, uuids: [memberId] };
        const params = { taskId };

        e.forEach(item => {
          if (item.controlType === "input") {
            data.params[item.key] = item.value;
          }
          if (item.isNeed && item.id) {
            params.meshId = item.id;
          }
        });

        updateMemberInfo(params, data).then(res => {
          resolve(res.data);
        });
      });
    },
    // 获取类型列表（通过辅助函数获取 taskId）
    getTypeList({ rootState }, e) {
      return new Promise((resolve, reject) => {
        getTaskId(rootState)
          .then(taskId => {
            const params = { taskId, parentId: e };
            listMemberType(params).then(res => {
              resolve(res.data);
              // 可选：若需要同步更新状态，可添加 commit('SET_TYPE_LIST', res.data)
            });
          });
      });
    }
  }
};