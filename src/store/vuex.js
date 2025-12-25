import Vue from "vue"
import Vuex from "vuex"
import material from './modules/material'
import request from './modules/request'
import user from './modules/user'
import getters from './getters'
import top from './modules/topStore';
import design from "./modules/design";
import bim from "./modules/bim";
import member from "./modules/member";
import model from './modules/model';
import animation from "./modules/animation";
import customAnimation from './modules/customAnimation';
// 挂载Vue
Vue.use(Vuex)

// 创建vuex对象

export default new Vuex.Store({
  state: {
    uploadingNum: 0,
    uploadDoc: 0,
    uploadCom: 0,
    uploadGISNum: 0, //上传gis数据服务模块的上传的数
    tagUploadNum: 0, //上传标签数量
  },
  mutations: {
    changeState(state, data) {
      state[data.key] = data.value
    }
  },
  modules: {
    material,
    request,
    user,
    top,
    design,
    bim,
    member,
    model,
    animation,
    customAnimation,
  },
  getters
})