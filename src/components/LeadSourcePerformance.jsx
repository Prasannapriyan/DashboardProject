import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

// Helper function to analyze NoShows
const analyzeNoShows = (appointments) => {
  const noShowStatuses = ['didnt_pick', 'call_later', 'rescheduled', 'wrong_number'];
  
  // Initialize stats object
  const stats = {
    ads: {
      total10k: 0,
      total20k: 0,
      byStatus10k: {
        didnt_pick: 0,
        call_later: 0,
        rescheduled: 0,
        wrong_number: 0
      },
      byStatus20k: {
        didnt_pick: 0,
        call_later: 0,
        rescheduled: 0,
        wrong_number: 0
      }
    },
    youtube: {
      total10k: 0,
      total20k: 0,
      byStatus10k: {
        didnt_pick: 0,
        call_later: 0,
        rescheduled: 0,
        wrong_number: 0
      },
      byStatus20k: {
        didnt_pick: 0,
        call_later: 0,
        rescheduled: 0,
        wrong_number: 0
      }
    }
  };

  // Analyze each appointment
  appointments.forEach(app => {
    if (noShowStatuses.includes(app.status)) {
      const source = app.leadSource || 'unknown';
      if (source !== 'unknown') {
        if (app.initialPitchType === '5k_pitched') {
          stats[source].total10k++;
          stats[source].byStatus10k[app.status]++;
        } else if (app.initialPitchType === '20k_pitched') {
          stats[source].total20k++;
          stats[source].byStatus20k[app.status]++;
        }
      }
    }
  });

  // Calculate total appointments for show-up rate
  const total = {
    ads: {
      total10k: appointments.filter(app => 
        app.leadSource === 'ads' && app.initialPitchType === '5k_pitched'
      ).length,
      total20k: appointments.filter(app => 
        app.leadSource === 'ads' && app.initialPitchType === '20k_pitched'
      ).length
    },
    youtube: {
      total10k: appointments.filter(app => 
        app.leadSource === 'youtube' && app.initialPitchType === '5k_pitched'
      ).length,
      total20k: appointments.filter(app => 
        app.leadSource === 'youtube' && app.initialPitchType === '20k_pitched'
      ).length
    }
  };

  return { stats, total };
};

