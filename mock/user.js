
const tokens = {
  admin: {
    access: 'admin-token',
    refresh: 'refresh-token'
  },
  editor: {
    access: 'editor-token',
    refresh: 'refresh-token'
  }
}

const users = {
  'admin-token': {
    groups: ['admin'],
    introduction: 'I am a super administrator',
    avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
    name: 'Super Admin'
  },
  'editor-token': {
    groups: ['editor'],
    introduction: 'I am an editor',
    avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
    name: 'Normal Editor'
  }
}

module.exports = [
  // user login
  {
    url: '/system/token',
    type: 'post',
    response: config => {
      const { username } = config.body
      const token = tokens[username]

      // mock error
      if (!token) {
        return {
          code: 6204,
          message: 'Account and password are incorrect.'
        }
      }

      return {
        code: 2000,
        data: token
      }
    }
  },

  // get user info
  {
    url: '/system/users/info',
    type: 'get',
    response: config => {
      const { token } = config.query
      const info = users[token]

      // mock error
      if (!info) {
        return {
          code: 5008,
          message: 'Login failed, unable to get user details.'
        }
      }

      return {
        code: 2000,
        data: info
      }
    }
  },

  // user logout
  {
    url: '/vue-admin-template/user/logout',
    type: 'post',
    response: _ => {
      return {
        code: 2000,
        data: 'success'
      }
    }
  }
]
