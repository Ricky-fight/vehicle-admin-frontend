

const TokenKey = 'access'
const RefreshKey = 'refresh'

export function getToken() {
  return localStorage.getItem(TokenKey)
}

export function setToken(token) {
  return localStorage.setItem(TokenKey, token)
}

export function removeToken() {
  return localStorage.removeItem(TokenKey)
}
export function getRefresh() {
  return localStorage.getItem(RefreshKey)
}

export function setRefresh(refresh) {
  return localStorage.setItem(RefreshKey, refresh)
}

export function removeRefresh() {
  return localStorage.removeItem(RefreshKey)
}
