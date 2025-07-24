import { updateMode, updateOrthogonal, updateAction, updateControlMode, updateSize, updateCase, addScreenshot, updateControlState } from "@/api/projectManage/model.js";

// 辅助函数：获取 taskId（适配 Vuex 上下文）
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
  namespaced: true, // 启用命名空间，避免状态冲突

  state: {
    activeMode: null,
    copycatList: [],
    markList: [
      { id: 81, label: '长度', name: 'length' },
      { id: 82, label: '间距', name: 'spacing' },
      { id: 83, label: '半径', name: 'radius' },
      { id: 84, label: '面积', name: 'area' }
    ],
    activeOperate: null,
    planeViewStatus: 1, //1 未激活平面视图 2已激活平面视图
  },

  mutations: {
    setPlaneViewStatus(state, e) {
      state.planeViewStatus = e
    },
    // 修改当前模式
    SET_ACTIVE_MODE(state, mode) {
      state.activeMode = mode;
    },
    // 修改临摹图列表（type 0: 添加 1：清空）
    SET_COPYCAT_LIST(state, { e, type }) {
      if (type === 0) {
        state.copycatList.push(e);
      } else {
        state.copycatList = [];
      }
    },
    // 修改当前构件操作类型
    SET_ACTIVE_OPERATE(state, operate) {
      state.activeOperate = operate;
    }
  },

  actions: {
    // 临摹图列表操作
    changeCopycat({ commit }, payload) {
      commit('SET_COPYCAT_LIST', payload);
    },

    // 模式变更（兼容原 Promise 接口）
    async changeMode({ commit }, { e, mode = true }) {
      commit('SET_ACTIVE_MODE', e);
      if (!mode) return;
      try {
        const taskId = await getTaskId(this); // this 指向 store 实例
        await updateMode({ taskId, editorMode: e });
      } catch (err) {
        return Promise.reject(err);
      }
    },

    // 是否正交
    async changeOrthogonal({ }, e) {
      try {
        const taskId = await getTaskId(this);
        await updateOrthogonal({
          taskId,
          flag: e === true ? 'open' : 'close'
        });
      } catch (err) {
        return Promise.reject(err);
      }
    },

    // 构件操作
    async changeControlMode({ commit }, e) {
      commit('SET_ACTIVE_OPERATE', e);
      if (e === null) return;
      try {
        const taskId = await getTaskId(this);
        await updateControlMode({ taskId, mode: e });
      } catch (err) {
        return Promise.reject(err);
      }
    },

    // 标注开关
    async changeMark({ state }, e) {
      try {
        const taskId = await getTaskId(this);
        const sizeList = state.markList.map(item => ({
          sizeName: item.name,
          control: e.includes(item.id) ? 'open' : 'close'
        }));
        await updateSize({ taskId }, sizeList);
      } catch (err) {
        return Promise.reject(err);
      }
    },

    // 保存方案
    async changeCase({ dispatch }, e) {
      try {
        const taskId = await getTaskId(this);
        await updateCase({ taskId, flag: e });
        if (e === 'commit') {
          dispatch('changeScreenshot');
        }
      } catch (err) {
        return Promise.reject(err);
      }
    },

    // 生成户型图
    changeScreenshot({ rootState }) {
      const { taskId } = rootState.design;
      const width = document.documentElement.clientWidth;
      const height = document.documentElement.clientHeight;
      addScreenshot({ taskId, length: width, width: height });
    },

    // 操作轴类型
    async changeControlState({ }, e) {
      try {
        const taskId = await getTaskId(this);
        await updateControlState({
          taskId,
          pakId: 'MAPWEB',
          actorOrAppId: e
        });
      } catch (err) {
        return Promise.reject(err);
      }
    },

    // 指令下发
    async changeAction({ }, e) {
      try {
        const taskId = await getTaskId(this);
        await updateAction({ taskid: taskId, ...e });
      } catch (err) {
        return Promise.reject(err);
      }
    }
  }
};