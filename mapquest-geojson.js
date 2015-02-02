var request = require("request");
var _config = require('./mapquest-geojson.config.js');
var _geojson = require('./mapquest-geojson.geojson.js');

module.exports.version = '2.0.2';

var mapquest_data;
var mapquest = {
    time: '',
    distance: '',
    items: []
};
var geojson;

module.exports = {
  
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

    var u = _config.get_url_reverse(q);

    console.log(u);

    request(u, function (error, response, body) {

      if (!error && response.statusCode == 200) {
          mapquest_data = JSON.parse(body);
          create_JSON();
          geojson = _geojson.get(mapquest_data, lat, lng);
          if (typeof callback === 'function') {
              callback(mapquest, geojson);
          };
      }
    });
  },

  geocode: function (street, city, state, callback) {
      var self = this;
      var q = street + ' ' + city + ' ' + state;
      var q = {
        location: {
            street: street + ', ' + city + ', ' + state
        },
        options: {
            thumbMaps: true,
            maxResults: -1
        }
      };
      
      var u = _config.get_url_geocode(q);
      
      request(u, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            mapquest_data = JSON.parse(body);
            create_JSON();
            geojson = _geojson.get(mapquest_data, lat, lng);
            if (typeof callback === 'function') {
                callback(mapquest, geojson);
            };
        };
      });      
  }, 

  route: function (origin, destination, city, state, callback) {

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
          
    var u = _config.get_url_route(qJson);    
    this._routing(u, callback);

  },

  routeLatLng: function (latS, lngS, latD, lngD, callback) {
      var u = _config.get_url_routeLatLng(latS, lngS, latD, lngD);
      console.log(u);
      this._routing(u, callback);
  }
    
};
    
function _routing (url, callback) {
    
    console.log(url);

    request(url, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        var mq = JSON.parse(body);
        mapquest_data = mq.route;
        route_JSON();
        geojson = _geojson.get_route(mapquest_data);
        if (typeof callback === 'function') {
            callback(mapquest, geojson);
        };
      } else {
          // error 
      }
    });
            
};

function route_JSON() {
    
    console.log('*************************');
    console.log('Time estimated: ' + mapquest_data.formattedTime);
    console.log('Distance: ' + mapquest_data.distance + ' mt');
    mapquest.time = mapquest_data.formattedTime;
    mapquest.distance = mapquest_data.distance;
    
    var legs = mapquest_data.legs;
    var i = 0;
    
    while (legs[i]) {
        var l = legs[i];
        var j = 0;
        console.log('Maneuvers n.: ' + jMax);
        
        while (l.maneuvers[j]) {
            var m = l.maneuvers[j];
            var route_path = {
                location: {
                  lat: m.startPoint.lat, // coordinate geografiche latitudine
                  lng: m.startPoint.lng  // coordinate geografiche longitudine
                },
                note: m.narrative,       // descrizione del percorso
                distance: m.distance,    // distanza 
                time: m.time,            // tempo
                item: l.maneuvers[j]
            };
            j++;
        };
        mapquest.items.push(route_path);
        i++;
    };
};

function create_JSON() {
    var i = 0;
    mapquest = [];

    while (mapquest_data.results[i]) {
      var rs = mapquest_data.results[i];
      if (_.size(rs.locations) > 0) {
        var j = 0;
        while (rs.locations[j]) {
            var r = { 
              location: {
                lat: 0,
                lng: 0
              },
              data: {}
            };
            var location = rs.locations[j];
            r.location.lat = location.displayLatLng.lat;
            r.location.lng = location.displayLatLng.lng;
            r.data = rs;
            mapquest.items.push(r);
            j++;  
        };
      };
      i++;
    }  
};
