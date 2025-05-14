import { format } from 'date-fns';

export const SETTERS = [
  'Vicky',
  'Vikneswar',
  'Hemaanth',
  'Harneesh',
  'Krishna',
  'Raju',
  'Sethu',
  'Prasanna',
  'Sales Person'
];

export const getStatusDisplay = (status) => {
  const display = {
    'picked': 'Picked',
    'didnt_pick': "Didn't Show up",
    'call_later': 'Call Later',
    'will_join_later': 'Will Join Later',
    'ghosted': 'Ghosted',
    '5k_pitched': '10K Pitch',  // Display updated, keeping code same for DB compatibility
    '20k_pitched': '20K Pitch',
    'booked': 'Booked',
    'rescheduled': 'Rescheduled',
    'wrongly_qualified': 'Wrongly Qualified',
    'wrong_number': 'Wrong Number',
    'paid': 'Paid'
  };
  return display[status] || status;
};

export const getStatusColor = (status) => {
  const colors = {
    'picked': 'bg-purple-500',
    'didnt_pick': 'bg-red-500',
    'call_later': 'bg-blue-500',
    'will_join_later': 'bg-pink-500',
    'ghosted': 'bg-indigo-500',
    '5k_pitched': 'bg-cyan-500',
    '20k_pitched': 'bg-teal-500',
    'booked': 'bg-orange-400',
    'rescheduled': 'bg-amber-500',
    'wrongly_qualified': 'bg-red-300',
    'wrong_number': 'bg-gray-500',
    'paid': 'bg-green-500'
  };
  return colors[status] || 'bg-gray-400';
};

export const formatTime = (time) => {
  const [hours, minutes] = time.split(':');
  const date = new Date();
  date.setHours(parseInt(hours, 10));
  date.setMinutes(parseInt(minutes, 10));
  return format(date, 'hh:mm aa');
};

export const createTimeSlots = () => {
  const slots = [];
  for (let hour = 9; hour < 21; hour++) {
    for (let minute of ['00', '30']) {
      slots.push(`${hour.toString().padStart(2, '0')}:${minute}`);
    }
  }
  return slots;
};

export const countSlotsBetweenTimes = (startTime, endTime) => {
  const [startHour, startMinute] = startTime.split(':').map(Number);
  const [endHour, endMinute] = endTime.split(':').map(Number);
  
  const totalMinutes = (endHour * 60 + endMinute) - (startHour * 60 + startMinute);
  return Math.floor(totalMinutes / 30);
};

const showUpStatuses = [
  'picked',
  '5k_pitched',
  '20k_pitched',
  'will_join_later',
  'ghosted',
  'wrongly_qualified',
  'paid'
];

const noShowStatuses = [
  'didnt_pick',
  'call_later',
  'rescheduled',
  'wrong_number'
];

