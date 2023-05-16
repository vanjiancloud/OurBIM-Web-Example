/*
 * @Author: zk
 * @Date: 2021-07-30 14:27:46
 * @LastEditors: zk
 * @LastEditTime: 2021-08-17 16:15:29
 * @description: 构件库
 */
import newRequest from '@/utils/newRequest'
import request from '../utils/request'
import qsStringify from "qs-stringify"

const COMPONENTLIBRARY = {

    // 获取构件列表
    getPublicComList: params => {
        return request({
            url: '/comControl/getPublicComList',
            method: 'get',
            params
        })
    },

    // 初始化构件
    initComponent: params => {
        return request({
            url: '/comControl/initCom',
            method: 'GET',
            params
        })
    },
    // 构件定位
    focusComponent: params => {
        return request({
            url: '/comControl/comFocus',
            method: 'POST',
            params
        })
    },

    /* 
 构件操作 
  params:{
    comId:'',
    taskId:'',
    action:'',//translate、rotate、scale
  }
  */

    operateCom: params => {
        return request({
            url: '/comControl/operateCom',
            method: 'POST',
            params
        })
    },
    // 自定义构件显示隐藏
    controlComShowOrHide: params => {
        return request({
            url: '/comControl/controlComShowOrHide',
            method: 'POST',
            params
        })
    },
    // 删除自定义构件
    // /comControl/deleteCom
    deleteCom: params => {
        return request({
            url: '/comControl/deleteCom',
            method: 'POST',
            params
        })
    },
}


// 添加构件
export function addCom(params) {
    return newRequest({
        url: "/comControl/addCom",
        method: "post",
        params,
        headers: {
            "Content-Type": "application/json"
        },
    });
}

// 开启/关闭构件库操作
export function comSwitch(params) {
    return newRequest({
        url: '/comControl/comAction',
        method: 'POST',
        params
    })
}
// 关闭构件库轴
export function closeComEdit(params) {
    return newRequest({
        url: '/comControl/comEditorAction',
        method: 'POST',
        params
    })
}


export default COMPONENTLIBRARY