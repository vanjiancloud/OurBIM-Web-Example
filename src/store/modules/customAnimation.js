export default {
  namespaced: true, // 启用命名空间
  state: {
    drawerShow: false,
    activeTreeNode: null, // 点击的构件过滤器tree节点 是自定义动画模型组的数据来源之一 数据来源二可通过模型框选多选推送的多选消息
    keyFrameEditData: {},
  },
  mutations: {
    changeDrawerShow(state, e) { state.drawerShow = e },
    changeActiveTreeNode(state, e) { state.activeTreeNode = e },
    changeKeyFrameEditData(state, e) { state.keyFrameEditData = e },
  },
  actions: {

  }
};