import request from "@/utils/newRequest.js";

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