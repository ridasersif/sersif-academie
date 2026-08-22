import React from 'react';

export default function SmartSearch() {
  return (
    <div className="smart-search-container w-full max-w-md mx-auto">
      <input 
        type="search" 
        placeholder="Rechercher un chapitre, un concept..." 
        className="w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );
}
