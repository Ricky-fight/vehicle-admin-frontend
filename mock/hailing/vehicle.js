const Mock = require('mockjs')
const Random = require('mockjs/src/mock/random')

const data = Mock.mock({
  'items|205': [{
    licence: '沪' + Random.string('upper', 3) + Random.string('number',4),
    color: '@sentence(10, 20)',
    vin: 'LSJW' + Random.string('number', 5) + 'PG' + Random.string('number', 6),
    'status|1': ['published', 'draft', 'deleted']
  }]
})

module.exports = [
  {
    url: '/api/hailing/vehicles',
    type: 'get',
    response: config => {
      const items = data.items
      return {
        code: 2000,
        data: {
          total: items.length,
          items: items
        }
      }
    }
  }
]
