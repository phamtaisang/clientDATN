export const state = () => {
  return {
    posts: [],
    post: {},
    users: [],
    post_by_user: [],
    onFormPost: false,
  }
}

export const mutations = {
  SET_PORTS(state, posts) {
    state.posts = posts
  },

  SET_POST(state, post) {
    state.post = post
    state.onFormPost = true
  },

  SET_POST_BY_USER(state, post) {
    state.post_by_user = post
  },

  SET_USERS(state, users) {
    state.users = users
  },

  SET_ON_FORM_POST(state) {
    state.onFormPost = !state.onFormPost
  },

  SET_EMPTY_FORM_POST(state) {
    state.post = {
      isCreate: true
    }
  },

  ADD_POSTS(state, post) {
    state.posts.unshift(post)
  },

  UPDATE_POSTS(state, post_id, post) {
    let index = state.posts.findIndex(post => post.id == post_id)
    state.posts[index] = post;
  },

  DELETE_POST(state, post_id) {
    let index = state.posts.findIndex(post => post.id == post_id)
    state.posts.splice(index, 1)
  },

  UPDATE_LIKE(state, post_id, user_id) {
    let index = state.posts.findIndex(post => post.id == post_id)
    console.log("index = ", index)
    state.posts[index].be_liked = !state.posts[index].be_liked;
    // note : Chưa cập nhật lại like trong state
  },
}
export const actions = {
  onFormPost({commit}) {
    commit('SET_ON_FORM_POST');
  },

  emptyForm({commit}) {
    commit('SET_EMPTY_FORM_POST');
  },

  loadData({commit}) {
    this.$axios.get("/api/home").then((response) => {
      commit('SET_PORTS', response.data.posts)
      commit('SET_USERS', response.data.users)
    })
  },

  async createPost({commit}, {data}) {
    const res = {isSuccess: false}
    try {
      let formData = new FormData();
      for (let i in data) {
        if (i === 'images') {
          let images = data[i];
          for (let j in images) {
            formData.append('photos[]', images[j].raw);
          }
        } else {
          formData.append(i, data[i]);
        }
      }
      const posts = await this.$axios.post("/api/post/create", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        }
      })
      commit('ADD_POSTS', posts.data.data)
      res.isSuccess = true
    } catch (error) {
    }
    return res
  },

  async editPost({commit}, {id, data}) {
    const res = {isSuccess: false}
    try {
      let formData = new FormData();
      for (let i in data) {
        if (i === 'images') {
          let images = data[i];
          for (let j in images) {
            formData.append('photos[]', images[j].raw);
          }
        } else {
          formData.append(i, data[i]);
        }
      }
      const posts = await this.$axios.post("/api/post/update/" + id, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        }
      })
      commit('UPDATE_POSTS', id, posts.data.data)
      res.isSuccess = true
    } catch (error) {
    }
    return res
  },

  async deletePost({commit}, post_id) {
    const res = {isSuccess: false}
    try {
      const posts = await this.$axios.delete("/api/post/delete/" + post_id);
      res.isSuccess = true
    } catch (error) {
    }
    commit('DELETE_POST', post_id)
    return res
  },

  getPostById({commit}, post_id) {
    this.$axios.get("/api/post/detail/" + post_id).then((response) => {
      commit('SET_POST', response.data.data)
    })
  },

  getPostByUser({commit}, user_id) {
    this.$axios.get("/api/post/by-user/" + user_id).then((response) => {
      commit('SET_POST_BY_USER', response.data.data)
    })
  },

  async likeAction({commit}, {user_id, data}) {
    try {
      await this.$axios.post("/api/like", data).then((response) => {
        commit('UPDATE_LIKE', data.post_id, user_id)
      });
    } catch (error) {
    }
  }

}

export const getters = {

  onFormPost(state) {
    return state.onFormPost
  },

  getPosts(state) {
    return state.posts
  },

  getPost(state) {
    return state.post
  },

  getPostByUser(state) {
    return state.post_by_user
  },

  getUsers(state) {
    return state.users
  }

}
