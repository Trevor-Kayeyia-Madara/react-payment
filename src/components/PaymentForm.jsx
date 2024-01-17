import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const PaymentForm = () => {
    const { folioNumber, totalAmount } = useParams();
  const [guestDetails, setGuestDetails] = useState({});
  const [selectedPaymentMode, setSelectedPaymentMode] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchGuestDetails = async () => {
      try {
        const response = await fetch(`http://localhost:3001/guests/${folioNumber}`);

        if (!response.ok) {
          const errorMessage = await response.text();
          throw new Error(`Error fetching guest details: ${errorMessage}`);
        }

        const data = await response.json();
        setGuestDetails(data);
      } catch (error) {
        console.error('Error fetching guest details:', error);
      }
    };

    fetchGuestDetails();
  }, [folioNumber]);

  const handlePaymentModeChange = (e) => {
    setSelectedPaymentMode(e.target.value);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();

    // Perform additional validation if needed

    // Prepare data for Node Mailer email
    const emailData = {
      folio_number: guestDetails.folio_number,
      first_name: guestDetails.first_name,
      last_name: guestDetails.last_name,
      email: guestDetails.email,
      amount: totalAmount, // Adjust the field name based on your database schema
      selected_payment_mode: selectedPaymentMode,
      message: message,
    };

    // Assuming you have an endpoint for sending emails
    fetch('http://localhost:3001/send-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(emailData),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Error sending email: ${response.statusText}`);
        }
        // Handle success, show a confirmation message, etc.
        console.log('Email sent successfully!');
      })
      .catch((error) => {
        console.error('Error sending email:', error);
        // Handle error, show an error message, etc.
      });
  };

  return (
    <div className="container mx-auto mt-8 p-4 bg-white shadow-md max-w-lg">
      <h2 className="text-2xl font-bold mb-4">Payment Form</h2>

      {/* Guest details */}
      <div className="mb-4">
        <p className="text-lg font-semibold">
          Guest Name: {guestDetails.first_name} {guestDetails.last_name}
        </p>
        <p className="text-gray-600">Email: {guestDetails.email}</p>
        <p className="text-gray-600">Amount: ${totalAmount}</p>
      </div>

      {/* Form for payment details */}
      <form onSubmit={handleFormSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-bold mb-2" htmlFor="paymentMode">
            Select Mode of Payment:
          </label>
          <select
            id="paymentMode"
            className="w-full px-3 py-2 border rounded-md"
            value={selectedPaymentMode}
            onChange={handlePaymentModeChange}
            required
          >
            <option value="">Select Payment Mode</option>
            <option value="Bank Transfer">Bank Transfer</option>
            <option value="Credit Card">Credit Card</option>
            <option value="Payment On Arrival">Payment On Arrival</option>
            <option value="Booking Request">Booking Request</option>
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-bold mb-2" htmlFor="message">
            Message:
          </label>
          <textarea
            id="message"
            className="w-full px-3 py-2 border rounded-md"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          ></textarea>
        </div>

        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          type="submit"
        >
          Submit Payment
        </button>
      </form>
    </div>
  );
};

export default PaymentForm;
