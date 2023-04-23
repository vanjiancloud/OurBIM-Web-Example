import request from "@/utils/newRequest.js";

// 新建GIS数据服务
export function addGISLayerServer(params, data) {
  return request({
    url: `/appli/addGISLayerServer`,
    method: "post",
    params,
    data,
    headers: {
      "Content-Type": "application/json"
    }
  });
}

// 编辑图纸
export function updateCADFileInfo(data) {
  return request({
    url: "/CADFile/updateFileInfo",
    method: "post",
    data
  });
}

// cad列表
export function getList(params) {
  return request({
    url: "/CADFile/getUserAllFile",
    method: "get",
    params
  });
}

// 删除图纸
export function deleteList(params) {
    return request({
        url: "/CADFile/deleteFileById",
        method: "post",
        params
    });
}