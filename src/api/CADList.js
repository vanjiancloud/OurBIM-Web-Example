// import request from "@/utils/newRequest.js";
import axios from 'axios'

// export const cadRequestUrl = `http://172.16.100.154:11088/vjapi` // 本地环境
// export const cadRequestUrl = `https://api.ourbim.com:11088/vjapi` // 线上正式环境
export const cadRequestUrl = `https://xr.ourbim.com:10088/vjapi` // 线上正式环境
// export const cadRequestUrl = `http://localhost:11088/vjapi` // 线上正式环境
// 新建GIS数据服务
export function addGISLayerServer(params, data) {
  return axios({
    url: `${cadRequestUrl}/appli/addGISLayerServer`,
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
  return axios({
    url: `${cadRequestUrl}/CADFile/updateFileInfo`,
    method: "post",
    data
  });
}

// cad列表
export function getList(params) {
  return axios({
    url: `${cadRequestUrl}/CADFile/getUserAllFile`,
    method: "get",
    params
  });
}

// 删除图纸
export function deleteList(params) {
    return axios({
        url: `${cadRequestUrl}/CADFile/deleteFileById`,
        method: "post",
        params
    });
}

// 下载图纸
export function downLoadCAD(params) {
    return axios({
        url: `${cadRequestUrl}/CADFile/getFileDownloadUrl`,
        method: "get",
        params
    });
}