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
  black: '黑',
  white: '白',
  gray: '灰'
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
  '0': '元/月',
  '1': '元/周'
}
export function paymentFilter(payment) {
  return paymentMap[payment]
}
