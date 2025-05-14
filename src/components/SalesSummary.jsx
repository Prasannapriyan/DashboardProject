import React from 'react';
import PropTypes from 'prop-types';

const SummaryBox = ({ label, count, bgColor = 'bg-gray-100' }) => (
  <div className={`${bgColor} p-4 rounded-lg shadow`}>
    <div className="text-sm text-gray-600">{label}</div>
    <div className="text-2xl font-bold mt-1">{count}</div>
  </div>
);

const SalesSummary = ({ 
  total,
  available,
  booked,
  picked,
  didntPick,
  callLater,
  paid,
  pitched5k,
  pitched20k,
  wronglyQualified,
  wrongNumber,
  ghosted,
  willJoinLater
}) => {
  return (
    <div className="mt-6 bg-white p-6 rounded-lg shadow-sm">
      <h2 className="text-lg font-semibold mb-4">Sales Summary</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        <SummaryBox
          label="Total Slots"
          count={total}
          bgColor="bg-gray-100"
        />
        <SummaryBox
          label="Available"
          count={available}
          bgColor="bg-green-100"
        />
        <SummaryBox
          label="Booked"
          count={booked}
          bgColor="bg-yellow-100"
        />
        <SummaryBox
          label="Picked"
          count={picked}
          bgColor="bg-purple-100"
        />
        <SummaryBox
          label="Didn't Show up"
          count={didntPick}
          bgColor="bg-red-100"
        />
        <SummaryBox
          label="Call Later"
          count={callLater}
          bgColor="bg-blue-100"
        />
        <SummaryBox
          label="Paid"
          count={paid}
          bgColor="bg-green-200"
        />
        <SummaryBox
          label="10K Pitched"
          count={pitched5k}
          bgColor="bg-cyan-100"
        />
        <SummaryBox
          label="20K Pitched"
          count={pitched20k}
          bgColor="bg-teal-100"
        />
        <SummaryBox
          label="Will Join Later"
          count={willJoinLater}
          bgColor="bg-pink-100"
        />
        <SummaryBox
          label="Wrong Number"
          count={wrongNumber}
          bgColor="bg-gray-200"
        />
        <SummaryBox
          label="Wrongly Qualified"
          count={wronglyQualified}
          bgColor="bg-red-200"
        />
        <SummaryBox
          label="Ghosted"
          count={ghosted}
          bgColor="bg-indigo-100"
        />
      </div>
    </div>
  );
};

SalesSummary.propTypes = {
  total: PropTypes.number.isRequired,
  available: PropTypes.number.isRequired,
  booked: PropTypes.number.isRequired,
  picked: PropTypes.number.isRequired,
  didntPick: PropTypes.number.isRequired,
  callLater: PropTypes.number.isRequired,
  paid: PropTypes.number.isRequired,
  pitched5k: PropTypes.number.isRequired,
  pitched20k: PropTypes.number.isRequired,
  wronglyQualified: PropTypes.number.isRequired,
  wrongNumber: PropTypes.number.isRequired,
  ghosted: PropTypes.number.isRequired,
  willJoinLater: PropTypes.number.isRequired
};

export default SalesSummary;
