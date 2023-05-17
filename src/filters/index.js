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

