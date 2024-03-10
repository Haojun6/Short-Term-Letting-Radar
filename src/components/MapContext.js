// MapContext.js
import React, { createContext, useContext, useState } from 'react';
import mapboxgl from 'mapbox-gl';

mapboxgl.accessToken = 'pk.eyJ1IjoiaHhpbmciLCJhIjoiY2x0YzFkMWk4MW53bjJqcXJqYzZ0N2l4ZSJ9.1j0iCy5UAqAmhs5mfqZ38w';

const MapContext = createContext();

export const useMapContext = () => useContext(MapContext);

export const MapProvider = ({ children }) => {
  const [map, setMap] = useState(null);

  const onSearch = async (query) => {
    // Fuzzy search implementation or integration with a geocoding service
    // For simplicity, this example uses the Mapbox Geocoding API directly
    const geocodingUrl = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json?access_token=${mapboxgl.accessToken}`;

    try {
      const response = await fetch(geocodingUrl);
      const data = await response.json();

      if (data.features && data.features.length > 0) {
        const [longitude, latitude] = data.features[0].center;

        if (map) {
          map.flyTo({
            center: [longitude, latitude],
            essential: true,
            zoom: 10
          });
        }
      } else {
        console.log('No results found');
      }
    } catch (error) {
      console.error('Error searching for location:', error);
    }
  };

  return (
    <MapContext.Provider value={{ map, setMap, onSearch }}>
      {children}
    </MapContext.Provider>
  );
};
