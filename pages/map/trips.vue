<template>
  <div>
      <input ref="autocomplete"
             placeholder="Tìm kiếm địa chỉ "
             type="text"
             id="search-input-map"
      />
      <el-menu class="menu-map-left">
        <el-button class="btn-custom-map" type="primary"
           :icon="on_show_form_create_planning ? 'el-icon-right' : 'el-icon-edit'"
           @click="on_show_form_create_planning = !on_show_form_create_planning">
           {{ on_show_form_create_planning ? 'Trở lại' : 'Tạo mới 1 kế hoạch' }}
        </el-button>

        <CreateTrips
          v-if="on_show_form_create_planning"
          :locations="locations"
          @delete="deleteMarker($event)"
          @markerData="markerDataUpdate($event)"
          @createSuccess="whenSuccessfullyCreated($event)"
        />
        <RouterLink to="/map/list-trips">
          <el-button v-if="on_show_form_create_planning == false" class="btn-custom-map" type="success" icon="el-icon-check" style="margin-left: 0">
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
            v-if="locations.length > 0"
            v-for="location in locations"
            :key="location.id"
            :position="{lat: location.lat, lng: location.lng}"
            :type="location.type"
            :options="{icon: location === currentLocation ? pins.selected : pins.notSelected}"
            @click="currentLocation = location"
          >
            <GMapInfoWindow :options="{maxWidth: 200}">
              <b>{{ location.address }}</b>

            </GMapInfoWindow>
          </GMapMarker>
        </GMap>
  </div>
</template>
<script>
  import GMap from "../../components/map/GMap";
  import GMapMarker from "../../components/map/GMapMarker";
  import CreateTrips from "../../components/map/trip/CreateTrip";
  export default {
    layout: "map",
    components: {
      GMap,
      GMapMarker,
      CreateTrips
    },
    mounted() {
    },
    data() {
      return {
        on_show_form_create_planning: false,
        currentLocation: {},
        locationsVisibleOnMap: "",
        directionsService: null,
        directionsDisplay: null,
        centerPosition:   {
          lat: 20.9628781,
          lng: 105.8160021,
        },
        locations: [

        ],
        apiMap: null,
        routeInfo: [],
        from: "",

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

    watch: {
      async locations(value) {
        await this.dogetRedirect_map(this.apiMap.map, value);
      }
    },

    methods: {
      returnToCenter() {
        this.$refs.gMap.map.setCenter(this.centerPosition);
      },

      whenSuccessfullyCreated() {
          this.on_show_form_create_planning = false
          this.locations = []
          console.log("click created !!!!")
      },

      markerDataUpdate(location) {
        let index = this.locations.indexOf(location);
        this.locations[index] = location;
      },

      deleteMarker(location) {
        let index = this.locations.findIndex(marker => marker.lat == location.lat)
        let arr = [];
        arr = [...this.locations]
        arr.splice(index, 1)
        this.locations = arr
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
          that.locations.push({
            lat: lat,
            lng: lng,
            address: "điểm chưa xác định",
            type: 'new',
            date_marker: '2020/01/01',
            time_start_marker:'00:00',
            time_end_marker:'00:00',
            distance:'0 km',
            duration:'0 h',
            note: null,
            visible: false
          })
          that.on_show_form_create_planning = true

          // vẽ chỉ đường
          this.dogetRedirect_map(map, that.locations);
        });

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
      dogetRedirect_map(map, locations) {
        let that = this
        if(!this.directionsService && !this.directionsDisplay) {
          this.directionsService = new google.maps.DirectionsService(); // Khai báo biến
          this.directionsDisplay = new google.maps.DirectionsRenderer(); // Khai báo biến
        }

        var directionsService = this.directionsService
        var directionsDisplay = this.directionsDisplay

        // điểm trung gian
        let waypts = [];
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
              if(i == _this.locations.length - 2) {
                _this.locations[parseInt(i) + 1].address = legs[i].end_address
                _this.locations[parseInt(i) + 1].duration = legs[i].duration
                _this.locations[parseInt(i) + 1].distance = legs[i].distance
              }
              _this.locations[parseInt(i)].address = legs[i].start_address
              _this.locations[parseInt(i)].duration = legs[i].duration
              _this.locations[parseInt(i)].distance = legs[i].distance
            }
            // var myroute = response.routes[0];
            // var time    = myroute.legs[0].duration.text; // Thời gian duy chuyển
            // var total   = myroute.legs[0].distance.text; // Chiều dài đoạn đường duy chuyển
            // var from    = myroute.legs[0].start_address; // Điểm xuất phát
            // var to      = myroute.legs[0].end_address; // Điểm đến

          } else {
            console.log(status);
          }
        });
      }

    }
  };
</script>
