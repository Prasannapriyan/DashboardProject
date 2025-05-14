import React from 'react';
import PropTypes from 'prop-types';

const SETTERS = [
  'Vicky',
  'Vikneswar',
  'Hemaanth',
  'Harneesh',
  'Krishna',
  'Kumaran',
  'Sethu',
  'Prasanna'
];

const SetterPerformance = ({ appointments = [] }) => {
  const getSetterStats = (setterName) => {
    const setterAppointments = appointments.filter(app => app.setterName === setterName);
    const total = setterAppointments.length;
    
    if (total === 0) {
      return {
        total: 0,
        rescheduled: 0,
        didntShowUp: 0,
        totalPitched: 0,
        wronglyQualified: 0,
        total10kSet: 0,
        total10kPitched: 0,
        paid10k: 0,
        paid9k: 0,
        paid5kSplit: 0,
        paid1kDeposit: 0,
        total20kSet: 0,
        total20kPitched: 0,
        paid20k: 0,
        paid15k: 0,
        paid10kPro: 0,
        paid10k2ndIns: 0,
        paid5kDeposit: 0,
        paid6kSub: 0
      };
    }

    const total10kSet = setterAppointments.filter(app => app.initialPitchType === '5k_pitched').length;
    const total20kSet = setterAppointments.filter(app => app.initialPitchType === '20k_pitched').length;
    
    const total10kPitched = setterAppointments.filter(app => 
      app.status === '5k_pitched' || 
      (app.status === 'paid' && app.pitchedType === '5k_pitched')
    ).length;

    const total20kPitched = setterAppointments.filter(app => 
      app.status === '20k_pitched' || 
      (app.status === 'paid' && app.pitchedType === '20k_pitched')
    ).length;

    const getPaymentCount = (paymentType) => 
      setterAppointments.filter(app => app.status === 'paid' && app.paymentType === paymentType).length;

    return {
      total,
      rescheduled: setterAppointments.filter(app => app.status === 'rescheduled').length,
      didntShowUp: setterAppointments.filter(app => app.status === 'didnt_pick').length,
      wronglyQualified: setterAppointments.filter(app => app.status === 'wrongly_qualified').length,
      totalPitched: total10kPitched + total20kPitched,
      total10kSet,
      total10kPitched,
      paid10k: getPaymentCount('5k'),
      paid9k: getPaymentCount('4k'),
      paid5kSplit: getPaymentCount('5k_split'),
      paid1kDeposit: getPaymentCount('1k_deposit'),
      total20kSet,
      total20kPitched,
      paid20k: getPaymentCount('20k'),
      paid15k: getPaymentCount('15k'),
      paid10kPro: getPaymentCount('10k'),
      paid10k2ndIns: getPaymentCount('10k_2nd'),
      paid5kDeposit: getPaymentCount('5k_deposit'),
      paid6kSub: getPaymentCount('6k_sub')
    };
  };

  const totalStats = SETTERS.reduce((acc, setter) => {
    const stats = getSetterStats(setter);
    Object.keys(stats).forEach(key => {
      acc[key] = (acc[key] || 0) + stats[key];
    });
    return acc;
  }, {});

  return (
    <div className="mt-8">
      <h2 className="text-lg font-bold mb-4">Setter Performance</h2>
      <div className="overflow-x-auto">
        <table className="w-full bg-white border text-sm">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-2 text-left border">Setter</th>
              <th className="px-4 py-2 text-center border bg-cyan-50">Total Set</th>
              <th className="px-4 py-2 text-center border bg-amber-50">Rescheduled</th>
              <th className="px-4 py-2 text-center border bg-red-50">Didn't Show up</th>
              <th className="px-4 py-2 text-center border bg-red-50">Wrongly Qualified</th>
              <th className="px-4 py-2 text-center border bg-blue-50">Total Pitched</th>
              <th className="px-4 py-2 text-center border bg-cyan-50">10K Set</th>
              <th className="px-4 py-2 text-center border bg-cyan-100">10K Pitched</th>
              <th className="px-4 py-2 text-center border bg-green-100">10K Paid</th>
              <th className="px-4 py-2 text-center border bg-green-100">9K Paid</th>
              <th className="px-4 py-2 text-center border bg-green-100">5K Split</th>
              <th className="px-4 py-2 text-center border bg-blue-50">1K Deposit</th>
              <th className="px-4 py-2 text-center border bg-teal-50">20K Set</th>
              <th className="px-4 py-2 text-center border bg-teal-100">20K Pitched</th>
              <th className="px-4 py-2 text-center border bg-green-200">20K Paid</th>
              <th className="px-4 py-2 text-center border bg-green-200">15K Paid</th>
              <th className="px-4 py-2 text-center border bg-green-200">10K Paid</th>
              <th className="px-4 py-2 text-center border bg-green-100">10K 2nd Ins</th>
              <th className="px-4 py-2 text-center border bg-blue-50">5K Deposit</th>
              <th className="px-4 py-2 text-center border bg-blue-100">6K Sub</th>
            </tr>
          </thead>
          <tbody>
            {SETTERS.map((setter, index) => {
              const stats = getSetterStats(setter);
              return (
                <tr 
                  key={setter}
                  className="hover:bg-gray-50"
                >
                  <td className="px-4 py-2 border font-medium">{setter}</td>
                  <td className="px-4 py-2 text-center border bg-cyan-50">{stats.total}</td>
                  <td className="px-4 py-2 text-center border bg-amber-50">{stats.rescheduled}</td>
                  <td className="px-4 py-2 text-center border bg-red-50">{stats.didntShowUp}</td>
                  <td className="px-4 py-2 text-center border bg-red-50">{stats.wronglyQualified}</td>
                  <td className="px-4 py-2 text-center border bg-blue-50">{stats.totalPitched}</td>
                  <td className="px-4 py-2 text-center border bg-cyan-50">{stats.total10kSet}</td>
                  <td className="px-4 py-2 text-center border bg-cyan-100">{stats.total10kPitched}</td>
                  <td className="px-4 py-2 text-center border bg-green-100">{stats.paid10k}</td>
                  <td className="px-4 py-2 text-center border bg-green-100">{stats.paid9k}</td>
                  <td className="px-4 py-2 text-center border bg-green-100">{stats.paid5kSplit}</td>
                  <td className="px-4 py-2 text-center border bg-blue-50">{stats.paid1kDeposit}</td>
                  <td className="px-4 py-2 text-center border bg-teal-50">{stats.total20kSet}</td>
                  <td className="px-4 py-2 text-center border bg-teal-100">{stats.total20kPitched}</td>
                  <td className="px-4 py-2 text-center border bg-green-200">{stats.paid20k}</td>
                  <td className="px-4 py-2 text-center border bg-green-200">{stats.paid15k}</td>
                  <td className="px-4 py-2 text-center border bg-green-200">{stats.paid10kPro}</td>
                  <td className="px-4 py-2 text-center border bg-green-100">{stats.paid10k2ndIns}</td>
                  <td className="px-4 py-2 text-center border bg-blue-50">{stats.paid5kDeposit}</td>
                  <td className="px-4 py-2 text-center border bg-blue-100">{stats.paid6kSub}</td>
                </tr>
              );
            })}
            <tr className="bg-gray-100 font-bold">
              <td className="px-4 py-2 border">Total</td>
              <td className="px-4 py-2 text-center border bg-cyan-50">{totalStats.total}</td>
              <td className="px-4 py-2 text-center border bg-amber-50">{totalStats.rescheduled}</td>
              <td className="px-4 py-2 text-center border bg-red-50">{totalStats.didntShowUp}</td>
              <td className="px-4 py-2 text-center border bg-red-50">{totalStats.wronglyQualified}</td>
              <td className="px-4 py-2 text-center border bg-blue-50">{totalStats.totalPitched}</td>
              <td className="px-4 py-2 text-center border bg-cyan-50">{totalStats.total10kSet}</td>
              <td className="px-4 py-2 text-center border bg-cyan-100">{totalStats.total10kPitched}</td>
              <td className="px-4 py-2 text-center border bg-green-100">{totalStats.paid10k}</td>
              <td className="px-4 py-2 text-center border bg-green-100">{totalStats.paid9k}</td>
              <td className="px-4 py-2 text-center border bg-green-100">{totalStats.paid5kSplit}</td>
              <td className="px-4 py-2 text-center border bg-blue-50">{totalStats.paid1kDeposit}</td>
              <td className="px-4 py-2 text-center border bg-teal-50">{totalStats.total20kSet}</td>
              <td className="px-4 py-2 text-center border bg-teal-100">{totalStats.total20kPitched}</td>
              <td className="px-4 py-2 text-center border bg-green-200">{totalStats.paid20k}</td>
              <td className="px-4 py-2 text-center border bg-green-200">{totalStats.paid15k}</td>
              <td className="px-4 py-2 text-center border bg-green-200">{totalStats.paid10kPro}</td>
              <td className="px-4 py-2 text-center border bg-green-100">{totalStats.paid10k2ndIns}</td>
              <td className="px-4 py-2 text-center border bg-blue-50">{totalStats.paid5kDeposit}</td>
              <td className="px-4 py-2 text-center border bg-blue-100">{totalStats.paid6kSub}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

SetterPerformance.propTypes = {
  appointments: PropTypes.arrayOf(PropTypes.shape({
    setterName: PropTypes.string.isRequired,
    status: PropTypes.string,
    paymentType: PropTypes.string,
    initialPitchType: PropTypes.string,
    pitchedType: PropTypes.string
  }))
};

export default SetterPerformance;
