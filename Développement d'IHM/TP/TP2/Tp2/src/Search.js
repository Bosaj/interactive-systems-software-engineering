import React from 'react';

const Search = ({ onSearch }) => {
  return (
    <div>
      <input 
        type="text" 
        placeholder="Rechercher par titre" 
        onChange={onSearch} // Appel de la fonction onSearch lors de la saisie
      />
    </div>
  );
};

export default Search;
