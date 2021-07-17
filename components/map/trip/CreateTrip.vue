<template>
    <div class="create-planning">
      <p class="lable-form">Tên chuyến đi <span style="color:red">*</span></p>
      <el-input v-model="title_trip"></el-input>
      <p class="lable-form">Thời gian <span style="color:red">*</span></p>
      <el-date-picker
        v-model="date_trip"
        type="daterange"
        format="dd/MM/yyyy"
        value-format="dd/MM/yyyy"
        start-placeholder="Bắt đầu"
        end-placeholder="Kết thúc">
      </el-date-picker>
      <p class="lable-form" style="padding-bottom: 10px;">Danh sách các địa điểm cần đến <span style="color:red">*</span></p>
      <span style="color:red; font-size:12px;"> Click ô tìm kiếm địa chỉ ở trên <i class="el-icon-thumb"></i> và thao tác click trên map !</span>
      <el-timeline :reverse="reverse" color="#0bbd87" class="list-planning">
        <p class="title-list"><i class="el-icon-date"></i> Danh sách hành trình </p>
        <el-timeline-item
          v-for="(location, index) in locations"
          :key="index"
          v-if="location.my_location== null"
        >
          <!--create marker-->
          <CreateMarker :location="location" :showFormMarker="visible" @markerDataSubmit="markerDataUpdateSubmit($event)" @markerDataLoadPage="markerDataUpdateLoadPage($event)" @delete="deleteMarker($event)" />
          <p style="color:orangered;"><i class="el-icon-info"></i> Thông tin </p>
          <p>
            <i class="el-icon-edit-outline"></i>
            Ghi chú : {{ markerDataArray[index]!= null ? markerDataArray[index].note : trip_id ? location.note : 'chưa cập nhập ' }}
          </p>

          <p><i class="el-icon-time"></i> Thời gian tới dự kiếm :{{ markerDataArray[index]!= null ? markerDataArray[index].time_start : location.time_start_marker }}</p>
          <p><i class="el-icon-time"></i> Thời gian dời đi dự kiếm : {{ markerDataArray[index] != null ? markerDataArray[index].time_end  : location.time_end_marker }}</p>
          <div class="info">
            <p style="color:orangered;"><i class="el-icon-place"></i> Điểm đến tiếp theo </p>
            <p v-if="location.distance"> * Quãng đường : {{ location.distance.text == null ? 'chưa xác định' : location.distance.text }} </p>
            <p v-if="location.duration"> * Thời gian : {{ location.duration.text == null ? 'chưa xác định' : location.duration.text }} </p>
          </div>
        </el-timeline-item>
      </el-timeline>

      <p class="lable-form" style="padding-bottom: 10px;">Mời bạn bè tham gia</p>
      <div class="friend">
        <el-tag v-for="(friend, index) in friends" :key="index"
          closable  @close="handleClose(friend)">
            {{friend.value }}
        </el-tag>

        <el-autocomplete
          class="inline-input"
          v-model="friend"
          :fetch-suggestions="querySearchFriend"
          placeholder="Tìm kiếm bạn bè"
          @select="handleSelectFriend"
        ></el-autocomplete>
      </div>
      <el-button v-if="trip_id == null" type="success" plain style="margin-top:15px;width: 100%;" @click="submitCreateTrip">  Tạo mới </el-button>
      <el-button v-else-if="detailTrip && detailTrip.author_id == user.id" type="success" plain style="margin-top:15px;width: 100%;" @click="submitCreateTrip">Cập nhật</el-button>
      <el-button v-else type="primary" plain style="margin-top:15px;width: 100%;" @click="joinRequest(trip_id)">  {{ txt_join_request }} </el-button>
    </div>
</template>

