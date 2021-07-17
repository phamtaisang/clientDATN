const cookieparser = process.server ? require('cookieparser') : undefined

export const state = () => {
  return {
    auth: null,
  }
}
export const mutations = {
  setAuth(state, auth) {
    state.auth = auth
  },
  SET_TOKEN(state, token) {
    state.token = token
  }
}
export const actions = {
  nuxtServerInit({commit}, {$axios, req}) {
    let auth = null
    if (req.headers.cookie) {
      const parsed = cookieparser.parse(req.headers.cookie)
      try {
        auth = JSON.parse(parsed.auth)
      } catch (err) {
        // No valid cookie found
      }
    }
    commit('setAuth', auth)

  }
}

export const getters = {
  loggedInUser(state) {
    return state.auth.user
  }
};
