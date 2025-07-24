/*
 * @Author: zk
 * @Date: 2023-01-11 10:45:24
 * @LastEditors: zk
 * @LastEditTime: 2024-07-25 21:38:36
 * @LastEditTime: 2023-01-16 17:46:21
 * @description: 面层设计（Vuex 版本）
 */
import { updateObj } from '@/api/userCenter/top.js'
// 提取为独立工具函数，直接接收 rootState 和查询键
const filterKey = (rootState, key) => {
  const { memberRsInfo } = rootState.design
  const obj = memberRsInfo.filter(item => item.key === key)
  // console.log(memberRsInfo)
  return obj[0]?.value || '' // 增加空值保护
}
export default {
  namespaced: true, // 启用命名空间（关键）
  state: {
    topType: 0, // 0: 全部 1：面层设计
    faceTypeData: [{
      id: 0,
      type: 'tile',
      name: '密缝铺贴',
      params: {
        tileType: 'Straight', // 铺贴方式 直铺
        alignmentType: "TopLeft", //对齐类型 左上
        tileGapType: "Default", // 缝隙类型 空缝
        horizontalOffset: 0, // 水平偏移：单位mm
        verticalOffset: 0, // 垂直偏移: 单位mm
        offsetOfGap: 5, // 缝隙的宽度: 单位mm
        angle: 0, // 角度 -180 ， 180
      }
    }, {
      id: 1,
      type: 'array',
      name: '模型阵列',
      params: {
        arrayType: "Horizontal", // 阵列方式: 水平
        alignmentType: "TopLeft", // 对齐类型: 左上
        horizontalOffset: 0, // 水平偏移：单位mm
        verticalOffset: 0, // 垂直偏移: 单位mm
        offsetOfGap: 400, // 相邻瓷砖的距离: 单位mm
        angle: 0, // 角度 -180,180
      }
    }],
    paveType: 'tile',
    faceInfo: null,
    lineType: null, //线类型
    styleLine: null, // 样条线
  },
  mutations: {
    // 同步修改状态的方法（替代 Pinia 中直接修改 this.xxx 的操作）
    changeFaceInfo(state, e) {
      state.faceInfo = e
    },
    changePave(state, e) {
      state.paveType = e
    },
    changeLineType(state, e) {
      state.lineType = e
    },
    changeStyleLine(state, e) {
      state.styleLine = e
    },
    setTopType(state, e) {
      state.topType = e
    },
  },
  actions: {
    changeStyleLine({ commit }, payload) {
      commit('changeStyleLine', payload); // 调用同名 mutation
    },
    changeTopDesign({ commit, rootState }, e) {
      commit('setTopType', e)
      const taskId = rootState.design.taskId
      // 直接调用工具函数获取值
      const actorId = filterKey(rootState, 'id')
      const clickLocation = filterKey(rootState, 'clickLocation')
      const params = {
        taskId,
        surfaceEditing: e ? 'enable' : 'disable',
        actorId,
        clickLocation
      }
      // 注意：eval 存在安全风险，建议替换为 JSON.parse 或其他安全方式解析
      let data = `{${clickLocation.replace(/=/g, ':').replace(/ /g, ',')}}`
      data = eval("(" + data + ")")
      setTimeout(() => {
        updateObj(params, data)
      }, 400);
    },
  }
}