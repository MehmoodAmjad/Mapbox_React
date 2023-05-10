import React, { useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl'; // Remove "!" and "eslint-disable-line import/no-webpack-loader-syntax"
//import Map from './Map'
mapboxgl.accessToken = 'pk.eyJ1IjoibWVobW9vZDk1MDEiLCJhIjoiY2xoZWl3Z2wyMHpyeTNncnBuaXFkdHFvNCJ9.Mr6A8qVIFGTrM3f8cVIH7A';

export default function App() {
  const [latitude, setLatitude] = useState('');

  useEffect(() => {
    const map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mehmood9501/clhek9r3w018u01pg7nf23upk',
      center: [17.5, 4.5], // Centered on Africa
      zoom: 3 // Zoomed out to show Africa
    });

    map.on('load', function() {
      map.addSource('african-countries', {
        type: 'geojson',
        data: '/use-mapbox-gl-js-with-react/GeoJsons/africa-outline-with-countries_6.geojson' // Use a relative path
      });
    });

    map.on('click', function(e) {
      var features = map.queryRenderedFeatures(e.point, {
        layers: ['africa-outline-with-countries-dmm9nh']
      });
      
      if (!features.length) {
        return;
      }
      
      console.log('Clicked on feature:', features[0]);
      
      var feature = features[0];
      var countryName = feature.properties.name;
      
      // Do something with the country name, e.g. show it in an alert dialog
      alert(countryName);
    });

    // Get user's current location
    navigator.geolocation.getCurrentPosition(function(position) {
      setLatitude(position.coords.latitude);
    });
  }, []); // Add empty array as second argument to useEffect so it only runs once

  return (
    <div>
      <div id="map" className="map-container" />
      {latitude && <p>Latitude: {latitude}</p>}
    </div>
  );
}
