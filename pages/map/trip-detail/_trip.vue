<template>
  <div>
    <input ref="autocomplete"
           placeholder="Tìm kiếm địa chỉ "
           type="text"
           id="search-input-map"
    />
    <el-menu class="menu-map-left">
      <CreateTrips
        v-if="locations"
        :locations="locations"
        :trip_id="this.$route.params.trip"
        :detailTrip = "this.detailTrip"
        @delete="deleteMarker($event)"
        @markerData="markerDataUpdate($event)"
        @createSuccess="whenSuccessfullyCreated($event)"
      />
      <RouterLink to="/map/list-trips">
        <el-button v-if="on_show_form_create_planning == true" class="btn-custom-map" type="success" icon="el-icon-check" style="margin-left: 0">
          Danh sách các chuyến đi
        </el-button>
      </RouterLink>
    </el-menu>
    <GMap
      ref="gMap"
      :cluster="{options: {styles: clusterStyle}}"
      :options="{fullscreenControl: true, streetViewControl: true, mapTypeControl: true, zoomControl: true, gestureHandling: 'cooperative'}"
      :zoom="6"
      @mapApi="EventMap($event)"
    >
      <GMapMarker
        v-if="locations"
        v-for="location in locations"
        :key="location.id"
        :position="{lat: location.lat, lng: location.lng}"
        :type="location.type"
        :options="{icon: location === currentLocation ? location.my_location ? location.avatar : '' : location.my_location ? location.avatar : ''}"
        @click="currentLocation = location"
      >
        <GMapInfoWindow :options="{maxWidth: 200}">
          <p v-if="!location.my_location">Địa chỉ : {{ location.address }}</p>
          <b>{{ location.name }} <sup style="position: absolute; left: 0;" class="el-badge__content el-badge__content--undefined is-fixed is-dot"></sup></b>
          <div v-if="location.my_location">
            <div style="height: 100px; overflow-y: scroll">
              <p v-for="(m, index) in location.message" :key="index" style="text-align: left">
                <b>{{ m.name }}</b> :  {{ m.content }}
              </p>
            </div>
            <form id="myForm" onsubmit="return false">
              <input type="text" name="message" v-model="txt_message" placeholder="Aa" style="width: 70%; float: left">
              <input type="button" @click="sendMessage(location.user_id)" value="Gửi" style="width: 25%; float: left">
            </form>
          </div>
        </GMapInfoWindow>
      </GMapMarker>
    </GMap>
  </div>
