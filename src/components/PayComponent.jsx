import React from 'react';
import PaymentForm from './PaymentForm'; // Adjust the import path based on your project structure

const PayComponent = ({ totalAmount }) => {
  // You can now use the totalAmount prop in this component

  return (
    <div className="container mx-auto mt-8 p-4 bg-white shadow-md max-w-lg">
      <h2 className="text-2xl font-bold mb-4">Payment Details</h2>

      <div className="mb-4">
        <p className="text-lg font-semibold">Total Amount: ${totalAmount}</p>
      </div>

      {/* Add your payment form or components here */}
      <PaymentForm totalAmount={totalAmount} />
    </div>
  );
};

export default PayComponent;
