import request from '@/utils/newRequest.js'

// 添加链接模型
export function addCombineApp(params) {
    return request({
        url: '/appli/addCombineApp',
        method: 'post',
        params
    })
}

// 获取模型token
export function getEnterToken(params) {
    return request({
        url: '/OurBim/getEnterToken',
        method: 'get',
        params
    })
}

// 获取项目列表
export function getProjectList(params) {
    return request({
        url: '/appli/getApplicationList',
        method: 'GET',
        params
    })
}

// 删除项目
export function deleteProject(params) {
    return request({
        url: '/appli/deleteProject',
        method: 'POST',
        params
    })
}

// 编辑项目
export function updateProject(params) {
    return request({
        url: '/appli/updateProject',
        method: 'POST',
        params
    })
}

export function upgradeModle(params) { // 升级模型
    return request({
        url: '/appli/upgradeBIMModel',
        method: 'POST',
        params
    })
}

// 分享项目
export function getWebUrl(params) {
    return request({
        url: '/appli/getWebUrl',
        method: 'POST',
        params

    })
}

export function getTeamUrl(params) {
    return request({
        url: '/OurBim/getTeamUrl',
        method: 'get',
        params
    })
}