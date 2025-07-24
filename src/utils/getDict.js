import { getDictData, getDictDataVj } from '@/api/expenseManage'

export const getDictDataByKey = (key, version = '') => {
  if (version && version == 'vjapi') {
    return new Promise((resolve, reject) => {
      const params = {
        enumName: key,
      }
      getDictDataVj(params).then(res => {
        if (res.code === 0 || res.code === 200) {
          resolve(res.data)
        } else {
          reject()
        }
      })
    })
  } else {
    return new Promise((resolve, reject) => {
      const params = {
        enumName: key,
      }
      getDictData(params).then(res => {
        if (res.code === 200) {
          resolve(res.data)
        } else {
          reject()
        }
      })
    })
  }

}