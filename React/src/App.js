import React, { useEffect, useState, useRef } from 'react';
import mapboxgl from 'mapbox-gl'; // Remove "!" and "eslint-disable-line import/no-webpack-loader-syntax"
import ReactDOM from "react-dom"
import axios from 'axios';

mapboxgl.accessToken = 'pk.eyJ1IjoibWVobW9vZDk1MDEiLCJhIjoiY2xoZWl3Z2wyMHpyeTNncnBuaXFkdHFvNCJ9.Mr6A8qVIFGTrM3f8cVIH7A';
const Popup = ({ country }) => (
  <div className="popup">
    {country}
  </div>
)
export default function App() {
  const [latitude, setLatitude] = useState('');
  const popUpRef = useRef(new mapboxgl.Popup({ offset: 15 }))
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
        data: '/Mapbox_React/GeoJsons/africa-outline-with-countries_6.geojson' // Use a relative path
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
      // var data = [feature.properties.name,feature.properties.continent,feature.properties.postal]
      // alert(countryName);
      const featureJSON = JSON.stringify({ feature });
      axios.post('http://localhost:5000/api/data', {featureJSON})
        .then(res => console.log(res.data))
        .catch(err => console.error(err));

      const popupNode = document.createElement("div");
      ReactDOM.render(
        <Popup
          country={countryName}
        />,
        popupNode
      )
      popUpRef.current
        .setLngLat(e.lngLat)
        .setDOMContent(popupNode)
        .addTo(map)
      
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
