export function statusTagFilter(status) {
  const statusMap = {
    1: 'success',
    0: 'gray',
    2: 'danger'
  }
  return statusMap[status]
}
export function titleFilter(title) {
  const titleMap = {
    create: '新建',
    update: '更新'
  }
  return titleMap[title]
}
export const colorMap = {
  1: '黑',
  2: '白',
  3: '灰'
}
export function colorFilter(color) {
  return colorMap[color]
}

export const statusMap = {
  0: '收车',
  1: '出车'
}
export function vehicleStatusFilter(status) {
  return statusMap[status]
}
export const paymentMap = {
  null: '元',
  'MONTHLY': '元 / 月',
  'WEEKLY': '元 / 周'
}
export function paymentFilter(payment) {
  return paymentMap[payment]
}

export const resultMap = {
  success: {
    icon: 'success',
    title: '提交成功',
    subTitle: '您可返回合同列表或下载合同'
  },
  error: {
    icon: 'error',
    title: '提交失败',
    subTitle: '请尝试重新提交'
  }
}
export function resultFilter(result) {
  return resultMap[result]
}

export const platformMap = {
  'ALL': '不限',
  'DIDI': '滴滴',
  'MEITUAN': '美团',
  'XIANGDAO': '享道',
  'T3': 'T3',
  'AA': 'AA',
  'CAOCAO': '曹操'
}
export function convertMap2Options(map) {
  const options = []
  for (const key in map) {
    options.push({ value: key, label: map[key] })
  }
  return options
}

export function platformFilter(platform) {
  return platformMap[platform]
}

export const contrastStatusMap = {
  'DRAFT': '草稿',
  'ACTIVE': '生效中',
  'TERMINATED': '已终止'
}
export function contrastStatusFilter(status) {
  return contrastStatusMap[status]
}
export const contrastStatusTagTypeMap = {
  'DRAFT': 'gray',
  'ACTIVE': 'success',
  'TERMINATED': 'danger'
}
export function contrastStatusTagType(status) {
  return contrastStatusTagTypeMap[status]
}
export const paymentPeriodMap = {
  'MONTHLY': '月付',
  'WEEKLY': '周付'
}

export function paymentPeriodFilter(paymentPeriod) {
  return paymentPeriodMap[paymentPeriod]
}

export const paymentPeriodOptions = convertMap2Options(paymentPeriodMap)
