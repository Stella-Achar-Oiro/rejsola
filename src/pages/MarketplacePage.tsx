import React from 'react';

const MarketplacePage = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Marketplace</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Placeholder for marketplace items */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Coming Soon</h2>
          <p className="text-gray-600">The marketplace is currently under development.</p>
        </div>
      </div>
    </div>
  );
};

export default MarketplacePage;