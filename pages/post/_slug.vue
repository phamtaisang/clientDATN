<template>
  <div>
    <el-page-header @back="goBack" :content="post.title">
    </el-page-header>
    <div  v-if="typeof post.trip !== 'undefined' && post.trip !== null">
      <el-button type="primary" style="float: left;margin-top: 17px;" @click="joinRequest(post.trip.id)">Xin tham gia chuyến đi</el-button>
      <NuxtLink :to="'/map/trip-detail/'+post.trip.id">
        <el-button type="info" style="float: left;margin: 17px;">Xem bản đồ</el-button>
      </NuxtLink>
      <p style="clear: both; text-align: left">
        {{ post.trip.title }}
        bắt đầu từ {{ post.trip.time_start }} đến ngày  {{ post.trip.time_end }}
      </p>
    </div>
    <div v-else style="text-align: left">
      Bạn chưa tạo lịch trình cho bài đăng này  !!
      <el-button type="text" @click="createTrip(post.id)">Tạo ngay</el-button>
    </div>
  <p style="line-height: 35px; text-align: justify">
    <span v-html="post.description"></span>
  </p>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        post: []
      }
    },

    async created() {
      let id_post = this.$route.query.slug;
      let post_detail = await this.$axios.get("/api/post/detail/"+id_post);
      this.post = post_detail.data.data
    },
    methods: {
      goBack() {
        this.$router.push('/')
      },
      async createTrip(post_id) {
        this.$router.push({ path: '/map/trips', query: { post_id: post_id } })
      },
      //xin tham gia chuyen di
      async joinRequest(trip_id) {
        await this.$axios.post("/api/trip/join-request/create", {
          trip_id: trip_id,
        });
        // location.reload()
      },
    }
  }
</script>
