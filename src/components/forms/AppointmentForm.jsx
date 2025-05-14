import React, { useState } from 'react';
import PropTypes from 'prop-types';

// Define setters array directly
const SETTERS = [
  'Vicky',
  'Vikneswar',
  'Hemaanth',
  'Harneesh',
  'Krishna',
  'Kumaran',
  'Sethu',
  'Prasanna',
  'Sales Person'
];

const PITCH_TYPES = [
  { value: '5k_pitched', label: '10K Pitch' },  // Updated display label, keeping value same for DB compatibility
  { value: '20k_pitched', label: '20K Pitch' }
];

// Helper function to format time to 12-hour format
const formatTo12Hour = (time) => {
  const [hours, minutes] = time.split(':');
  const hour = parseInt(hours);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const hour12 = hour % 12 || 12;
  return `${hour12}:${minutes} ${ampm}`;
};

const AppointmentForm = ({ onClose, onSubmit, salesPerson, time, isUnavailable }) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    notes: '',
    setterName: '',
    pitchType: '',
    initialPayment: '', // no default
    leadSource: 'ads', // default value
    leadQuality: '', // no default
    bookingDate: new Date().toISOString().split('T')[0] // default to current date in YYYY-MM-DD format
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ 
      ...formData, 
      salesPerson, 
      time,
      initialPitchType: formData.pitchType,
      bookingDate: formData.bookingDate
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-5 rounded-lg w-[420px] text-[15px]">
        <h2 className="text-lg font-bold mb-3">
          Book Appointment - {salesPerson} - {formatTo12Hour(time)}
          {isUnavailable && (
            <span className="text-[13px] text-red-500 block">
              Note: This slot is normally unavailable
            </span>
          )}
        </h2>
        <form onSubmit={handleSubmit}>
          {/* Client Information */}
          <div className="mb-3">
            <div className="mb-2">
              <label className="block mb-1 text-[14px]">Name *</label>
              <input
                required
                className="w-full border p-1.5 rounded text-[14px]"
                value={formData.name}
                onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
              />
            </div>

            <div className="mb-2">
              <label className="block mb-1 text-[14px]">Phone *</label>
              <input
                required
                type="tel"
                className="w-full border p-1.5 rounded text-[14px]"
                value={formData.phone}
                onChange={e => setFormData(prev => ({ ...prev, phone: e.target.value }))}
              />
            </div>

            <div className="mb-2">
              <label className="block mb-1 text-[14px]">Notes</label>
              <textarea
                className="w-full border p-1.5 rounded text-[14px] h-16"
                value={formData.notes}
                onChange={e => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              />
            </div>
          </div>

          {/* Setter Information */}
          <div className="mb-3">
            <div className="text-[14px] font-semibold text-gray-500 mb-2 border-b pb-1">Setter Data</div>
            
            <div className="mb-2">
              <label className="block mb-1 text-[14px]">Setter Name *</label>
              <select
                required
                className="w-full border p-1.5 rounded text-[14px]"
                value={formData.setterName}
                onChange={e => setFormData(prev => ({ ...prev, setterName: e.target.value }))}
              >
                <option value="">Select Setter</option>
                {SETTERS.map(setter => (
                  <option key={setter} value={setter}>{setter}</option>
                ))}
              </select>
            </div>

            <div className="mb-2">
              <label className="block mb-1 text-[14px]">Date of Booking *</label>
              <input
                type="date"
                required
                className="w-full border p-1.5 rounded text-[14px]"
                value={formData.bookingDate}
                onChange={e => setFormData(prev => ({ ...prev, bookingDate: e.target.value }))}
              />
            </div>

            <div className="mb-2">
              <label className="block mb-1 text-[14px]">Pitch Type *</label>
              <select
                required
                className="w-full border p-1.5 rounded text-[14px]"
                value={formData.pitchType}
                onChange={e => setFormData(prev => ({ ...prev, pitchType: e.target.value }))}
              >
                <option value="">Select Pitch Type</option>
                {PITCH_TYPES.map(pitch => (
                  <option key={pitch.value} value={pitch.value}>{pitch.label}</option>
                ))}
              </select>
            </div>

            <div className="flex gap-6 mb-2">
              <div className="w-1/2">
                <label className="block mb-1 text-[14px]">Rs. 50 Paid? *</label>
                <div className="flex gap-3 text-[14px]">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="initialPayment"
                      value="paid"
                      checked={formData.initialPayment === 'paid'}
                      onChange={e => setFormData(prev => ({ ...prev, initialPayment: e.target.value }))}
                      className="mr-2"
                      required
                    />
                    Yes
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="initialPayment"
                      value="unpaid"
                      checked={formData.initialPayment === 'unpaid'}
                      onChange={e => setFormData(prev => ({ ...prev, initialPayment: e.target.value }))}
                      className="mr-2"
                    />
                    No
                  </label>
                </div>
              </div>

              <div className="w-1/2">
                <label className="block mb-1 text-[14px]">Lead Quality? *</label>
                <div className="flex flex-col gap-1 text-[14px]">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="leadQuality"
                      value="best"
                      checked={formData.leadQuality === 'best'}
                      onChange={e => setFormData(prev => ({ ...prev, leadQuality: e.target.value }))}
                      className="mr-2"
                      required
                    />
                    Best
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="leadQuality"
                      value="good"
                      checked={formData.leadQuality === 'good'}
                      onChange={e => setFormData(prev => ({ ...prev, leadQuality: e.target.value }))}
                      className="mr-2"
                    />
                    Good
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="leadQuality"
                      value="average"
                      checked={formData.leadQuality === 'average'}
                      onChange={e => setFormData(prev => ({ ...prev, leadQuality: e.target.value }))}
                      className="mr-2"
                    />
                    Average
                  </label>
                </div>
              </div>
            </div>

            <div className="mb-2">
              <label className="block mb-1 text-[14px]">Lead Source *</label>
              <div className="flex gap-3 text-[14px]">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="leadSource"
                    value="ads"
                    checked={formData.leadSource === 'ads'}
                    onChange={e => setFormData(prev => ({ ...prev, leadSource: e.target.value }))}
                    className="mr-2"
                  />
                  Ads
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="leadSource"
                    value="youtube"
                    checked={formData.leadSource === 'youtube'}
                    onChange={e => setFormData(prev => ({ ...prev, leadSource: e.target.value }))}
                    className="mr-2"
                  />
                  YouTube
                </label>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <button 
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 bg-gray-200 rounded hover:bg-gray-300 text-[14px]"
            >
              Cancel
            </button>
            <button 
              type="submit"
              className="px-3 py-1.5 bg-green-600 text-white rounded hover:bg-green-700 text-[14px]"
            >
              Book
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

AppointmentForm.propTypes = {
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  salesPerson: PropTypes.string.isRequired,
  time: PropTypes.string.isRequired,
  isUnavailable: PropTypes.bool
};

export default AppointmentForm;
