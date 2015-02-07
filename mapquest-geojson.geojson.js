module.exports.version = '2.0.4';

var geojson = {
    type : "FeatureCollection",
    features: []
};

module.exports = {
    
    get: function(data, callback) {
        geojson.features = []; 
        _run(data.items, callback);
    },

    get_route: function (data, callback) {
        geojson.features = [];
        var feature_route = create_geojson_line('percorso', data.shapePoints);
        geojson.features.push(feature_route);
        _run(data.items, callback);
    }
};

function _run(items, callback) {
    var i = 0;
    while (items[i]) {
        var rs = items[i];
        // console.log('geojson created ... ' + JSON.stringify(rs));
        var feature = create_geojson_point(rs.location.lat, 
                                           rs.locationlng, 
                                           rs.note);
        geojson.features.push(feature);
        i++;
    };

    if (typeof callback === 'function') {
      console.log('callback data ... ' + JSON.stringify(geojson));
      callback(geojson);
    };
}

function create_geojson_point (lat, lng, title) {

    var feature = {
        "type": "Feature",
        "properties": {
          "point": 'geolocation',
          "title": title,
          "icon": 'geolocation',
          "color": 'green',  
          "location": [Number(lat),
                         Number(lng)],
          "data": {}  
        },
        "geometry": {
          "type": "Point",
          "coordinates": [Number(lng),
                         Number(lat)]
        }
    };

    // console.log('geojson point ...');
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

    // console.log('geojson line ...');

    return feature;

 }