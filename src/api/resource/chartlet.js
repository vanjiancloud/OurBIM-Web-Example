import request from "@/utils/newRequest.js";

// 获取所有材质贴图分组
export function list(params) {
    return request({
        url: '/material/getAllMaterialTextureGroup',
        method: 'GET',
        params
    })
}


// 获取某材质贴图分组下所有贴图
export function textureList(params) {
    return request({
        url: '/material/getMaterialTextureByGroupId',
        method: 'GET',
        params
    })
}


// 创建贴图分组
export function addChartletGroup(data) {
    return request({
        url: "/material/createMaterialTextureGroup",
        method: "post",
        data,
        headers: {
            "Content-Type": "multipart/form-data;"
        },
    });
}

// 编辑贴图分组
export function updateMaterialTextureGroup(data) {
    return request({
        url: '/material/updateMaterialTextureGroup',
        method: 'post',
        data,
        headers: {
            "Content-Type": "multipart/form-data;"
        },
    })
}

// 删除贴图分组或贴图
export function deleteMaterialTexture(params) {
    return request({
        url: '/material/deleteMaterialTextureInfo',
        method: 'post',
        params,
    })
}

// 上传贴图
export function addChartlet(data) {
    return request({
        url: "/material/uploadMaterialTextures",
        method: "post",
        data,
        headers: {
            "Content-Type": "multipart/form-data;"
        },
    });
}

// 编辑贴图
export function updateMaterialTexture(data) {
    return request({
        url: '/material/updateMaterialTexture',
        method: 'post',
        data,
        headers: {
            'Content-Type': 'multipart/form-data;'
        }
    })
}