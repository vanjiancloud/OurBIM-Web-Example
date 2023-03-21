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

// 编辑GIS数据服务
export function editGISLayerServer(data) {
  return request({
    url: "/appli/updateGISLayer",
    method: "post",
    data,
    headers: {
      "Content-Type": "multipart/form-data;"
    }
  });
}

// gis列表
export function getList(params) {
  return request({
    url: "/appli/getGISLayerList",
    method: "get",
    params
  });
}

// 删除GIS数据服务
export function deleteList(params) {
    return request({
        url: "/appli/delGISLayerServer",
        method: "post",
        params
    });
}