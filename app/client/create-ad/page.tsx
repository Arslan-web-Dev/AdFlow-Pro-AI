'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function CreateAdPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Create New Ad</h1>
        
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-600 mb-4">
            Create ad form will be implemented here.
          </p>
          <button
            onClick={() => router.back()}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
}
