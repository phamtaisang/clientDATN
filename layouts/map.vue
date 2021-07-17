<template>
  <div>
    <el-container>
      <Header />
    </el-container>
      <el-main class="main-layout" style="padding: 0 !important;">
        <el-button type="primary" icon="el-icon-edit edit-map-mobile" circle @click="onFormEditTrip()"></el-button>
        <el-button type="primary" icon="el-icon-right back-map" circle @click="backToMap()"></el-button>
        <el-button type="primary" icon="el-icon-right back-to-trip" circle @click="backToTrip()"></el-button>
        <el-button type="primary" icon="el-icon-map-location icon-map-mobile" circle @click="listMarkers()"></el-button>
        <Nuxt />
      </el-main>
  </div>
</template>
<script>
import Header from "../components/common/header/Header";

export default {
  middleware: 'authenticated',
  components: {
    Header,
  },
  methods: {
    onFormEditTrip() {
      this.isActive = !this.isActive;
      if (this.$el.querySelector('ul.menu-map-left') != null) {
        this.$el.querySelector('ul.menu-map-left').style.display = "block";
        this.$el.querySelector('.icon-map-mobile').style.display = "block";
        this.$el.querySelector('.back-map').style.display = "block";
        this.$el.querySelector('.edit-map-mobile').style.display = "none";
      }
    },
    listMarkers() {
      if (this.$el.querySelector('.list-planning')) {
        this.$el.querySelector('.list-planning').style.display = "block";
        this.$el.querySelector('.icon-map-mobile').style.display = "none";
        this.$el.querySelector('.back-map').style.display = "none";
        this.$el.querySelector('.back-to-trip').style.display = "block";
      }
      else {
        alert("bạn chưa tạo 1 marker")
      }
    },
    backToMap() {
      this.$el.querySelector('ul.menu-map-left').style.display = "none";
      this.$el.querySelector('.back-map').style.display = "none";
      this.$el.querySelector('.edit-map-mobile').style.display = "block";
      this.$el.querySelector('.icon-map-mobile').style.display = "none";
      if (this.$el.querySelector('.list-planning')) {
        this.$el.querySelector('.list-planning').style.display = "none";
      }
    },
    backToTrip() {
      this.$el.querySelector('.list-planning').style.display = "none";
      this.$el.querySelector('.back-map').style.display = "block";
      this.$el.querySelector('.back-to-trip').style.display = "none";
    }
  }
};
</script>
