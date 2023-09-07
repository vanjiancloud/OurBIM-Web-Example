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

    // 初始化构件
    initComponent: params => {
        return request({
            url: '/comControl/initCom',
            method: 'GET',
            params
        })
    },

    operateCom: params => {
        return request({
            url: '/comControl/operateCom',
            method: 'POST',
            params
        })
    },
}


// 构件定位
export function focusComponent(params) {
    return newRequest({
        url: '/comControl/comFocus',
        method: 'POST',
        params
    })
}


// 删除自定义构件
export function deleteCustomCom(params) {
    return newRequest({
        url: '/comControl/deleteCom',
        method: 'POST',
        params
    })
}


// 自定义构件显示隐藏
export function controlComShowOrHide(params) {
    return newRequest({
        url: '/comControl/controlComShowOrHide',
        method: 'POST',
        params
    })
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

// 修改光源信息
export function modifyComParams(params,data) {
    return newRequest({
        url: '/comControl/modifyComParams',
        method: 'POST',
        params,
        data
    })
}

// 获取构件列表
export function getPublicList(params) {
    return newRequest({
        url: '/comControl/getPublicComList',
        method: 'get',
        params
    })
}


export default COMPONENTLIBRARY