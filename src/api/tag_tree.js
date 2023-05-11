/*
 * @Author: zk
 * @Date: 2021-05-06 15:15:52
 * @LastEditors: zk
 * @LastEditTime: 2021-05-12 16:25:47
 * @description: 
 */
  import request from '../utils/request'
  import qsStringify from "qs-stringify"
  import newRequest from '@/utils/newRequest.js'

  const TAGTREE = {
        // 获取标签列表
        LISTTAG: params =>{
            return request({
                url: '/tagControl/getTagList',
                method: 'get',
                params
              })
        },
        // 添加标签集
        SAVETAGGATHER: params => {
            return request({
                url: '/tagControl/addTagGroup',
                method: 'POST',
                // params
                data: qsStringify(params)
              })
        },
        // 添加标签
        SAVETAG: params => {
            return request({
                url: '/tagControl/addTag',
                method: 'POST',
                // params
                data: qsStringify(params)
              })
        },
        // 修改标签
        UPDATETAG: params => {
            return request({
                url: '/tagControl/updateTag',
                method: 'POST',
                data: qsStringify(params)
              })
        },
        // 删除
        REMOVERTAG: params => {
            return request({
                url: '/tagControl/deleteTag',
                method: 'POST',
                data: qsStringify(params)
              })
        },
        // 显示隐藏
        UPDATASHOWTAG: params => {
            return request({
                url: '/tagControl/controlTagShow',
                method: 'POST',
                data: qsStringify(params)
              })
        },
        // focus
        UPDATAFOCUSTAG: params => {
          return request({
              url: '/tagControl/clickTag',
              method: 'POST',
              data: qsStringify(params)
            })
      },
  }

  export default TAGTREE


export function getTagList(params) {
    return newRequest({
        url: '/tagControl/getTagList',
        method: 'get',
        params
    })
}