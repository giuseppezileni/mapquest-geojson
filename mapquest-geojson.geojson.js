module.exports.version = '2.0.2';

var geojson = {
    type : "FeatureCollection",
    features: []
};

module.exports = {
    
    get: function(data, lat, lng) {
        geojson.features = []; 
        var i = 0;
        while (data.results[i]) {
            var rs = b.results[i];
            if (_.size(rs.locations) > 0) {
                var j = 0;
                while (rs.locations[j]) {
                    var location = rs.locations[j];
                    var lat = location.displayLatLng.lat;
                    var lng = location.displayLatLng.lng;
                    var title = location.street + ', ' +  location.postalCode;
                    var feature = create_geojson_point(lat, lng, title);
                    geojson.features.push(feature);
                    j++;
                };
            };
            i++;
        };
        return geojson;
    },
    get_route: function (data) {
        
        geojson.features = [];
        var i = 0;
        var feature_route = create_geojson_line('da a ', data.shape.shapePoints);
        geojson.features.push(feature_route);
    
        var legs = data.legs;
    
        while (legs[i]) {
            var l = legs[i];
            var j = 0;
            var jMax = _.size(l.maneuvers);
            console.log('Maneuvers n.: ' + jMax);

            while (l.maneuvers[j]) {
                var m = l.maneuvers[j];
                var feature = create_geojson_point(m.startPoint.lat, 
                                                   m.startPoint.lng, 
                                                   m.narrative);
                geojson.features.push(feature);
                j++;
            };
            i++;
        };
        return geojson;
    }
};

function create_geojson_point (lat, lng, title) {

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

};

function create_geojson_line (title, coordinates) {

    var feature = {
        "type": "Feature",
        "properties": {
          "point": "route",
          "title": title 
        },
        "geometry": {
          "type": "LineString",
          "coordinates": coordinates
        }
    };

    return feature;

 }