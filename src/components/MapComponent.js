import React, { useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

mapboxgl.accessToken = 'pk.eyJ1IjoiaHhpbmciLCJhIjoiY2x0YzFkMWk4MW53bjJqcXJqYzZ0N2l4ZSJ9.1j0iCy5UAqAmhs5mfqZ38w';

const MapComponent = () => {

  const [locations, setLocations] = useState([]);

  const locationsToGeoJSON = (locations) => {
    return {
      type: 'FeatureCollection',
      features: locations.map(location => ({
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [location.longitude, location.latitude]
        },
        properties: {}
      }))
    };
  };

  useEffect(() => {
  const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/streets-v11', // style URL
    center: [-6.25, 53.35], // Initial center position
    zoom: 12 // Initial zoom level
  });

  map.on('load', () => {
    // Fetch locations after the map is initialized
    fetch('http://localhost:5000/getLocations')
      .then(response => response.json())
      .then(data => {
        const geojsonData = locationsToGeoJSON(data);

        // Add a new source from our GeoJSON data
        // console.log(geojsonData);
        map.addSource('locations', {
          type: 'geojson',
          data: geojsonData
        });

        // Add a layer to use the source to create red circles
        map.addLayer({
          id: 'locations-points',
          type: 'circle',
          source: 'locations',
          paint: {
            // Use the 'circle-color' paint property to make the circles red
            'circle-color': '#ff0000',
            'circle-radius': 1.5 // Size of the circle
          }
        });

        // Optionally adjust the map view to the first location
        if (data.length > 0) {
          map.flyTo({center: [data[0].longitude, data[0].latitude], zoom: 10});
        }
      })
      .catch(error => console.error('Failed to fetch', error));
  });
}, []);

  return <div id="map" style={{width: '100%', height: '400px'}}></div>;
};

export default MapComponent;
