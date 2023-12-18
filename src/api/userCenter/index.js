import request from "@/utils/newRequest.js";
import config from '../../../server.config'

// 获取流程文字
export function getProccess(params) {
    return request({
        url: '/launcherReceiveMsg/getLoadingMessageByTaskId',
        method: 'get',
        params,
    })
}

// 预启动开启
export function preloadStart(params) {
    return request({
        url: '/cloudServicePreStart/preloadStart',
        method: 'post',
        params,
    })
}

// 预启动关闭
export function preloadClose(params) {
    return request({
        url: '/cloudServicePreStart/preloadClose',
        method: 'post',
        params,
    })
}

// 指令下发
export function doAction(params) {
    return request({
        url: '/OurBim/doAction',
        method: 'get',
        params
    })
}

// 浏览器上面的 旋转 移动 缩放 按钮
export function setGizmoMode(params) {
    return request({
        url: '/OurBim/setGizmoMode',
        method: 'post',
        params
    })
}

// 打开或者关闭(轴心)
export function setGizmoModeType(params) {
    return request({
        url: '/OurBim/setGizmoModeType',
        method: 'post',
        params
    })
}

// 关闭构件库轴
export function closeComEdit(params) {
    return request({
        url: '/comControl/comEditorAction',
        method: 'POST',
        params
    })
}

// 改变选中构件状态
export function conChoiceVisible(params) {
    return request({
        url: '/OurBim/conChoiceVisible',
        method: 'get',
        params
    })
}

// 隔离构件
export function invertHidden(params) {
    return request({
        url: '/OurBim/invertHidden',
        method: 'post',
        params
    })
}

// 显示全部构件
export function displayAllActor(params) {
    return request({
        url: '/OurBim/displayAllActor',
        method: 'post',
        params
    })
}

// 通过pakid获取appid
export function getPakIdByAppId(params) {
    return request({
        url: '/appli/getPakIdByAppId',
        method: 'get',
        params
    })
}

export function requestOurBim(params) {
    return request({
        url: '/OurBim/testRequestOurBim',
        method: 'POST',
        params
    })
}

// 获取流
export function doRequestOurBimStream(data) {
    return request({
        url: '/OurBim/doRequestOurBimStream',
        method: 'post',
        data
    })
}

// 建立websocket通信
let WSBASEURL = config.VUE_APP_REQUEST_URL.replace('http://', 'ws://').replace('https://', 'wss://');
export function connectWebsocket(params) {
    return `${WSBASEURL}/websocket/${params}`
}