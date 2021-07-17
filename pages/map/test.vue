<template>
  <div>
      <GMapSearch @coordinates="getCoordinates($event)" />
  </div>
</template>
<script>
  import GMapSearch from "../../components/map/GMapSearch";
  export default {
    components: {
      GMapSearch
    },
    methods: {
      getCoordinates(event) {
        console.log("Tọa độ = ", event.lat, event.lng)
      }
    }
  };
</script>