export const calculateLeadSourceStats = (appointments) => {
  // Get a map of all appointments that have been rescheduled to a new time
  const rescheduledMap = appointments.reduce((acc, app) => {
    if (app.parentId) {
      acc[app.parentId] = true;
    }
    return acc;
  }, {});

  // Only count appointments that haven't been rescheduled to another time
  const scheduledApps = appointments.filter(app => 
    app.status !== 'rescheduled' && !rescheduledMap[app.id]
  );
  
  // 10K stats
  const scheduled10k = scheduledApps.filter(app => app.initialPitchType === '5k_pitched').length;

  const showUp10k = appointments.filter(app => 
    app.initialPitchType === '5k_pitched' && 
    showUpStatuses.includes(app.status)
  ).length;

  const didntShow10k = appointments.filter(app => 
    app.initialPitchType === '5k_pitched' && 
    noShowStatuses.includes(app.status)
  ).length;

  const pitched10k = appointments.filter(app => 
    app.status === '5k_pitched' || 
    (app.status === 'paid' && app.pitchedType === '5k_pitched')
  ).length;

  const paid10k = appointments.filter(app => 
    app.status === 'paid' && 
    app.pitchedType === '5k_pitched' &&
    ['5k', '4k', '1k_deposit', '5k_split'].includes(app.paymentType)
  ).length;

  const revenue10k = appointments.reduce((total, app) => {
    if (app.status === 'paid' && app.pitchedType === '5k_pitched') {
      const values = {
        '5k': 10000,
        '4k': 9000,
        '1k_deposit': 1000,
        '5k_split': 5000
      };
      return total + (values[app.paymentType] || 0);
    }
    return total;
  }, 0);

  // 20K stats
  const scheduled20k = scheduledApps.filter(app => app.initialPitchType === '20k_pitched').length;
  
  const showUp20k = appointments.filter(app => 
    app.initialPitchType === '20k_pitched' && 
    showUpStatuses.includes(app.status)
  ).length;

  const didntShow20k = appointments.filter(app => 
    app.initialPitchType === '20k_pitched' && 
    noShowStatuses.includes(app.status)
  ).length;

  const pitched20k = appointments.filter(app => 
    app.status === '20k_pitched' || 
    (app.status === 'paid' && app.pitchedType === '20k_pitched')
  ).length;

  const paid20k = appointments.filter(app => 
    app.status === 'paid' && 
    app.pitchedType === '20k_pitched' &&
    ['20k', '15k', '10k', '10k_2nd', '6k_sub', '5k_deposit'].includes(app.paymentType)
  ).length;

  const revenue20k = appointments.reduce((total, app) => {
    if (app.status === 'paid' && app.pitchedType === '20k_pitched') {
      const values = {
        '20k': 20000,
        '15k': 15000,
        '10k': 10000,
        '10k_2nd': 10000,
        '6k_sub': 6000,
        '5k_deposit': 5000
      };
      return total + (values[app.paymentType] || 0);
    }
    return total;
  }, 0);

  return {
    stats10k: {
      scheduled: scheduled10k,
      showUp: showUp10k,
      didntShowUp: didntShow10k,
      showUpRate: scheduled10k > 0 ? ((showUp10k / scheduled10k) * 100).toFixed(1) : '0.0',
      pitched: pitched10k,
      paid: paid10k,
      closingRate: pitched10k > 0 ? ((paid10k / pitched10k) * 100).toFixed(1) : '0.0',
      revenue: revenue10k
    },
    stats20k: {
      scheduled: scheduled20k,
      showUp: showUp20k,
      didntShowUp: didntShow20k,
      showUpRate: scheduled20k > 0 ? ((showUp20k / scheduled20k) * 100).toFixed(1) : '0.0',
      pitched: pitched20k,
      paid: paid20k,
      closingRate: pitched20k > 0 ? ((paid20k / pitched20k) * 100).toFixed(1) : '0.0',
      revenue: revenue20k
    },
    appointments: appointments
  };
};

export const calculateSetterStats = (appointments, setter) => {
  const setterAppointments = appointments.filter(app => app.setterName === setter);
  const activeAppointments = setterAppointments.filter(app => app.status !== 'rescheduled');
  
  return {
    total: activeAppointments.length,
    rescheduled: setterAppointments.filter(app => app.status === 'rescheduled').length,
    pitch5k: activeAppointments.filter(app => 
      app.status === '5k_pitched' || 
      (app.status === 'paid' && app.pitchedType === '5k_pitched')
    ).length,
    pitch20k: activeAppointments.filter(app => 
      app.status === '20k_pitched' || 
      (app.status === 'paid' && app.pitchedType === '20k_pitched')
    ).length,
    initialPitch5k: activeAppointments.filter(app => app.initialPitchType === '5k_pitched').length,
    initialPitch20k: activeAppointments.filter(app => app.initialPitchType === '20k_pitched').length,
    converted: activeAppointments.filter(app => app.status === 'paid').length,
    converted5k: activeAppointments.filter(app => 
      app.status === 'paid' && 
      app.pitchedType === '5k_pitched' &&
      app.initialPitchType === '5k_pitched'
    ).length,
    converted20k: activeAppointments.filter(app => 
      app.status === 'paid' && 
      app.pitchedType === '20k_pitched' &&
      app.initialPitchType === '20k_pitched'
    ).length,
    didntPick: activeAppointments.filter(app => app.status === 'didnt_pick').length,
    wronglyQualified: activeAppointments.filter(app => app.status === 'wrongly_qualified').length,
    initialPaymentPaid: activeAppointments.filter(app => app.initialPayment === 'paid').length,
    initialPaymentNotPaid: activeAppointments.filter(app => app.initialPayment === 'unpaid').length
  };
};

