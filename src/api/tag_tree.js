/*
 * @Author: zk
 * @Date: 2021-05-06 15:15:52
 * @LastEditors: zk
 * @LastEditTime: 2021-05-12 15:54:57
 * @description: 
 */
  import request from '../utils/request'
  import qsStringify from "qs-stringify"

  const TAGTREE = {
        // 获取标签列表
        LISTTAG: params =>{
            return request({
                url: '/TagControl/getTagList',
                method: 'get',
                params
              })
        },
        // 添加标签集
        SAVETAGGATHER: params => {
            return request({
                url: '/TagControl/addTagGroup',
                method: 'POST',
                data: qsStringify(params)
              })
        },
        // 添加标签
        SAVETAG: params => {
            return request({
                url: '/TagControl/addTag',
                method: 'POST',
                data: qsStringify(params)
              })
        },
        // 修改标签
        UPDATETAG: params => {
            return request({
                url: '/TagControl/updateTag',
                method: 'POST',
                data: qsStringify(params)
              })
        },
        // 删除
        REMOVERTAG: params => {
            return request({
                url: '/TagControl/deleteTag',
                method: 'POST',
                data: qsStringify(params)
              })
        },
        // 显示隐藏
        UPDATASHOWTAG: params => {
            return request({
                url: '/TagControl/controlTagShow',
                method: 'POST',
                data: qsStringify(params)
              })
        },
  }

  export default TAGTREE