import { asyncRoutes, constantRoutes } from '@/router'

/**
 * Use meta.role to determine if the current user has permission
 * @param groups
 * @param route
 */
function hasPermission(groups, route) {
  if (route.meta && route.meta.groups) {
    return groups.some(group => route.meta.groups.includes(group))
  } else {
    return true
  }
}

/**
 * Filter asynchronous routing tables by recursion
 * @param routes asyncRoutes
 * @param roles
 */
export function filterAsyncRoutes(routes, groups) {
  const res = []

  routes.forEach(route => {
    const tmp = { ...route }
    if (hasPermission(groups, tmp)) {
      if (tmp.children) {
        tmp.children = filterAsyncRoutes(tmp.children, groups)
      }
      res.push(tmp)
    }
  })

  return res
}

const state = {
  routes: [],
  addRoutes: []
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes
    state.routes = constantRoutes.concat(routes)
  }
}

const actions = {
  generateRoutes({ commit }, groups) {
    return new Promise(resolve => {
      let accessedRoutes
      if (groups.includes('admin')) {
        accessedRoutes = asyncRoutes || []
      } else {
        accessedRoutes = filterAsyncRoutes(asyncRoutes, groups)
      }
      commit('SET_ROUTES', accessedRoutes)
      resolve(accessedRoutes)
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