export const calculateSalesPersonStats = (appointments, salesPerson, selectedDate) => {
  const activeAppointments = appointments.filter(
    app => 
      app.status !== 'rescheduled' && 
      app.salesPerson === salesPerson && 
      app.date.toDateString() === selectedDate.toDateString()
  );

  const booked5k = activeAppointments.filter(app => app.initialPitchType === '5k_pitched').length;
  const booked20k = activeAppointments.filter(app => app.initialPitchType === '20k_pitched').length;

  const didntShow10k = activeAppointments.filter(app => 
    app.initialPitchType === '5k_pitched' && 
    ['didnt_pick', 'call_later', 'rescheduled', 'wrong_number'].includes(app.status)
  ).length;

  const didntShow20k = activeAppointments.filter(app => 
    app.initialPitchType === '20k_pitched' && 
    ['didnt_pick', 'call_later', 'rescheduled', 'wrong_number'].includes(app.status)
  ).length;

  const totalPitch5k = activeAppointments.filter(app => 
    app.status === '5k_pitched' || 
    (app.status === 'paid' && app.pitchedType === '5k_pitched')
  ).length;

  const totalPitch20k = activeAppointments.filter(app => 
    app.status === '20k_pitched' || 
    (app.status === 'paid' && app.pitchedType === '20k_pitched')
  ).length;

  // Create payments object with all possible payment types initialized to 0
  const payments = {
    '5k': 0,
    '4k': 0,
    '1k_deposit': 0,
    '5k_split': 0,
    '5k_deposit': 0,
    '6k_sub': 0,
    '10k': 0,
    '10k_2nd': 0,
    '20k': 0
  };

  // Update payment counts
  activeAppointments.forEach(app => {
    if (app.status === 'paid' && app.paymentType) {
      payments[app.paymentType] = (payments[app.paymentType] || 0) + 1;
    }
  });

  return {
    booked5k,
    booked20k,
    didntShow10k,
    didntShow20k,  // Add to returned object
    totalPitch5k,
    totalPitch20k,
    payments,
    initialPaymentPaid: activeAppointments.filter(app => app.initialPayment === 'paid').length,
    initialPaymentNotPaid: activeAppointments.filter(app => app.initialPayment === 'unpaid').length
  };
};

