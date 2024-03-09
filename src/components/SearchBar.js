// SearchBar.js
import React, { useState } from 'react';

const SearchBar = ({ onSearch }) => { // Ensure onSearch is properly destructured from props
  const [query, setQuery] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    if (query) onSearch(query); // Correctly calling onSearch passed as prop
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <button type="submit">Search</button>
    </form>
  );
};

export default SearchBar;
