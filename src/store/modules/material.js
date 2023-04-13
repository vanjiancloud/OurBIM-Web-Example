// 材质的管理状态
const getDefaultState = () => {
    return {
        activeMaterialIndex: 0, //默认选中材质信息
        openMaterial: false, //是否打开材质信息
        openTexture: '', //选中的贴图
        materialAllInfo: {}, //当前材质的信息
        componentAllInfo: {} //当前选中的构件信息
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
            if(typeof state[key] === 'object'){
                state[key] = { ...state[key], ...value }
            }else{
                state[key] = value
            }
        }
    }
}

const actions = {
  changeSetting ({ commit }, data) {
    commit('CHANGE_SETTING', data)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}