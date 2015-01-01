## mapquest-geojson

## install

<code> npm install mapquest-geojson </code>

## Config
Update your API Key Mapquest API Developer

## usage
<code> var mapquest = require('mapquest-geojson');</code>

<h2>Geocodind</h2>
Get all geographical infomraton about street's 

<code> geocode (street, city, state, format, function (data) {
// your code
}); </code>

## Response
<code>
data: {
    response: [], // response format about information <a href="http://open.mapquestapi.com/geocoding/#parameters" target="_blank"> here </a> <br />
    geojson: {} // gejson format <a href="http://geojson.org" target="_blank"> here </a>
}
</code>

