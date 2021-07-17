import * as firebase from "firebase/app";
import "firebase/database";

export const state = () => {
  return {
    comments: [],
    commentCompact: []
  }
}

export const mutations = {
  // SET_COMMENTS(state, comments) {
  //   state.comments = comments
  // },
  // SET_COMMENT_COMPACT(state, comments) {
  //   state.comments = comments
  // },
}

export const actions = {
  // loadDataComments({ commit }, post_id) {
  //   // https://firebase.google.com/docs/reference/js/firebase.database.Reference#key
  //   var that = this;
  //   console.log("====", post_id)
  //   var rootRef = firebase.database().ref("comments/posts/"+post_id);
  //   rootRef.on("value", function(snapshot) {
  //     if(snapshot.val()) {
  //       let comments = Object.values(snapshot.val());
  //       let commentCompact = Object.values(snapshot.val()).slice(-3);
  //       commit('SET_COMMENTS', comments)
  //       commit('SET_COMMENT_COMPACT', commentCompact)
  //     }
  //   }, function (error) {
  //     console.log("Error: " + error.code);
  //   });
  // },
  async createComment({commit}, {data}) {
    const res = {isSuccess: false}
    try {
      const comment = await this.$axios.$post("/api/comment/post", data)
      res.isSuccess = true
    } catch (error) {
    }
    return res
  },
  async deleteComment({commit}, {data}) {
    const res = {isSuccess: false}
    try {
      console.log(data)
      const comment = await this.$axios.$post("/api/comment/post/remove", data)
      res.isSuccess = true
    } catch (error) {
    }
    return res
  },
}

export const getters = {
  getComments(state) {
    return state.comments
  },
  getCommentCompact(state) {
    return state.commentCompact
  }
}
