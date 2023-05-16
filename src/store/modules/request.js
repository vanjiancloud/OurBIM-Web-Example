
// 取消请求，中断请求
const state = {
    cancel: null,
};
const mutations = {
    SET_CANCEL(state, cancel) {
        state.cancel = cancel;
    },
};

const actions = {
    cancelRequest ({ commit }, data) {
      commit('SET_CANCEL', data)
    }
  }

export default {
    namespaced: true,
    state,
    mutations,
    actions
};
