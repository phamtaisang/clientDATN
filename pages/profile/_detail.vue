<template>
  <div>
    <el-row>
      <el-col :sm="24">
          <el-upload
            ref="upload"
            :auto-upload="false"
            :on-change="handleChange"
            name="images"
            action=""
          >
          <el-avatar :size="50" :src="userInfo.avatar">
          </el-avatar>
        </el-upload>
        <span
          style="position: absolute;
          top: 12px;
          font-weight: bold;
          padding-left: 32px;
          color: #303133;">
          {{ userInfo.name }}

          <!--Todo: user la user dang login-->

          <div style="text-align: left;" v-if="userInfo.id != user.id">
            <span v-if="!userInfo.friendshipInfo || userInfo.friendshipInfo['type'] == 2">
            <el-button type="primary" style="padding:2px; margin-top: 10px;" @click="sendFriend(userInfo.id, userInfo.name, 0)">Thêm bạn</el-button>
            </span>
            <span v-else-if="userInfo.friendshipInfo && userInfo.friendshipInfo['type'] == 0 && userInfo.friendshipInfo.user_one_id == user.id">
              <el-button type="primary" style="padding: -1px;">Đã gửi lời mời kết bạn</el-button>
              <el-button type="danger" style="padding:2px; margin-top: 10px;" @click="sendFriend(userInfo.id, userInfo.name, 1)">Hủy bỏ</el-button>
            </span>
            <span v-else-if="userInfo.friendshipInfo && userInfo.friendshipInfo['type'] == 0 && userInfo.friendshipInfo.user_two_id == user.id">
              <el-button style="padding:2px; margin-top: 10px;" type="danger" @click="sendFriend(userInfo.id, userInfo.name, 1)">từ chối</el-button>
              <el-button style="padding:2px; margin-top: 10px;" type="primary" @click="sendFriend(userInfo.id, userInfo.name, 2)">Đồng ý kết bạn</el-button>
            </span>
            <span v-else-if="userInfo.friendshipInfo && userInfo.friendshipInfo['type'] == 1">
              <el-button style="padding:2px; margin-top: 10px;" type="primary" @click="sendFriend(userInfo.id, userInfo.name, 3)">Bạn bè</el-button>
            </span>
          </div>

        </span>
      </el-col>
      <el-col :sm="24">
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="Dòng thời gian" name="first">
              <ListPostByUser />
          </el-tab-pane>
          <el-tab-pane :label="userInfo.id == user.id ? 'Cài đặt' : 'Thông tin cá nhân'" name="third">
              <el-row>
                <el-col :lg="24" class="text-left" v-if="userInfo.id == user.id">
                    <p class="lable">Họ tên <span style="color:red">*</span></p>
                    <el-input type="text" v-model="userInfo.name" placeholder="Nhập họ tên"></el-input>
                    <p class="lable">Địa chỉ <span style="color:red">*</span></p>
                    <el-input type="text" v-model="userInfo.address" placeholder="Nhập địa chỉ"></el-input>
                    <p class="lable">Số điện thoại <span style="color:red">*</span></p>
                    <el-input type="text" v-model="userInfo.phone" placeholder="Nhập số điện thoại"></el-input>
                    <p class="lable">Giới tính<span style="color:red">*</span></p>
                    <el-radio v-model="radio" label="1">Nam</el-radio>
                    <el-radio v-model="radio" label="2">Nữ</el-radio>
                    <p class="lable">Mô tả về bạn <span style="color:red">*</span></p>
                    <el-input type="textarea" v-model="userInfo.description" placeholder="Nhập mô tả về bạn" style="margin-bottom: 10px;"></el-input>
                    <el-button type="primary" @click="submitForm()">Cập nhật</el-button>
                    <el-button type="danger" @click="logout">Đăng xuất</el-button>
                </el-col>
                <el-col :lg="24" class="text-left" v-if="userInfo.id != user.id">
                    <p>Thông tin</p>
                    <p>Họ tên : {{ userInfo.name }}</p>
                    <p>Địa chỉ :{{ userInfo.address }}</p>
                    <p>Số điện thoại : {{ userInfo.phone }}</p>
                    <p>Mô tả bản thân : {{ userInfo.description }}</p>
                </el-col>
              </el-row>
          </el-tab-pane>
        </el-tabs>
      </el-col>
    </el-row>
  </div>
</template>
<script>

  import ListPostByUser from "../../components/home/post/ListPostByUser";
  import {mapActions, mapGetters} from "vuex";
  import * as firebase from "firebase/app";
  const Cookie = process.client ? require("js-cookie") : undefined;

  export default {
    data() {
      return {
        activeName: 'first',
        userInfo: [],
        radio: '1',
        file_avatar: ""
      };
    },
    components: {
      ListPostByUser
    },
    computed: mapGetters({
      getInfoUser: "user/getUser",
      user: "loggedInUser",
    }),
    watch: {
      getInfoUser(value) {
        this.userInfo = Object.assign({}, value);
        console.log(this.userInfo)
        if (this.userInfo.gender == 1) {
          this.radio = '1'
        }
        else {
          this.radio = '2'
        }
      }
    },
    mounted() {
      this.ActionGetUserById(this.$route.params.detail)
    },
    methods: {
      ...mapActions({
        ActionGetUserById: "user/getUserById",
        editProfile: "user/editProfile"
      }),
      handleClick(tab, event) {
        console.log(tab.index);
      },
      async logout() {
        const messaging = firebase.messaging();
        const token_device =await messaging.requestPermission()
          .then(function(){
            return messaging.getToken();
          })
          .catch(function(err){
            console.log(err)
          })
        console.log(token_device)
        this.$axios.post("/api/delete-user-device")
        Cookie.remove("auth");
        this.$store.commit("setAuth", null);
        this.$auth.setToken('local', null)
        window.location.href = '/'
      },
      handleChange(file) {
        this.file_avatar = file
      },
      async submitForm() {
        let {isSuccess} = await this.editProfile({
          data: {
            name: this.userInfo.name,
            address: this.userInfo.address,
            phone: this.userInfo.phone,
            description: this.userInfo.description,
            gender: this.radio,
            image: this.file_avatar,
          },
        });
        if (isSuccess) {
          this.$message.success("Đã sửa thông tin thành công")
          location.reload()
        }
      },
      // type 0 là gửi kết bạn
      // type 1 là hủy kết bạn
      // type 2 là đồng ý
      async sendFriend(friend_id, name_friend, type) {
        if (type == 0) {
          var sendFriend = await this.$axios.post("/api/friends/send-request", {
            friend_id: friend_id,
          });
          if (sendFriend) {
            this.$message.success("Bạn đã gửi lời mời kết bạn tới "+name_friend)
            location.reload()
          }
        }
        else if (type == 1) {
          var sendFriend = await this.$axios.post("/api/friends/cancel-request", {
            friend_id: friend_id,
          });
          if (sendFriend) {
            this.$message.success("Đã hủy bỏ kết bạn với "+name_friend)
            location.reload()
          }
        }
        else {
          var sendFriend = await this.$axios.post("/api/friends/accept-request", {
            friend_id: friend_id,
          });
          if (sendFriend) {
            this.$message.success("Bạn và "+name_friend+ "đã trở thành bạn bè")
            location.reload()
          }
        }
      }
    }
  };
</script>
