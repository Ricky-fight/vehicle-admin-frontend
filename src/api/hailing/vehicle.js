import request from '@/utils/request'

export function getVehicleList(params) {
  return request({
    url: '/api/hailing/vehicles',
    method: 'get',
    params
  })
}

export function getVehicleSeriesOptions() {
  return request({
    url: '/api/hailing/vehicle-series',
    method: 'get'
  })
}
export function updateVehicle(id, data) {
  return request({
    url: `/api/hailing/vehicles/${id}`,
    method: 'post',
    data: data
  })
}
