export default {
  namespaced: true, // 启用命名空间避免冲突
  state: {
    surfaceAreaMeasurement: false, //当前是否表面积测量 true时候支持框选查看表面积 否则不支持框选表面积
    boxSelection: false, // 当前是否框选 true时候支持框选查看表面积 否则不支持框选表面积
    unit: 'm', // 默认测量的单位
    precision: '0.01', // 默认测量的精度
    viewMode: 2, //人称视角 第一人称模式：1（传输投影模式必须是透视投影）；第三人称模式：2（上帝视角）；跟随对象模式：3 （传输投影模式必须是透视投影）
    projectionMode: 1, //投影模式 1:透视投影 2:正交投影(传输人称视角必须是上帝视角)
  },
  mutations: {
    changeSurfaceAreaMeasurement(state, e) { state.surfaceAreaMeasurement = e },
    changeBoxSelection(state, e) { state.boxSelection = e },
    changeUnit(state, e) { state.unit = e },
    changePrecision(state, e) { state.precision = e },
    changeViewMode(state, e) { state.viewMode = e },
    changeProjectionMode(state, e) { state.projectionMode = e },
  },
  actions: {
    changeSurfaceAreaMeasurement({ commit }, e) {
      commit('changeSurfaceAreaMeasurement', e);
    },
  }
};