<template>
  <div>
    <el-breadcrumb separator="/" style="margin-top:20px;">
      <el-breadcrumb-item :to="{ path: '/map/trips' }">Map</el-breadcrumb-item>
      <el-breadcrumb-item style="color: #67c23a;text-decoration: underline;">Chờ xác nhận</el-breadcrumb-item>
    </el-breadcrumb>
    <el-table
      :data="tripsInvitations.filter(data => !search || data.name.toLowerCase().includes(search.toLowerCase()))"
      style="width: 100%">

      <el-table-column
        label="Tên chuyến đi"
        prop="title">
        <template slot-scope="scope">
          <i class="el-icon-truck"></i>
          <span style="margin-left: 10px">{{ scope.row.trip.title }}</span>
        </template>
      </el-table-column>

      <el-table-column
        label="Bắt đầu"
        prop="time_start"
        sortable
      >
        <template slot-scope="scope">
          <i class="el-icon-time"></i>
          <span style="margin-left: 10px">{{ scope.row.trip.time_start }}</span>
        </template>
      </el-table-column>

      <el-table-column
        label="Kết thúc"
        prop="time_end"
        sortable
      >
        <template slot-scope="scope">
          <i class="el-icon-time"></i>
          <span style="margin-left: 10px">{{ scope.row.trip.time_end }}</span>
        </template>
      </el-table-column>

      <el-table-column
        label="Trạng thái"
        prop="time_end"
        sortable
      >
        <template slot-scope="scope">
          <el-tag type="success" v-if="Date.parse(new Date().toLocaleString())/1000 < Date.parse(scope.row.trip.time_end)"><i class="el-icon-check"></i> Đang diễn ra </el-tag>
          <el-tag type="danger" v-if="Date.parse(new Date().toLocaleString())/1000 > Date.parse(scope.row.trip.time_end)"><i class="el-icon-check"></i> Đã kết thúc </el-tag>
        </template>
      </el-table-column>

      <el-table-column
        align="center" label="Tùy chọn">
        <template slot-scope="scope">
          <el-button style="margin-top: 3px; width:100%; margin-left: 0 !important"
                     size="mini"
                     @click="handleEdit(scope.$index, scope.row.trip)">Xem
          </el-button>
          <el-button
            style="margin-top: 3px; width:100%;"
            size="mini"
            type="primary"
            @click="acceptTrip(scope.row)">Tham gia
          </el-button>
          <el-button style="margin-top: 3px; width:100%; margin-left: 0 !important"
                     size="mini"
                     type="danger"
                     @click="handleDelete(scope.$index, scope.row.trip)">hủy bỏ
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <br>
<!--    <el-breadcrumb separator="/" style="margin-top:20px;">-->
<!--      <el-breadcrumb-item style="color: #67c23a;text-decoration: underline;">Danh sách các chuyến đi được mời</el-breadcrumb-item>-->
<!--    </el-breadcrumb>-->
<!--    <el-table-->
<!--      :data="tripsJoining.filter(data => !search || data.name.toLowerCase().includes(search.toLowerCase()))"-->
<!--      style="width: 100%">-->

<!--      <el-table-column-->
<!--        label="Tên chuyến đi"-->
<!--        prop="title">-->
<!--        <template slot-scope="scope">-->
<!--          <i class="el-icon-truck"></i>-->
<!--          <span style="margin-left: 10px">{{ scope.row.trip.title }}</span>-->
<!--        </template>-->
<!--      </el-table-column>-->

<!--      <el-table-column-->
<!--        label="Bắt đầu"-->
<!--        prop="time_start"-->
<!--        sortable-->
<!--      >-->
<!--        <template slot-scope="scope">-->
<!--          <i class="el-icon-time"></i>-->
<!--          <span style="margin-left: 10px">{{ scope.row.trip.time_start }}</span>-->
<!--        </template>-->
<!--      </el-table-column>-->

<!--      <el-table-column-->
<!--        label="Kết thúc"-->
<!--        prop="time_end"-->
<!--        sortable-->
<!--      >-->
<!--        <template slot-scope="scope">-->
<!--          <i class="el-icon-time"></i>-->
<!--          <span style="margin-left: 10px">{{ scope.row.trip.time_end }}</span>-->
<!--        </template>-->
<!--      </el-table-column>-->

