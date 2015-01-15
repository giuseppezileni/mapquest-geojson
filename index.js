var _ = require('underscore');
var request = require("request");

module.exports.version = '2.0.0';

module.exports = {
  _appkey: 'Fmjtd%7Cluurn162n0%2C7a%3Do5-9wtsuw', // Your API KEY !!!!!!
  _host: 'http://open.mapquestapi.com/geocoding/v1/',
  _host_route: 'http://open.mapquestapi.com/directions/v2/',
  _data: {
    response: [],
    geojson: {
        type : "FeatureCollection",
        features: []
    },
  },

  _create_geojson_point: function (lat, lng, title) {

    var feature = {
        "type": "Feature",
        "properties": {
          "point": 'geolocation',
          "title": title,
          "icon": 'geolocation',
          "color": 'green',  
          "location": [Number(lat),
                         Number(lng)]  
        },
        "geometry": {
          "type": "Point",
          "coordinates": [Number(lng),
                         Number(lat)]
        }
    };

    return feature;

  },

  reverse: function (lat, lng, callback) {
    
    var self = this;
    
    var q = {
      location: {
        latLng: {
          lat: lat,
          lng: lng
        }
      }
    };

    var u = this._host + 'reverse?key=' + this._appkey + 
            '&outFormat=json&inFormat=json&' +
            'json=' + JSON.stringify(q);

    var r = { 
      location: {
        lat: 0,
        lng: 0
      },
      data: {}
    };

    console.log(u);

    request(u, function (error, response, body) {

      if (!error && response.statusCode == 200) {
        var b = JSON.parse(body);

        var i = 0;

        while (b.results[i]) {
          var rs = b.results[i];
          if (_.size(rs.locations) > 0) {
            var j = 0;
            while (rs.locations[j]) {
              var location = rs.locations[j];
              r.location.lat = location.displayLatLng.lat;
              r.location.lng = location.displayLatLng.lng;
              r.data = rs;
              self._data.response.push(r);
              var title = location.street + ', ' +  location.postalCode;
              var features = self._create_geojson_point(location.displayLatLng.lat, location.displayLatLng.lng, title);
              self._data.geojson.features.push(features);
              j++;  
            };
          };
          i++;
        }

        if (typeof callback === 'function') {
          callback(self._data);
        };
      }
    });

  },

  geocode: function (street, city, state, callback) {
    var features = new Array();
    this._data.response = [];
    this._data.geojson.features = [];
    var self = this;
    var q = street + ' ' + city + ' ' + state;
    // console.log('geocoding by ' + q); 

    var q = {
      location: {
        street: street + ', ' + city + ', ' + state
      },
      options: {
        thumbMaps: true,
        maxResults: -1
      }
    };

    var u = this._host + 'address?key=' + this._appkey + 
            '&outFormat=json&inFormat=json&' +
            'json=' + JSON.stringify(q);

    // console.log(u);

    var r = { 
      location: {
        lat: 0,
        lng: 0
      },
      data: {}
    };

    request(u, function (error, response, body) {

      if (!error && response.statusCode == 200) {

        var b = JSON.parse(body);
        var i = 0;

        while (b.results[i]) {
          var rs = b.results[i];
          if (_.size(rs.locations) > 0) {
            var j = 0;
            while (rs.locations[j]) {
              var location = rs.locations[j];
              r.location.lat = location.displayLatLng.lat;
              r.location.lng = location.displayLatLng.lng;
              r.data = rs;
              self._data.response.push(r);
              var title = location.street + ', ' +  location.postalCode;
              var features = self._create_geojson_point(location.displayLatLng.lat, location.displayLatLng.lng, title);
              self._data.geojson.features.push(features);
              j++;  
            };
          };
          i++;
        }
      } 

      if (typeof callback === 'function') {
          callback(self._data);
      };

    });      
  }, 

  route: function (origin, destination, city, state, callback) {

    // {locations:["Via Sparano, Bari, IT","Via Massaua, Bari, IT"],options:{avoids:[],avoidTimedConditions:false,doReverseGeocode: true,shapeFormat:raw,generalize:0,routeType:bicycle,timeType:1,locale:it_IT,unit:k,enhancedNarrative:false,drivingStyle: 2,highwayEfficiency: 21.0}}

    var o = origin + ', ' + city + ', ' + state;
    var e = destination + ', ' + city + ', ' + state;

    var qJson = {
      locations:[o,e],
      options:{ 
        avoids: [],
        avoidTimedConditions: false,
        doReverseGeocode: true,
        shapeFormat: 'raw',
        generalize: 0,
        routeType: 'bicycle',
        timeType: 1,
        locale: 'it_IT',
        unit: 'k',
        enhancedNarrative: false,
        drivingStyle: 2,
        highwayEfficiency: 21.0
      }
    };

    var qStr = JSON.stringify(qJson);

    var u = this._host_route + 'route?key=' + this._appkey +
            '&outFormat=json&inFormat=json' +
            '&json=' + qStr;
    
    this._routing(u, callback);

  },

  routeLatLng: function (latS, lngS, latD, lngD, callback) {

    // http://www.mapquestapi.com/directions/v2/route?key=YOUR_KEY_HERE&
    // callback=renderAdvancedNarrative&ambiguities=ignore&outFormat=json&inFormat=json&json={locations:["Via Sparano, Bari, IT","Via Massaua, Bari, IT"],options:{avoids:[],avoidTimedConditions:false,doReverseGeocode: true,shapeFormat:raw,generalize:0,routeType:bicycle,timeType:1,locale:it_IT,unit:k,enhancedNarrative:false,drivingStyle: 2,highwayEfficiency: 21.0}}

    var u = this._host_route + 'route?key=' + this._appkey +
            '&outFormat=json' +
            '&timeType=1&enhancedNarrative=false&shapeFormat=raw&generalize=0&locale=it_IT&unit=k' +
            '&routeType=bicycle' + 
            '&from=' + latS + ',' + lngS + 
            '&to=' + latD + ',' + lngD + 
            '&drivingStyle=2&highwayEfficiency=21.0';
    console.log(u);

    this._routing(u, callback);

  },
  
  _routing: function (url, callback) {
    
    var self = this;
    var route_data;

    console.log(url);

    request(url, function (error, response, body) {

      if (!error && response.statusCode == 200) {
        route_data = JSON.parse(body);
      };

      if (typeof callback === 'function') {
        callback(route_data);
      };

    });
            
  }
    
};
