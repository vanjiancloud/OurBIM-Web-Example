// 导入抽取的axios对象
import request from '../utils/request'
// 导入字符串转换工具
import qsStringify from 'qs-stringify'

const TeamModeApi = {
    getTeamUrl: (params) => {
        return request({
            url: '/OurBim/getTeamUrl',
            method: 'get',
            params
        })
    }
}

export default TeamModeApi