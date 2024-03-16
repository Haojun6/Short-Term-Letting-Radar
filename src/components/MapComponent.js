import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import SearchBar from './SearchBar';
import './MapComponent.css';
import { useMapContext } from './MapContext';
mapboxgl.accessToken = 'pk.eyJ1IjoiaHhpbmciLCJhIjoiY2x0YzFkMWk4MW53bjJqcXJqYzZ0N2l4ZSJ9.1j0iCy5UAqAmhs5mfqZ38w';

const MapComponent = () => {
   const { map, setMap } = useMapContext();
  const navigate = useNavigate();



  useEffect(() => {
    const initializeMap = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/hxing/cltlov0ke009601qo9sg89dz1',
      center: [-8.604,53.440],
      zoom: 6 // starting zoom
    });

    initializeMap.on('load', () => {
      setMap(initializeMap);
    });
  }, []);

  useEffect(() => {
    if (!map) return;

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
              region_name: item.region_name,
              rpz: item.rpz,
              illegal: item.illegal,
            },
            geometry: {
              type: 'Point',
              coordinates: [item.longitude, item.latitude],
            },
          })),
        };

        map.addSource('locations', { type: 'geojson', data: geoJson });
        map.addLayer({
          id: 'locations',
          type: 'symbol',
          source: 'locations',
          layout: {
    'icon-image': [
      'match',
      ['get', 'illegal'], // Check the 'illegal' property
      'Yes', 'caution', // If 'illegal' is 'Yes', use the 'cross' icon
      ['match', // Nested match for other conditions
        ['get', 'rpz'], // Now check the 'rpz' property
        'Yes', 'home1', // If 'rpz' is 'Yes', use the 'ranger-station' icon
        'home2' // Default icon if neither 'illegal' nor 'rpz' is 'Yes'
      ]
    ],
    'icon-size': 1
  }
        });

        const popup = new mapboxgl.Popup({
          closeButton: false,
          closeOnClick: false,
        });

        map.on('mouseenter', 'locations', (e) => {
          map.getCanvas().style.cursor = 'pointer';
          const coordinates = e.features[0].geometry.coordinates.slice();
          const { id, name, price, host_name, room_type, rpz, illegal } = e.features[0].properties;
          const description = `<div className={"description"}><strong>${name}</strong>
                                                              <p>Price: ${price}<br>
                                                              Type: ${room_type}<br>
                                                              Host: ${host_name}<br>
                                                              RPZ: ${rpz}<br>
                                                              Potential Illegal: ${illegal}</p></div>`;
          while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
            coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
          }

          popup.setLngLat(coordinates)
               .setHTML(description)
               .addTo(map);
        });

        map.on('mouseleave', 'locations', () => {
          map.getCanvas().style.cursor = '';
          popup.remove();
        });

        map.on('click', 'locations', function(e) {
          if (e.features.length > 0) {
            const feature = e.features[0];
            const listingId = feature.properties.id; // Ensure 'id' matches the property name in your data
            navigate(`/details/${listingId}`);
          }
        });
      })
      .catch(error => console.error('Failed to fetch', error));
  }, [map]); // Re-run this effect if the map instance changes

  return (
    <div className={"map"} id="map" style={{ width: '70%', height: '530px', marginTop: 100, marginLeft: -290, borderRadius: 20, }}>
    </div>
  );
};

export default MapComponent;
