const Mock = require('mockjs')

const data = Mock.mock({
  'items|205': [{
    id: '@increment',
    licence: '@carPlate',
    'color|1': ['black', 'white', 'gray'],
    vin: '@vin',
    'status|1': ['0', '1'],
    driverName: '@cname',
    'brand|1': ['荣威', '大众', '丰田'],
    'vehicleSeries|1': ['荣威I6', '荣威I6 MAX', '荣威I6 MAX EV', '朗逸'],
    registerDate: '@date',
    inspectionExpired: '@date(yyyy-MM)'
  }]
})

const seriesData = [
  {
    value: '荣威',
    label: '荣威',
    children: [
      { value: '2121321', label: '荣威I6' },
      { value: '1828173', label: '荣威I6 MAX' },
      { value: '1298173', label: '荣威I6 MAX EV' }
    ]
  },
  {
    value: '大众',
    label: '大众',
    children: [
      { value: '1821173', label: '朗逸' }
    ]
  },
  {
    value: '丰田',
    label: '丰田',
    children: [
      { value: '1276761', label: '雷凌' }
    ]
  }
]
// console.log(data)
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
  },
  {
    url: '/api/hailing/vehicle-series',
    type: 'get',
    response: config => {
      const items = seriesData
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
