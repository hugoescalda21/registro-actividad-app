import React from 'react';

export const SkeletonCard = () => (
  <div className="card-gradient p-6 animate-pulse">
    <div className="flex items-center justify-between mb-4">
      <div className="h-6 bg-gray-300 rounded w-32"></div>
      <div className="h-8 bg-gray-300 rounded w-20"></div>
    </div>
    <div className="space-y-3">
      <div className="h-4 bg-gray-300 rounded w-full"></div>
      <div className="h-4 bg-gray-300 rounded w-3/4"></div>
    </div>
  </div>
);

export const SkeletonStat = () => (
  <div className="bg-white rounded-xl p-4 shadow-lg animate-pulse">
    <div className="h-4 bg-gray-300 rounded w-20 mb-3"></div>
    <div className="h-8 bg-gray-300 rounded w-24"></div>
  </div>
);