# sangpt

# doc

[https://auth.nuxtjs.org/schemes/local]

[https://firebase.nuxtjs.org/guide/getting-started]

## link get key config firebase client

## project => `sanghumg`

[https://console.firebase.google.com/u/0/project/sanghumg-40254/settings/general/web:ZmZhMjM4ODgtZTdjNi00NTBjLTgzNWUtYjUzOWRmNTRjMmFm]

### fix error config firebase !!! => bản 4.5.0 thay cho bản mới (bản mới lỗi !!) 

`npm install firebase@4.5.0 --save`

[https://stackoverflow.com/questions/48863485/typeerror-cannot-read-property-googleauthprovider-of-undefined]

### link tham khảo sử dụng firebase

[https://nuxt-fire-demo.herokuapp.com/]

### docments map api 

[https://www.npmjs.com/package/nuxt-gmaps]

[https://developers.google.com/maps/documentation/javascript/overview]

`npm i nuxt-gmaps`

`
modules: [
  ['nuxt-gmaps', {
    key: '<API-Key>',
    //you can use libraries: ['places']
  }]
]
`
****

### api custom for components Gmap.vue

    ````
     * components Gmap.vue add 
    
      this.$emit("mapApi",
       {
          'map': map,
          'google': this.google
       });
       
    * use
   
    <GMap @mapApi="MapInit($event)" />
   
    // read methods MapInit(api)
        const map = api.map;
        const google = api.google;
       
    ````

### api custom for components GMapSearch.vue
    ````
     * components Search.vue add 
   
      this.$emit("coordinates",
      {
        'lat': lat,
        'lng': lng
      });
       
    * use
   
    <GMapSearch @coordinates="getCoordinates($event)" />
   
    // read methods MapInit(api)
      methods: {
          getCoordinates(event) {
            console.log("Tọa độ = ", event.lat, event.lng)
          }
      }
       
    ````
  
###Vẽ chỉ đường 

[https://huykira.net/webmaster/css-html/chuc-nang-cao-trong-google-maps-api.html]

[https://developers.google.com/maps/documentation/javascript/directions#GeocodedWaypoints]

###Lấy vị trí hiện tại của user 

[https://developers.google.com/maps/documentation/javascript/examples/map-geolocation]
