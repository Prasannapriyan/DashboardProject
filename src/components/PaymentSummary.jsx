import React from 'react';
import PropTypes from 'prop-types';

const PaymentRow = ({ label, count, amount }) => (
  <tr className="border-b">
    <td className="py-2">{label}</td>
    <td className="py-2 text-center">{count}</td>
    <td className="py-2 text-right">₹{(amount * count).toLocaleString()}</td>
  </tr>
);

const PaymentSummary = ({ payments = {} }) => {
  const paymentValues = {
    '5k': 10000,  // Updated from 5000
    '4k': 9000,   // Updated from 4000
    '1k_deposit': 1000,
    '5k_deposit': 5000,
    '6k_sub': 6000,
    '10k': 10000,
    '10k_2nd': 10000,
    '20k': 20000,
    '5k_split': 5000  // Add new payment type
  };

  const totalRevenue = Object.entries(payments).reduce((total, [type, count]) => {
    return total + (paymentValues[type] || 0) * count;
  }, 0);

  const paymentLabels = {
    '5k': '10K',          // Updated label
    '4k': '9K',           // Updated label
    '1k_deposit': '1K Deposit',
    '5k_deposit': '5K Deposit',
    '6k_sub': '6K Subscription',
    '10k': '10K',
    '10k_2nd': '10K (2nd)',
    '20k': '20K',
    '5k_split': '5K Split'  // Add new payment type
  };

  return (
    <div className="mt-6 bg-white p-6 rounded-lg shadow-sm">
      <h2 className="text-lg font-semibold mb-4">Payment Summary</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="border-b-2 border-gray-200">
              <th className="text-left py-2">Payment Type</th>
              <th className="text-center py-2">Count</th>
              <th className="text-right py-2">Amount</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(paymentLabels).map(([key, label]) => (
              <PaymentRow
                key={key}
                label={label}
                count={payments[key] || 0}
                amount={paymentValues[key]}
              />
            ))}
            <tr className="border-t-2 border-gray-200 font-bold">
              <td className="py-3">Total Revenue</td>
              <td></td>
              <td className="text-right">₹{totalRevenue.toLocaleString()}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

PaymentSummary.propTypes = {
  payments: PropTypes.objectOf(PropTypes.number)
};

export default PaymentSummary;
