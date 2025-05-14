import React, { useState } from 'react';
import PropTypes from 'prop-types';

const calculateQualityStats = (appointments, quality) => {
  const qualityApps = appointments.filter(app => app.leadQuality === quality);

  // Helper to count payments
  const countPayments = (pitchType, paymentTypes) => {
    return qualityApps.filter(app => 
      app.status === 'paid' && 
      app.pitchedType === pitchType && 
      paymentTypes.includes(app.paymentType)
    ).length;
  };

  // 10K stats
  const set10k = qualityApps.filter(app => app.initialPitchType === '5k_pitched').length;
  const didntShow10k = qualityApps.filter(app => 
    app.initialPitchType === '5k_pitched' && 
    ['didnt_pick', 'call_later', 'wrong_number'].includes(app.status)
  ).length;
  const wronglyQualified10k = qualityApps.filter(app => 
    app.initialPitchType === '5k_pitched' && 
    app.status === 'wrongly_qualified'
  ).length;
  const rescheduled10k = qualityApps.filter(app => 
    app.initialPitchType === '5k_pitched' && 
    app.status === 'rescheduled'
  ).length;
  const pitched10k = qualityApps.filter(app => 
    app.status === '5k_pitched' || 
    (app.status === 'paid' && app.pitchedType === '5k_pitched')
  ).length;

  const paid10k = countPayments('5k_pitched', ['5k']);
  const paid9k = countPayments('5k_pitched', ['4k']);
  const paid5kSplit = countPayments('5k_pitched', ['5k_split']);
  const paid1kDeposit = countPayments('5k_pitched', ['1k_deposit']);

  // 20K stats
  const set20k = qualityApps.filter(app => app.initialPitchType === '20k_pitched').length;
  const didntShow20k = qualityApps.filter(app => 
    app.initialPitchType === '20k_pitched' && 
    ['didnt_pick', 'call_later', 'wrong_number'].includes(app.status)
  ).length;
  const wronglyQualified20k = qualityApps.filter(app => 
    app.initialPitchType === '20k_pitched' && 
    app.status === 'wrongly_qualified'
  ).length;
  const rescheduled20k = qualityApps.filter(app => 
    app.initialPitchType === '20k_pitched' && 
    app.status === 'rescheduled'
  ).length;
  const pitched20k = qualityApps.filter(app => 
    app.status === '20k_pitched' || 
    (app.status === 'paid' && app.pitchedType === '20k_pitched')
  ).length;

  const paid20k = countPayments('20k_pitched', ['20k']);
  const paid15k = countPayments('20k_pitched', ['15k']);
  const paid10kPro = countPayments('20k_pitched', ['10k']);
  const paid5kDeposit = countPayments('20k_pitched', ['5k_deposit']);
  const paid6kSub = countPayments('20k_pitched', ['6k_sub']);

  // Calculate ARPs
  const arp10k = pitched10k ? 
    ((paid10k * 10000 + paid9k * 10000 + paid5kSplit * 5000) / pitched10k) : 0;

  const arp20k = pitched20k ? 
    ((paid20k * 20000 + paid15k * 20000 + paid10kPro * 10000 + paid6kSub * 6000) / pitched20k) : 0;

  return {
      stats10k: {
        set: set10k,
        didntShow: didntShow10k,
        wronglyQualified: wronglyQualified10k,
        rescheduled: rescheduled10k,
        pitched: pitched10k,
        pitchedRate: set10k ? ((pitched10k / set10k) * 100).toFixed(1) : '0.0',
      paid10k,
      paid9k,
      paid5kSplit,
      paid1kDeposit,
      arp: Math.round(arp10k)
    },
      stats20k: {
        set: set20k,
        didntShow: didntShow20k,
        wronglyQualified: wronglyQualified20k,
        rescheduled: rescheduled20k,
        pitched: pitched20k,
        pitchedRate: set20k ? ((pitched20k / set20k) * 100).toFixed(1) : '0.0',
      paid20k,
      paid15k,
      paid10k: paid10kPro,
      paid5kDeposit,
      paid6kSub,
      arp: Math.round(arp20k)
    }
  };
};

