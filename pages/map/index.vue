<template>
  <div>
    <GMap
      ref="gMap"
      :cluster="{options: {styles: clusterStyle}}"
      :center="{lat: locations[0].lat, lng: locations[0].lng}"
      :options="{fullscreenControl: false, streetViewControl: false, mapTypeControl: false, zoomControl: true, gestureHandling: 'cooperative'}"
      :zoom="6"
      @bounds_changed="checkForMarkers"
    >
      <GMapMarker
        v-for="location in locations"
        :key="location.id"
        :position="{lat: location.lat, lng: location.lng}"
        :options="{icon: location === currentLocation ? pins.selected : pins.notSelected}"
        @click="currentLocation = location"
      >
        <GMapInfoWindow :options="{maxWidth: 200}">
          <b>{{ location.title }}</b>
          <br>
          <br>
          <code>
            Lat: {{ location.lat }},
            <br>
            Lng: {{ location.lng }}
          </code>
        </GMapInfoWindow>
      </GMapMarker>
    </GMap>
  </div>
</template>
<script>
  import GMap from "../../components/map/GMap";
  import GMapMarker from "../../components/map/GMapMarker";
  export default {
    components: {
      GMap,
      GMapMarker,
    },
    async created() {

    },
    data() {
      return {
        currentLocation: {},
        locationsVisibleOnMap: "",
        locations: [
          // 20.9628781,105.8160021
          {
            lat: 20.9628781,
            lng: 105.8160021,
            title: "Điểm test 1"
          },
          {
            // 21.0336028,105.7842273
            lat: 21.0336028,
            lng: 105.7842273,
            title: "Điểm test 2"
          },
          {
            // 21.0362282,105.7869719
            lat: 21.0362282,
            lng: 105.7869719,
            title: "Điểm test 3"
          },
          {
            // 21.0713199,105.7784407
            lat: 21.0713199,
            lng: 105.7784407,
            title: "Điểm test 4"
          },
          {
            // 21.0213629,105.6370268
            lat: 21.0213629,
            lng: 105.6370268,
            title: "Điểm test 5"
          },
          {
            // 20.8295016,105.8844657
            lat: 20.8295016,
            lng: 105.8844657,
            title: "Điểm test 6"
          },
        ],
        pins: {
          selected:
            "",
          notSelected:
            ""
        },
        clusterStyle: [
          {
            url:
              "https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m1.png",
            width: 56,
            height: 56,
            textColor: "#fff"
          }
        ],
      };
    },

    methods: {
      returnToCenter() {
        this.$refs.gMap.map.setCenter(this.locations[0]);
      },

      checkForMarkers() {
        this.locations.forEach((location, i) => {
          location.visible = this.$refs.gMap.map
            .getBounds()
            .contains(this.$refs.gMap.markers[i].getPosition());
        });

        this.locationsVisibleOnMap = this.locations
          .filter(l => l.visible)
          .map(l => l.name)
          .join(", ");
      }
    }
  };
</script>
