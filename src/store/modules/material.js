// 材质的管理状态
const getDefaultState = () => {
  return {
    activeMaterialIndex: 0, //构件信息 材质信息中 材质球默认选中的index（当前默认第一个） 默认选中材质信息
    openMaterial: false, //是否打开材质信息
    openTexture: '', //选中的贴图
    componentAllInfo: {}, //当前选中的构件信息
    materialAllInfo: {}, //当前材质的信息
    materialLevel1Tab: 0,//当前资源库的tab切换值
    allMaterialChecked: false,//是否替换所有相同材质,
    isAnimationLinkage: false,//是否是动画模块联动
  }
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  CHANGE_SETTING: (state, { key, value }) => {
    // eslint-disable-next-line no-prototype-builtins
    if (state.hasOwnProperty(key)) {
      if (typeof state[key] === 'object' && Object.keys(value).length) {
        state[key] = { ...state[key], ...value }
      } else {
        state[key] = value
      }
    }
  }
}

const actions = {
  changeSetting({ commit }, data) {
    commit('CHANGE_SETTING', data)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}