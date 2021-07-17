export const state = () => {
  return {
    friends: [],
    listTripsByUser: [],
    listTripsInvitations: [],
    listTripsJoining: [],
    trip: [],
    markers: [],
    friendsDetail: [],
  }
}

export const mutations = {

  SET_FRIENDS(state, friends) {
    state.friends = friends
  },

  SET_LIST_TRIPS_BY_USER(state, listTrips) {
    state.listTripsByUser = listTrips
  },

  SET_LIST_TRIPS_INVITATIONS(state, listTrips) {
    state.listTripsInvitations = listTrips
  },

  SET_LIST_TRIPS_JOININGTRIPS(state, listTrips) {
    state.listTripsJoining = listTrips
  },

  SET_DETAIL_TRIPS(state, trip) {
    state.trip = trip
  },

  SET_DETAIL_MARKER(state, markers) {
    state.markers = [...markers, ...state.markers]
  },

  SET_DETAIL_TRIP_FRIENDS(state, friends) {
    state.friendsDetail = friends
  },

  ADD_MARKER(state, marker) {
    state.markers.push(marker)
  },

  DELETE_MARKER(state, marker) {
    state.markers.splice(state.markers.indexOf(marker), 1)
  },

  CLEAR(state) {
    state.markers = []
  }
}

export const actions = {

  async loadListFriends({commit}) {
    await this.$axios.get("/api/trip/get-all-my-friends").then((response) => {
      commit('SET_FRIENDS', response.data.friends)
    })
  },

  async createTrip({commit}, {data}) {
    const res = {isSuccess: false}
    try {
      const trips = await this.$axios.$post("/api/trip/create", data)
      res.isSuccess = true
    } catch (error) {
      console.log(error)
    }
    return res
  },

  async editTrip({commit}, {id, data}) {
    const res = {isSuccess: false}
    try {
      await this.$axios.$post("/api/trip/" + id, data)
      res.isSuccess = true
    } catch (error) {
    }
    return res
  },

  async getListTripsByUser({commit}) {
    await this.$axios.get("/api/trip/list").then((response) => {
      commit('SET_LIST_TRIPS_BY_USER', response.data.listTripByUser)
      commit('SET_LIST_TRIPS_INVITATIONS', response.data.invitations)
      commit('SET_LIST_TRIPS_JOININGTRIPS', response.data.joiningTrips)
    })
  },

  async getDetailTrip({commit, state}, data) {
    return await this.$axios.get("/api/trip/detail_info/" + data.id).then((response) => {
      commit('SET_DETAIL_TRIPS', response.data.trip)
      commit('SET_DETAIL_MARKER', response.data.positions)
      commit('SET_DETAIL_TRIP_FRIENDS', response.data.trip_users)
      // return state.markers
      return response.data;
    })
  },

  async addMarker({commit}, marker) {
    commit('ADD_MARKER', marker)
  },

  async deleteMarker({commit}, data) {
    console.log(data)
    commit('DELETE_MARKER', data.marker)
  },

  async clear({commit}) {
    commit('CLEAR')
  },

  async deleteTrip({commit}, trip_id) {
    const res = {isSuccess: false}
    try {
      await this.$axios.delete("api/trip/delete", trip_id);
      res.isSuccess = true
    } catch (error) {
    }
    return res
  }

}

export const getters = {

  getListFriends(state) {
    return state.friends
  },

  getListTripsByUser(state) {
    return state.listTripsByUser
  },

  getListTripsInvitations(state) {
    return state.listTripsInvitations
  },

  getListTripsJoining(state) {
    return state.listTripsJoining
  },

  getDetailTrip(state) {
    return state.trip
  },

  getListMarker(state) {
    return state.markers
  },

  // danh sách bạn bè đã mời tham gia trong trang detail
  getFriendsDetail(state) {
    return state.friendsDetail
  }

}
