// App.js or MainPage.js
import React from 'react';
import { MapProvider } from './MapContext';
import MapComponent from './MapComponent';
import SearchBar from './SearchBar';
import StatisticsComponent from './StatisticsComponent';

const MainPage = () => {
  return (
    <MapProvider>
      <div>
        <SearchBar />
        <MapComponent />
        <StatisticsComponent />
      </div>
    </MapProvider>
  );
};

export default MainPage;
