<template>
  <el-popover placement="bottom" title="Thông báo" width="200" trigger="click">
    <el-row v-for="(value,index) in trip_member_notification.notifications" :key="index">
      <span v-if="value.type == 1 && value.status == 0">
        <b>{{ value.user.name }}</b> Muốn xin tham gia chuyến du lịch
        <b>{{ value.trip.title }}</b> của bạn
        <p>
          <el-button type="primary" style="padding: 5px; margin: 10px 0;" @click="acceptJoinRequest(value.user.id, value.trip.id)">Chấp nhận</el-button>
          <el-button type="danger" style="padding: 5px;" @click="cancelTrip()">Hủy bỏ</el-button>
        </p>
      </span>
      <span v-if="value.type == 0 && value.status == 0">
        <b>{{ value.trip.user.name }}</b> mời bạn tham gia chuyến du lịch
        <b>{{ value.trip.title }}</b> của bạn ấy
        <p>
          <el-button type="primary" style="padding: 5px; margin: 10px 0;" @click="acceptTrip(value.trip.id)">Chấp nhận</el-button>
          <el-button type="danger" style="padding: 5px;" @click="cancelTrip()">Hủy bỏ</el-button>
        </p>
      </span>

      <span v-if="value.type == 0 && value.status == 1">
        <b>{{ value.user.name }}</b> đã đồng ý yêu cầu chuyến đi
        <b>{{ value.trip.title }}</b> của bạn
      </span>

    </el-row>
    <el-badge :value="trip_member_notification.count_notify_not_seen" class="item" slot="reference">
      <i class="el-icon-map-location"></i>
    </el-badge>
    <a href="#" @click="seeAllNotifications()">Đánh dấu đã xem tất cả </a>
  </el-popover>
</template>
<script>
  import {mapGetters} from "vuex";

  export default {
    props: {
      trip_member_notification: {},
    },
    data() {
      return {
      };
    },
    computed: mapGetters({
      user: "loggedInUser",
    }),
    created() {
      console.log("trip notification = ", this.trip_member_notification)
    },
    methods: {
      seeAllNotifications() {
        this.$axios.get("/api/notification/seen_all_member_notification");
        location.reload()
      },

      // đồng ý lời mời tham gia du lịch
      async acceptTrip(trip_id) {
        await this.$axios.post("/api/trip/invitation/accept", {
          trip_id: trip_id,
        });
        location.reload()
      },

      // đồng ý lời mời người khác tham gia du lịch
      async acceptJoinRequest(friend_id, trip_id) {
        await this.$axios.post("/api/trip/join-request/accept", {
          friend_id: friend_id,
          trip_id: trip_id,
        });
        location.reload()
      },

      cancelTrip() {
        console.log("cancel Friend")
      }
    }
  }
</script>
