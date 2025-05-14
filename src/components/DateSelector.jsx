import React from 'react';
import PropTypes from 'prop-types';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const DateSelector = ({ selectedDate, onChange, isProduction = true }) => {
  return (
    <div className="flex flex-col items-center mb-6 space-y-2">
      <h1 className="text-2xl font-bold">FITX120 Sales Calendar</h1>
      <div className="text-gray-600 font-medium">
        {isProduction ? 'Production Mode' : 'Development Mode'}
      </div>
      <div className="inline-block">
        <DatePicker
          selected={selectedDate}
          onChange={onChange}
          dateFormat="dd/MM/yyyy"
          className="border px-3 py-2 rounded text-center"
        />
      </div>
    </div>
  );
};

DateSelector.propTypes = {
  selectedDate: PropTypes.instanceOf(Date).isRequired,
  onChange: PropTypes.func.isRequired,
  isProduction: PropTypes.bool
};

export default DateSelector;
