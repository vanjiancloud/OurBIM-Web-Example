/*
 * @Autor: zk
 * @Date: 2024-10-21 21:45:38
 * @LastEditors: zk
 * @LastEditTime: 2024-10-30 22:06:02
 * @Description: 
 */
import request from '@/utils/newRequest.js'

// 添加链接模型
export function addEle(params) {
    return request({
        url: '/GISPolygon/createPolygon',
        method: 'post',
        params
    })
}
// 显示隐藏
export function updateEleState(params) {
    return request({
        url: '/GISPolygon/setPolygonVisibility?',
        method: 'post',
        params
    })
}
// 编辑
export function updateEle(params, data) {
    return request({
        url: '/GISPolygon/updatePolygon',
        method: 'post',
        params,
        data
    })
}
// focus
export function focusEle(params) {
    return request({
        url: '/GISPolygon/pitchOnPolygon',
        method: 'post',
        params
    })
}
// del
export function delEle(params) {
    return request({
        url: '/GISPolygon/deletePolygon',
        method: 'post',
        params
    })
}
// list
export function listLayer(params) {
    return request({
        url: '/GISPolygon/getGISLayerList',
        method: 'get',
        params
    })
}
// update
export function updateLayer(params, data) {
    return request({
        url: '/GISPolygon/setPolygon3dtile',
        method: 'post',
        params,
        data
    })
}
// del
export function delLayer(params) {
    return request({
        url: '/GISPolygon/getGISLayerList',
        method: 'get',
        params
    })
}
// copy
export function copyEle(params, data) {
    return request({
        url: '/GISPolygon/copyPolygon',
        method: 'post',
        params
    })
}
// updateColor
export function updateColor(params, data) {
    return request({
        url: '/GISPolygon/setPolygon3dtileColor',
        method: 'post',
        params,
        data
    })
}
// getColor
export function getColor(params, data) {
    return request({
        url: '/GISPolygon/selectGISPolygonSet',
        method: 'get',
        params
    })
}
// list
export function listPolygon(params) {
    return request({
        url: '/GISPolygon/selectGISPolygonList',
        method: 'get',
        params
    })
}