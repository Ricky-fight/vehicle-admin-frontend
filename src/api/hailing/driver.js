import request from '@/utils/request'

export function getDriverList(params) {
  return request({
    url: 'hailing/drivers/',
    method: 'get',
    params
  })
}
export function createDriver(data) {
  return request({
    url: 'hailing/drivers/',
    method: 'post',
    data: data
  })
}

export function updateDriver(id, data) {
  return request({
    url: `hailing/drivers/${id}/`,
    method: 'put',
    data: data
  })
}

export function deleteDriver(id) {
  return request({
    url: `hailing/drivers/${id}/`,
    method: 'delete',
  })
}
