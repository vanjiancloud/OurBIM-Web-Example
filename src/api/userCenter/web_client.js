import request from "@/utils/newRequest.js";

// 获取taskid
export function getTaskId(params) {
    return request({
        url: '/launcherReceiveMsg/getLatestTaskIdByProjectId',
        method: 'get',
        params,
    })
}


// 获取流程文字
export function getProccess(params) {
    return request({
        url: '/launcherReceiveMsg/getLoadingMessageByTaskId',
        method: 'get',
        params,
    })
}