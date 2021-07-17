<template>
  <div class="GMap__Marker" v-if="!markerLoaded">
    <slot/>
  </div>
</template>

<script>
export default {
  props: {
    position: Object,
    options: Object,
    type: String,
  },

  data(){
    return{
      marker: null,
      markerLoaded: false,
      events: ['click', 'mouseover', 'mouseout']
    }
  },

  destroyed() {
    this.marker.setMap(null)
  },

  mounted() {
    // if(this.type === 'new') {
      this.init()
    // }
  },
  methods: {
    init(){
      let child = undefined;
      this.marker = null;
      this.markerLoaded = false;
      this.position.lat = parseFloat(this.position.lat);
      this.position.lng = parseFloat(this.position.lng);
      this.marker = new this.$parent.google.maps.Marker({
        position: this.position,
        map: this.$parent.map,
        animation: this.$parent.google.maps.Animation.DROP,
        // draggable: true,
        ...this.options
      });

      this.$parent.markers.push(this.marker);
      this.markerLoaded = true;

      if(this.$children.length > 0){
        child = this.$children[0];
        child.initInfoWindow();
      }

      this.marker.addListener('rightclick', function() {
        console.log('right click')
      })

      this.events.forEach(event =>{
        this.$parent.google.maps.event.addListener(this.marker, event, (e) =>{
          if(child !== undefined && event === 'click'){
            child.infoWindow.open(this.$parent.map, this.marker);
          }
          this.$emit(event, {position: this.position, event: e, map: this.$parent.map, marker: this.marker})
        });
      })
    }
  },

  watch:{
    'options.icon'(value){
      this.marker.setIcon(value)
    }
  }
}
</script>
