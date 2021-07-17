<template>
  <el-popover
    v-if="location"
    placement="top"
    title="Thông tin điểm đến"
    width="300"
    trigger="click"
    v-model="visible"
  >
    <el-input v-model="location.address"></el-input>
    <el-input type="textarea" v-model="note" placeholder="Nhập ghi chú cho điểm " style="margin-bottom: 10px;"></el-input>
    <el-date-picker
      style="width: 100%;"
      v-model="time_start_marker"
      type="datetime"
      format="dd/MM/yyyy HH:mm:ss"
      value-format="dd/MM/yyyy HH:mm:ss"
      placeholder="Thời gian đến">
    </el-date-picker>
    <el-date-picker
      style="width: 100%;"
      v-model="time_end_marker"
      type="datetime"
      format="dd/MM/yyyy HH:mm:ss"
      value-format="dd/MM/yyyy HH:mm:ss"
      placeholder="Thời gian đi">
    </el-date-picker>
    <el-button type="success" icon="el-icon-check" style="width: 48%; margin-left: 0;" @click="submitInfoMarker()"> Cập
      nhật
    </el-button>
    <el-button type="danger" icon="el-icon-delete" style="float: right; width: 48%;" @click="deleteMarker(location)">Xóa
    </el-button>

    <el-button slot="reference" style="padding:0; border: none !important; padding-right:20px;">
      <i class='el-icon-location-outline'></i>
      {{ location.address == "" ? "Tên địa điểm" : location.address }} <button><i class="el-icon-edit"></i></button>
    </el-button>

  </el-popover>
</template>

<script>
  export default {
    props: {
      location: "",
    },
    data() {
      return {
        time_start_marker: null,
        time_end_marker: null,
        visible: false,
        note: null
      };
    },
    created() {
      //edit
      if(this.$route.params.trip) {
        this.note = this.location.note;
        this.time_start_marker = this.location.time_start_marker;
        this.time_end_marker = this.location.time_end_marker;
        this.$emit("markerDataLoadPage",
          {
            address: this.location.address,
            lat: this.location.lat,
            lng: this.location.lng,
            time_start: this.location.time_start_marker,
            time_end: this.location.time_end_marker,
            note: this.location.note,
            type: this.location.type
          });
        this.visible = false
      }
      else {
        //create
        this.$emit("markerDataLoadPage",
          {
            address: this.location.address,
            lat: this.location.lat,
            lng: this.location.lng,
            time_start: this.time_start_marker,
            time_end: this.time_end_marker,
            note: this.note,
            type: this.location.type
          });
        this.visible = false
      }

    },
    methods:  {
      submitInfoMarker() {
        this.$emit("markerDataSubmit",
          {
            address: this.location.address,
            lat: this.location.lat,
            lng: this.location.lng,
            time_start: this.time_start_marker,
            time_end: this.time_end_marker,
            note: this.note,
            type: this.location.type
          });
        this.visible = false
      },
      deleteMarker(location) {
        this.$emit("delete",
          location);
        this.visible = false
      }
    }
  }
</script>

<style scoped>
  .list-planning .el-button {
    color: black !important;
    font-weight: bold;
  }
</style>
