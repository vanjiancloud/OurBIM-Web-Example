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
export function setWeather(params, data) {
    return request({
        url: '/weather/setWeatherPostProcess',
        method: 'post',
        params,
        data
    })
}

// 模型背景设置
export function backgroundSetting(params, data) {
    return request({
        url: `/appli/modelBackgroundSetting`,
        method: 'post',
        params,
        data
    })
}

// 设置太阳光、天空光照属性
export function setWeatherSun(params, data) {
    return request({
        url: `/weather/setSunLightIntensityAndColor`,
        method: "post",
        params,
        data
    });
}

// 设置太阳光、天空光照属性
export function setWeatherLight(params) {
    return request({
        url: `/weather/setWeatherLight`,
        method: "post",
        params
    });
}

// 获取环境列表
export function getWeatherList(params) {
    return request({
        url: '/appli/getWeatherList',
        method: 'get',
        params
    })
}

// 获取模型参数化天气信息
export function getWeatherParams(params) {
    return request({
        url: '/weather/getWeatherParams',
        method: 'get',
        params,
    })
}

// 设置天气颜色
export function setWeatherColor(params) {
    return request({
        url: '/OurBim/setWeatherColor',
        method: 'post',
        params,
    })
}

// 设置天气时间、时速
export function setWeatherTimeAndTimeSpeed(params) {
    return request({
        url: '/weather/setWeatherTimeAndTimeSpeed',
        method: 'post',
        params,
    })
}

// 设置天气
export function setWeatherType(params, data) {
    return request({
        url: '/weather/setWeatherType',
        method: 'post',
        params,
        data,
        headers: {
            'Content-Type': 'application/json'
        }
    })
}

// 设置太阳方位
export function setSunLightDirection(params, data) {
    return request({
        url: '/weather/setSunLightDirection',
        method: 'post',
        params,
        data,
        headers: {
            'Content-Type': 'application/json'
        }
    })
}

// 获取当前天气的Id
export function getCurrWeatherId(params) {
    return request({
        url: '/weather/getCurrWeatherId',
        method: 'get',
        params,
    })
}

// 设置风向风速
export function setWindDirectionAndSpeed(params) {
    return request({
        url: '/weather/setWindDirectionAndSpeed',
        method: 'post',
        params,
    })
}