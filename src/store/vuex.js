import Vue from "vue"
import Vuex from "vuex"
import material from './modules/material'
import request from './modules/request'
import user from './modules/user'
import getters from './getters'

// 挂载Vue
Vue.use(Vuex)

// 创建vuex对象

export default new Vuex.Store({
    state: {
        uploadingNum: 0,
        uploadDoc: 0,
        uploadCom: 0,
        uploadGISNum: 0, //上传gis数据服务模块的上传的数
    },
    mutations: {
        changeState(state, data) {
            state[data.key] = data.value
        }
    },
    modules: {
        material,
        request,
        user
    },
    getters
})