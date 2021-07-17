<template>
  <el-popover placement="bottom" title="Thông báo" width="200" trigger="click">
    <el-row v-for="(friend,index) in friend_notifications.notifications" :key="index" style="padding: 10px 0;">
      <el-col v-if="friend.type == 0 && friend.user_two_id == user.id">
        <NuxtLink :to="'/profile/'+friend.user_one_id">
          <b>{{ friend.user_one.name }}</b>
          Đã gửi lời mời kết bạn
        </NuxtLink>
        <p>
          <el-button type="primary" style="padding: 5px; margin: 10px 0;" @click="addFriend(friend.user_one_id)">Chấp nhận</el-button>
          <el-button type="danger" style="padding: 5px;" @click="cancelFriend()">Hủy bỏ</el-button>
        </p>
      </el-col>
      <el-col v-if="friend.type == 1 && friend.user_one_id == user.id">
        <NuxtLink :to="'/profile/'+friend.user_two_id">
          <b>{{ friend.user_two.name }}</b>
          Đã đồng ý kết bạn
        </NuxtLink>
      </el-col>
    </el-row>
    <el-badge :value="friend_notifications.count_notify_not_seen" class="item" slot="reference">
      <i class="el-icon-user"></i>
    </el-badge>
    <a href="#" @click="seeAllNotifications()">Đánh dấu đã xem tất cả </a>
  </el-popover>
</template>
<script>
  import {mapGetters} from "vuex";

  export default {
    props: {
      friend_notifications: {},
    },
    data() {
      return {
      };
    },
    computed: mapGetters({
      user: "loggedInUser",
    }),
    created() {
      console.log("hihi = ", this.friend_notifications)
    },
    methods: {
      seeAllNotifications() {
        this.$axios.get("/api/notification/seen_all_friend_notification");
        location.reload()
      },
      async addFriend(friend_id) {
        var sendFriend = await this.$axios.post("/api/friends/accept-request", {
          friend_id: friend_id,
        });
        location.reload()
      },
      cancelFriend() {
        console.log("cancel Friend")
      }
    }
  }
</script>
