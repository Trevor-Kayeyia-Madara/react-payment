import TransactionComponent from './TransactionComponent';
import React, { useState } from 'react';
import RoomComponent from './RoomComponent';

const ConfirmComponent = () => {
  const [bookingData, setBookingData] = useState(null);

  const handleRoomBookingSuccess = (bookingData, guestDetails, roomRate, roomType, folioNumber) => {
    // Do something with the booking data if needed
    setBookingData(bookingData);
  };

  return (
    <div>
      {/* Render RoomComponent and pass onRoomBookingSuccess as a prop */}
      <RoomComponent onRoomBookingSuccess={handleRoomBookingSuccess} />

      {/* Conditionally render TransactionComponent with room_rate, room_type, and folio_number props */}
      {bookingData && (
        <TransactionComponent
          room_rate={bookingData.room_rate}
          room_type={bookingData.room_type}
          folio_number={bookingData.folio_number}
        />
      )}
    </div>
  );
};

export default ConfirmComponent;
