import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import ConfirmComponent from './ConfirmComponent';

const RoomComponent = () => {
  const { register, setValue, handleSubmit, watch } = useForm();
  const { folioNumber } = useParams();
  const navigate = useNavigate();
  const roomType = watch('room_type');
  const checkInDate = watch('check_in_date');
  const checkOutDate = watch('check_out_date');
  const [guestDetails, setGuestDetails] = useState(null);
  const [bookingData, setBookingData] = useState(null);

  useEffect(() => {
    const fetchGuestDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/guests/${folioNumber}`);
        setGuestDetails(response.data);
      } catch (error) {
        console.error('Error fetching guest details', error);
      }
    };

    fetchGuestDetails();
  }, [folioNumber]);

  useEffect(() => {
    const handleRoomTypeChange = () => {
      const rate = roomType === 'Villa Sultan' ? 200.0 : roomType === 'Dyke Cottage' ? 180.0 : 0.0;
      setValue('room_rate', rate);
    };

    const calculateNumberOfNights = () => {
      if (checkInDate && checkOutDate) {
        const checkIn = new Date(checkInDate);
        const checkOut = new Date(checkOutDate);
        const numberOfNights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
        setValue('number_of_nights', numberOfNights);
      }
    };

    handleRoomTypeChange();
    calculateNumberOfNights();
  }, [roomType, checkInDate, checkOutDate, setValue]);

  const onSubmit = async (data) => {
    try {
      const roomBookingResponse = await axios.post('http://localhost:3001/rooms', {
        ...data,
        folio_number: folioNumber,
      });

      const { room_rate, room_type } = data;
      setBookingData({ room_rate, room_type, ...roomBookingResponse.data });
      navigate(`/transaction/${folioNumber}`);
    } catch (error) {
      console.error('Error submitting room data', error);
    }
  };

  return (
    <div className="max-w-md mx-auto p-4 bg-white rounded-md shadow-md">
      <h2 className="text-2xl font-bold mb-4">Folio Number: {folioNumber}</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-4">
          <label className="block text-sm font-bold mb-2" htmlFor="room_type">
            Room Type:
          </label>
          <select className="w-full px-3 py-2 border rounded-md" {...register('room_type', { required: true })}>
            <option value="Villa Sultan">Villa Sultan</option>
            <option value="Dyke Cottage">Dyke Cottage</option>
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-bold mb-2" htmlFor="no_of_guests">
            Number of Guests:
          </label>
          <input className="w-full px-3 py-2 border rounded-md" type="number" {...register('no_of_guests', { required: true })} />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-bold mb-2" htmlFor="room_rate">
            Room Rate:
          </label>
          <input className="w-full px-3 py-2 border rounded-md" type="number" {...register('room_rate', { required: true })} readOnly />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-bold mb-2" htmlFor="check_in_date">
            Check-in Date:
          </label>
          <input className="w-full px-3 py-2 border rounded-md" type="date" {...register('check_in_date', { required: true })} />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-bold mb-2" htmlFor="check_out_date">
            Check-out Date:
          </label>
          <input className="w-full px-3 py-2 border rounded-md" type="date" {...register('check_out_date', { required: true })} />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-bold mb-2" htmlFor="number_of_nights">
            Number of Nights:
          </label>
          <input className="w-full px-3 py-2 border rounded-md" type="number" {...register('number_of_nights', { required: true })} readOnly />
        </div>

        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" type="submit">
          Submit Room Data
        </button>
      </form>
      {/* Render ConfirmComponent with bookingData */}
      {bookingData && <ConfirmComponent bookingData={bookingData} guestDetails={guestDetails} folioNumber={folioNumber} />}
    </div>
  );
};

export default RoomComponent;
