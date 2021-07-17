export const state = () => {
  return {
    user: [],
  }
}

export const mutations = {
  SET_USER(state, user) {
    state.user = user
  },
}

export const actions = {
  getUserById({commit}, user_id) {
    this.$axios.get("/api/user/detail-info/" + user_id).then((response) => {
      commit('SET_USER', response.data.user)
    })
  },
  async editProfile({commit}, {data}) {
    const res = {isSuccess: false}
    try {
      let formData = new FormData();
      for (let i in data) {
        if (i === 'image') {
          let images = data[i];
          formData.append('file', images.raw);
        } else {
          formData.append(i, data[i]);
        }
      }
      const user = await this.$axios.post("/api/user/edit/profile", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        }
      })
      res.isSuccess = true
    } catch (error) {
    }
    return res
  }
}

export const getters = {
  getUser(state) {
    return state.user
  }
}
