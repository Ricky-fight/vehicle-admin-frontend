import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/system/token/',
    method: 'post',
    data
  })
}

export function getInfo(token) {
  return request({
    url: '/system/users/info/',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: '/system/users/logout/',
    method: 'post'
  })
}
