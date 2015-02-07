module.exports.version = '2.0.4';

module.exports = {
    appkey: 'Fmjtd%7Cluurn162n0%2C7a%3Do5-9wtsuw', 
    host: 'http://open.mapquestapi.com/geocoding/v1/',
    host_route: 'http://open.mapquestapi.com/directions/v2/',
    get_url_reverse: function (jsonquery) {
        var self = this;
        var url = this.host + 'reverse?key=' + this.appkey + 
            '&outFormat=json&inFormat=json&' +
            'json=' + JSON.stringify(jsonquery); 
        return url;
    },
    get_url_geocode: function (jsonquery) {
        var self = this;
        var url = this.host + 'address?key=' + this.appkey + 
            '&outFormat=json&inFormat=json&' +
            'json=' + JSON.stringify(jsonquery); 
        return url;
    },
    get_url_route: function (jsonquery) {
        var url = this.host_route + 'route?key=' + this.appkey +
            '&outFormat=json&inFormat=json' +
            '&json=' + JSON.stringify(jsonquery);
        return url;
    },
    get_url_routeLatLng: function (latS, lngS, latD, lngD, routeType) {
        
        var rt = 'bicycle';
        
        if (typeof routeType !== 'undefined') {
            rt = routeType;    
        };
        
        var url = this.host_route + 'route?key=' + this.appkey +
            '&outFormat=json' + 
            '&timeType=1&enhancedNarrative=false&' +  
            'shapeFormat=raw&generalize=0&' +
            'locale=it_IT&unit=k' +
            '&routeType=' + rt + 
            '&from=' + latS + ',' + lngS + 
            '&to=' + latD + ',' + lngD + 
            '&drivingStyle=2&highwayEfficiency=21.0'; 
        
        return url;
    }
}