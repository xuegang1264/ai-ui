import request from '../request.js'

export function getStats() {
  return request.get('/home/stats')
}

export function getChartData(params) {
  return request.get('/home/chart', { params })
}
