import React from 'react';
import GuestForm from './GuestComponent';

function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md w-full p-4 bg-white rounded-md shadow-md">
        <GuestForm />
      </div>
    </div>
  );
}

export default Home;
