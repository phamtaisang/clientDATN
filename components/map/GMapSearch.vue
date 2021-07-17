<template>
  <div>
    <input ref="autocomplete"
           placeholder="Enter your address"
           type="text"
           id="search-input-map"
    />
    <GMap
      ref="gMap"
      :cluster="{options: {styles: clusterStyle}}"

      :options="{fullscreenControl: true, streetViewControl: true, mapTypeControl: true, zoomControl: true, gestureHandling: 'cooperative'}"
      :zoom="6"

      @mapApi="SearchMap($event)"
    >
    </GMap>
  </div>
</template>
<script>
  import GMap from "../../components/map/GMap";
  import GMapMarker from "./GMapMarker";
  export default {
    components: {
      GMap,
      GMapMarker,
    },
    mounted() {
    },
    data() {
      return {
        currentLocation: {},
        locationsVisibleOnMap: "",
        location:
          // 20.9628781,105.8160021
          {
            lat: 20.9628781,
            lng: 105.8160021,
            title: "Điểm test 1"
          },

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

      async SearchMap(api) {
        const map = api.map;
        const google = api.google;
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

        map.addListener("click", (mapsMouseEvent) => {
          infoWindow.close();

          infoWindow = new google.maps.InfoWindow({
            position: mapsMouseEvent.latLng,
          });

          infoWindow.setContent(
            mapsMouseEvent.latLng.lat() + " , " + mapsMouseEvent.latLng.lng()
          );
          infoWindow.open(map);
          // get lat, lng when click . . .
          const lat = mapsMouseEvent.latLng.lat()
          const lng = mapsMouseEvent.latLng.lng()
          this.$emit("coordinates",
            {
              'lat': lat,
              'lng': lng
            });
        });
      },

    }
  };
</script>