const QualityReport = ({ quality, stats }) => (
  <div className="mb-4">
    <div className="space-y-4">
      <div className="border rounded p-4">
        <h3 className="font-medium mb-2">10K Performance</h3>
        <div className="space-y-1">
          <p>Set: {stats.stats10k.set}</p>
          <p>Didn't Show: {stats.stats10k.didntShow}</p>
          <p>Wrongly Qualified: {stats.stats10k.wronglyQualified}</p>
          <p>Rescheduled: {stats.stats10k.rescheduled}</p>
          <p>Pitched: {stats.stats10k.pitched}</p>
          <p>Pitched Rate: {stats.stats10k.pitchedRate}%</p>
          <p>10K Paid: {stats.stats10k.paid10k}</p>
          <p>9K Paid: {stats.stats10k.paid9k}</p>
          <p>5K Split: {stats.stats10k.paid5kSplit}</p>
          <p>1K Deposit: {stats.stats10k.paid1kDeposit}</p>
          <p>ARP: ₹{stats.stats10k.arp.toLocaleString()}</p>
        </div>
      </div>

      <div className="border rounded p-4">
        <h3 className="font-medium mb-2">20K Performance</h3>
        <div className="space-y-1">
          <p>Set: {stats.stats20k.set}</p>
          <p>Didn't Show: {stats.stats20k.didntShow}</p>
          <p>Wrongly Qualified: {stats.stats20k.wronglyQualified}</p>
          <p>Rescheduled: {stats.stats20k.rescheduled}</p>
          <p>Pitched: {stats.stats20k.pitched}</p>
          <p>Pitched Rate: {stats.stats20k.pitchedRate}%</p>
          <p>20K Paid: {stats.stats20k.paid20k}</p>
          <p>15K Paid: {stats.stats20k.paid15k}</p>
          <p>10K Paid: {stats.stats20k.paid10k}</p>
          <p>5K Deposit: {stats.stats20k.paid5kDeposit}</p>
          <p>6K Sub: {stats.stats20k.paid6kSub}</p>
          <p>ARP: ₹{stats.stats20k.arp.toLocaleString()}</p>
        </div>
      </div>
    </div>
  </div>
);

