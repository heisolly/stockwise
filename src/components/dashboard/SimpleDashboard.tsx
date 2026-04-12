'use client';

import { useSelector } from 'react-redux';
import { RootState } from '@/store';

export function SimpleDashboard() {
  const { user, businessProfile } = useSelector((state: RootState) => state.auth);

  console.log('SimpleDashboard: Rendering with user:', !!user, 'businessProfile:', !!businessProfile);

  return (
    <div className="p-6 bg-white min-h-screen">
      <h1 className="text-3xl font-bold text-gray-900 mb-4">
        Simple Dashboard Test
      </h1>
      
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Debug Information</h2>
        
        <div className="space-y-2">
          <p><strong>User:</strong> {user ? `${user.name} (${user.email})` : 'Not loaded'}</p>
          <p><strong>User Role:</strong> {user?.role || 'Not available'}</p>
          <p><strong>Business:</strong> {businessProfile?.name || 'Not loaded'}</p>
          <p><strong>Business ID:</strong> {businessProfile?.id || 'Not available'}</p>
          <p><strong>Onboarded:</strong> {businessProfile?.onboarded ? 'Yes' : 'No'}</p>
        </div>
      </div>

      <div className="mt-6 bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Test Content</h2>
        <p>If you can see this, the dashboard is loading successfully!</p>
        <p className="mt-2 text-gray-600">
          This is a minimal version of the dashboard to test if the routing and authentication are working properly.
        </p>
      </div>
    </div>
  );
}
