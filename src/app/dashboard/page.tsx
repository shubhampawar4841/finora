'use client'

import React from 'react';
import { useUser ,  UserButton } from '@clerk/nextjs';


export default function Dashboard() {
  const { user } = useUser();

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <header className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <div className="flex items-center space-x-2">

        </div>
      </header>
      {user && (
            <>
            
              <span className="text-gray-700">Welcome, {user.firstName}!</span>
            </>
          )}
    </div>
  );
}