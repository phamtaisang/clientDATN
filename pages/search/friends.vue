<template>
  <el-container>
    <el-row>
      <el-col class="item-friend" :sm="24" v-for="user in userResult['friends']" :key="user.id">
        <NuxtLink :to="'/profile/'+user.id">
          <el-avatar
            :size="60"
            :src="user.avatar"
          ></el-avatar>
        </NuxtLink>
        <span class="box-botton-friend">
            <NuxtLink :to="'/profile/'+user.id" class="name">{{ user.name }}</NuxtLink>
            <el-button type="primary">Bạn bè</el-button>
          </span>
      </el-col>
      <el-col class="item-friend" :sm="24" v-for="user in userResult['users']" :key="user.id">
        <NuxtLink :to="'/profile/'+user.id">
          <el-avatar
            :size="60"
            :src="user.avatar"
          ></el-avatar>
        </NuxtLink>
        <span class="box-botton-friend">
            <NuxtLink :to="'/profile/'+user.id" class="name">{{ user.name }}</NuxtLink>
            <el-button type="primary" @click="sendFriend(user.id, user.name, 0)">Thêm bạn</el-button>
        </span>
      </el-col>
      <el-col class="item-friend" :sm="24" v-for="user in userResult['user_receive_request']" :key="user.id">
        <NuxtLink :to="'/profile/'+user.id">
          <el-avatar
            :size="60"
            :src="user.avatar"
          ></el-avatar>
        </NuxtLink>
        <span class="box-botton-friend">
            <NuxtLink :to="'/profile/'+user.id" class="name">{{ user.name }}</NuxtLink>
            <el-button type="primary" @click="sendFriend(user.id, user.name, 1)">Đã gửi lời mời kết bạn</el-button>
        </span>
      </el-col>
      <el-col class="item-friend" :sm="24" v-for="user in userResult['user_sent_request']" :key="user.id">
        <NuxtLink :to="'/profile/'+user.id">
          <el-avatar
            :size="60"
            :src="user.avatar"
          ></el-avatar>
        </NuxtLink>
        <span class="box-botton-friend">
            <NuxtLink :to="'/profile/'+user.id" class="name">{{ user.name }}</NuxtLink>
            <el-button type="primary" @click="sendFriend(user.id, user.name, 2)">Đồng ý</el-button>
        </span>
      </el-col>
    </el-row>
  </el-container>
</template>

<script>
  export default {
    data() {
      return {
        userResult: [],
      };
    },
    async mounted() {
      var Result = await this.$axios.post("/api/search/friend", {
        search_text: this.$route.query.txt_search,
      });
      this.userResult = Result.data
    },
    methods: {
      // type 0 là gửi kết bạn
      // type 1 là hủy kết bạn
      // type 2 là đồng ý
      async sendFriend(friend_id, name_friend, type) {
        if (type == 0) {
          var sendFriend = await this.$axios.post("/api/friends/send-request", {
            friend_id: friend_id,
          });
          if (sendFriend) {
            this.$message.success("Bạn đã gửi lời mời kết bạn tới " + name_friend)
            location.reload()
          }
        } else if (type == 1) {
          var sendFriend = await this.$axios.post("/api/friends/cancel-request", {
            friend_id: friend_id,
          });
          if (sendFriend) {
            this.$message.success("Đã hủy bỏ kết bạn với " + name_friend)
            location.reload()
          }
        } else {
          var sendFriend = await this.$axios.post("/api/friends/accept-request", {
            friend_id: friend_id,
          });
          if (sendFriend) {
            this.$message.success("Bạn và " + name_friend + "đã trở thành bạn bè")
            location.reload()
          }
        }
      }
    }
  }
</script>
<style>
  .item-friend {
    text-align: left
  }

  .item-friend a.name {
    display: block;
  }

  .item-friend button {
    padding: 2px;
    margin: 10px 0;
  }

  .item-friend span {
    display: inline-block;
  }

  span.box-botton-friend {
    transform: translateY(-15px);
  }
</style>
