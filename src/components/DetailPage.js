import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import styles from './DetailPage.module.css'; // Import the CSS module correctly

const DetailPage = () => {
  const { id } = useParams();
  const [listing, setListing] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:5000/getListingDetails/${id}`)
      .then(response => response.json())
      .then(data => setListing(data))
      .catch(error => console.error('Failed to fetch statistics', error));
  }, [id]);

  if (!listing) return <div>Loading...</div>;

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>{listing.name}</h2>
      <p className={styles.detail}><span className={styles.detailTitle}>Price:</span> {listing.price}</p>
      <p className={styles.detail}><span className={styles.detailTitle}>Type:</span> {listing.room_type}</p>
      <p className={styles.detail}><span className={styles.detailTitle}>Host:</span> {listing.host_name}</p>
      <p className={styles.detail}><span className={styles.detailTitle}>Coordinates:</span> {listing.latitude}, {listing.longitude}</p>
      <p className={styles.detail}><span className={styles.detailTitle}>Region:</span> {listing.region_name}</p>
      <p className={styles.detail}><span className={styles.detailTitle}>Rent Pressure Zone:</span> {listing.rpz}</p>
      <p className={styles.detail}><span className={styles.detailTitle}>Potential Illegal:</span> {listing.illegal}</p>
      <img className={styles.homeimg} src={listing.picture_url} alt="Listing" />
    </div>
  );
};

export default DetailPage;
