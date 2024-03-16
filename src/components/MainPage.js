import React from 'react';
import { MapProvider } from './MapContext';
import MapComponent from './MapComponent';
import SearchBar from './SearchBar';
import StatisticsComponent from './StatisticsComponent';
import './MainPage.css';

const MainPage = () => {
  const imgurl = "https://t4.ftcdn.net/jpg/04/57/12/43/360_F_457124365_Px9SbN2aaT86tL7EEitzB2s2eMk4Uaou.webp"
  return (
    <MapProvider>
  <div className="body">
    <div className="header-container">
      <h1 className="header">Short-Term Letting Radar</h1>
      <img className="img" src={imgurl} alt="radar img"/>
    </div>
    <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'start', padding: '20px' }}>
      <SearchBar />
      <MapComponent />
      <StatisticsComponent className="statistics-component" />
    </div>
  </div>
</MapProvider>
  );
};

export default MainPage;
