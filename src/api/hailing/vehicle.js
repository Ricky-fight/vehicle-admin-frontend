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
    url: '/hailing/vehicle/type/options/',
    method: 'get'
  })
}
export function updateVehicle(id, data) {
  return request({
    url: `/hailing/vehicles/${id}/`,
    method: 'put',
    data: data
  })
}
export function deleteVehicle(id) {
  return request({
    url: `/hailing/vehicles/${id}/`,
    method: 'delete'
  })
}
export function createVehicle(data) {
  // const certificate = { registerDate: data.registerDate, inspectionDate: data.inspectionDate }
  // data.certificate = certificate
  // delete data.registerDate
  // delete data.inspectionDate
  return request({
    url: `/hailing/vehicles/`,
    method: 'post',
    data: data
  })
}

export function createVehicleType(data) {
  return request({
    url: `/hailing/vehicle/types/`,
    method: 'post',
    data: data
  })
}

