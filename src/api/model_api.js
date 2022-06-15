/*
 * @Author: zk
 * @Date: 2021-02-24 13:47:18
 * @LastEditors: zk
 * @LastEditTime: 2021-06-09 11:10:08
 * @description: 
 */
import qs from "qs"
import {
    BASE
} from "../utils/socket_request"
import request from '../utils/request'
import qsStringify from "qs-stringify"

import axios from 'axios'
const MODELAPI = {

    DOWNLOADFILE: (params, callback) => {
        return axios({
            url: '/FileStorge/downloadModelFile',
            method: 'get',
            params,
            responseType: 'blob',
            onDownloadProgress(progress) {
                callback(progress)
            }
        })
    },
    GETMODELINFO: params => {
        return request({
            url: '/OurBim/requestOurBim',
            method: 'POST',
            data: qsStringify(params)
        })
    },
    // 建立websocket通信
    CREATESOCKET: params => {
        return `${BASE.WSPRO}websocket/${params}`
    },
    // 获取构件树
    LISTMEMBERTREE: params => {
        return request({
            url: '/appli/getComponent',
            method: 'get',
            params
        })
    },

    // 指令下发
    UPDATEORDER: params => {

        return request({
            url: '/OurBim/doAction',
            method: 'get',
            params
        })
    },
    // 浏览器中 锁的打开与关闭
    LOCKOPENORCLOSE: params => {
        return request({
            url: '/OurBim/editorModeControl',
            method: 'post',
            params
        })
    },
    // 点击锁后的 后续信息
    LOCKAFTERINFO: params => {
        return request({
            url: '/OurBim/editorActorOrModel',
            method: 'post',
            params
        })
    },
    // 浏览器上面的 旋转 移动 缩放 按钮
    BROWSERBUTTON: params => {
        return request({
            url: '/OurBim/setGizmoMode',
            method: 'post',
            params
        })
    },
    // 获取关注视角
    LISTFOLLOWPOINT: params => {
        return request({
            url: '/OurBim/selectCamerashotAll',
            method: 'post',
            params
        })
    },
    //   修改关注视角
    UPDATEFOLLOWPOINT: params => {
        return request({
            url: '/OurBim/updateCamerashotGod',
            method: 'post',
            params
        })
    },
    //   删除关注视角
    DElETEFOLLOWPOINT: params => {
        return request({
            url: '/OurBim/deleteCamerashotGod',
            method: 'post',
            params
        })
    },
    // 还原模型
    UPDATERESETANGLE: params => {
        return request({
            url: '/OurBim/clearGodCamerashot',
            method: 'post',
            params
        })
    },
    // 获取模型token
    GETBIMTOKEN: params => {
        return request({
            url: '/OurBim/getEnterToken',
            method: 'get',
            params
        })
    },
    // 新建集成项目
    ADDINTEGRARE: params => {
        return request({
            url: '/appli/addCombineApp',
            method: 'post',
            params
        })
    },
    // 获取环境列表
    LISTWEATHER: params => {
        return request({
            url: '/appli/getWeatherList',
            method: 'get',
            params
        })
    },
    // 改变选中构件状态
    UPDATEMEMBER: params => {
        return request({
            url: '/OurBim/conChoiceVisible',
            method: 'get',
            params
        })
    },
    // params:{
    //   taskId:''
    // }
    // 显示全部构件
    displayAllActor: params => {
        return request({
            url: '/OurBim/displayAllActor',
            method: 'post',
            data: qsStringify(params)
        })
    },
    // params:{
    //   taskId:''
    // }
    // 隔离构件
    invertHidden: params => {
        return request({
            url: '/OurBim/invertHidden',
            method: 'post',
            data: qsStringify(params)
        })
    },
}

export default MODELAPI