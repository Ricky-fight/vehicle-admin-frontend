import request from '@/utils/request'

export function getDriverList() {
  return request({
    url: 'api/hailing/drivers',
    method: 'get'
  })
}
