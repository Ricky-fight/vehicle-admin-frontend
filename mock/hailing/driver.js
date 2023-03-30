const Mock = require('mockjs')

const data = Mock.mock({
  'items|360': [{
    id: '@increment',
    identificationNo: '@idNo',
    name: '@cname',
    phone1: '@phone',
    phone2: '@phone',
    emergencyPhone: '@phone',
    address: '@address',
    registerDate: '@date',
    vehicle: {
      licence: '@vehicleLicence',
      'vehicleSeries|1': ['荣威-荣威I6', '荣威-荣威I6 MAX', '荣威-荣威I6 MAX EV', '大众-朗逸']
    }
  }]
})
// console.log(data)
module.exports = [
  {
    url: '/api/hailing/drivers',
    type: 'get',
    response: config => {
      const items = data.items
      return {
        code: 20000,
        data: {
          total: items.length,
          items: items
        }
      }
    }
  }]
