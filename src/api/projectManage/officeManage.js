import request from '@/utils/newRequest.js'

// 分享文档（文档管理）
export function getDocShareUrl(params){
    return request({
        url: '/cloudDoc/getDocShareUrl',
        method: 'get',
        params
    })
}

// 删除文档（文档管理）
export function deleteCloudDoc(params) {
    return request({
        url: '/cloudDoc/deleteCloudDoc',
        method: 'post',
        params
    })
}

// 获取文档预览 或 在线编辑链接（文档管理）
export function getDocUrl(params) {
    return request({
        url: '/cloudDoc/getDocUrl',
        method: 'get',
        params
    })
}

// 获取所有文档信息（文档管理）
export function getUserAllCloudDoc(params) {
    return request({
        url: '/cloudDoc/getUserAllCloudDoc',
        method: 'get',
        params
    })
}