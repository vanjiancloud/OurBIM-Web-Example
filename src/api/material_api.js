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
    // 指令更换材质
    CHANGEMATERIALBYINSTRUCTION: (params, data) => {
        return request({
            url: '/material/changeMaterialByInstruction',
            method: 'post',
            params,
            data,
            headers: {
                'Content-Type': 'application/json'
            }
        })
    },
    // 添加材质到用户材质库
    ADDMATERIALFORUSER: (params, data) => {
        return request({
            url: '/material/addMaterialForUser',
            method: 'post',
            params,
            data,
            headers: {
                'Content-Type': 'application/json'
            }
        })
    },
    // 获取 个人库 贴图
    GETMATERIALALLTEXTUREINFO: params => {
        return request({
            url: '/material/getAllMaterialTextureInfo',
            method: 'get',
            params
        })
    },
    // 材质编辑模式开关
    MATERIALEDITORCONTROL: params => {
        return request({
            url: '/material/materialEditorControl',
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
    // 获取OurBIM材质库分组
    GETOURBIMMATERIALGROUP: params => {
        return request({
            url: '/material/getOurBIMMaterialGroup',
            method: 'get',
            params
        })
    },
    // 获取OurBIM材质库某分组下的材质
    GETOURBIMMATERIALBYGROUP: params => {
        return request({
            url: '/material/getOurBIMMaterialByGroup',
            method: 'get',
            params
        })
    },
    // 修改材质参数
    UPDATEMATERIAL: (params, data) => {
        return request({
            url: '/material/updateMaterial',
            method: 'post',
            params,
            data,
            headers: {
                'Content-Type': 'application/json'
            }
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
    // 创建个人库材质贴图分组
    CREATEMATERIALTEXTUREGROUP: params => {
        return request({
            url: '/material/createMaterialTextureGroup',
            method: 'post',
            params,
        })
    },
    GETPAKIDBYAPPID: params => {
        return request({
            url: '/appli/getPakIdByAppId',
            method: 'get',
            params
        })
    },
    // 重置材质
    RESETMATERIAL: (params, data) => {
        return request({
            url: '/material/resetMaterial',
            method: 'post',
            params,
            data,
            headers: {
                'Content-Type': 'application/json'
            }
        })
    },
}

export default CHAILIAOAPI