import request from '@/utils/request'

export function getVehicleList(params) {
  return request({
    url: '/vue-admin-template/table/list',
    method: 'get',
    params
  })
}
