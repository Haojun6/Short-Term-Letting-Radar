// StatisticsComponent.js
import React, { useEffect, useState } from 'react';
import './StatisticsComponent.css'; // This assumes you have a CSS file for styles

const StatisticsComponent = () => {
  const [stats, setStats] = useState({
    total_listings: 0,
    average_price: 0,
    percentage_entire_home: 0,
    illegal: 0,
    illegal_in_rpz: 0,
    illegal_in_total: 0,
    percentage_rpz: 0,
    rpz_numbers: 0,
    // Add other state variables as needed based on your statistics
    entire_home: 0
  });

  useEffect(() => {
    // Fetch statistics from the backend
    fetch('http://localhost:5000/statistics')
      .then(response => response.json())
      .then(data => {
        setStats(data);
      })
      .catch(error => {
        console.error('Failed to fetch statistics', error);
      });
  }, []);

  // A function to calculate width for bar based on percentage
  const calculateBarWidth = (percentage) => `${percentage}%`;

  return (
    <div className="statistics-container">
      <div className="stats-section">
        <div className="filter-section">
          <div className="filter-dropdown">
            <select>
              <option value="Ireland">Ireland</option>
              <option value="Dublin">Dublin</option>
              <option value="Cork">Cork</option>
              <option value="Galway">Galway</option>
              <option value="Dún Laoghaire">Dún Laoghaire</option>
              <option value="Fingal">Fingal</option>
              <option value="Limerick">Limerick</option>
            </select>
          </div>
      </div>
        <div className="total-listings">
          <span className="total-number">{stats.total_listings.toLocaleString()} LISTINGS</span>
        </div>
        <div className="room-type-section">
          <h4>Room Type: </h4><h5>{stats.entire_home.toLocaleString()} Entire Homes out of {stats.total_listings.toLocaleString()}</h5>
          {/* Repeat structure below for each room type with appropriate state variables */}
          <div className="room-type-bar">
            <span className="room-type-label">Entire home/apt</span>
            <div className="bar" style={{ width: calculateBarWidth(stats.percentage_entire_home) }}>
              <span className="percentage">{stats.percentage_entire_home.toFixed(2)}%</span>
            </div>
          </div>
        </div>

        <div className="rent-pressure-section">
          <h4>Rent Pressure Zone: </h4><h5>{stats.rpz_numbers.toLocaleString()} in RPZ out of {stats.total_listings.toLocaleString()}</h5>
          {/* Repeat structure below for each room type with appropriate state variables */}
          <div className="rent-pressure-bar">
            <span className="rent-pressure-label">Rent-Pressure-Zone</span>
            <div className="bar" style={{ width: calculateBarWidth(stats.percentage_rpz) }}>
              <span className="percentage">{stats.percentage_rpz.toFixed(2)}%</span>
            </div>
          </div>
        </div>

        <div className="illegal-total-section">
          <h4>Illegal: </h4><h5>{stats.illegal.toLocaleString()} Illegals out of {stats.total_listings.toLocaleString()} in Total</h5>
          {/* Repeat structure below for each room type with appropriate state variables */}
          <div className="illegal-total-bar">
            <span className="illegal-total-label">Illegal-Total</span>
            <div className="bar" style={{ width: calculateBarWidth(stats.illegal_in_total) }}>
              <span className="percentage">{stats.illegal_in_total.toFixed(2)}%</span>
            </div>
          </div>
          <h5>{stats.illegal.toLocaleString()} Illegals out of {stats.rpz_numbers.toLocaleString()} in RPZ</h5>
          <div className="illegal-rpz-bar">
            <span className="illegal-rpz-label">Illegal-rpz</span>
            <div className="bar" style={{ width: calculateBarWidth(stats.illegal_in_rpz) }}>
              <span className="percentage">{stats.illegal_in_rpz.toFixed(2)}%</span>
            </div>
          </div>
        </div>

        {/* Include other statistics sections similar to room-type-section */}
      </div>
    </div>
  );
};

export default StatisticsComponent;
