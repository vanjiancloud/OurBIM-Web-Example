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

    // 更新视点 (视图)
    COVERVIEW: params => {
        return request({
            url: '/ViewPoint/coverView',
            method: 'post',
            params
        })
    },
    // 查询 视点动画列表（视图）
    SERACHCIEWANIMATION: params => {
        return request({
            url: '/ViewPoint/getViewAnimList',
            method: 'get',
            params
        })
    },
    // 创建空的视点动画（视图）
    CREATEANIM: params => {
        return request({
            url: '/ViewPoint/createViewAnim',
            method: 'post',
            params
        })
    },
    // 修改视点动画的名称（视图）
    CHANGENAMEANIM: params => {
        return request({
            url: '/ViewPoint/updateViewAnimName',
            method: 'post',
            params
        })
    },
    // 删除视点动画（视图）
    DELETEANIM: params => {
        return request({
            url: '/ViewPoint/delViewAnim',
            method: 'post',
            params
        })
    },
    // 添加视点至视点动画序列中（视图）
    ADDVIEWSTOANIM: params => {
        return request({
            url: '/ViewPoint/addViewImgToViewAnim',
            method: 'post',
            params
        })
    },
    // 根据视图id获取视点（视图）
    GETANIMBYVIEW: params => {
        return request({
            url: '/ViewPoint/getAnimByViewId',
            method: 'get',
            params
        })
    },
    // 删除视图动画中的视点（视图）
    REMOVEANIMPOINTERS: params => {
        return request({
            url: '/ViewPoint/delViewImgFromViewAnim',
            method: 'post',
            params
        })
    },
    // 修改视图动画中的视点间的过渡时间（视图）
    UPDATEPLAYTIME: params => {
        return request({
            url: '/ViewPoint/updatePlayTimeByEdit',
            method: 'post',
            params
        })
    },
    // 视点动画预览（视图）
    VIEWANIMPREVIEW: params => {
        return request({
            url: '/ViewPoint/viewAnimPreview',
            method: 'post',
            params
        })
    },
    // 点击暂停、播放、停止时（视图）
    PLAYOPERATION: params => {
        return request({
            url: '/ViewPoint/playOperation',
            method: 'post',
            params
        })
    },
    // 拖拽视图里面的视点交换位置（视图）
    UPDATEORDERBYMOUSE: params => {
        return request({
            url: '/ViewPoint/updateOrderByMouse',
            method: 'post',
            params
        })
    },
    // 视点导出图片（视图）
    EXPORTIMG: params => {
        return request({
            url: '/viewOperation/exportImg',
            method: 'get',
            params
        })
    },

    // 获取自定义构件列表 （自定义构件）
    GETCOMLISTBYPARENTID: params => {
        return request({
            url: '/comControl/getComListByParentId',
            method: 'GET',
            params
        })
    },
    // 删除自定义构件分组/构件 （自定义构件）
    DELETEUSERCOM: params => {
        return request({
            url: '/comControl/deleteUserCom',
            method: 'POST',
            params
        })
    },
    // 新建分组 （自定义构件）
    ADDCOMGROUP: params => {
        return request({
            url: '/comControl/addComGroup',
            method: 'POST',
            params
        })
    },
    // 获取所有自定义构建 （自定义构件）
    GETALLCOM: params => {
        return request({
            url: '/comControl/getAllCom',
            method: 'get',
            params
        })
    },
    // 自定义构建组更名 （自定义构件）
    UPDATECOMGROUP: params => {
        return request({
            url: '/comControl/updateComGroup',
            method: 'post',
            params
        })
    },
    // 获取所有文档信息（文档管理）
    GETUSERALLCLOUDDOC: params => {
        return request({
            url: '/cloudDoc/getUserAllCloudDoc',
            method: 'get',
            params
        })
    },
    // 获取文档预览 或 在线编辑链接（文档管理）
    GETDOCURL: params => {
        return request({
            url: '/cloudDoc/getDocUrl',
            method: 'get',
            params
        })
    },
    // 删除文档（文档管理）
    DELETECLOUDDOC: params => {
        return request({
            url: '/cloudDoc/deleteCloudDoc',
            method: 'post',
            params
        })
    },
    // 下载文档（文档管理）
    GETCLOUDDOCDOWNLOADURL: params => {
        return request({
            url: '/cloudDoc/getCloudDocDownloadUrl',
            method: 'get',
            params
        })
    },
    // 分享文档（文档管理）
    GETDOCSHAREUEL: params => {
        return request({
            url: '/cloudDoc/getDocShareUrl',
            method: 'get',
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