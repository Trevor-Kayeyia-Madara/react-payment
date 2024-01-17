import React, { useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Autosuggest from 'react-autosuggest';

const TransactionComponent = ({ room_rate, room_type, folio_number }) => {
  const { folioNumber } = useParams();
  const navigate = useNavigate();
  const [guestDetails, setGuestDetails] = useState({});
  const [extras, setExtras] = useState({
    cleaning_fee: true,
    sea_view: false,
    car_rental: false,
    breakfast: false,
    wifi: false,
    laundry: false,
    satellite_tv: false,
  });
  const [totalAmount, setTotalAmount] = useState(null);
  const [invoiceNumber, setInvoiceNumber] = useState('');
  const [transactionDate, setTransactionDate] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [selectedRoomType, setSelectedRoomType] = useState('');

  // Prices for extras
  const extrasPrices = useMemo(() => ({
    laundry: 10,
    satellite_tv: 10,
    car_rental: 30,
    sea_view: 10,
    breakfast: 10,
    wifi: 100,
    cleaning_fee: 10,
  }), []); // Empty dependency array ensures that the object is memoized on mount

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

  useEffect(() => {
    const handleCalculateTotal = async () => {
      try {
        const roomResponse = await fetch(`http://localhost:3001/rooms/${folioNumber}`);
        if (!roomResponse.ok) {
          throw new Error(`Error fetching room details: ${roomResponse.statusText}`);
        }
        const roomData = await roomResponse.json();
        const roomRate = roomData[0].room_rate;

        const extrasTotal = Object.entries(extras).reduce((acc, [extraName, isSelected]) => {
          const extraPrice = isSelected ? extrasPrices[extraName] : 0;
          return acc + extraPrice;
        }, 0);

        const vatRate = 0.22;
        const totalAmount = roomRate + extrasTotal + roomRate * vatRate;

        setTotalAmount(totalAmount);
      } catch (error) {
        console.error('Error calculating total amount:', error);
      }
    };

    handleCalculateTotal();
  }, [extras, extrasPrices, folioNumber]);

  const handleCheckboxChange = (name) => {
    setExtras((prevExtras) => ({
      ...prevExtras,
      [name]: !prevExtras[name],
    }));
  };

  const handleTransactionDateChange = (e) => {
    setTransactionDate(e.target.value);
  };

  const generateInvoiceNumber = () => {
    const generatedInvoiceNumber = 'INV-' + Math.floor(Math.random() * 1000);
    setInvoiceNumber(generatedInvoiceNumber);
  };

  useEffect(() => {
    generateInvoiceNumber();
    setTransactionDate(new Date().toISOString().split('T')[0]);
  }, []);

  const getSuggestions = (value) => {
    const rooms = ['Villa Sultan', 'Dyke Cottage'];
    const inputValueLower = value.toLowerCase();

    return rooms.filter((room) => room.toLowerCase().includes(inputValueLower));
  };

  const onSuggestionsFetchRequested = ({ value }) => {
    setSuggestions(getSuggestions(value));
  };

  const onSuggestionsClearRequested = () => {
    setSuggestions([]);
  };

  const onSuggestionSelected = (event, { suggestion }) => {
    setSelectedRoomType(suggestion);
  };

  const inputProps = {
    placeholder: 'Room Type',
    value: inputValue,
    onChange: (event, { newValue }) => setInputValue(newValue),
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Assuming you are making a POST request here
    const apiUrl = 'http://localhost:3001/payments'; // Replace with your actual API endpoint

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          transactionDate,
          room_type: selectedRoomType,
          invoiceNumber, // Use the correct state variable name here
          cleaning_fee: extras.cleaning_fee,
          sea_view: extras.sea_view,
          car_rental: extras.car_rental,
          breakfast: extras.breakfast,
          wifi: extras.wifi,
          laundry: extras.laundry,
          satellite_tv: extras.satellite_tv,
          amount: totalAmount,
        }),
      });

      if (!response.ok) {
        throw new Error(`Error submitting payment: ${response.statusText}`);
      }

      // Additional processing if needed

      // After a successful POST request, navigate to the new page
      const newPageUrl = `/payment-form/${folioNumber}/${totalAmount}`;
      navigate(newPageUrl);

    } catch (error) {
      console.error('Error submitting payment:', error);
      // Handle error, show a message, etc.
    }
  };

  return (
    <div className="container mx-auto mt-8 p-4 bg-white shadow-md max-w-lg">
      <h2 className="text-2xl font-bold mb-4">Transaction Details</h2>

      {/* Guest details */}
      <div className="mb-4">
        <p className="text-lg font-semibold">
          Guest Name: {guestDetails.first_name} {guestDetails.surname}
        </p>
        <p className="text-gray-600">Email: {guestDetails.email}</p>
        <p className="text-gray-600">Phone Number: {guestDetails.phone_number}</p>
      </div>

      {/* Form for payment details */}
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-bold mb-2" htmlFor="transactionDate">
            Transaction Date:
          </label>
          <input
            className="w-full px-3 py-2 border rounded-md"
            type="date"
            id="transactionDate"
            value={transactionDate}
            onChange={handleTransactionDateChange}
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-bold mb-2" htmlFor="room_type">
            Indicate the Room Type you booked for:
          </label>
          <Autosuggest
            suggestions={suggestions}
            onSuggestionsFetchRequested={onSuggestionsFetchRequested}
            onSuggestionsClearRequested={onSuggestionsClearRequested}
            onSuggestionSelected={onSuggestionSelected}
            getSuggestionValue={(suggestion) => suggestion}
            renderSuggestion={(suggestion) => <div>{suggestion}</div>}
            inputProps={inputProps}
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-bold mb-2" htmlFor="invoiceNumber">
            Invoice Number:
          </label>
          <input className="w-full px-3 py-2 border rounded-md" type="text" id="invoiceNumber" readOnly value={invoiceNumber} />
        </div>

        {Object.entries(extras).map(([extraName, isSelected]) => (
          <div key={extraName} className="flex items-center mb-2">
            <input
              type="checkbox"
              id={extraName}
              checked={isSelected}
              onChange={() => handleCheckboxChange(extraName)}
              disabled={extraName === 'cleaning_fee'} // Disable cleaning_fee checkbox
            />
            <label htmlFor={extraName} className="ml-2">
              {extraName.replace('_', ' ')} (+${extrasPrices[extraName]})
            </label>
          </div>
        ))}

        <div className="mb-4">
          <label className="block text-sm font-bold mb-2" htmlFor="amount">
            Amount:
          </label>
          <input className="w-full px-3 py-2 border rounded-md" type="text" id="amount" readOnly value={totalAmount} />
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

export default TransactionComponent;
