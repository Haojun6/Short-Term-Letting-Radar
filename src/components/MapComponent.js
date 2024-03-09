import React, { useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

mapboxgl.accessToken = 'pk.eyJ1IjoiaHhpbmciLCJhIjoiY2x0YzFkMWk4MW53bjJqcXJqYzZ0N2l4ZSJ9.1j0iCy5UAqAmhs5mfqZ38w';

const MapComponent = () => {
  const [map, setMap] = useState(null);

  useEffect(() => {
    const initializeMap = new mapboxgl.Map({
      container: 'map', // container ID
      style: 'mapbox://styles/hxing/cltgc43kb002k01pjhntfgflz', // style URL
      center: [-6.2603, 53.3498], // starting position [lng, lat]
      zoom: 10 // starting zoom
    });

    initializeMap.on('load', () => {
      setMap(initializeMap);
    });
  }, []);

  useEffect(() => {
    if (!map) return; // Wait for the map to be initialized

    fetch('http://localhost:5000/getLocations')
      .then(response => response.json())
      .then(data => {
        const geoJson = {
          type: 'FeatureCollection',
          features: data.map(item => ({
            type: 'Feature',
            properties: {
              id: item.id,
              name: item.name,
              price: item.price,
              room_type: item.room_type,
              host_name: item.host_name,
            },
            geometry: {
              type: 'Point',
              coordinates: [item.longitude, item.latitude],
            },
          })),
        };

        map.addSource('points', { type: 'geojson', data: geoJson });
        map.addLayer({
          id: 'points',
          type: 'circle',
          source: 'points',
          paint: {
            'circle-color': [
              'match',
              ['get', 'room_type'],
              'Entire home/apt', '#00ff00', // Green for Entire home/apt
              '#ff0000' // Red for others
            ],
            'circle-radius': 3,
          },
        });

        const popup = new mapboxgl.Popup({
          closeButton: false,
          closeOnClick: false,
        });

        map.on('mouseenter', 'points', (e) => {
          map.getCanvas().style.cursor = 'pointer';
          const coordinates = e.features[0].geometry.coordinates.slice();
          const { id, name, price, host_name,room_type } = e.features[0].properties;
          const description = `<strong>${name}</strong><p>Price: ${price}<br>Type: ${room_type}<br>Host: ${host_name}</p>`;

          // Ensure that if the map is zoomed out such that multiple
          // copies of the feature are visible, the popup appears
          // over the copy being pointed to.
          while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
            coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
          }

          popup.setLngLat(coordinates)
               .setHTML(description)
               .addTo(map);
        });

        map.on('mouseleave', 'points', () => {
          map.getCanvas().style.cursor = '';
          popup.remove();
        });
      })
      .catch(error => console.error('Failed to fetch', error));
  }, [map]); // Re-run this effect if the map instance changes

  return <div id="map" style={{ width: '100%', height: '500px' }}></div>;
};

export default MapComponent;