<script>
    import CreateMarker from "./CreateMarker";
    import { mapActions, mapGetters } from "vuex";
    export default {

      components: {
        CreateMarker,
      },

      props: {
        locations: Array,
        trip_id: null,
        detailTrip: null
      },

      data() {
        return {
            visible: false,
            title_trip: "",
            date_trip: [],
            reverse: false,
            friend: '',
            friends: [],
            markerDataArray: [],
            test: [],
            links: [],
            txt_join_request: "Gửi yêu cầu xin tham gia"
          };
      },

      created() {
        this.$store.dispatch("map/loadListFriends");
        this.links = this.loadAllFriends();
        // edit . . .
        if (this.detailTrip) {
          for (let i = 0; i< this.detailTrip.trip_users.length; i++) {
            console.log(this.detailTrip.trip_users[i].name)
            this.friends.push(
              { "value": this.detailTrip.trip_users[i].name, id: this.detailTrip.trip_users[i].id }
            )
          }
          this.title_trip = this.detailTrip.trip.title
          this.date_trip[0] = this.detailTrip.trip.time_start
          this.date_trip[1] = this.detailTrip.trip.time_end
        }
      },

      computed: mapGetters({
        getFriends: "map/getListFriends",
        user :"loggedInUser",
      }),

      watch: {
        async getFriends() {
          this.links = this.loadAllFriends();
        },
        async locations(value) {

        },
        async markerDataArray(value) {
          this.markerDataArray = value
        }
      },

      methods: {
        ...mapActions({
          add: "map/createTrip",
          edit: "map/editTrip",
        }),

        async submitCreateTrip() {
          try {
            if (this.trip_id == null && this.detailTrip == null) {
              //create
              let {isSuccess} = await this.add({
                  data: {
                    name_trip: this.title_trip,
                    date_start: this.date_trip[0],
                    date_end: this.date_trip[1],
                    friends: this.friends,
                    markers: this.markerDataArray,
                    post_id: this.$route.query.post_id ? this.$route.query.post_id : ''
                  },
                });
                if (isSuccess) {
                  this.$message.success("Đã tạo mới thành công 1 kế hoạch !")
                  this.$emit("createSuccess", true)
                }
            }
            else {
              //edit
              let {isSuccess} = await this.edit({
                id: this.trip_id,
                data: {
                  name_trip: this.title_trip,
                  date_start: this.date_trip[0],
                  date_end: this.date_trip[1],
                  friends: this.friends,
                  markers: this.markerDataArray,
                  post_id: this.$route.query.post_id ? this.$route.query.post_id : ''
                },
              });
              console.log(isSuccess)
              if (isSuccess) {
                this.$message.success("Đã cập nhật thành công !")
                // this.$router.push("/map/list-trips");
                // location.reload()
              }
            }

          } catch (e) {
            console.log(e)
            this.$message.error('Thất bại')
          }

        },

        //khi click on map or load trang (neu la trang detail) thi nhan list marker
        markerDataUpdateLoadPage(event) {
          this.markerDataArray.push(event)
          this.$emit("markerData", event)
        },

        // khi edit 1 marker
        markerDataUpdateSubmit(event) {
          let index = this.markerDataArray.findIndex(marker => marker.lat == event.lat)
          let arr = [];
          arr = [...this.markerDataArray]
          arr[index] = event
          this.markerDataArray = arr
        },

        deleteMarker(event) {
          this.markerDataArray.splice(this.markerDataArray.indexOf(event), 1)
          this.$emit("delete",
            event);
        },

        querySearchFriend(queryString, cb) {
          var links = this.links;
          var results = queryString ? links.filter(this.createFilterFriend(queryString)) : links;
          // call callback function to return suggestions
          cb(results);
        },

        createFilterFriend(queryString) {
          return (link) => {
            return (link.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
          };
        },

        loadAllFriends() {
          let data = []
            for (let i = 0; i< this.getFriends.length; i++) {
              data.push(
                { "value": this.getFriends[i].name, id: this.getFriends[i].id }
              )
            }
          return data
        },

        handleClose(friend) {
          this.friends.splice(this.friends.indexOf(friend), 1);
        },

        handleSelectFriend(item) {
          this.friend = "",
          this.friends.push(item);
        },

        //xin tham gia chuyen di
        async joinRequest(trip_id) {
          await this.$axios.post("/api/trip/join-request/create", {
            trip_id: trip_id,
          });
          this.txt_join_request = "đã gửi yêu cầu"
          // location.reload()
        },
      },

    }
</script>

<style scoped>
  li.el-timeline-item:last-child .info {
    display: none;
  }
  p.title-list {
    padding-bottom: 10px;
    font-size: 16px;
    font-weight: bold;
    color: #3a8ee6;
    text-decoration: underline;
  }
  .list-planning {
    position: fixed;
    top: 40px;
    right: 0;
    background: #ffffffd1;
    padding-left: 20px;
    padding-top: 20px;
    max-height: 87vh;
    overflow-y: scroll;
  }
</style>
