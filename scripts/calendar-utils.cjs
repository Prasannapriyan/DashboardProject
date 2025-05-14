const { format } = require('date-fns');

const SETTERS = [
  'Vicky',
  'Vikneswar',
  'Hemaanth',
  'Harneesh',
  'Hitesh',
  'Kumaran',
  'Sethu',
  'Prasanna',
  'Sales Person'
];

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

function calculateLeadSourceStats(appointments) {
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

  // Filter appointments by source
  const adsAppointments = appointments.filter(app => app.leadSource === 'ads');
  const youtubeAppointments = appointments.filter(app => app.leadSource === 'youtube');

  const stats = {
    ads: {
      stats10k: {
        scheduled: adsAppointments.filter(app => app.initialPitchType === '5k_pitched').length,
        showUp: adsAppointments.filter(app => app.initialPitchType === '5k_pitched' && showUpStatuses.includes(app.status)).length,
        didntShowUp: adsAppointments.filter(app => app.initialPitchType === '5k_pitched' && noShowStatuses.includes(app.status)).length,
        pitched: pitched10k,
        paid: paid10k,
        revenue: revenue10k
      },
      stats20k: {
        scheduled: adsAppointments.filter(app => app.initialPitchType === '20k_pitched').length,
        showUp: adsAppointments.filter(app => app.initialPitchType === '20k_pitched' && showUpStatuses.includes(app.status)).length,
        didntShowUp: adsAppointments.filter(app => app.initialPitchType === '20k_pitched' && noShowStatuses.includes(app.status)).length,
        pitched: pitched20k,
        paid: paid20k,
        revenue: revenue20k
      },
      appointments: adsAppointments
    },
    youtube: {
      stats10k: {
        scheduled: youtubeAppointments.filter(app => app.initialPitchType === '5k_pitched').length,
        showUp: youtubeAppointments.filter(app => app.initialPitchType === '5k_pitched' && showUpStatuses.includes(app.status)).length,
        didntShowUp: youtubeAppointments.filter(app => app.initialPitchType === '5k_pitched' && noShowStatuses.includes(app.status)).length,
        pitched: pitched10k,
        paid: paid10k,
        revenue: revenue10k
      },
      stats20k: {
        scheduled: youtubeAppointments.filter(app => app.initialPitchType === '20k_pitched').length,
        showUp: youtubeAppointments.filter(app => app.initialPitchType === '20k_pitched' && showUpStatuses.includes(app.status)).length,
        didntShowUp: youtubeAppointments.filter(app => app.initialPitchType === '20k_pitched' && noShowStatuses.includes(app.status)).length,
        pitched: pitched20k,
        paid: paid20k,
        revenue: revenue20k
      },
      appointments: youtubeAppointments
    }
  };

  return stats;
}

module.exports = {
  SETTERS,
  showUpStatuses,
  noShowStatuses,
  calculateLeadSourceStats
};
