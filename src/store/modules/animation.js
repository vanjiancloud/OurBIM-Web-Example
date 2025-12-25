export default {
  namespaced: true, // 启用命名空间
  state: {
    currentItem: {}, // 当前点击的动画项
  },
  mutations: {
    changeCurrentItem(state, e) { state.currentItem = e },
  },
  actions: {

  }
};