const NoShowReport = ({ source, stats, total, type }) => (
  <div className="mb-4">
    <h3 className="font-bold mb-2">{type} Appointments</h3>
    <table className="w-full text-sm">
      <tbody>
        <tr className="bg-gray-50">
          <td className="px-2 py-1">Total Scheduled:</td>
          <td className="px-2 py-1 text-right">{total[`total${type}`]}</td>
        </tr>
        <tr>
          <td className="px-2 py-1">Total NoShows:</td>
          <td className="px-2 py-1 text-right">{stats[`total${type}`]}</td>
        </tr>
        <tr className="bg-gray-50">
          <td className="px-2 py-1">NoShow Rate:</td>
          <td className="px-2 py-1 text-right">
            {((stats[`total${type}`] / Math.max(1, total[`total${type}`])) * 100).toFixed(1)}%
          </td>
        </tr>
        <tr>
          <td colSpan="2" className="px-2 py-1 font-medium">Breakdown:</td>
        </tr>
        {Object.entries(stats[`byStatus${type}`]).map(([status, count]) => (
          <tr key={status} className="bg-gray-50">
            <td className="px-2 py-1 pl-4">{status}:</td>
            <td className="px-2 py-1 text-right">{count}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const LeadSourcePerformance = ({ leadSourceStats }) => {
  const { ads, youtube } = leadSourceStats;
  const [noShowData, setNoShowData] = useState(null);
  const [showNoShowModal, setShowNoShowModal] = useState(false);
  console.log('Has ads appointments:', Boolean(ads.appointments));
  console.log('Has youtube appointments:', Boolean(youtube.appointments));

  // Calculate totals
  const totals = {
    stats10k: {
      scheduled: ads.stats10k.scheduled + youtube.stats10k.scheduled,
      showUp: ads.stats10k.showUp + youtube.stats10k.showUp,
      didntShowUp: ads.stats10k.didntShowUp + youtube.stats10k.didntShowUp,
      showUpRate: ((ads.stats10k.showUp + youtube.stats10k.showUp) / 
        (ads.stats10k.scheduled + youtube.stats10k.scheduled) * 100 || 0).toFixed(1),
      pitched: ads.stats10k.pitched + youtube.stats10k.pitched,
      paid: ads.stats10k.paid + youtube.stats10k.paid,
      closingRate: ((ads.stats10k.paid + youtube.stats10k.paid) / 
        (ads.stats10k.pitched + youtube.stats10k.pitched) * 100 || 0).toFixed(1),
      revenue: ads.stats10k.revenue + youtube.stats10k.revenue
    },
    stats20k: {
      scheduled: ads.stats20k.scheduled + youtube.stats20k.scheduled,
      showUp: ads.stats20k.showUp + youtube.stats20k.showUp,
      didntShowUp: ads.stats20k.didntShowUp + youtube.stats20k.didntShowUp,
      showUpRate: ((ads.stats20k.showUp + youtube.stats20k.showUp) / 
        (ads.stats20k.scheduled + youtube.stats20k.scheduled) * 100 || 0).toFixed(1),
      pitched: ads.stats20k.pitched + youtube.stats20k.pitched,
      paid: ads.stats20k.paid + youtube.stats20k.paid,
      closingRate: ((ads.stats20k.paid + youtube.stats20k.paid) / 
        (ads.stats20k.pitched + youtube.stats20k.pitched) * 100 || 0).toFixed(1),
      revenue: ads.stats20k.revenue + youtube.stats20k.revenue
    }
  };

  // Analyze NoShows when component mounts or appointments change
  useEffect(() => {
    if (ads.appointments && youtube.appointments) {
      const data = analyzeNoShows([...ads.appointments, ...youtube.appointments]);
      console.log('NoShow Data:', data); // Debug log
      setNoShowData(data);
    }
  }, [ads.appointments, youtube.appointments]);

  return (
    <div className="mt-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold">Lead Source Performance</h2>
        {ads.appointments && youtube.appointments && (
          <button
            onClick={() => {
              console.log('Button clicked'); // Debug log
              setShowNoShowModal(true);
            }}
            className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
          >
            View NoShow Analysis
          </button>
        )}
      </div>

      {/* NoShow Analysis Modal */}
      {showNoShowModal && noShowData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center" style={{ zIndex: 9999 }}>
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto relative">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">NoShow Analysis</h2>
              <button 
                onClick={() => setShowNoShowModal(false)}
                className="text-gray-500 hover:text-gray-700 absolute top-4 right-4"
              >
                ✕
              </button>
            </div>

            <div className="space-y-6">
              <div className="border rounded p-4">
                <h3 className="text-lg font-bold mb-4">Meta Ads</h3>
                <NoShowReport 
                  source="ads"
                  stats={noShowData.stats.ads}
                  total={noShowData.total.ads}
                  type="10k"
                />
                <NoShowReport 
                  source="ads"
                  stats={noShowData.stats.ads}
                  total={noShowData.total.ads}
                  type="20k"
                />
              </div>

              <div className="border rounded p-4">
                <h3 className="text-lg font-bold mb-4">YouTube</h3>
                <NoShowReport 
                  source="youtube"
                  stats={noShowData.stats.youtube}
                  total={noShowData.total.youtube}
                  type="10k"
                />
                <NoShowReport 
                  source="youtube"
                  stats={noShowData.stats.youtube}
                  total={noShowData.total.youtube}
                  type="20k"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Original Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse border">
          <thead>
            <tr>
              <th rowSpan="2" className="border bg-gray-50 px-4 py-2 w-40 text-left">Lead Source</th>
              <th colSpan="8" className="border bg-cyan-50 text-center py-2">10K Performance</th>
              <th colSpan="8" className="border bg-teal-50 text-center py-2">20K Performance</th>
            </tr>
            <tr>
              {/* 10K Headers */}
              <th className="border bg-cyan-50 px-4 py-2 text-sm font-medium">Sched.</th>
              <th className="border bg-cyan-50 px-4 py-2 text-sm font-medium">Show</th>
              <th className="border bg-cyan-50 px-4 py-2 text-sm font-medium">No Show</th>
              <th className="border bg-cyan-50 px-4 py-2 text-sm font-medium">Show%</th>
              <th className="border bg-cyan-100 px-4 py-2 text-sm font-medium">Pitched</th>
              <th className="border bg-green-100 px-4 py-2 text-sm font-medium">Paid</th>
              <th className="border bg-blue-50 px-4 py-2 text-sm font-medium">Close%</th>
              <th className="border bg-green-50 px-4 py-2 text-sm font-medium">Revenue</th>
              
              {/* 20K Headers */}
              <th className="border bg-teal-50 px-4 py-2 text-sm font-medium">Sched.</th>
              <th className="border bg-teal-50 px-4 py-2 text-sm font-medium">Show</th>
              <th className="border bg-teal-50 px-4 py-2 text-sm font-medium">No Show</th>
              <th className="border bg-teal-50 px-4 py-2 text-sm font-medium">Show%</th>
              <th className="border bg-teal-100 px-4 py-2 text-sm font-medium">Pitched</th>
              <th className="border bg-green-100 px-4 py-2 text-sm font-medium">Paid</th>
              <th className="border bg-blue-50 px-4 py-2 text-sm font-medium">Close%</th>
              <th className="border bg-green-50 px-4 py-2 text-sm font-medium">Revenue</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {[
              { name: 'Meta Ads', stats: ads },
              { name: 'YouTube', stats: youtube },
              { name: 'Total', stats: totals, isTotal: true }
            ].map(({ name, stats, isTotal }) => (
              <tr 
                key={name}
                className={`${isTotal ? 'bg-gray-100 font-semibold' : 'hover:bg-gray-50'}`}
              >
                <td className="border px-4 py-2">{name}</td>
                
                {/* 10K Stats */}
                <td className="border px-4 py-2 text-center bg-cyan-50/50">{stats.stats10k.scheduled}</td>
                <td className="border px-4 py-2 text-center bg-cyan-50/50">{stats.stats10k.showUp}</td>
                <td className="border px-4 py-2 text-center bg-cyan-50/50">{stats.stats10k.didntShowUp}</td>
                <td className="border px-4 py-2 text-center bg-cyan-50/50">{stats.stats10k.showUpRate}%</td>
                <td className="border px-4 py-2 text-center bg-cyan-100/50">{stats.stats10k.pitched}</td>
                <td className="border px-4 py-2 text-center bg-green-100/50">{stats.stats10k.paid}</td>
                <td className="border px-4 py-2 text-center bg-blue-50/50">{stats.stats10k.closingRate}%</td>
                <td className="border px-4 py-2 text-center bg-green-50/50">₹{stats.stats10k.revenue.toLocaleString()}</td>
                
                {/* 20K Stats */}
                <td className="border px-4 py-2 text-center bg-teal-50/50">{stats.stats20k.scheduled}</td>
                <td className="border px-4 py-2 text-center bg-teal-50/50">{stats.stats20k.showUp}</td>
                <td className="border px-4 py-2 text-center bg-teal-50/50">{stats.stats20k.didntShowUp}</td>
                <td className="border px-4 py-2 text-center bg-teal-50/50">{stats.stats20k.showUpRate}%</td>
                <td className="border px-4 py-2 text-center bg-teal-100/50">{stats.stats20k.pitched}</td>
                <td className="border px-4 py-2 text-center bg-green-100/50">{stats.stats20k.paid}</td>
                <td className="border px-4 py-2 text-center bg-blue-50/50">{stats.stats20k.closingRate}%</td>
                <td className="border px-4 py-2 text-center bg-green-50/50">₹{stats.stats20k.revenue.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

NoShowReport.propTypes = {
  source: PropTypes.string.isRequired,
  stats: PropTypes.object.isRequired,
  total: PropTypes.object.isRequired,
  type: PropTypes.string.isRequired
};

LeadSourcePerformance.propTypes = {
  leadSourceStats: PropTypes.shape({
    ads: PropTypes.shape({
      stats10k: PropTypes.shape({
        scheduled: PropTypes.number.isRequired,
        showUp: PropTypes.number.isRequired,
        didntShowUp: PropTypes.number.isRequired,
        showUpRate: PropTypes.string.isRequired,
        pitched: PropTypes.number.isRequired,
        paid: PropTypes.number.isRequired,
        closingRate: PropTypes.string.isRequired,
        revenue: PropTypes.number.isRequired
      }).isRequired,
      stats20k: PropTypes.shape({
        scheduled: PropTypes.number.isRequired,
        showUp: PropTypes.number.isRequired,
        didntShowUp: PropTypes.number.isRequired,
        showUpRate: PropTypes.string.isRequired,
        pitched: PropTypes.number.isRequired,
        paid: PropTypes.number.isRequired,
        closingRate: PropTypes.string.isRequired,
        revenue: PropTypes.number.isRequired
      }).isRequired,
      appointments: PropTypes.array
    }).isRequired,
    youtube: PropTypes.shape({
      stats10k: PropTypes.shape({
        scheduled: PropTypes.number.isRequired,
        showUp: PropTypes.number.isRequired,
        didntShowUp: PropTypes.number.isRequired,
        showUpRate: PropTypes.string.isRequired,
        pitched: PropTypes.number.isRequired,
        paid: PropTypes.number.isRequired,
        closingRate: PropTypes.string.isRequired,
        revenue: PropTypes.number.isRequired
      }).isRequired,
      stats20k: PropTypes.shape({
        scheduled: PropTypes.number.isRequired,
        showUp: PropTypes.number.isRequired,
        didntShowUp: PropTypes.number.isRequired,
        showUpRate: PropTypes.string.isRequired,
        pitched: PropTypes.number.isRequired,
        paid: PropTypes.number.isRequired,
        closingRate: PropTypes.string.isRequired,
        revenue: PropTypes.number.isRequired
      }).isRequired,
      appointments: PropTypes.array
    }).isRequired
  }).isRequired
};

export default LeadSourcePerformance;
