import request from '@/utils/request'

export function getDriverList() {
  return request({
    url: 'hailing/drivers/',
    method: 'get'
  })
}