export const calculateStats = (appointments, salesPeople, selectedDate, userUnavailableSlots, defaultUnavailableSlots = {}) => {
  const todayAppointments = appointments.filter(
    app => app.date.toDateString() === selectedDate.toDateString()
  );

  const activeAppointments = todayAppointments.filter(
    app => app.status !== 'rescheduled'
  );

  // Calculate total slots for each person, excluding breaks
  const totalSlots = salesPeople.reduce((acc, person) => {
    if (!person.isPresent) return acc;
    
    // Count available slots between start and end time
    const timeSlots = createTimeSlots().filter(time => 
      time >= person.startTime && time < person.endTime
    );

    // Remove global break slots
    const availableSlots = timeSlots.filter(time => {
      const isBreakTime = Object.entries(defaultUnavailableSlots)
        .some(([key, slot]) => {
          const timeFromKey = key.split('_')[1];
          return slot.isGlobal && timeFromKey === time;
        });
      return !isBreakTime;
    });

    // Remove personal unavailable slots
    const finalSlots = availableSlots.filter(time => {
      const isPersonalUnavailable = Object.entries(defaultUnavailableSlots)
        .some(([key, slot]) => {
          const [, name, timeFromKey] = key.split('_');
          return !slot.isGlobal && 
                 name.toLowerCase() === person.name.toLowerCase() && 
                 timeFromKey === time;
        });
      return !isPersonalUnavailable;
    });

    return acc + finalSlots.length;
  }, 0);

  // Count user-set unavailable slots
  const unavailableCount = Object.entries(userUnavailableSlots).reduce((count, [key, isUnavailable]) => {
    if (isUnavailable && key.includes(selectedDate.toDateString())) {
      count++;
    }
    return count;
  }, 0);

  const payments = activeAppointments.reduce((acc, app) => {
    if (app.paymentType) {
      acc[app.paymentType] = (acc[app.paymentType] || 0) + 1;
    }
    return acc;
  }, {});

  const paymentValues = {
    '5k': 10000,
    '4k': 9000,
    '1k_deposit': 1000,
    '5k_split': 5000,
    '5k_deposit': 5000,
    '6k_sub': 6000,
    '10k': 10000,
    '10k_2nd': 10000,
    '20k': 20000
  };

  const totalRevenue = Object.entries(payments).reduce((total, [type, count]) => {
    return total + (paymentValues[type] * count);
  }, 0);

  const setterStats = {};
  SETTERS.forEach(setter => {
    setterStats[setter] = calculateSetterStats(todayAppointments, setter);
  });

  const salesPersonStats = {};
  salesPeople.forEach(person => {
    salesPersonStats[person.name] = calculateSalesPersonStats(todayAppointments, person.name, selectedDate);
  });

  const adsAppointments = todayAppointments.filter(app => app.leadSource === 'ads');
  const youtubeAppointments = todayAppointments.filter(app => app.leadSource === 'youtube');

  const adsStats = calculateLeadSourceStats(adsAppointments);
  const youtubeStats = calculateLeadSourceStats(youtubeAppointments);

  const pitched5k = activeAppointments.filter(app => 
    app.status === '5k_pitched' || 
    (app.status === 'paid' && app.pitchedType === '5k_pitched')
  ).length;

  const pitched20k = activeAppointments.filter(app => 
    app.status === '20k_pitched' || 
    (app.status === 'paid' && app.pitchedType === '20k_pitched')
  ).length;

  const initialPaymentPaid = activeAppointments.filter(app => app.initialPayment === 'paid').length;
  const initialPaymentNotPaid = activeAppointments.filter(app => app.initialPayment === 'unpaid').length;
  const rescheduled = todayAppointments.filter(app => app.status === 'rescheduled').length;
  const booked = activeAppointments.length;

  return {
    available: totalSlots - booked - unavailableCount,
    booked,
    rescheduled,
    initialPaymentPaid,
    initialPaymentNotPaid,
    picked: activeAppointments.filter(app => app.status === 'picked').length,
    didntPick: activeAppointments.filter(app => app.status === 'didnt_pick').length,
    callLater: activeAppointments.filter(app => app.status === 'call_later').length,
    willJoinLater: activeAppointments.filter(app => app.status === 'will_join_later').length,
    ghosted: activeAppointments.filter(app => app.status === 'ghosted').length,
    pitched5k,
    pitched20k,
    wronglyQualified: activeAppointments.filter(app => app.status === 'wrongly_qualified').length,
    wrongNumber: activeAppointments.filter(app => app.status === 'wrong_number').length,
    paid: activeAppointments.filter(app => app.status === 'paid').length,
    total: totalSlots,
    payments,
    totalRevenue,
    setterStats,
    salesPersonStats,
    leadSourceStats: {
      ads: {
        ...adsStats,
        appointments: adsAppointments
      },
      youtube: {
        ...youtubeStats,
        appointments: youtubeAppointments
      }
    }
  };
};
