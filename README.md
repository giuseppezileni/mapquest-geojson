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
    response: [],  <br />
    geojson: {}
}
</code>

Response format about OSM API click <a href="http://open.mapquestapi.com/geocoding/#parameters" target="_blank"> here </a>
Gejson format <a href="http://geojson.org" target="_blank"> here </a>

