# mapquest-geojson
NodeJS module to read and convert API [Mapquest Open Platform](http://open.mapquestapi.com) to [GeoJSON](http://geojson.org) data.

## Installation

<pre>npm install mapquest-geojson</pre>

## Methods

### Reverse
Reverse Geocoding by inputting a latitude and longitude. 

<pre>reverse(lat, lng, callback)</pre>
Return JSON data and [GeoJSON](http://geojson.org) for your map.

* lat: Latitude of the user's location.  
* lng: Longitude of the user's location. 

#### Example

<pre>
var mapquest = require("mapquest-geojson");

function reverse(callback) {
    mapquest.reverse(41.0946, 16.8706, function (results, geojson) { 
        // .............    
    });
};
</pre>

### Geocode
The geocoding method take an address and get the associated latitude and longitude.

<pre>geocode(street, city, state, callback)</pre>
Return [GeoJSON](http://geojson.org) for your map.

* street: Street to get latitude and longitude  (Ex. Via Sparano da Bari)  
* city: City to get latitude and longitude   (Ex. Bari)
* state: State to get latitude and longitude (Ex. IT for Italy)

#### Example

<pre>
var mapquest = require("mapquest-geojson");

function geocode(callback) {
    mapquest.geocode('Via Sparano da Bari', 'Via Massaua', 'Bari, 'IT', function (results, geojson) { 
        // .............    
    });
};
</pre>

### Routing
The Route Service provides a simple interface to get routing, narrative, and shapes at the same city and state.

<pre>route(origin, destination, city, state, callback)</pre>
Return [GeoJSON](http://geojson.org) for your map.

* origin: Origin to start routing (Ex. Via Sparano da Bari)  
* destination: Destination to end routing   (Ex. Via Massaua)
* city: City to get routing (Ex. Bari)
* state: State to get routing (Ex. IT for Italy)

<pre>routeLatLng (latS, lngS, latD, lngD, callback)</pre>
Return [GeoJSON](http://geojson.org) for your map.

* latS: Latitude to start routing  
* lngS: Longitude to end routing   
* latD: Latitude to end routing 
* lngD: Longitude to end routing 


#### Example

<pre>
var mapquest = require("mapquest-geojson");

function routeLatLng(callback) {
    mapquest.routeLatLng(41.0946, 16.8706, 41.101071, 16.8588921, function (results, geojson) { 
        // .............    
    });
};
</pre>

## Data

<pre>
mapquest: {
    time: '',       // time elpased to routing 
    distance: '',   // distance to route path
    items: []       // items data
};
</pre>

### Items Geocoding and Reverse
<pre>
item = { 
  location: {
    lat: 41.0946,
    lng: 16.8706
  },
  data: {
    // Mapquest Open Platform data
  }
}
</pre>

####[Mapquest Open Platform data](http://open.mapquestapi.com/geocoding/#optionssample)

### Items Routing
<pre>
route = {
    location: {
      lat: 41.0946, 
      lng: 16.8706  
    },
    note: '',                   // description
    distance: 1234,             // distance meters 
    time: 00:45:00,             // time elapsed
    item: {
        // Mapquest Open Platform data routing
    }
}
</pre>

####[Mapquest Open Platform data routing](http://open.mapquestapi.com/directions/#response)

## Developers & Support
Giuseppe Zileni ([Twitter](https://twitter.com/gzileni)/[Mail](mailto:me@gzileni.name)/[Site](http://www.gzileni.name))

