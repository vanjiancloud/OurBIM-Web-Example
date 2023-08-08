import { getDictData } from '@/api/expenseManage'

export const getDictDataByKey = (key) => {
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