'use client';

import { useEffect, useState } from 'react';

interface Visit {
  ip: string;
  userAgent: string;
  timestamp: string;
  path: string;
}

export default function SiteVisit() {
  const [visits, setVisits] = useState<Visit[]>([]);

  useEffect(() => {
    fetch('/api/track-visit')
      .then(res => res.json())
      .then(setVisits)
      .catch(console.error);
  }, []);

  return (
    <div className="bg-black/50 p-4 rounded-lg">
      <h2 className="text-xl font-bold mb-4">Recent Site Visits</h2>
      <div className="overflow-auto max-h-[400px]">
        {visits.slice(-10).reverse().map((visit, index) => (
          <div key={index} className="mb-2 p-2 border-b border-gray-700">
            <div className="text-sm text-gray-400">IP: {visit.ip}</div>
            <div className="text-xs text-gray-500">
              {new Date(visit.timestamp).toLocaleString()}
            </div>
            <div className="text-xs text-gray-500">Path: {visit.path}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
