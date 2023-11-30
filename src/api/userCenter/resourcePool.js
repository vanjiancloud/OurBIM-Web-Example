import request from "@/utils/newRequest.js";

// 开启/关闭构件库操作
export function comSwitch(params) {
    return request({
        url: '/comControl/comAction',
        method: 'POST',
        params
    })
}

// 添加构件
export function addCom(params) {
    return request({
        url: "/comControl/addCom",
        method: "post",
        params,
        headers: {
            "Content-Type": "application/json"
        },
    });
}

// 获取构件列表
export function getPublicList(params) {
    return request({
        url: '/comControl/getPublicComList',
        method: 'get',
        params
    })
}


// 获取 个人库 贴图分组
export function getTextureGroup(params) {
    return request({
        url: "/material/getAllMaterialTextureGroup",
        method: "get",
        params
    });
}

// 获取 个人库 贴图分组下的贴图
export function getTextureByGroupId(params) {
    return request({
        url: "/material/getMaterialTextureByGroupId",
        method: "get",
        params
    });
}

// 获取OurBIM材质库某分组下的材质
export function getMaterialByGroup(params) {
    return request({
        url: '/material/getOurBIMMaterialByGroup',
        method: 'get',
        params
    })
}

// 获取用户的个人材质库
export function getMaterialFromUser(params) {
    return request({
        url: `/material/getMaterialFromUser`,
        method: 'get',
        params,
    })
}

// 获取OurBIM材质库分组
export function getOurBIMMaterialGroup(params) {
    return request({
        url: '/material/getOurBIMMaterialGroup',
        method: 'get',
        params
    })
}

// 获取项目的材质库
export function getProjectMaterial(params) {
    return request({
        url: `/material/getMaterialList`,
        method: 'get',
        params,
    })
}

// 材质编辑模式开关
export function materialEditorControl(params) {
    return request({
        url: '/material/materialEditorControl',
        method: 'get',
        params
    })
}

// 获取材质的信息（替换过的材质才有信息）
export function getMaterialByMatId(params) {
    return request({
        url: '/material/getMaterialByMatId',
        method: 'get',
        params
    })
}

// 重置材质
export function resetMaterial(params,data) {
    return request({
        url: '/material/resetMaterial',
        method: 'post',
        params,
        data,
        headers: {
            'Content-Type': 'application/json'
        }
    })
}

// 修改材质参数
export function updateMaterial(params,data) {
    return request({
        url: '/material/updateMaterial',
        method: 'post',
        params,
        data,
        headers: {
            'Content-Type': 'application/json'
        }
    })
}

// 指令更换材质
export function changeMaterialByInstruction(params,data) {
    return request({
        url: '/material/changeMaterialByInstruction',
        method: 'post',
        params,
        data,
        headers: {
            'Content-Type': 'application/json'
        }
    })
}

// 添加材质到项目材质库
export function addMaterialForApp(params,data) {
    return request({
        url: `/material/addMaterialForApp`,
        method: 'post',
        params,
        data,
        headers: {
            'Content-Type': 'application/json'
        }
    })
}

// 添加材质到用户材质库
export function addMaterialForUser(params,data) {
    return request({
        url: '/material/addMaterialForUser',
        method: 'post',
        params,
        data,
        headers: {
            'Content-Type': 'application/json'
        }
    })
}

// 调整临摹图比例尺
export function updateScale(params, data) {
    return request({
        url: `/buildSystem/blueprintSetting`,
        method: 'post',
        params,
        data
    })
}