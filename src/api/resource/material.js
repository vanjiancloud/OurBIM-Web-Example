import request from "@/utils/newRequest.js";

// 查询自定义材质分组
export function selectCustomizeMaterialGroup(params) {
  return request({
    url: '/customizeMaterial/selectCustomizeMaterialGroup',
    method: 'post',
    params
  })
}
// 删除自定义材质分组
export function deleteCustomizeMaterialGroup(params) {
  return request({
    url: '/customizeMaterial/deleteCustomizeMaterialGroup',
    method: 'post',
    params
  })
}
// 添加自定义材质分组
export function addCustomizeMaterialGroup(data) {
  return request({
    url: "/customizeMaterial/addCustomizeMaterialGroup",
    method: "post",
    data,
    headers: {
      "Content-Type": "multipart/form-data;"
    },
  });
}
// 更新自定义材质分组
export function updateCustomizeMaterialGroup(data) {
  return request({
    url: '/customizeMaterial/updateCustomizeMaterialGroup',
    method: 'post',
    data,
    headers: {
      "Content-Type": "multipart/form-data;"
    },
  })
}

// 查询自定义材质
export function selectCustomizeMaterial(params) {
  return request({
    url: '/customizeMaterial/selectCustomizeMaterial',
    method: 'post',
    params
  })
}
// 添加自定义材质
export function addCustomizeMaterial(data) {
  return request({
    url: '/customizeMaterial/addCustomizeMaterial',
    method: 'post',
    data
  })
}
// 更新自定义材质
export function updateCustomizeMaterial(data) {
  return request({
    url: '/customizeMaterial/updateCustomizeMaterial',
    method: 'post',
    data
  })
}
// 删除自定义材质
export function deleteCustomizeMaterial(params) {
  return request({
    url: '/customizeMaterial/deleteCustomizeMaterial',
    method: 'post',
    params
  })
}
// 复制自定义材质
export function copyCustomizeMaterial(params) {
  return request({
    url: '/customizeMaterial/copyCustomizeMaterial',
    method: 'post',
    params
  })
}

// 复制公共材质到自定义材质
export function copyPublicMaterialToCustomMaterial(params) {
  return request({
    url: '/customizeMaterial/copyPublicMaterialToCustomMaterial',
    method: 'post',
    params
  })
}

// 复制项目材质到自定义材质
export function copyAppMaterialToCusTomMaterial(params) {
  return request({
    url: '/customizeMaterial/copyAppMaterialToCusTomMaterial',
    method: 'post',
    params
  })
}
// 添加自定义材质缩略图
export function setCustomizeMaterialImage(params) {
  return request({
    url: '/customizeMaterial/setCustomizeMaterialImage',
    method: 'post',
    params,
  })
}