</template>
<script>
  import GMap from "../../../components/map/GMap";
  import GMapMarker from "../../../components/map/GMapMarker";
  import CreateTrips from "../../../components/map/trip/CreateTrip";
  import {mapActions, mapGetters, mapState} from "vuex";
  import * as firebase from "firebase/app";
  import "firebase/database";
  export default {
    layout: "map",
    components: {
      GMap,
      GMapMarker,
      CreateTrips,
    },
    data() {
      return {
        txt_message: "",
        on_show_form_create_planning: true,
        currentLocation: {},
        locationsVisibleOnMap: "",
        directionsService: null,
        directionsDisplay: null,
        centerPosition:   {
          lat: 20.9628781,
          lng: 105.8160021,
        },
        locations: null,
        myLocation: null,
        apiMap: null,
        pins: {
          selected:
          "https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m1.png",
          notSelected:
            "https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m1.png",
        },
        info: [],
        detailTrip: null,
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

    mounted() {

    },

    created() {
      // https://firebase.google.com/docs/reference/js/firebase.database.Reference#key
      var that = this;
      var rootRef = firebase.database().ref("trips/"+this.$route.params.trip+"/");
      rootRef.on("value", function(snapshot) {
        if(snapshot.val()) {
          let locations_friends = Object.entries(snapshot.val());
          console.log("abc", locations_friends)
          for(var i = 0; i < locations_friends.length; i++) {
            that.addMarker({
              lat: locations_friends[i][1].lat,
              lng: locations_friends[i][1].lng,
              // address: "điểm chưa xác định",
              type: 'my_location',
              date_marker: '2020/01/01',
              time_start_marker:'Chưa cập nhật',
              time_end_marker:'Chưa cập nhật',
              // distance:'0 km',
              // duration:'0 h',
              name: locations_friends[i][1].user_name,
              message: locations_friends[i][1].message ? locations_friends[i][1].message : 'Không có lời nhắn !',
              avatar: locations_friends[i][1].avatar,
              user_id: locations_friends[i][1].user_id,
              my_location: true
            })
          }
        }
      }, function (error) {
        console.log("Error: " + error.code);
      });
      this.$store.dispatch('map/clear');
    },

    watch: {
      async apiMap(value) {
        const detailVuex =  await this.$store.dispatch('map/getDetailTrip', {
          id: this.$route.params.trip
        });

        const detail = Object.assign({}, detailVuex)
        this.detailTrip = await detail
         await this.dogetRedirect_map(value.map, this.markers);
        },
      async markers(value) {
        this.locations = this.value
        if (this.apiMap && this.apiMap.map) {
          await this.dogetRedirect_map(this.apiMap.map, value);
        }
      }
    },
    computed: {
      ...mapGetters({
        markers: 'map/getListMarker'
      })
    },
    methods: {
      //gui tin nhan
      sendMessage(user_id) {
        console.log("noi dung", this.txt_message)
        console.log("user id", user_id)
        console.log("trip id", this.$route.params.trip)
        this.$axios.post("/api/trip/send-message", {
          user_id: user_id,
          trip_id: this.$route.params.trip,
          message: this.txt_message
        });
        document.getElementById("myForm").reset();
      },

      ...mapActions({
        addMarker: "map/addMarker"
      }),

      returnToCenter() {
        this.$refs.gMap.map.setCenter(this.centerPosition);
      },

      whenSuccessfullyCreated() {
        this.on_show_form_create_planning = false
        this.locations = []
      },

      markerDataUpdate(location) {
        let index = this.locations.indexOf(location);
        this.locations[index] = location;
      },

      async deleteMarker(location) {
        // this.locations.splice(this.locations.indexOf(location), 1);
        const deleteMarker =  await this.$store.dispatch('map/deleteMarker', {
           marker: location
        });
       },

      async EventMap(api) {
        this.apiMap = api;
        const map = api.map;
        const google = api.google;
        map.setCenter(this.centerPosition);
        const input = document.getElementById("search-input-map");
        let infoWindow = new google.maps.InfoWindow({});
        infoWindow.open(map);
        var searchBox = await new google.maps.places.SearchBox(input);
        // Bias the SearchBox results towards current map's viewport.
        map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);
        map.addListener("bounds_changed", () => {
          searchBox.setBounds(map.getBounds());
        });
        let markers = [];
        let that = this;

        // event when click on  map !!!

        map.addListener("click", (mapsMouseEvent) => {
          // get lat, lng when click . . .
          infoWindow.close();
          infoWindow = new google.maps.InfoWindow({
            position: mapsMouseEvent.latLng,
          });
          const lat = mapsMouseEvent.latLng.lat()
          const lng = mapsMouseEvent.latLng.lng()
          that.addMarker({
            lat: lat,
            lng: lng,
            // address: "điểm chưa xác định",
            type: 'new',
            date_marker: '2020/01/01',
            time_start_marker:'Chưa cập nhật',
            time_end_marker:'Chưa cập nhật',
            // distance:'0 km',
            // duration:'0 h',
            note: null,
            visible: false
          })
          that.on_show_form_create_planning = true
          // vẽ chỉ đường
          this.dogetRedirect_map(map, that.locations);
        });

        // lấy vị trí của người dùng
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            async (position) => {
              const pos = {
                lat: position.coords.latitude,
                lng: position.coords.longitude,
              };
              let follow = await this.$axios.post("api/trip/firebase", {
                lat: position.coords.latitude,
                lng: position.coords.longitude,
                tripId: this.$route.params.trip
              })
              map.setCenter(pos);
            },
            () => {
              handleLocationError(true, infoWindow, map.getCenter());
            }
          );
        } else {
          // Browser doesn't support Geolocation
          handleLocationError(false, infoWindow, map.getCenter());
        }

        // event when search on map . . .
        searchBox.addListener("places_changed", () => {
          const places = searchBox.getPlaces();

          if (places.length == 0) {
            return;
          }
          // Clear out the old markers.
          markers.forEach((marker) => {
            marker.setMap(null);
          });
          markers = [];
          // For each place, get the icon, name and location.
          const bounds = new google.maps.LatLngBounds();
          places.forEach((place) => {
            if (!place.geometry) {
              console.log("Returned place contains no geometry");
              return;
            }
            // get lat, lng when submit input search . . .
            const lat = place.geometry.location.lat()
            const lng = place.geometry.location.lng()
            this.$emit("coordinates",
              {
                'lat': lat,
                'lng': lng
              });
            infoWindow.close();
            infoWindow = new google.maps.InfoWindow({
              position: place.geometry.location,
            });
            infoWindow.setContent(
              "Địa điểm : " + place.formatted_address,
            );
            infoWindow.open(map);

            if (place.geometry.viewport) {
              // Only geocodes have viewport.
              bounds.union(place.geometry.viewport);
            } else {
              bounds.extend(place.geometry.location);
            }
          });
          map.fitBounds(bounds);
        })
      },

      //function vẽ map chỉ đường
      dogetRedirect_map(map, locations1) {
        let locations = [];
        for (let i in locations1) {
          if (!locations1[i].my_location) {
            locations.push(locations1[i])
          }
        }

        let that = this
        if(!this.directionsService && !this.directionsDisplay) {
          this.directionsService = new google.maps.DirectionsService(); // Khai báo biến
          this.directionsDisplay = new google.maps.DirectionsRenderer(); // Khai báo biến
        }

        var directionsService = this.directionsService
        var directionsDisplay = this.directionsDisplay

        // điểm trung gian
        let waypts = [];
        console.log("my locations : ", locations)
        for (let i = 1; i < locations.length -1 ; i++) {
            waypts.push({
              location: {
                lat: locations[i].lat,
                lng: locations[i].lng,
              },
              stopover: true,
            });
        }

        var request = {
          origin: locations[0],
          destination: locations[locations.length -1],
          waypoints: waypts,
          optimizeWaypoints: true,
          travelMode: google.maps.TravelMode.DRIVING
        };
        directionsDisplay.setMap(null);
        directionsDisplay.setMap(map);
        var _this = this;
        directionsService.route(request, function(response, status) {
          if (status == google.maps.DirectionsStatus.OK) {
            directionsDisplay.setOptions({ preserveViewport: true, suppressMarkers: true });
            directionsDisplay.setDirections(response);
            var legs = response.routes[0].legs;
            for(let i in legs) {
                if (i == locations.length - 2) {
                  locations[parseInt(i) + 1].address = legs[i].end_address
                  locations[parseInt(i) + 1].duration = legs[i].duration
                  locations[parseInt(i) + 1].distance = legs[i].distance
                }
                locations[parseInt(i)].address = legs[i].start_address
                locations[parseInt(i)].duration = legs[i].duration
                locations[parseInt(i)].distance = legs[i].distance
            }
            _this.locations = locations1
          } else {
            console.log(status);
          }
        });
      },
    }
  };
</script>
