import React, { useState } from 'react';
import { useMapContext } from './MapContext';
import "./SearchBar.css";

const SearchBar = () => {
  const { onSearch } = useMapContext();
  const [query, setQuery] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    if (query) onSearch(query);
  };

  return (
    <form className={"search-section"} onSubmit={handleSubmit}>
      <input className="search-bar"
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search locations"
      />
      <button className="search-button" type="submit">Search</button>
    </form>
  );
};

export default SearchBar;
