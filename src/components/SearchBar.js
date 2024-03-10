// SearchBar.js
import React, { useState } from 'react';
import { useMapContext } from './MapContext';

const SearchBar = () => {
  const { onSearch } = useMapContext();
  const [query, setQuery] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    if (query) onSearch(query);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search locations"
      />
      <button type="submit">Search</button>
    </form>
  );
};

export default SearchBar;
