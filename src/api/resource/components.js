import request from "@/utils/newRequest.js";

// 列表
export function list(params) {
    return request({
        url: '/comControl/getComListByParentId',
        method: 'GET',
        params
    })
}

// 新建分组 （自定义构件）
export function addComGroup(params) {
    return request({
        url: '/comControl/addComGroup',
        method: 'POST',
        params
    })
}

// 自定义构建组更名 （自定义构件）
export function updateComGroup(params) {
    return request({
        url: '/comControl/updateComGroup',
        method: 'post',
        params
    })
}

// 删除自定义构件分组/构件 （自定义构件）
export function deleteUserCom(params) {
    return request({
        url: '/comControl/deleteUserCom',
        method: 'POST',
        params
    })
}

// 编辑构件
export function updateUserCom(data) {
    return request({
        url: '/comControl/updateUserCom',
        method: 'POST',
        data,
        headers: {
            'Content-Type': 'multipart/form-data;'
        }
    })
}

// 重新转换构件
export function upgradeUserCom(params) {
    return request({
        url: '/comControl/upgradeUserCom',
        method: 'POST',
        params
    })
}