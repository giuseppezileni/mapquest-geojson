var request = require("request");
var _config = require('./mapquest-geojson.config.js');
var _geojson = require('./mapquest-geojson.geojson.js');
var _ = require('underscore');
var async = require('async');

module.exports.version = '2.0.5';

var mapquest_data;
var mapquest = {
  items: [],
  shapePoints: {},
  date: '',
  time: ''
};
var geojson;
var isError;
var error_json = {
  error: '',
  descrition: ''
}

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
          _geojson.get(mapquest, function (geoj) {
              geojson = geoj;
              if (typeof callback === 'function') {
                callback(false, geojson);
              };  
            });
      } else {
        error_json.error += 'can\'t found address by ' + JSON.stringify(q);
        if (typeof callback === 'function') {
            callback(true, error_json);
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
            //console.log(JSON.stringify(mapquest_data));
            create_JSON();
            _geojson.get(mapquest, function (geoj) {
              geojson = geoj;
              if (typeof callback === 'function') {
                callback(false, geojson);
              };  
            });
            
        } else {
          isError = true
          error_json.error += 'can\'t geocode address by ' + JSON.stringify(q);
          if (typeof callback === 'function') {
            callback(isError, error_json);
          };
        }
      });      
  }, 

  routeLatLng: function (latS, lngS, latD, lngD, callback) {
      var u = _config.get_url_routeLatLng(latS, lngS, latD, lngD);
      console.log(u);
      _routing(u, callback);
  }
    
};
    
function _routing (url, callback) {
    
    console.log(url);

    request(url, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        var mq = JSON.parse(body);
        mapquest_data = mq.route;
        route_JSON();
        console.log('create geojson ...')
        _geojson.get_route(mapquest, function (gj) {
          geojson = gj;
          console.log('callback return ...');
          if (typeof callback === 'function') {
            callback(false, geojson);
          };
        });
        
      } else {
        // error 
        isError = true
        error_json.error = 'can\'t route path by ' + url;
        if (typeof callback === 'function') {
            callback(isError, error_json);
        };
      }
    });    
};

function route_JSON() {
    
    console.log('mapquesta data: ' + JSON.stringify(mapquest_data));

    console.log('*************************');
    console.log('Time estimated: ' + mapquest_data.formattedTime);
    console.log('Distance: ' + mapquest_data.distance + ' mt');
    total_time = mapquest_data.formattedTime;
    total_distance = mapquest_data.distance;
    mapquest.time = total_time;
    mapquest.distance = total_distance;
    mapquest.shapePoints = mapquest_data.shape.shapePoints
    
    var legs = mapquest_data.legs;
    var i = 0;

    async.each(mapquest_data.legs, function (leg, callback_root) {

      console.log('Maneuvers n.: ' + _.size(leg.maneuvers));

      async.each(leg.maneuvers, function (maneuver, callback_child) {
          var route_path = {
              total_distance: total_distance,
              totale_time: total_time,
              location: {
                lat: maneuver.startPoint.lat, // coordinate geografiche latitudine
                lng: maneuver.startPoint.lng  // coordinate geografiche longitudine
              },
              note: maneuver.narrative,       // descrizione del percorso
              distance: maneuver.distance,    // distanza 
              time: maneuver.time,            // tempo
              item: maneuver,
              value: {}
          };
          // console.log('****>' + JSON.stringify(route_path));
          mapquest.items.push(route_path);
          callback_child();
      }, function (err) {
        if (!err) {
          callback_root();
        } else {
          error_json.error += 'error by maneuver child.';
          callback_root(true);
        }
      });

    }, function (err) {
      if (err) {
        error_json.error += 'error by maneuver child.';
      }
    });
    
};

function create_JSON() {
    var i = 0;
    
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
              data: {},
              note: ''
            };
            var location = rs.locations[j];

            var lat = location.displayLatLng.lat;
            var lng = location.displayLatLng.lng;
            var title = location.street + ', ' +  location.postalCode;
            r.note = title;
            r.location.lat = lat;
            r.location.lng = lng;
            r.data = rs;
            mapquest.items.push(r);
            j++;  
        };
      };
      i++;
    }  
};
