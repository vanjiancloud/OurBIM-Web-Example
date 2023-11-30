// 浏览器
import request from '@/utils/newRequest.js'


// 获取构件树
export function getComponents(params) {
    return request({
        url: '/appli/getComponent',
        method: 'get',
        params
    })
}

// 冻结与解冻
export function freezeCom(params, data) {
    return request({
        url: '/comControl/freezeCom',
        method: 'post',
        params,
        data
    })
}

// 点击锁后的 后续信息
export function lockAfterInfo(params) {
    return request({
        url: '/OurBim/editorActorOrModel',
        method: 'post',
        params
    })
}

// 浏览器中 锁的打开与关闭
export function lockControl(params) {
    return request({
        url: '/OurBim/editorModeControl',
        method: 'post',
        params
    })
}

// 删除自定义构件
export function deleteCustomCom(params) {
    return request({
        url: '/comControl/deleteCom',
        method: 'POST',
        params
    })
}

// 构件定位
export function focusComponent(params) {
    return request({
        url: '/comControl/comFocus',
        method: 'POST',
        params
    })
}

// 自定义构件显示隐藏
export function controlComShowOrHide(params) {
    return request({
        url: '/comControl/controlComShowOrHide',
        method: 'POST',
        params
    })
}

// 查询整个模型的位置信息
export function getModelLocation(params) {
    return request({
        url: '/OurBim/getModelLocation',
        method: 'get',
        params
    })
}

// 模型整体偏移
export function moveModel(params, data) {
    return request({
        url: '/OurBim/moveModel',
        method: 'post',
        params,
        data
    })
}