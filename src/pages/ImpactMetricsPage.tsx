import React from 'react';

const ImpactMetricsPage = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Impact Metrics</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Environmental Impact</h2>
          <p className="text-gray-600">Track your environmental impact metrics here.</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Social Impact</h2>
          <p className="text-gray-600">Monitor your social impact initiatives here.</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Economic Impact</h2>
          <p className="text-gray-600">View your economic impact data here.</p>
        </div>
      </div>
    </div>
  );
};

export default ImpactMetricsPage;