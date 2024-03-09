// StatisticsComponent.js

import React, { useEffect, useState } from 'react';

const StatisticsComponent = () => {
  const [stats, setStats] = useState({
    total_listings: 0,
    average_price: 0,
    percentage_entire_home: 0,
  });

  useEffect(() => {
    // Fetch statistics from the backend
    fetch('http://localhost:5000/statistics') // Ensure this URL matches your Flask route
      .then(response => response.json())
      .then(data => {
        setStats(data);
      })
      .catch(error => {
        console.error('Failed to fetch statistics', error);
      });
  }, []);

  return (
    <div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '5px', marginLeft: '20px' }}>
      <h3>Statistics</h3>
      <p>Total Listings: {stats.total_listings}</p>
      <p>Average Price: ${stats.average_price.toFixed(2)}</p>
      <p>Entire Home/Apt: {stats.percentage_entire_home.toFixed(2)}%</p>
    </div>
  );
};

export default StatisticsComponent;
