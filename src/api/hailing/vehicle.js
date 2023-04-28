import request from '@/utils/request'

export function getVehicleList(params) {
  return request({
    url: '/hailing/vehicles/',
    method: 'get',
    params
  })
}

export function getVehicleSeriesOptions() {
  return request({
    url: '/hailing/vehicle/types/',
    method: 'get'
  })
}
export function updateVehicle(id, data) {
  return request({
    url: `/hailing/vehicles/${id}`,
    method: 'post',
    data: data
  })
}