const LeadQualityPerformance = ({ appointments = [] }) => {
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  
  // Calculate stats for each quality
  const qualityStats = {
    best: calculateQualityStats(appointments, 'best'),
    good: calculateQualityStats(appointments, 'good'),
    average: calculateQualityStats(appointments, 'average')
  };

  // Calculate totals
  const totals = {
    stats10k: {
      set: Object.values(qualityStats).reduce((sum, stats) => sum + stats.stats10k.set, 0),
      didntShow: Object.values(qualityStats).reduce((sum, stats) => sum + stats.stats10k.didntShow, 0),
      wronglyQualified: Object.values(qualityStats).reduce((sum, stats) => sum + stats.stats10k.wronglyQualified, 0),
      rescheduled: Object.values(qualityStats).reduce((sum, stats) => sum + stats.stats10k.rescheduled, 0),
      pitched: Object.values(qualityStats).reduce((sum, stats) => sum + stats.stats10k.pitched, 0),
      paid10k: Object.values(qualityStats).reduce((sum, stats) => sum + stats.stats10k.paid10k, 0),
      paid9k: Object.values(qualityStats).reduce((sum, stats) => sum + stats.stats10k.paid9k, 0),
      paid5kSplit: Object.values(qualityStats).reduce((sum, stats) => sum + stats.stats10k.paid5kSplit, 0),
      paid1kDeposit: Object.values(qualityStats).reduce((sum, stats) => sum + stats.stats10k.paid1kDeposit, 0)
    },
    stats20k: {
      set: Object.values(qualityStats).reduce((sum, stats) => sum + stats.stats20k.set, 0),
      didntShow: Object.values(qualityStats).reduce((sum, stats) => sum + stats.stats20k.didntShow, 0),
      wronglyQualified: Object.values(qualityStats).reduce((sum, stats) => sum + stats.stats20k.wronglyQualified, 0),
      rescheduled: Object.values(qualityStats).reduce((sum, stats) => sum + stats.stats20k.rescheduled, 0),
      pitched: Object.values(qualityStats).reduce((sum, stats) => sum + stats.stats20k.pitched, 0),
      paid20k: Object.values(qualityStats).reduce((sum, stats) => sum + stats.stats20k.paid20k, 0),
      paid15k: Object.values(qualityStats).reduce((sum, stats) => sum + stats.stats20k.paid15k, 0),
      paid10k: Object.values(qualityStats).reduce((sum, stats) => sum + stats.stats20k.paid10k, 0),
      paid5kDeposit: Object.values(qualityStats).reduce((sum, stats) => sum + stats.stats20k.paid5kDeposit, 0),
      paid6kSub: Object.values(qualityStats).reduce((sum, stats) => sum + stats.stats20k.paid6kSub, 0)
    }
  };

  // Calculate total pitched rates and ARPs
  totals.stats10k.pitchedRate = totals.stats10k.set ? 
    ((totals.stats10k.pitched / totals.stats10k.set) * 100).toFixed(1) : '0.0';
  totals.stats20k.pitchedRate = totals.stats20k.set ? 
    ((totals.stats20k.pitched / totals.stats20k.set) * 100).toFixed(1) : '0.0';

  totals.stats10k.arp = totals.stats10k.pitched ? 
    Math.round(((totals.stats10k.paid10k * 10000 + totals.stats10k.paid9k * 10000 + 
      totals.stats10k.paid5kSplit * 5000) / totals.stats10k.pitched)) : 0;

  totals.stats20k.arp = totals.stats20k.pitched ? 
    Math.round(((totals.stats20k.paid20k * 20000 + totals.stats20k.paid15k * 20000 + 
      totals.stats20k.paid10k * 10000 + totals.stats20k.paid6kSub * 6000) / 
      totals.stats20k.pitched)) : 0;

  return (
    <div className="mt-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold">Lead Quality Performance</h2>
        <button
          onClick={() => setShowDetailsModal(true)}
          className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
        >
          View Details
        </button>
      </div>

      {/* Details Modal */}
      {showDetailsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Lead Quality Details</h2>
              <button 
                onClick={() => setShowDetailsModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            <div className="space-y-6">
              {Object.entries(qualityStats).map(([quality, stats]) => (
                <div key={quality} className="border rounded p-4">
                  <h3 className="text-lg font-bold mb-4 capitalize">{quality}</h3>
                  <QualityReport quality={quality} stats={stats} />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Main Table */}
      <div className="overflow-x-auto" style={{ maxWidth: '100%', overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
        <table className="w-max border-collapse border" style={{ minWidth: '100%' }}>
          <thead>
            <tr>
              <th rowSpan="2" className="border bg-gray-50 px-4 py-2 text-left">Lead Quality</th>
              <th colSpan="11" className="border bg-cyan-50 text-center py-2">10K Performance</th>
              <th colSpan="11" className="border bg-teal-50 text-center py-2">20K Performance</th>
            </tr>
            <tr>
              {/* 10K Headers */}
              <th className="border bg-cyan-50 px-2 py-2 text-sm">Set</th>
              <th className="border bg-cyan-50 px-2 py-2 text-sm">No Show</th>
              <th className="border bg-cyan-50 px-2 py-2 text-sm">WQ</th>
              <th className="border bg-cyan-50 px-2 py-2 text-sm">Resch.</th>
              <th className="border bg-cyan-100 px-2 py-2 text-sm">Pitched</th>
              <th className="border bg-cyan-100 px-2 py-2 text-sm whitespace-nowrap">Pitched %</th>
              <th className="border bg-green-100 px-2 py-2 text-sm">10K Paid</th>
              <th className="border bg-green-100 px-2 py-2 text-sm">9K Paid</th>
              <th className="border bg-green-100 px-2 py-2 text-sm">5K Split</th>
              <th className="border bg-green-100 px-2 py-2 text-sm">1K Dep.</th>
              <th className="border bg-blue-50 px-2 py-2 text-sm">ARP</th>

              {/* 20K Headers */}
              <th className="border bg-teal-50 px-2 py-2 text-sm">Set</th>
              <th className="border bg-teal-50 px-2 py-2 text-sm">No Show</th>
              <th className="border bg-teal-50 px-2 py-2 text-sm">WQ</th>
              <th className="border bg-teal-50 px-2 py-2 text-sm">Resch.</th>
              <th className="border bg-teal-100 px-2 py-2 text-sm">Pitched</th>
              <th className="border bg-teal-100 px-2 py-2 text-sm whitespace-nowrap">Pitched %</th>
              <th className="border bg-green-100 px-2 py-2 text-sm">20K Paid</th>
              <th className="border bg-green-100 px-2 py-2 text-sm">15K Paid</th>
              <th className="border bg-green-100 px-2 py-2 text-sm">10K Paid</th>
              <th className="border bg-green-100 px-2 py-2 text-sm">6K Sub</th>
              <th className="border bg-blue-50 px-2 py-2 text-sm">ARP</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries({ ...qualityStats, total: totals }).map(([quality, stats]) => (
              <tr 
                key={quality}
                className={quality === 'total' ? 
                  'bg-gray-100 font-semibold' : 
                  'hover:bg-gray-50'
                }
              >
                <td className="border px-4 py-2 capitalize">{quality}</td>
                
                {/* 10K Stats */}
                <td className="border px-2 py-2 text-center bg-cyan-50/50">{stats.stats10k.set}</td>
                <td className="border px-2 py-2 text-center bg-cyan-50/50">{stats.stats10k.didntShow}</td>
                <td className="border px-2 py-2 text-center bg-cyan-50/50">{stats.stats10k.wronglyQualified}</td>
                <td className="border px-2 py-2 text-center bg-cyan-50/50">{stats.stats10k.rescheduled}</td>
                <td className="border px-2 py-2 text-center bg-cyan-100/50">{stats.stats10k.pitched}</td>
                <td className="border px-2 py-2 text-center bg-cyan-100/50">{stats.stats10k.pitchedRate}%</td>
                <td className="border px-2 py-2 text-center bg-green-100/50">{stats.stats10k.paid10k}</td>
                <td className="border px-2 py-2 text-center bg-green-100/50">{stats.stats10k.paid9k}</td>
                <td className="border px-2 py-2 text-center bg-green-100/50">{stats.stats10k.paid5kSplit}</td>
                <td className="border px-2 py-2 text-center bg-green-100/50">{stats.stats10k.paid1kDeposit}</td>
                <td className="border px-2 py-2 text-center bg-blue-50/50">₹{stats.stats10k.arp.toLocaleString()}</td>

                {/* 20K Stats */}
                <td className="border px-2 py-2 text-center bg-teal-50/50">{stats.stats20k.set}</td>
                <td className="border px-2 py-2 text-center bg-teal-50/50">{stats.stats20k.didntShow}</td>
                <td className="border px-2 py-2 text-center bg-teal-50/50">{stats.stats20k.wronglyQualified}</td>
                <td className="border px-2 py-2 text-center bg-teal-50/50">{stats.stats20k.rescheduled}</td>
                <td className="border px-2 py-2 text-center bg-teal-100/50">{stats.stats20k.pitched}</td>
                <td className="border px-2 py-2 text-center bg-teal-100/50">{stats.stats20k.pitchedRate}%</td>
                <td className="border px-2 py-2 text-center bg-green-100/50">{stats.stats20k.paid20k}</td>
                <td className="border px-2 py-2 text-center bg-green-100/50">{stats.stats20k.paid15k}</td>
                <td className="border px-2 py-2 text-center bg-green-100/50">{stats.stats20k.paid10k}</td>
                <td className="border px-2 py-2 text-center bg-green-100/50">{stats.stats20k.paid6kSub}</td>
                <td className="border px-2 py-2 text-center bg-blue-50/50">₹{stats.stats20k.arp.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

QualityReport.propTypes = {
  quality: PropTypes.string.isRequired,
  stats: PropTypes.object.isRequired
};

LeadQualityPerformance.propTypes = {
  appointments: PropTypes.arrayOf(PropTypes.shape({
    leadQuality: PropTypes.string,
    initialPitchType: PropTypes.string,
    status: PropTypes.string,
    paymentType: PropTypes.string
  }))
};

export default LeadQualityPerformance;
