import React from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';  // Import useNavigate
import axios from 'axios';

const GuestForm = () => {
  const navigate = useNavigate();  // Initialize useNavigate

  const { register, handleSubmit, setValue } = useForm();

  const onSubmitGuestForm = async (data) => {
    try {
      // Make a POST request to your backend API
      const response = await axios.post('http://localhost:3001/guests', data);
      console.log('Data submitted successfully', response.data);

      // Use navigate to move to the /room-booking route with the folioNumber
      navigate(`/room-booking/${data.folio_number}`);
    } catch (error) {
      console.error('Error submitting data', error);
    }
  };

  // Function to generate a random folio number
  const generateFolioNumber = () => {
    const randomNumber = Math.floor(Math.random() * 10000) + 1;
    return 'GF' + randomNumber;
  };

  // Auto-generate and autofill folio_number on component mount
  React.useEffect(() => {
    const folioNumber = generateFolioNumber();
    setValue('folio_number', folioNumber);
  }, [setValue]);

  return (
    <form
      className="max-w-md mx-auto p-4 bg-white rounded-md shadow-md"
      onSubmit={handleSubmit(onSubmitGuestForm)}
    >
      <div className="mb-4">
        <label className="block text-sm font-bold mb-2" htmlFor="folio_number">
          Folio Number:
        </label>
        <input
          className="w-full px-3 py-2 border rounded-md"
          type="text"
          {...register('folio_number')}
          readOnly
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-bold mb-2" htmlFor="first_name">
          First Name:
        </label>
        <input
          className="w-full px-3 py-2 border rounded-md"
          type="text"
          {...register('first_name', { required: true })}
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-bold mb-2" htmlFor="surname">
          Surname:
        </label>
        <input
          className="w-full px-3 py-2 border rounded-md"
          type="text"
          {...register('surname', { required: true })}
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-bold mb-2" htmlFor="email">
          Email:
        </label>
        <input
          className="w-full px-3 py-2 border rounded-md"
          type="email"
          {...register('email', { required: true })}
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-bold mb-2" htmlFor="phone_number">
          Phone Number:
        </label>
        <input
          className="w-full px-3 py-2 border rounded-md"
          type="tel"
          {...register('phone_number', { required: true })}
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-bold mb-2" htmlFor="city">
          City:
        </label>
        <input
          className="w-full px-3 py-2 border rounded-md"
          type="text"
          {...register('city', { required: true })}
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-bold mb-2" htmlFor="country">
          Country:
        </label>
        <input
          className="w-full px-3 py-2 border rounded-md"
          type="text"
          {...register('country', { required: true })}
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-bold mb-2" htmlFor="zip">
          ZIP:
        </label>
        <input
          className="w-full px-3 py-2 border rounded-md"
          type="text"
          {...register('zip', { required: true })}
        />
      </div>

      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        type="submit"
      >
        Submit
      </button>
    </form>
  );
};

export default GuestForm;
