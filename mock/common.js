const Mock = require('mockjs')
const Random = Mock.Random
let count = 1
Mock.Random.extend({
  phone: function() {
    const phonePrefixs = ['132', '135', '189'] // 自己写前缀哈
    return this.pick(phonePrefixs) + Mock.mock(/\d{8}/)
  }
})
Mock.Random.extend({
  idNo: function() {
    return Random.id()
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
Mock.Random.extend({
  increment: function() {
    return count++ + ''
  }
})
Mock.Random.extend({
  carPlate: function() {
    return '沪' + Random.string('upper', 3) + Random.string('number', 4)
  }
})
Mock.Random.extend({
  vin: function() {
    return 'LSJW' + Random.string('number', 5) + 'PG' + Random.string('number', 6)
  }
})
