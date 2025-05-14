import React from 'react';
import PropTypes from 'prop-types';
import { getStatusDisplay } from './calendar-utils';
import { format } from 'date-fns';

const formatDate = (dateStr) => {
  try {
    const [year, month, day] = dateStr.split('-');
    return `${day}/${month}/${year}`;
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'Invalid Date';
  }
};

const formatTime = (timeStr) => {
  try {
    return format(new Date(`2024-01-01 ${timeStr}`), 'hh:mm aa');
  } catch (error) {
    console.error('Error formatting time:', error);
    return timeStr;
  }
};

const AppointmentTooltip = ({ appointment, position }) => (
  <div
    className="absolute bg-white shadow-lg p-4 rounded z-50 w-72"
    style={{
      left: `${position.x}px`,
      top: `${position.y}px`
    }}
  >
    {/* Client Information */}
    <div className="mb-4">
      <div className="text-sm font-semibold text-gray-500 mb-2">Client Information</div>
      <h3 className="font-bold">{appointment.name}</h3>
      <p className="text-sm">
        <span className="font-medium">Phone:</span> {appointment.phone}
      </p>
      {appointment.notes && (
        <p className="text-sm">
          <span className="font-medium">Notes:</span> {appointment.notes}
        </p>
      )}
    </div>
    
    {/* Setter Information */}
    <div className="mb-4">
      <div className="text-sm font-semibold text-gray-500 mb-2 border-b pb-1">Setter Data</div>
      <p className="text-sm">
        <span className="font-medium">Setter:</span> {appointment.setterName}
      </p>
      <p className="text-sm">
        <span className="font-medium">Booking Date:</span> {formatDate(appointment.bookingDate)}
      </p>
      <p className="text-sm">
        <span className="font-medium">Initial Pitch:</span>{' '}
        {getStatusDisplay(appointment.initialPitchType)}
      </p>
      <p className="text-sm">
        <span className="font-medium">Rs.50 Paid:</span>{' '}
        <span className={appointment.initialPayment === 'paid' ? 'text-green-600' : 'text-red-600'}>
          {appointment.initialPayment === 'paid' ? 'Paid' : 'Not Paid'}
        </span>
      </p>
      <p className="text-sm">
        <span className="font-medium">Lead Source:</span>{' '}
        <span className="capitalize">{appointment.leadSource || 'Ads'}</span>
      </p>
      <p className="text-sm">
        <span className="font-medium">Lead Quality:</span>{' '}
        <span className={
          appointment.leadQuality === 'best' ? 'text-green-600 font-medium' :
          appointment.leadQuality === 'good' ? 'text-orange-500 font-medium' :
          'text-yellow-500 font-medium'
        }>
          {appointment.leadQuality ? 
            appointment.leadQuality.charAt(0).toUpperCase() + 
            appointment.leadQuality.slice(1) : 
            'Average'}
        </span>
      </p>
    </div>

    {/* Sales Information */}
    <div>
      <div className="text-sm font-semibold text-gray-500 mb-2 border-b pb-1">Sales Data</div>
      <div className="space-y-1">
        <p className="text-sm">
          <span className="font-medium">Status:</span>{' '}
          {getStatusDisplay(appointment.status)}
        </p>
        
        <p className="text-sm">
          <span className="font-medium">Time:</span>{' '}
          {formatTime(appointment.time)}
        </p>
        
        <p className="text-sm">
          <span className="font-medium">Sales Person:</span>{' '}
          {appointment.salesPerson}
        </p>
        
        {appointment.callLaterDateTime && (
          <p className="text-sm">
            <span className="font-medium">Call Back:</span>{' '}
            {format(new Date(appointment.callLaterDateTime), 'dd/MM/yyyy hh:mm aa')}
          </p>
        )}
        
        {appointment.callNotes && (
          <p className="text-sm">
            <span className="font-medium">Call Notes:</span>{' '}
            {appointment.callNotes}
          </p>
        )}
        
        {(appointment.status === 'paid' && appointment.pitchedType) && (
          <p className="text-sm">
            <span className="font-medium">Final Pitch:</span>{' '}
            {getStatusDisplay(appointment.pitchedType)}
          </p>
        )}

        {appointment.paymentType && (
          <p className="text-sm">
            <span className="font-medium">Payment:</span>{' '}
            {appointment.paymentType}
          </p>
        )}

        <div className="mt-2 pt-2 border-t">
          {appointment.status === 'rescheduled' && appointment.rescheduledTo && (
            <p className="text-sm text-gray-600">
              <span className="font-medium">Rescheduled to:</span>{' '}
              {formatDate(appointment.rescheduledTo.date)}{' '}
              {appointment.rescheduledTo.time && formatTime(appointment.rescheduledTo.time)}{' '}
              with {appointment.rescheduledTo.salesPerson}
            </p>
          )}
          {appointment.rescheduledFrom && (
            <p className="text-sm text-gray-600 mt-1">
              <span className="font-medium">Rescheduled from:</span>{' '}
              {formatDate(appointment.rescheduledFrom.date)}{' '}
              {appointment.rescheduledFrom.time && formatTime(appointment.rescheduledFrom.time)}{' '}
              with {appointment.rescheduledFrom.salesPerson}
            </p>
          )}
        </div>
      </div>
    </div>
  </div>
);

AppointmentTooltip.propTypes = {
  appointment: PropTypes.shape({
    name: PropTypes.string.isRequired,
    phone: PropTypes.string.isRequired,
    notes: PropTypes.string,
    status: PropTypes.string.isRequired,
    bookingDate: PropTypes.string.isRequired,
    time: PropTypes.string.isRequired,
    salesPerson: PropTypes.string.isRequired,
    setterName: PropTypes.string.isRequired,
    initialPitchType: PropTypes.string.isRequired,
    initialPayment: PropTypes.string.isRequired,
    leadSource: PropTypes.string,
    leadQuality: PropTypes.string,
    callLaterDateTime: PropTypes.string,
    callNotes: PropTypes.string,
    paymentType: PropTypes.string,
    pitchedType: PropTypes.string,
    rescheduledFrom: PropTypes.shape({
      date: PropTypes.string,
      time: PropTypes.string,
      salesPerson: PropTypes.string
    }),
    rescheduledTo: PropTypes.shape({
      date: PropTypes.string,
      time: PropTypes.string,
      salesPerson: PropTypes.string
    })
  }).isRequired,
  position: PropTypes.shape({
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired
  }).isRequired
};

export default AppointmentTooltip;
