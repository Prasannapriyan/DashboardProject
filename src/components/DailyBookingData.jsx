import React, { useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

// Define setters array (excluding Sales Person)
const SETTERS = [
  'Vicky',
  'Vikneswar',
  'Hemaanth',
  'Harneesh',
  'Krishna',
  'Raju',
  'Sethu',
  'Prasanna',
  'Abi Mahesh'
];

const formatDateToYYYYMMDD = (date) => {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const processBookingData = (appointments, startDate, endDate) => {
  // Set dates to local midnight
  const start = new Date(startDate);
  start.setHours(0, 0, 0, 0);
  
  const end = new Date(endDate);
  end.setHours(23, 59, 59, 999);

  // Initialize an object to store data for all dates in the range
  const allDates = {};
  const currentDate = new Date(start);
  
  // Add all dates in range with zero values
  while (currentDate <= end) {
    const dateStr = formatDateToYYYYMMDD(currentDate);
    allDates[dateStr] = {
      totalBooked: 0,
      tenK: 0,
      twentyK: 0,
      best: 0,
      good: 0,
      average: 0,
      setterCounts: Object.fromEntries(SETTERS.map(setter => [setter, 0]))
    };
    currentDate.setDate(currentDate.getDate() + 1);
  }

  // Add actual booking data
  appointments
    .filter(app => {
      const bookingDate = new Date(app.bookingDate + 'T00:00:00');
      // Only count original bookings (not rescheduled ones)
      return bookingDate >= start && 
             bookingDate <= end && 
             !app.rescheduledFrom;
    })
    .forEach(app => {
      const date = formatDateToYYYYMMDD(new Date(app.bookingDate));
      if (allDates[date]) {
        allDates[date].totalBooked++;
        allDates[date][app.initialPitchType === '5k_pitched' ? 'tenK' : 'twentyK']++;
        allDates[date][app.leadQuality]++;
        if (app.setterName && app.setterName !== 'Sales Person') {
          allDates[date].setterCounts[app.setterName]++;
        }
      }
    });

  return allDates;
};

const DailyBookingData = ({ appointments = [] }) => {
  const [dateRange, setDateRange] = useState([new Date(), new Date()]);
  const [startDate, endDate] = dateRange;

  const bookingData = useMemo(() => {
    const processedData = processBookingData(appointments, startDate, endDate);
    return Object.entries(processedData)
      .map(([date, stats]) => ({ date, ...stats }))
      .sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [appointments, startDate, endDate]);

  return (
    <div className="mt-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-bold">Daily Booking Data</h2>
        <div className="flex items-center gap-2">
          <DatePicker
            selectsRange={true}
            startDate={startDate}
            endDate={endDate}
            onChange={(update) => setDateRange(update)}
            dateFormat="dd/MM/yyyy"
            className="border px-3 py-2 rounded text-center"
          />
        </div>
      </div>

      <div className="overflow-x-auto" style={{ maxWidth: '100%' }}>
        <table className="w-max border-collapse border" style={{ minWidth: '100%' }}>
          <thead>
            <tr className="sticky top-0 bg-white">
              <th className="border bg-gray-50 px-4 py-2 text-left">S No</th>
              <th className="border bg-gray-50 px-4 py-2 text-left">Date</th>
              <th className="border bg-gray-50 px-4 py-2 text-center">Total Booked</th>
              <th className="border bg-cyan-50 px-4 py-2 text-center">10K</th>
              <th className="border bg-teal-50 px-4 py-2 text-center">20K</th>
              <th className="border bg-green-50 px-4 py-2 text-center">Best</th>
              <th className="border bg-yellow-50 px-4 py-2 text-center">Good</th>
              <th className="border bg-orange-50 px-4 py-2 text-center">Average</th>
              {SETTERS.map(setter => (
                <th key={setter} className="border bg-blue-50 px-4 py-2 text-center whitespace-nowrap">
                  {setter}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {bookingData.map(({ date, totalBooked, tenK, twentyK, best, good, average }, index) => (
              <tr key={date} className="hover:bg-gray-50">
                <td className="border px-4 py-2">{index + 1}</td>
                <td className="border px-4 py-2">
                  {new Date(date + 'T00:00:00').toLocaleDateString('en-GB')}
                </td>
                <td className="border px-4 py-2 text-center font-medium">{totalBooked}</td>
                <td className="border px-4 py-2 text-center bg-cyan-50/50">{tenK}</td>
                <td className="border px-4 py-2 text-center bg-teal-50/50">{twentyK}</td>
                <td className="border px-4 py-2 text-center bg-green-50/50">{best}</td>
                <td className="border px-4 py-2 text-center bg-yellow-50/50">{good}</td>
                <td className="border px-4 py-2 text-center bg-orange-50/50">{average}</td>
                {SETTERS.map(setter => (
                  <td key={setter} className="border px-4 py-2 text-center bg-blue-50/50">
                    {bookingData[index].setterCounts[setter]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

DailyBookingData.propTypes = {
  appointments: PropTypes.arrayOf(PropTypes.shape({
    bookingDate: PropTypes.string.isRequired,
    initialPitchType: PropTypes.string.isRequired,
    leadQuality: PropTypes.string.isRequired
  }))
};

export default DailyBookingData;
