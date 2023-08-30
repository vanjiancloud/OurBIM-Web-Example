import newRequest from '@/utils/newRequest'
import request from '../utils/request'
import qsStringify from "qs-stringify"

import axios from 'axios'
const CHAILIAOAPI = {

    // 获取 材质库里的 项目库列表
    GETPROJECTMATERIALINFO: params => {
        return request({
            url: '/material/getProjectMaterialInfo',
            method: 'get',
            params
        })
    },
    // 获取材质的信息（替换过的材质才有信息）
    GETMATERIALBYMATID: params => {
        return request({
            url: '/material/getMaterialByMatId',
            method: 'get',
            params
        })
    },
    // 修改材质贴图
    MODIFYMATERIALTEXTURE: formData => {
        return request({
            url: '/material/modifyMaterialTexture',
            method: 'post',
            headers: {
                "Content-Type": "multipart/form-data;"
            },
            data: formData,
        })
    },
    GETPAKIDBYAPPID: params => {
        return request({
            url: '/appli/getPakIdByAppId',
            method: 'get',
            params
        })
    },
    // 设置天气颜色
    SETWEATHERCOLOR: params => {
        return request({
            url: '/OurBim/setWeatherColor',
            method: 'post',
            params,
        })
    },
    // 设置天气时间、时速
    SETTIMEWEATHERTIMEANDTIMESPEED: params => {
        return request({
            url: '/weather/setWeatherTimeAndTimeSpeed',
            method: 'post',
            params,
        })
    },
    // 设置太阳方位
    SETSUNLIGHTDIRECTION: (params, data) => {
        return request({
            url: '/weather/setSunLightDirection',
            method: 'post',
            params,
            data,
            headers: {
                'Content-Type': 'application/json'
            }
        })
    },
    // 设置天气
    SETWEATHRTTYPE: (params, data) => {
        return request({
            url: '/weather/setWeatherType',
            method: 'post',
            params,
            data,
            headers: {
                'Content-Type': 'application/json'
            }
        })
    },
    // 设置风向风速
    SETWINDDIRECTIONANDSPEED: params => {
        return request({
            url: '/weather/setWindDirectionAndSpeed',
            method: 'post',
            params,
        })
    },
    // 获取模型参数化天气信息
    GETWEATHERPARAMS: params => {
        return request({
            url: '/weather/getWeatherParams',
            method: 'get',
            params,
        })
    },
    // 获取当前天气的Id
    GETCURRWEATHERID: params => {
        return request({
            url: '/weather/getCurrWeatherId',
            method: 'get',
            params,
        })
    },
}

// 获取 个人库 贴图
export function getChartletList(params) {
    return newRequest({
        url: "/material/getAllMaterialTextureInfo",
        method: "get",
        params
    });
}

// 获取 个人库 贴图分组
export function getTextureGroup(params) {
    return newRequest({
        url: "/material/getAllMaterialTextureGroup",
        method: "get",
        params
    });
}
// 获取 个人库 贴图分组下的贴图
export function getTextureByGroupId(params) {
    return newRequest({
        url: "/material/getMaterialTextureByGroupId",
        method: "get",
        params
    });
}

// 上传贴图
export function addChartlet(data) {
    return newRequest({
        url: "/material/uploadMaterialTextures",
        method: "post",
        data,
        headers: {
            "Content-Type": "multipart/form-data;"
        },
    });
}
// 获取OurBIM材质库某分组下的材质
export function getMaterialByGroup(params) {
    return newRequest({
        url: '/material/getOurBIMMaterialByGroup',
        method: 'get',
        params
    })
}
// 材质编辑模式开关
export function materialEditorControl(params) {
    return newRequest({
        url: '/material/materialEditorControl',
        method: 'get',
        params
    })
}
// 获取材质的信息（替换过的材质才有信息）
export function getMaterialByMatId(params) {
    return newRequest({
        url: '/material/getMaterialByMatId',
        method: 'get',
        params
    })
}
// 重置材质
export function resetMaterial(params,data) {
    return newRequest({
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
    return newRequest({
        url: '/material/updateMaterial',
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
    return newRequest({
        url: '/material/addMaterialForUser',
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
    return newRequest({
        url: '/material/changeMaterialByInstruction',
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
    return newRequest({
        url: `/buildSystem/blueprintSetting`,
        method: 'post',
        params,
        data
    })
}

// 获取OurBIM材质库分组
export function getOurBIMMaterialGroup(params) {
    return newRequest({
        url: '/material/getOurBIMMaterialGroup',
        method: 'get',
        params
    })
}

// 获取用户的个人材质库
export function getMaterialFromUser(params) {
    return newRequest({
        url: `/material/getMaterialFromUser`,
        method: 'get',
        params,
    })
}

// 获取项目的材质库
export function getProjectMaterial(params) {
    return newRequest({
        url: `/material/getMaterialList`,
        method: 'get',
        params,
    })
}

// 添加材质到项目材质库
export function addMaterialForApp(params,data) {
    return newRequest({
        url: `/material/addMaterialForApp`,
        method: 'post',
        params,
        data,
        headers: {
            'Content-Type': 'application/json'
        }
    })
}


export default CHAILIAOAPI