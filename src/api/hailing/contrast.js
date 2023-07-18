import request from '@/utils/request'

export function submitContrast(data) {
  return request({
    url: 'hailing/contrasts/',
    method: 'post',
    data: data
  })
}

export function getContrastList(params) {
  return request({
    url: 'hailing/contrasts/',
    method: 'get',
    params
  })
}
