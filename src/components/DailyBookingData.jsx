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
  const start = startDate ? new Date(startDate) : new Date();
  start.setHours(0, 0, 0, 0);
  
  const end = endDate ? new Date(endDate) : new Date(start);
  end.setHours(23, 59, 59, 999);

  console.log('Processing date range:', {
    rawStart: startDate,
    rawEnd: endDate,
    normalizedStart: start.toISOString(),
    normalizedEnd: end.toISOString(),
    dateStrings: {
      start: formatDateToYYYYMMDD(start),
      end: formatDateToYYYYMMDD(end)
    }
  });

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

  // Debug all Krishna appointments first
  const krishnaDebug = appointments
    .filter(app => app.setterName === 'Krishna')
    .map(app => {
      const bookingDate = new Date(app.bookingDate + 'T00:00:00');
      return {
        id: app.id,
        bookingDate: app.bookingDate,
        status: app.status,
        hasRescheduledFrom: !!app.rescheduledFrom,
        isInDateRange: bookingDate >= start && bookingDate <= end,
        willBeIncluded: bookingDate >= start && 
                       bookingDate <= end && 
                       !app.rescheduledFrom,
        dateStr: formatDateToYYYYMMDD(new Date(app.bookingDate))
      };
    });
  
  console.log('Krishna Appointments Analysis:');
  console.dir({
    totalKrishnaAppointments: krishnaDebug.length,
    appointments: krishnaDebug,
    dateRange: {
      start: formatDateToYYYYMMDD(start),
      end: formatDateToYYYYMMDD(end)
    },
    willBeIncluded: krishnaDebug.filter(a => a.willBeIncluded).length
  }, { depth: null });

  console.log('Date range for filtering:', {
    startDate: start.toISOString(),
    endDate: end.toISOString()
  });

  // Debug selected date range first
  console.log('Selected date range:', {
    start: formatDateToYYYYMMDD(start),
    end: formatDateToYYYYMMDD(end)
  });

  // Debug Krishna's appointments
  const krishnaBookingsOnDate = appointments
    .filter(app => app.setterName === 'Krishna')
    .map(app => {
      const bookingDateStr = formatDateToYYYYMMDD(new Date(app.bookingDate));
      const startDateStr = formatDateToYYYYMMDD(start);
      return {
        id: app.id,
        bookingDate: app.bookingDate,
        status: app.status,
        rescheduled: {
          isRescheduledFrom: !!app.rescheduledFrom,
          hasRescheduledTo: !!app.rescheduledTo
        },
        originalBooking: !app.rescheduledFrom,
        dates: {
          booking: bookingDateStr,
          selected: startDateStr,
          matches: bookingDateStr === startDateStr
        }
      };
    });

  console.log('Krishna bookings detail:', krishnaBookingsOnDate);

  // First, identify unique appointments per date
  const uniqueBookings = new Map(); // date -> Set(appointment IDs)
  appointments.forEach(app => {
    const bookingDate = new Date(app.bookingDate + 'T00:00:00');
    const dateStr = formatDateToYYYYMMDD(bookingDate);
    
    if (!uniqueBookings.has(dateStr)) {
      uniqueBookings.set(dateStr, new Set());
    }
    
    // Only add if it's an original booking (not rescheduled)
    // or if we haven't seen this original appointment yet
    if (!app.rescheduledFrom && !uniqueBookings.get(dateStr).has(app.id)) {
      uniqueBookings.get(dateStr).add(app.id);
    }
  });

  // Process only unique appointments per date
  appointments
    .filter(app => {
      const bookingDate = new Date(app.bookingDate + 'T00:00:00');
      const dateStr = formatDateToYYYYMMDD(bookingDate);
      return bookingDate >= start && 
             bookingDate <= end && 
             uniqueBookings.get(dateStr)?.has(app.id);
    })
    .forEach(app => {
      const date = formatDateToYYYYMMDD(new Date(app.bookingDate));
      if (allDates[date]) {
        // Count all metrics based on original booking date
        console.log('Processing booking:', {
          date,
          setterName: app.setterName,
          status: app.status,
          pitchType: app.initialPitchType,
          leadQuality: app.leadQuality
        });

        allDates[date].totalBooked++;
        allDates[date][app.initialPitchType === '5k_pitched' ? 'tenK' : 'twentyK']++;
        allDates[date][app.leadQuality]++;

        if (app.setterName === 'Krishna') {
          console.log('Counting Krishna booking:', {
            dateKey: date,
            bookingDate: app.bookingDate,
            id: app.id,
            originalDate: app.date?.toDateString(),
            isOriginalDateInRange: app.date && start <= app.date && app.date <= end
          });
        }
        if (app.setterName && app.setterName !== 'Sales Person') {
          allDates[date].setterCounts[app.setterName]++;
          // More debug logging
          if (app.setterName === 'Krishna') {
            console.log('Incremented count for Krishna:', {
              date: date,
              newCount: allDates[date].setterCounts[app.setterName]
            });
          }
        }
      }
    });

  console.log('Final booking counts:', Object.entries(allDates).map(([date, data]) => ({
    date,
    allCounts: data.setterCounts,
    krishnaCounts: data.setterCounts['Krishna']
  })));
  
  Object.entries(allDates).forEach(([date, data]) => {
    if (data.setterCounts['Krishna'] > 0) {
      console.log(`Date ${date}: Krishna has ${data.setterCounts['Krishna']} bookings`);
    }
  });

  return allDates;
};

const DailyBookingData = ({ appointments = [] }) => {
  const today = new Date();
  const [dateRange, setDateRange] = useState([today, today]);
  const [startDate, endDate] = dateRange;

  // Handle date range selection
  const handleDateChange = (dates) => {
    const [start, end] = dates;
    
    if (!start) {
      // Reset to today if no start date
      setDateRange([new Date(), new Date()]);
      return;
    }

    // Store the new range
    setDateRange(dates);
  };

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
            selected={startDate}
            onChange={handleDateChange}
            selectsRange={true}
            startDate={startDate}
            endDate={endDate}
            shouldCloseOnSelect={false}
            showMonthDropdown
            showYearDropdown
            dropdownMode="select"
            dateFormat="dd/MM/yyyy"
            placeholderText="Select date range"
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
