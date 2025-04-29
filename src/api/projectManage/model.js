/*
 * @Autor: zk
 * @Date: 2024-08-23 19:46:00
 * @LastEditors: zk
 * @LastEditTime: 2024-09-24 20:51:54
 * @Description: 
 */
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
export function updateProject(params, data) {
    return request({
        url: '/appli/updateProject',
        method: 'POST',
        params,
        data,
        headers: {
            'Content-Type': 'application/json;charset=UTF-8'
        }
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
// 编辑项目
export function updateGisProject(params, data) {
    return request({
        url: '/appli/manageGISLinks',
        method: 'POST',
        params,
        data,
        headers: {
            'Content-Type': 'multipart/form-data;'
        }
    })
}