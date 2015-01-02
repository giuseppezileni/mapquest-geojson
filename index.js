var _ = require('underscore');
var request = require("request");

module.exports.version = '1.0.1';

module.exports = {
  _appkey: 'Fmjtd%7Cluurn162n0%2C7a%3Do5-9wtsuw', // Your API KEY !!!!!!
  _host: 'http://open.mapquestapi.com',
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

  geocode: function (street, city, state, format, callback) {
    var features = new Array();
    var self = this;
    var q = street + ' ' + city + ' ' + state;
    console.log('geocoding by ' + q); 

    var q = {
      location: {
        street: street + ', ' + city + ', ' + state
      },
      options: {
        thumbMaps: true,
        maxResults: -1
      }
    };

    var u = this._host + '/geocoding/v1/address?key=' + 
            this._appkey + '&outFormat=json&inFormat=json&' +
            'json=' + JSON.stringify(q);

    console.log(u);

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
        console.log(r);
        if (typeof format === 'undefined') {
          // callback all data
          callback(self._data);
        } else if (format === 'geojson') {
          callback(self._data.geojson);
        } else if (format === 'json') {
          callback(self._data.response);
        }
      };

    });      
  }
    
};
