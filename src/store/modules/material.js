// 材质的管理状态
const getDefaultState = () => {
  return {
    activeMaterialIndex: 0, //构件信息 材质信息中 材质球默认选中的index（当前默认第一个） 默认选中材质信息
    openMaterial: false, //是否打开材质信息
    //选中的贴图类型 
    // 基础颜色贴图
    //   "texturesList": [{
    // 	"paramName": "BaseColorMap",
    // 	"paramValue": "https://api.ourbim.com:11023/vjapi/userMaterialMap/Materials_PBR/T_White_Color.png"
    // }, {
    // 金属度贴图
    // 	"paramName": "MetallicMap",
    // 	"paramValue": "https://api.ourbim.com:11023/vjapi/userMaterialMap/Materials_PBR/T_White_Linear.png"
    // }, {
    // 粗糙度贴图
    // 	"paramName": "RoughnessMap",
    // 	"paramValue": "https://api.ourbim.com:11023/vjapi/userMaterialMap/Materials_PBR/T_MidGray_Linear.BMP"
    // }, {
    // 法线贴图
    // 	"paramName": "NormalMap",
    // 	"paramValue": "https://api.ourbim.com:11023/vjapi/userMaterialMap/Materials_PBR/T_Flat_Normal.png"
    // }, {
    // 自发光贴图
    // 	"paramName": "EmissionMap",
    // 	"paramValue": "https://api.ourbim.com:11023/vjapi/userMaterialMap/Materials_PBR/T_White_Color.png"
    // }]
    openTexture: '',
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