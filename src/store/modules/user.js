import { showDetail, userCenterUse } from "@/api/my.js";
import { resetRouter } from '@/router'

// 管理状态
const getDefaultState = () => {
    return {
        userId: JSON.parse(sessionStorage.getItem("userid")),
        userInfo: {},
        total: {},
    }
}

const state = getDefaultState()

const mutations = {
    RESET_STATE: (state) => {
        Object.assign(state, getDefaultState())
    },
    SET_USERID: (state, user) => {
        state.userId = user
    },
    CHANGE_USERINFO: (state, userInfo) => {
        state.userInfo = userInfo
    },
    CHANGE_TOTAL: (state, total) => {
        state.total = total
    }
}

const actions = {
    // 获取用户信息
    getUser({ commit, state }){
        return new Promise((resolve, reject) => {
            showDetail({ userid: state.userId}).then(async response => {
                commit('CHANGE_USERINFO', response.data)
            }).catch(error => {
                reject(error)
            })
        })
    },
    // 获取头部统计
    getTotal({ commit, state }) {
        return new Promise((resolve, reject) => {
            userCenterUse({ userId: state.userId}).then(async response => {
                commit('CHANGE_TOTAL', response.data)
            }).catch(error => {
                reject(error)
            })
        })
    },
    // 退出
    logout({ commit, state }) {
        return new Promise((resolve, reject) => {
            localStorage.clear()
            sessionStorage.clear()
            resetRouter()
            commit('RESET_STATE')
            resolve()
        })
    },
}

export default {
    namespaced: true,
    state,
    mutations,
    actions
}