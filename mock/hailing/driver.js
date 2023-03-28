const Mock = require('mockjs')
const Random = Mock.Random

Mock.Random.extend({
  phone: function() {
    const phonePrefixs = ['132', '135', '189'] // 自己写前缀哈
    return this.pick(phonePrefixs) + Mock.mock(/\d{8}/)
  }
})
Mock.Random.extend({
  address: function() {
    return Random.county(true) + 'xxxx号xx楼xx室'
  }
})
Mock.Random.extend({
  vehicleLicence: function() {
    return '沪' + Random.string('upper', 3) + Random.string('number', 4)
  }
})
const data = Mock.mock({
  'items|360': [{
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
