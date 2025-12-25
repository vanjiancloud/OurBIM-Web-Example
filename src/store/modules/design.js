export default {
  namespaced: true, // 启用命名空间避免冲突
  state: {
    taskId: null,
    bimId: null,
    bimUserId: 'b36e81c74d5c44afa856ea2cae1ae49b',
    startState: false,
    typeNum: 1,
    isReady: false,
    isRight: false,
    isScale: false,
    footerState: 0,
    listGroup: [],
    listMaterial: [],
    libNode: null,
    // 0--绘制建筑结构(墙体等) 1--绘制套线结构(门套线等) 2--面层设计 4--绘制机电管线
    drawType: null,
    memberInfo: null,
    memberRsInfo: null,
    memberId: null,
    listCheck: [],
    mappingList: [],
    materInfo: null,
    useMaterInfo: null,
    initMaterInfo: [],
    activeMater: 0,
    activeMaps: null,
    allMaterialChecked: false,
    lengthInfo: '',
    groupInfo: null,
    eventId: null,
    activeCopy: null,
    deleteComIds: [],
    pipelineType: null, //当前绘制的机电管线构件类型
    // 机电管线菜单默认值
    pipelineForm: {
      width: 10,
      height: 5,
      thickness: 0.5,
      diameter: 10,
      planeHeight: 100
    },
    // 机电管线个性化参数设置
    pipeGeometryAttr: []
  },
  mutations: {
    // 所有直接修改 state 的操作移至 mutations（同步）
    changeEvent(state, e) { state.eventId = e },
    changeGroupInfo(state, e) { state.groupInfo = e },
    checkMember(state, e) { state.listCheck = e },
    changeGroup(state, e) { state.listGroup = e },
    changeMaterial(state, e) { state.listMaterial = e },
    changeDrawType(state, e) { state.drawType = e },
    changeMemberId(state, e) { state.memberId = e },
    changeMember(state, e) { state.memberInfo = e },
    changeMemberInfo(state, e) { state.memberRsInfo = e },
    changeFooterState(state, e) { state.footerState = e },
    changeScale(state, e) { state.isScale = e },
    changeLength(state, e) { state.lengthInfo = e },
    changeActiveMater(state, e) { state.activeMater = e },
    changeIsRight(state, e) { state.isRight = e },
    changeMappingList(state, e) { state.mappingList = e },
    changeInitMaterial(state, e) { state.initMaterInfo = e },
    changeMaterInfo(state, e) { state.materInfo = e },
    changeUseInfo(state, e) { state.useMaterInfo = e },
    changeModelState(state, e) { state.isReady = e },
    changeTaskId(state, e) { state.taskId = e },
    changeLibNode(state, e) { state.libNode = e },
    changeType(state, e) { state.typeNum = e },
    changeBimId(state, e) { state.bimId = e },
    changeBimUserId(state, e) { state.bimUserId = e },
    resetState(state, e) {
      const { startState, bimId, bimUserId } = e;
      state.startState = startState;
      state.bimId = bimId;
      state.bimUserId = bimUserId;
    },
    updateState(state, e) { state.startState = e },
    changeMaps(state, e) { state.activeMaps = e },
    changeCopy(state, e) { state.activeCopy = e },
    deleteCom(state, e) { state.deleteComIds = e },
    changeAllMaterialChecked(state, e) { state.allMaterialChecked = e },
    changePipelineType(state, e) { state.pipelineType = e },
    changePipelineForm(state, e) { state.pipelineForm = e },
    changePipeGeometryAttr(state, e) { state.pipeGeometryAttr = e },
  },
  actions: {
    // 包含逻辑/异步操作的方法移至 actions（可调用 mutations）
    changeDrawType({ commit, dispatch }, e) {
      if (e === null) {
        // 调用其他模块方法（假设 top 模块已注册）
        dispatch('top/changeStyleLine', null, { root: true });
      }
      commit('changeDrawType', e); // 提交 mutation 修改 state
    },
    changeMaterInfo({ commit }, e) {
      return new Promise(resolve => {
        commit('changeMaterInfo', e);
        resolve();
      });
    },
    changeUseInfo({ commit }, e) {
      return new Promise(resolve => {
        commit('changeUseInfo', e);
        resolve();
      });
    },
    changeBimId({ commit }, e) {
      return new Promise(resolve => {
        commit('changeBimId', e);
        resolve();
      });
    },
    changeBimUserId({ commit }, e) {
      return new Promise(resolve => {
        commit('changeBimUserId', e);
        resolve();
      });
    },
    updateState({ commit }, e) {
      return new Promise(resolve => {
        commit('updateState', e);
        resolve();
      });
    },
    jumpShare({ commit }, e) {
      return new Promise(resolve => {
        const { bimUserId, bimId } = e;
        commit('changeBimUserId', bimUserId);
        commit('changeBimId', bimId);
        const newPage = this.$router.resolve({ path: '/shareCase', query: e });
        window.open(newPage.href, '_blank');
        resolve();
      });
    },
    jumpDesign({ commit }, e) {
      return new Promise(resolve => {
        const { applidStatus, paasUserId, bimId } = e;
        if (applidStatus === '2') {
          commit('changeBimUserId', paasUserId);
          commit('changeBimId', bimId);
          const newPage = this.$router.resolve({
            path: '/design/house',
            query: { bimUserId: paasUserId, bimId }
          });
          window.open(newPage.href, '_blank');
        } else {
          this.$message.warning('方案准备中，请稍后！');
        }
        resolve();
      });
    }
  }
};