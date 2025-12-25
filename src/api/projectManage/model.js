import request from '@/utils/newRequest.js'
import qs from "qs";

// 初始化
export function updateBuildState(data) {
  return request({
    url: `/buildSystem/initBuildSystem`,
    method: 'post',
    headers: {
      'content-type': 'application/x-www-form-urlencoded'
    },
    data: qs.stringify(data)
  })
}
// 图纸初始化
export function blueprintInit(params) {
  return request({
    url: `/cadImport/blueprintInit`,
    method: 'post',
    params,
  })
}
// 添加链接模型
export function addCombineApp(params) {
  return request({
    url: '/appli/addCombineApp',
    method: 'post',
    params
  })
}

// 获取模型token
export function getEnterToken(params) {
  return request({
    url: '/OurBim/getEnterToken',
    method: 'get',
    params
  })
}

// 获取项目列表
export function getProjectList(params) {
  return request({
    url: '/appli/getApplicationList',
    method: 'GET',
    params
  })
}

// 删除项目
export function deleteProject(params) {
  return request({
    url: '/appli/deleteProject',
    method: 'POST',
    params
  })
}

// 编辑项目
export function updateProject(params, data) {
  return request({
    url: '/appli/updateProject',
    method: 'POST',
    params,
    data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}
// 将版本升级，重新转化项目 api2.5
export function upgradeModle(params) {
  return request({
    url: '/appli/upgradeBIMModel',
    method: 'POST',
    params
  })
}

// 分享项目
export function getWebUrl(params) {
  return request({
    url: '/appli/getWebUrl',
    method: 'POST',
    params

  })
}

export function getTeamUrl(params) {
  return request({
    url: '/OurBim/getTeamUrl',
    method: 'get',
    params
  })
}
// 编辑项目
export function updateGisProject(params, data) {
  return request({
    url: '/appli/manageGISLinks',
    method: 'POST',
    params,
    data,
    headers: {
      'Content-Type': 'multipart/form-data;'
    }
  })
}
// 新增方案 创建空项目
export function addCase(params) {
  return request({
    url: `/appli/createEmptyApp`,
    method: 'post',
    params
  })
}
// 切换2D/3D模式
export function updateMode(data) {
  return request({
    url: `/buildSystem/editorModeChange`,
    method: 'post',
    headers: {
      'content-type': 'application/x-www-form-urlencoded'
    },
    data: qs.stringify(data)
  })
}
// 正交是否开启
export function updateOrthogonal(data) {
  return request({
    url: `/buildSystem/orthogonalControl`,
    method: 'post',
    headers: {
      'content-type': 'application/x-www-form-urlencoded'
    },
    data: qs.stringify(data)
  })
}
// 指令下发
export function updateAction(data) {
  return request({
    url: `/OurBim/doAction`,
    method: 'get',
    params: data
  })
}
// 提交与回滚
export function updateCase(params) {
  return request({
    url: `/buildSystem/commitOrRollback`,
    method: 'post',
    params
  })
}
// 截图
export function addScreenshot(data) {
  return request({
    url: `/appli/createScreenShot`,
    method: 'get',
    params: data
  })
}
// 操作轴类型
export function updateControlMode(data) {
  return request({
    url: `/OurBim/setGizmoMode`,
    method: 'post',
    headers: {
      'content-type': 'application/x-www-form-urlencoded'
    },
    data: qs.stringify(data)
  })
}
// 尺寸显示是否开启
export function updateSize(params, data) {
  return request({
    url: `/buildSystem/sizeControl`,
    method: 'post',
    params: params,
    data: data
  })
}
// 构件操作
export function updateControlState(data) {
  return request({
    url: `/OurBim/editorActorOrModel`,
    method: 'post',
    headers: {
      'content-type': 'application/x-www-form-urlencoded'
    },
    data: qs.stringify(data)
  })
}
// 获取类型列表
export function listMemberType(e) {
  return request({
    url: `/buildSystem/getBuildingListByParentId`,
    method: 'get',
    params: e
  })
}
// 设置属性
export function updateMemberInfo(params, data) {
  return request({
    url: `/buildSystem/setBuildingComParams`,
    method: 'post',
    params: params,
    data: data
  })
}
// 选中构件轮廓线设置
export function setOutLineParams(params) {
  return request({
    url: `/OurBim/setOutLineParams`,
    method: 'post',
    params,
  })
}
// 发送构件信息，websocket推送构件表面积信息
export function getAreaByActor(data) {
  return request({
    url: `/OurBim/getAreaByActor`,
    method: 'post',
    data,
  })
}
// 新建构件模型
export function createActorApp(params) {
  return request({
    url: `/appli/createActorApp`,
    method: 'post',
    params,
  })
}
// 上传BIM模型
export function addProject(data) {
  return request({
    url: `/appli/addProject`,
    method: 'post',
    data,
  })
}
