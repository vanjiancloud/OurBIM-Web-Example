
// 取消请求，中断请求
// 使用方式：在vue页面中需要的地方this.cancel&&this.cancel()
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
