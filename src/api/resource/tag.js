import request from "@/utils/newRequest.js";

// 获取所有材质贴图分组
export function list(params) {
    return request({
        url: '/tagControl/getTagList',
        method: 'GET',
        params
    })
}

// 查询所有的公共标签
export function listPublicTag(params) {
    return request({
        url: '/tagControl/listPublicTag',
        method: 'GET',
        params
    })
}

// 查询用户标签
export function listUserTagGroup(params) {
    return request({
        url: '/tagControl/listUserTagGroup',
        method: 'GET',
        params
    })
}

// 添加用户标签分组
export function addUserTagGroup(data) {
    return request({
        url: '/tagControl/addUserTagGroup',
        method: 'POST',
        data
    })
}

// 编辑用户标签和分组
export function editUserTag(data) {
    return request({
        url: '/tagControl/editUserTag',
        method: 'POST',
        data
    })
}

// 删除用户标签和分组
export function deleteUserTag(data) {
    return request({
        url: '/tagControl/deleteUserTag',
        method: 'POST',
        data
    })
}


// 根据分组查询用户标签
export function listUserTagByGroupId(params) {
    return request({
        url: '/tagControl/listUserTagByGroupId',
        method: 'GET',
        params
    })
}

// 添加标签
export function addUserTag(data) {
    return request({
        url: '/tagControl/addUserTag',
        method: 'POST',
        data
    })
}

// 手动点击添加标签
export function addTag(params) {
    return request({
        url: '/tagControl/addTag',
        method: 'POST',
        params
    })
}

// 添加标签集
export function addTagGroup(params) {
    return request({
        url: '/tagControl/addTagGroup',
        method: 'POST',
        params
    })
}

// 修改标签
export function updateTag(params) {
    return request({
        url: '/tagControl/updateTag',
        method: 'POST',
        params,
    })
}
// 批量修改标签
export function updateTags(params, data) {
    return request({
        url: '/tagControl/updateTags',
        method: 'POST',
        params,
        data
    })
}
// focus
export function clickTag(params) {
    return request({
        url: '/tagControl/clickTag',
        method: 'POST',
        params
    })
}

// 删除
export function deleteTag(params)  {
    return request({
        url: '/tagControl/deleteTag',
        method: 'POST',
        params
    })
}

// 修改锚点图片
export function postTagImg(data)  {
    return request({
        url: '/tagControl/postTagImg',
        method: 'POST',
        data,
        headers: {
            "Content-Type": "multipart/form-data;"
        },
    })
}

// 获取标签列表
export function getTagList(params){
    return request({
        url: '/tagControl/getTagList',
        method: 'get',
        params
    })
}

// 查询所有的用户标签
export function listUserTag(params){
    return request({
        url: '/tagControl/listUserTag',
        method: 'get',
        params
    })
}

// 标签显示隐藏
export function controlTagShow(params) {
    return request({
        url: '/tagControl/controlTagShow',
        method: 'POST',
        params
    })
}

// 添加自定义标签样式
export function addTagStyle(params,data) {
    return request({
        url: '/tagControl/addTagStyle',
        method: 'POST',
        params,
        data
    })
}

// 修改标签样式
export function updateTagStyle(params,data) {
    return request({
        url: '/tagControl/updateTagStyle',
        method: 'POST',
        params,
        data
    })
}

// 添加自定义标签数据
export function sendDataToTag(params,data) {
    return request({
        url: '/tagControl/sendDataToTag',
        method: 'POST',
        params,
        data
    })
}

// 获取当前项目中具体的某个标签信息
export function getAppIdTag(params){
    return request({
        url: '/tagControl/getAppIdTag',
        method: 'get',
        params
    })
}