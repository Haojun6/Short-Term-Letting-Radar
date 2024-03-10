import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import SearchBar from './SearchBar';
import { useMapContext } from './MapContext';
mapboxgl.accessToken = 'pk.eyJ1IjoiaHhpbmciLCJhIjoiY2x0YzFkMWk4MW53bjJqcXJqYzZ0N2l4ZSJ9.1j0iCy5UAqAmhs5mfqZ38w';

const MapComponent = () => {
   const { map, setMap } = useMapContext();
  const navigate = useNavigate();

  const handleStyleLoad = () => {
  console.log("Style loaded, attempting to re-add sources and layers");

  if (!map) {
    console.error("Map instance is not available");
    return;
  }

  const geoJsonData = {
    type: 'FeatureCollection',
    features: [
      // Example feature, replace with your actual data structure
      {
        type: 'Feature',
        properties: {
          room_type: 'Entire home/apt', // Example property
        },
        geometry: {
          type: 'Point',
          coordinates: [-74.006, 40.7128], // Example coordinates
        },
      },
    ],
  };

  if (!map.getSource('locations')) {
    map.addSource('locations', { type: 'geojson', data: geoJsonData });
    console.log("Source added");
  } else {
    // Update source data if it already exists
    map.getSource('locations').setData(geoJsonData);
    console.log("Source updated");
  }

  if (!map.getLayer('locations')) {
    map.addLayer({
      id: 'locations',
      type: 'symbol',
      source: 'locations',
      layout: {
        'icon-image': 'home', // Use a simple icon for testing
        'icon-size': 1.5,
      },
    });
    console.log("Layer added");
  } else {
    console.log("Layer already exists");
  }
};





  useEffect(() => {
    const initializeMap = new mapboxgl.Map({
      container: 'map', // container ID
      style: 'mapbox://styles/hxing/cltlov0ke009601qo9sg89dz1', // style URL
      center: [0, 10], // starting position [lng, lat]
      zoom: 10 // starting zoom
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
              ['get', 'room_type'],
              'Entire home/apt', 'home', // Example: 'home-15' is a Maki icon
              'home1' // Default to 'star-15' for others. Make sure to choose icons that exist in your Mapbox style or are generally available
            ],
            'icon-size': 1 // Adjust the size as necessary
          }
        });

        const popup = new mapboxgl.Popup({
          closeButton: false,
          closeOnClick: false,
        });

        map.on('mouseenter', 'locations', (e) => {
          map.getCanvas().style.cursor = 'pointer';
          const coordinates = e.features[0].geometry.coordinates.slice();
          const { id, name, price, host_name,room_type } = e.features[0].properties;
          const description = `<strong>${name}</strong><p>Price: ${price}<br>Type: ${room_type}<br>Host: ${host_name}</p>`;
          console.log(id)
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

  useEffect(() => {
  if (!map) return;

  map.on('style.load', handleStyleLoad);

  // Cleanup the event listener when the component unmounts or the map instance changes
  return () => {
    map.off('style.load', handleStyleLoad);
  };
}, [map]); // Dependencies array includes `map` to re-bind the event listener if the map instance changes


  return (
    <div id="map" style={{ width: '100%', height: '500px' }}>

    </div>
  );
};

export default MapComponent;
