import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const DetailPage = () => {
  const { id } = useParams();
  const [listing, setListing] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:5000/getListingDetails/${id}`)
      .then(response => response.json())
      .then(data => setListing(data));
  }, [id]);

  if (!listing) return <div>Loading...</div>;

  return (
    <div>
      <h2>{listing.name}</h2>
      <p>Price: {listing.price}</p>
      <p>Type: {listing.room_type}</p>
      <p>Host: {listing.host_name}</p>
      {/* Display other details */}
      <img src={listing.picture_url} alt="Listing" />
    </div>
  );
};

export default DetailPage;
