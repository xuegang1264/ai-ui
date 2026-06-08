// 地图大屏相关 API
// 接入时根据实际后端地址调整

import request from './request.js'

// 墒情设备数据
export function ploughingStation(params) {
  return request.post('/resource/api/moisture-analysis/overview/ploughingStation', params, {
    headers: { 'x-license-token': '89761ac5e9bea57ba255bd529346ddef' },
  })
}

// 今日墒情
export function moistureContentToday(params) {
  return request.post('/resource/api/moisture-analysis/overview/moistureContentToday', params)
}

// 墒情近七天数据
export function moistureWeekTrend(params) {
  return request.post('/resource/api/moisture-analysis/overview/moistureWeekTrend', params, {
    headers: { 'x-license-token': '89761ac5e9bea57ba255bd529346ddef' },
  })
}

// 分页获取墒情统计（用于墒情统计表）
export function pageSoilMoisture(params) {
  return request.post('/resource/api/moisture-analysis/pageSoilMoisture', params)
}

// 根据adcode 查询农服中心选择的街道
export function townCoordinates(params) {
  return request.get('/aiScreen/townCoordinates', { params })
}

export function pointDetail(params) {
  return request.get('/aiScreen/pointDetail', { params })
}

// 根据adcode 查询农服中心选择的街道
export function newTownCoordinates(params) {
  return request.get('/aiScreen/newTownCoordinates', { params })
}

// 根据adcode 查询农服中心选择的街道
export function villageCoordinates(params) {
  return request.get('/aiScreen/villageCoordinates', { params })
}

// 植保站/虫情 接口
export function portalLogin(
  params,
  initialToken = import.meta.env.VITE_APP_CHONGQING_PLANT_PROTECT_TOKEN || '',
  timeout,
) {
  const formData = new URLSearchParams()
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== '') formData.append(k, v)
  })

  const headers = {
    'Content-Type': 'application/x-www-form-urlencoded',
  }
  if (initialToken) headers.token = initialToken

  return request.post('/adp/portal/login', formData, { headers, timeout })
}

export function plantProtectionStation(params) {
  return request.post('/adp/provinceInsect/listDevicePositionBySourceAndType', params)
}

export function listDevicePositionBySourceAndType(params) {
  return request.post('https://jsiot.jssny.com.cn/adp/provinceInsect/listDevicePositionBySourceAndType', params)
}

export function getServiceCenterPoints(params) {
  return request.get('https://pukoushanbei.nxzhnyyjy.com:9082/production/aiScreen/pointDetail', { params })
}

// // 根据组织查询机场列表
// export function airportListByOrg(params) {
//   return request.post('/agent-screen/screen_uav/airport_list_by_org', params)
// }

// 获取设备监测详情（formData，参数 sn）
export function getDeviceMonitorDetail(params) {
  const formData = new FormData()
  Object.entries(params).forEach(([k, v]) => formData.append(k, v))
  return request.post('/adp/provinceInsect/getDeviceMonitorDetail', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
}
