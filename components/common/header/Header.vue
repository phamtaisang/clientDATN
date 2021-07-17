<template>
  <el-container class="header">
    <el-header :lg="12">
      <el-row :gutter="10">
        <el-col :lg="1" :sm="12" :xs="12" class="logo">
          <Logo/>
        </el-col>
        <el-col :lg="5">
          <form class="search" action="/search/friends">
          <el-input placeholder="Tìm kiếm bạn bè" v-model="input1" name="txt_search">
            <i slot="prefix" class="el-input__icon el-icon-search"></i>
          </el-input>
          </form>
        </el-col>
        <el-col :lg="12" class="footer-mobile">
          <el-menu
            :default-active="activeIndex"
            class="el-menu-demo"
            mode="horizontal"
            @select="handleSelect"
          >
            <el-menu-item index="1"><NuxtLink to="/"><i class="el-icon-house"></i></NuxtLink></el-menu-item>
            <el-menu-item index="2"><NuxtLink to="/map/list-trips"><i class="el-icon-date"></i></NuxtLink></el-menu-item>
            <el-menu-item index="3"
            >
              <NuxtLink to="/map/trips">
                <i class="el-icon-location-information"></i>
              </NuxtLink>
            </el-menu-item>
            <el-menu-item index="4"
            >
              <NuxtLink :to="'/profile/'+user.id"><i class="el-icon-user"></i></NuxtLink>
            </el-menu-item>
          </el-menu>
          <div class="line"></div>
        </el-col>
        <el-col :lg="6" :sm="12" :xs="12" class="icon-right">
          <div class="icon-top">
            <FriendNotification :friend_notifications="friend_notifications" />
            <TripNotification :trip_member_notification="trip_member_notification" />
            <OtherNotification :other_notification="other_notification" />
            <el-badge class="item">
              <i @click="drawer = true" class="el-icon-s-operation"></i>
            </el-badge>
          </div>
        </el-col>
      </el-row>
    </el-header>
  </el-container>
</template>
<script>
  import TripNotification from "./notification/Trip";
  import OtherNotification from "./notification/Notification";
  import FriendNotification from "./notification/Friend";
  import Logo from "../../Logo";
  import {mapGetters} from "vuex";
  import * as firebase from 'firebase/app';
  import 'firebase/messaging'
  export default {
    data() {
      return {
        drawer: false,
        activeIndex: "1",
        input1: "",
        friend_notifications: {},
        other_notification: {},
        trip_member_notification: {}
      };
    },
    computed: {
      ...mapGetters({user: "loggedInUser"}),
    },
    async mounted() {
      const messaging = firebase.messaging();
      const token_device =await messaging.requestPermission()
        .then(function(){
          return messaging.getToken();
        })
        .catch(function(err){
          console.log(err)
        })
      console.log(token_device)
      this.$axios.post("/api/create-user-device", {
        device_token: token_device,
      });
      messaging.onMessage(function(payload) {
        const title = 'Hello world';
        const options = {
          body: payload.data.status
        };
        return self.registration.showNotification(title, options);
      })
      this.fetchApiNotifications()
      // setInterval(this.fetchApiNotifications, 5000)
    },
    destroy() {
      clearInterval(this.fetchApiNotifications)
    },
    components: {
      TripNotification,
      OtherNotification,
      FriendNotification,
      Logo,
    },

    methods: {
      handleSelect(key, keyPath) {
        if (key == 1) {
          this.$router.push("/");
        }
      },
      async fetchApiNotifications() {
          let notifications = await this.$axios.get("/api/notification/get-all");
        console.log(notifications)
          this.friend_notifications = notifications.data.friend_notifications
          this.other_notification = notifications.data.other_notification
          this.trip_member_notification = notifications.data.trip_member_notification
      }
    },
  };
</script>
<style>
  .el-badge__content.is-fixed {
    top: 18px;
  }

  .el-avatar {
    margin-top: 7px;
  }

  .icon-right {
    text-align: right;
  }
</style>
