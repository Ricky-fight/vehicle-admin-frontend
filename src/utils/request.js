import axios from 'axios'
import { MessageBox, Message } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'

// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 5000 // request timeout
})

// request interceptor
service.interceptors.request.use(
  config => {
    // do something before request is sent
    config.headers['Content-Type'] = 'application/json'
    config.headers['Authorization'] = 'Bearer ' + getToken()
    // console.log('Auth configured')
    return config
  },
  error => {
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
  */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  response => {
    const res = response.data
    if (!res) return res
    switch (res.code) {
      case 2000:
        return res
      case 4030:
      case 5008:
      case 5012:
      case 5014:
        MessageBox.confirm('You have been logged out, you can cancel to stay on this page, or log in again', 'Confirm logout', {
          confirmButtonText: 'Re-Login',
          cancelButtonText: 'Cancel',
          type: 'warning'
        }).then(() => {
          store.dispatch('user/resetToken').then(() => {
            location.reload()
          })
        })
        break
      case 4000: // bad request
        for (const error in res.errors) {
          for (const message in res.errors[error]) {
            Message.error(message)
          }
        }
        return Promise.reject(new Error('请求失败：参数错误'))
      case 4050:
        return Promise.reject(new Error('服务器不支持该接口'))
    }
    return res
    // if the custom code is not 20000, it is judged as an error.
    // if (res.code && res.code !== 2000) {
    //   // 50008: Illegal token; 50012: Other clients logged in; 50014: Token expired;
    //   if (res.code === 5008 || res.code === 5012 || res.code === 5014) {
    //     // to re-login
    //     MessageBox.confirm('You have been logged out, you can cancel to stay on this page, or log in again', 'Confirm logout', {
    //       confirmButtonText: 'Re-Login',
    //       cancelButtonText: 'Cancel',
    //       type: 'warning'
    //     }).then(() => {
    //       store.dispatch('user/resetToken').then(() => {
    //         location.reload()
    //       })
    //     })
    //   }
    //   // return Promise.reject(new Error(res.message || 'Error'))
    //   return res
    // } else {
    //   return res
    // }
  },
  error => {
    console.log('err' + error) // for debug
    Message({
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default service
