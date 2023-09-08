// 天气
import request from '@/utils/newRequest.js'

// 获取天气后置处理设置参数
export function getWeather(params) {
    return request({
        url: '/weather/getWeatherPostProcess',
        method: 'get',
        params
    })
}

// 获取天气后置处理设置参数
export function setWeather(params,data) {
    return request({
        url: '/weather/setWeatherPostProcess',
        method: 'post',
        params,
        data
    })
}

