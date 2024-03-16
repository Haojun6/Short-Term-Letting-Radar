// StatisticsComponent.js
import React, { useEffect, useState } from 'react';
import './StatisticsComponent.css'; // This assumes you have a CSS file for styles

const StatisticsComponent = () => {
  const [selectedFilter, setSelectedFilter] = useState('Ireland');
  const [stats, setStats] = useState({
    total_listings: 0,
    average_price: 0,
    percentage_entire_home: 0,
    illegal: 0,
    illegal_in_rpz: 0,
    illegal_in_total: 0,
    percentage_rpz: 0,
    rpz_numbers: 0,
    entire_home: 0
  });

  const AverageNumbers = {
    Ireland: 219,
    Dublin: 248,
    Cork: 223,
    Galway: 231,
    Dún_Laoghaire: 287,
    Fingal: 230,
    Limerick: 207
  };

  const IllegalNumbers = {
    Ireland: 8270,
    Dublin: 4197,
    Cork: 1938,
    Galway: 677,
    Dún_Laoghaire: 110,
    Fingal: 207,
    Limerick: 370
  };

  const EntireNumbers = {
    Ireland: 16186,
    Dublin: 4666,
    Cork: 2503,
    Galway: 1344,
    Dún_Laoghaire: 83,
    Fingal: 209,
    Limerick: 501
  };

  const PressureNumbers = {
    Ireland: 18400,
    Dublin: 8996,
    Cork: 4007,
    Galway: 1691,
    Dún_Laoghaire: 210,
    Fingal: 427,
    Limerick: 879
  };

  const listingNumbers = {
    Ireland: 23989,
    Dublin: 9020,
    Cork: 4011,
    Galway: 2254,
    Dún_Laoghaire: 210,
    Fingal: 433,
    Limerick: 1853
  };

  const handleFilterChange = (event) => {
    setSelectedFilter(event.target.value);
  };

  useEffect(() => {
    // Fetch other statistics from the backend
    fetch('http://localhost:5000/statistics')
      .then(response => response.json())
      .then(data => {
        setStats({
          ...data,
           // Override total listings with static data
        });
      })
      .catch(error => {
        console.error('Failed to fetch statistics', error);
      });
  }, [selectedFilter]);

  // A function to calculate width for bar based on percentage
  const calculateBarWidth = (percentage) => `${percentage}%`;

  return (
    <div className="statistics-container">
      <div className="stats-section">
        <div className="filter-section">
          <div className="filter-dropdown">
            <select onChange={handleFilterChange} value={selectedFilter}>
              <option value="Ireland">Ireland</option>
              <option value="Dublin">Dublin</option>
              <option value="Cork">Cork</option>
              <option value="Galway">Galway</option>
              <option value="Dún_Laoghaire">Dún Laoghaire</option>
              <option value="Fingal">Fingal</option>
              <option value="Limerick">Limerick</option>
            </select>
          </div>
        </div>
        <div className="total-listings">
          <h3 className="total-number">Short-Term Lettings: {listingNumbers[selectedFilter].toLocaleString()}</h3>
          <h3 className="average-price">Average Price: {AverageNumbers[selectedFilter].toLocaleString()}</h3>
        </div>
        <div className="room-type-section">
          <h4>Room Type: </h4><h5>{stats.entire_home.toLocaleString()} Entire Homes out of {listingNumbers[selectedFilter].toLocaleString()}</h5>

          <div className="room-type-bar">
            <span className="label"></span>
            <div className="bar" style={{ width: calculateBarWidth((EntireNumbers[selectedFilter]/listingNumbers[selectedFilter]*100).toFixed(2)) }}>
              <span className="percentage">{(EntireNumbers[selectedFilter]/listingNumbers[selectedFilter]*100).toFixed(2)}%</span>
            </div>
          </div>
        </div>

        <div className="rent-pressure-section">
          <h4>Rent Pressure Zone: </h4><h5>{PressureNumbers[selectedFilter].toLocaleString()} in RPZ out of {listingNumbers[selectedFilter].toLocaleString()}</h5>

          <div className="rent-pressure-bar">
            <span className="label"></span>
            <div className="bar" style={{ width: calculateBarWidth((PressureNumbers[selectedFilter]/listingNumbers[selectedFilter]*100).toFixed(2)) }}>
              <span className="percentage">{(PressureNumbers[selectedFilter]/listingNumbers[selectedFilter]*100).toFixed(2)}%</span>
            </div>
          </div>
        </div>

        <div className="illegal-total-section">
          <h4>Illegal: </h4><h5>{IllegalNumbers[selectedFilter].toLocaleString()} Illegals out of {listingNumbers[selectedFilter].toLocaleString()} in Total</h5>

          <div className="illegal-total-bar">
            <span className="label"></span>
            <div className="bar" style={{ width: calculateBarWidth((IllegalNumbers[selectedFilter]/listingNumbers[selectedFilter]*100).toFixed(2)) }}>
              <span className="percentage">{(IllegalNumbers[selectedFilter]/listingNumbers[selectedFilter]*100).toFixed(2)}%</span>
            </div>
          </div>
          <h5>{IllegalNumbers[selectedFilter].toLocaleString()} Illegals out of {PressureNumbers[selectedFilter].toLocaleString()} in RPZ</h5>
          <div className="illegal-rpz-bar">
            <span className="label"></span>
            <div className="bar" style={{ width: calculateBarWidth((IllegalNumbers[selectedFilter]/PressureNumbers[selectedFilter]*100).toFixed(2)) }}>
              <span className="percentage">{(IllegalNumbers[selectedFilter]/PressureNumbers[selectedFilter]*100).toFixed(2)}%</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default StatisticsComponent;
