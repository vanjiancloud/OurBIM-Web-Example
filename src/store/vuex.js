import Vue from "vue"
import Vuex from "vuex"

// 挂载Vue
Vue.use(Vuex)

// 创建vuex对象

export default new Vuex.Store({
    state: {
        uploadingNum: 0,
        uploadDoc: 0,
        uploadCom: 0
    },
    mutations: {
        changeState(state, data) {
            state[data.key] = data.value
        }
    }
})