/*jslint es5:true, indent: 2 */
/*global Vue, io */
/* exported vm */
'use strict';
var socket = io();

var vm = new Vue({
  el: '#page',
  data: {
    map: null,
    taxiId: 0,
    taxiLocation: null,
    pos: null,
    curOrder: 0,
    orders: {},
    customerMarkers: {}
  },
  created: function () {
    socket.on('initialize', function (data) {
      this.orders = data.orders;
    }.bind(this));
    socket.on('currentQueue', function (data) {
      this.orders = data.orders;
      for(var order in data.orders)
      {
          if(data.orders[order].mytaxi == this.taxiId)
          {
              this.curOrder = order;
              handleGivenOrder(data.orders[order]);
          }
      }
    }.bind(this));
    socket.on('orderFinished', function (orderId) {
        if(orderId == this.curOrder.orderId)
        {
            Vue.delete(this.orders, order.orderId);
            this.map.removeLayer(this.customerMarkers.from);
            this.map.removeLayer(this.customerMarkers.dest);
            this.map.removeLayer(this.customerMarkers.line);
            Vue.delete(this.customerMarkers);
            resetTaxi();
            modal.style.display = "none";
            modal2.style.display = "none";
        }
    }.bind(this));
    // this icon is not reactive
    this.taxiIcon = L.icon({
      iconUrl: "resources/taxi.png",
      iconSize: [36,36],
      iconAnchor: [18,36]
    });
    this.fromIcon = L.icon({
      iconUrl: "resources/customer.png",
      iconSize: [36,50],
      iconAnchor: [19,50]
    });

    //Helper function, should probably not be here
    function getRandomInt(min, max) {
      min = Math.ceil(min);
      max = Math.floor(max);
      return Math.floor(Math.random() * (max - min)) + min;
    }
    // It's probably not a good idea to generate a random taxi number, client-side. 
    this.taxiId = getRandomInt(1, 1000000);
  },
  mounted: function () {
    // set up the map
    this.map = L.map('my-map').setView([59.8415,17.648], 13);

    // create the tile layer with correct attribution
    var osmUrl='http://{s}.tile.osm.org/{z}/{x}/{y}.png';
    var osmAttrib='Map data © <a href="http://openstreetmap.org">OpenStreetMap</a> contributors';
    L.tileLayer(osmUrl, {
        attribution: osmAttrib,
        maxZoom: 18
    }).addTo(this.map);
    this.map.on('click', this.setTaxiLocation);
  },
  beforeDestroy: function () {
    socket.emit('taxiQuit', this.taxiId);
  },
  methods: {
    setTaxiLocation: function (event) {
      if (this.taxiLocation === null) {
        this.taxiLocation = L.marker([event.latlng.lat, event.latlng.lng], {icon: this.taxiIcon, draggable: true}).addTo(this.map);
        this.taxiLocation.on("drag", this.moveTaxi);
        socket.emit("addTaxi", { taxiId: this.taxiId,
                                latLong: [event.latlng.lat, event.latlng.lng]
                                });
        this.pos = [event.latlng.lat, event.latlng.lng];
      }
      else {
        this.taxiLocation.setLatLng(event.latlng);
        this.moveTaxi(event);
      }
    },
    moveTaxi: function (event) {
        this.pos = [event.latlng.lat, event.latlng.lng];
      socket.emit("moveTaxi", { taxiId: this.taxiId,
                                latLong: [event.latlng.lat, event.latlng.lng]
                                });
    },
    quit: function () {
      this.map.removeLayer(this.taxiLocation);
      this.taxiLocation = null;
      socket.emit("taxiQuit", this.taxiId);
    },
    acceptOrder: function (order) {
        this.customerMarkers = this.putCustomerMarkers(order);
        order.taxiIdConfirmed = this.taxiId;
        socket.emit("orderAccepted", order);
        console.log(order);
    },
    finishOrder: function (order) {
    console.log("Deleted4 "+order.orderId);
      Vue.delete(this.orders, order.orderId);
      this.map.removeLayer(this.customerMarkers.from);
      this.map.removeLayer(this.customerMarkers.dest);
      this.map.removeLayer(this.customerMarkers.line);
      Vue.delete(this.customerMarkers);
      socket.emit("finishOrder", order.orderId);
    console.log("Deleted3 "+order.orderId);
    },
    putCustomerMarkers: function (order) {
      var fromMarker = L.marker(order.fromLatLong, {icon: this.fromIcon}).addTo(this.map);
      fromMarker.orderId = order.orderId;
      var destMarker = L.marker(order.destLatLong).addTo(this.map);
      destMarker.orderId = order.orderId;
      var connectMarkers = L.polyline([order.fromLatLong, order.destLatLong], {color: 'blue'}).addTo(this.map);
      return {from: fromMarker, dest: destMarker, line: connectMarkers};
    },
  }
});
