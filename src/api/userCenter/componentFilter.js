import request from '@/utils/newRequest.js'

// 过滤器改版接口
// 获取分组列表
export function getGroupListNew(params) {
  return request({
    url: '/ActorFilterNew/getGroupList',
    method: 'POST',
    params,
  })
}
// 创建分组
export function createGroupBatchNew(params, data) {
  return request({
    url: '/ActorFilterNew/createGroupBatch',
    method: 'POST',
    params,
    data
  })
}

// 老版接口
// 获取文件夹列表
export function getDirList(params) {
  return request({
    url: '/OurBim/getDirList',
    method: 'POST',
    params,
  })
}

// 创建分组文件夹
export function createDir(params) {
  return request({
    url: '/OurBim/createDir',
    method: 'POST',
    params,
  })
}

// 获取子级菜单列表
export function getGroupList(params) {
  return request({
    url: '/OurBim/getGroupList',
    method: 'POST',
    params,
  })
}

// 创建构件分组
export function createGroupBatch(params, data) {
  return request({
    url: '/OurBim/createGroupBatch',
    method: 'POST',
    params,
    data
  })
}

// 删除分组文件夹
export function deleteDirByid(params) {
  return request({
    url: '/OurBim/deleteDirByid',
    method: 'POST',
    params
  })
}

// 更新分组文件夹、分组、构件的名称
export function updateName(params) {
  return request({
    url: '/OurBim/updateName',
    method: 'POST',
    params
  })
}

// 删除分组
export function deleteGroupById(params) {
  return request({
    url: '/OurBim/deleteGroupById',
    method: 'POST',
    params
  })
}

// 构件添加至分组
export function addActorToGroup(params, data) {
  return request({
    url: '/OurBim/addActorToGroup',
    method: 'POST',
    params,
    data
  })
}

// 从分组移除构件
export function deleteActorByid(params) {
  return request({
    url: '/OurBim/deleteActorByid',
    method: 'POST',
    params
  })
}

// 设置分组文件夹、分组下构件的可见性
export function setIsVisiable(params) {
  return request({
    url: '/OurBim/setIsVisiable',
    method: 'POST',
    params
  })
}
// 设置分组、文件夹、分组下构件的选中
export function setSelect(params) {
  return request({
    url: '/OurBim/setSelect',
    method: 'POST',
    params,
  })
}

// 获取条件参数列表 传参 taskId（任务id）、groupId（分组id）
export function getConditionList(params) {
  return request({
    url: '/ActorFilterNew/getConditionList',
    method: 'POST',
    params,
  })
}
// 过滤条件 传参 taskId（任务id）、groupId（分组id）
export function filterCondition(params, data) {
  return request({
    url: '/ActorFilterNew/filterCondition',
    method: 'POST',
    params,
    data,
  })
}
// 根据分组id查询过滤条件
export function selectfilterCondition(params) {
  return request({
    url: '/ActorFilterNew/selectfilterCondition',
    method: 'POST',
    params,
  })
}
// 过滤条件同类型、同层同类型查询
export function selectfilterConditionSame(params) {
  return request({
    url: '/ActorFilterNew/selectfilterConditionSame',
    method: 'POST',
    params,
  })
}

// 删除分组下所有构件
export function deleteActorByGroup(params) {
  return request({
    url: '/ActorFilterNew/deleteActorByGroup',
    method: 'POST',
    params,
  })
}

// 过滤条件计数
export function filterConditionCount(params, data) {
  return request({
    url: '/ActorFilterNew/filterConditionCount',
    method: 'POST',
    params,
    data,
  })
}

// 根据构件id组判断是否在分组内
export function selectGroupActorJudge(params, data) {
  return request({
    url: '/ActorFilterNew/selectGroupActorJudge',
    method: 'POST',
    params,
    data,
  })
}
// 根据构件id移除分组内构件
export function delectGroupActorBatch(params, data) {
  return request({
    url: '/ActorFilterNew/delectGroupActorBatch',
    method: 'POST',
    params,
    data,
  })
}
// 模型构件的选中/取消选中（不区分自定义构件原始构件）
export function comFocusAll(params) {
  return request({
    url: '/comControl/comFocusAll',
    method: 'POST',
    params,
  })
}