<!--      <el-table-column-->
<!--        label="Trạng thái"-->
<!--        prop="time_end"-->
<!--        sortable-->
<!--      >-->
<!--        <template slot-scope="scope">-->
<!--          <el-tag type="success" v-if="Date.parse(new Date().toLocaleString())/1000 < Date.parse(scope.row.trip.time_end)"><i class="el-icon-check"></i> Đang diễn ra </el-tag>-->
<!--          <el-tag type="danger" v-if="Date.parse(new Date().toLocaleString())/1000 > Date.parse(scope.row.trip.time_end)"><i class="el-icon-check"></i> Đã kết thúc </el-tag>-->
<!--        </template>-->
<!--      </el-table-column>-->

<!--      <el-table-column-->
<!--        align="center" label="Tùy chọn">-->
<!--        <template slot-scope="scope">-->
<!--          <el-button-->
<!--            style="margin-top: 3px; width:100%;"-->
<!--            size="mini"-->
<!--            @click="handleEdit(scope.$index, scope.row.trip)"><i class="el-icon-view"></i> Xem-->
<!--          </el-button>-->
<!--          <el-button style="margin-top: 3px; width:100%; margin-left: 0 !important"-->
<!--                     size="mini"-->
<!--                     type="danger"-->
<!--                     @click="handleDelete(scope.$index, scope.row.trip)"><i class="el-icon-delete"></i>Hủy bỏ-->
<!--          </el-button>-->
<!--        </template>-->
<!--      </el-table-column>-->
<!--    </el-table>-->
    <br>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item style="color: #67c23a;text-decoration: underline;">Danh sách các chuyến đi </el-breadcrumb-item>
    </el-breadcrumb>
    <el-table
      :data="tripsByUser.filter(data => !search || data.name.toLowerCase().includes(search.toLowerCase()))"
      style="width: 100%">

      <el-table-column
        label="Tên chuyến đi"
        prop="title">
        <template slot-scope="scope">
          <i class="el-icon-truck"></i>
          <span style="margin-left: 10px">{{ scope.row.title }}</span>
        </template>
      </el-table-column>

      <el-table-column
        label="Bắt đầu"
        prop="time_start"
        sortable
      >
        <template slot-scope="scope">
          <i class="el-icon-time"></i>
          <span style="margin-left: 10px">{{ scope.row.time_start }}</span>
        </template>
      </el-table-column>

      <el-table-column
        label="Kết thúc"
        prop="time_end"
        sortable
      >
        <template slot-scope="scope">
          <i class="el-icon-time"></i>
          <span style="margin-left: 10px">{{ scope.row.time_end }}</span>
        </template>
      </el-table-column>

      <el-table-column
        label="Trạng thái"
        prop="time_end"
        sortable
      >
        <template slot-scope="scope">
          <el-tag type="success" v-if="Date.parse(new Date().toLocaleString())/1000 < Date.parse(scope.row.time_end)"><i class="el-icon-check"></i> Đang diễn ra </el-tag>
          <el-tag type="danger" v-if="Date.parse(new Date().toLocaleString())/1000 > Date.parse(scope.row.time_end)"><i class="el-icon-check"></i> Đã kết thúc </el-tag>
        </template>
      </el-table-column>

      <el-table-column
        align="center" label="Tùy chọn">
        <template slot-scope="scope">
          <el-button
            style="margin-top: 3px; width:100%;"
            size="mini"
            @click="handleEdit(scope.$index, scope.row)"><i class="el-icon-view"></i> xem
          </el-button>
          <el-button style="margin-top: 3px; width:100%; margin-left: 0 !important"
                     size="mini"
                     type="danger"
                     @click="handleDelete(scope.$index, scope.row)"><i class="el-icon-delete"></i> xóa
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
  import {mapGetters, mapActions} from "vuex";

  export default {
    data() {
      return {
        search: '',
      }
    },

    mounted() {
      this.$store.dispatch("map/getListTripsByUser");
    },

    computed: mapGetters({
      tripsByUser: "map/getListTripsByUser",
      tripsInvitations: "map/getListTripsInvitations",
      tripsJoining: "map/getListTripsJoining",
    }),

    methods: {
      ...mapActions({
        delete: "map/deleteTrip",
      }),
      handleEdit(index, row) {
        this.$router.push("/map/trip-detail/"+row.id);
      },
      async handleDelete(index, row) {
        try {
          let {isSuccess} = await this.delete({
            data: {
              trip_id: row.id,
            },
          });
          if (isSuccess) {
            this.$store.dispatch("map/getListTripsByUser");
            this.$message.success("Đã xóa thành công !")
          }
        } catch (e) {
          this.$message.error('Thất bại')
        }
      },
      async acceptTrip(row) {
        await this.$axios.post("/api/trip/invitation/accept", {
          trip_id: row.trip.id,
        });
        location.reload()
      },
    },
  }
</script>
