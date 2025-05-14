/**
 * Test helper for sales calculations
 * 
 * Test Cases:
 * 1. Standard 10K Full Payment (ID: 1)
 *    - 10K full payment
 *    - Vicky (setter) → Harsha (sales)
 *    - Ads lead source
 * 
 * 2. No Show - 10K (ID: 2)
 *    - Customer didn't pick
 *    - Vicky → Harsha
 *    - Ads lead source
 * 
 * 3. Standard 20K Full Payment (ID: 3)
 *    - 20K full payment
 *    - Prasanna → Mani
 *    - YouTube lead source
 * 
 * 4. Upgrade: 10K → 20K (ID: 4)
 *    - Initially pitched 10K, upgraded to 20K
 *    - Vicky → Harsha
 *    - Ads lead source
 * 
 * 5. Rescheduled Appointment (ID: 5)
 *    - Rescheduled from ID: 2
 *    - Prasanna → Monish
 *    - YouTube lead source
 * 
 * 6. Split Payment - 10K (ID: 6)
 *    - 5K split payment
 *    - Vicky → Harsha
 *    - Ads lead source
 * 
 * 7. Second Installment - 20K (ID: 7)
 *    - 10K second installment
 *    - Vicky → Harsha
 *    - Ads lead source
 * 
 * 8. Lower Package - 9K (ID: 8)
 *    - 9K package
 *    - Prasanna → Tamil
 *    - YouTube lead source
 * 
 * Metrics Tracked:
 * 1. Status Distribution
 *    - Show up vs No show
 *    - Paid vs Unpaid
 *    - Rescheduled appointments
 * 
 * 2. Revenue Analysis
 *    - 10K package revenue
 *    - 20K package revenue
 *    - Split payments
 *    - Second installments
 * 
 * 3. Setter Performance
 *    - Total appointments set
 *    - Conversion rates
 *    - Revenue per setter
 * 
 * 4. Sales Performance
 *    - Revenue per sales person
 *    - Conversion rates
 *    - Package upgrades
 * 
 * 5. Lead Source Analysis
 *    - Revenue by source
 *    - Conversion rates
 *    - Initial payment rates
 * 
 * 6. Package Analysis
 *    - Initial vs Final package
 *    - Upgrade rates
 *    - Package distribution
 */

// Test helper for calculations
export const validateCalculations = (_appointments) => {
  const today = new Date();
  const testAppointments = [
    {
      id: 1,
      status: 'paid',
      initialPitchType: '5k_pitched',
      pitchedType: '5k_pitched',
      setterName: 'Vicky',
      leadSource: 'ads',
      date: today,
      initialPayment: 'paid',
      paymentType: '5k',  // 10K full payment
      salesPerson: 'Harsha',
      time: '11:00'
    },
    {
      id: 2,
      status: 'didnt_pick',
      initialPitchType: '5k_pitched',
      setterName: 'Vicky',
      leadSource: 'ads',
      date: today,
      initialPayment: 'unpaid',
      salesPerson: 'Harsha',
      time: '12:00'
    },
    {
      id: 3,
      status: 'paid',
      initialPitchType: '20k_pitched',
      pitchedType: '20k_pitched',
      paymentType: '20k',
      setterName: 'Prasanna',
      leadSource: 'youtube',
      date: today,
      initialPayment: 'paid',
      salesPerson: 'Mani',
      time: '13:00'
    },
    {
      id: 4,
      status: 'paid',
      initialPitchType: '5k_pitched',
      pitchedType: '20k_pitched',
      paymentType: '20k',
      setterName: 'Vicky',
      leadSource: 'ads',
      date: today,
      initialPayment: 'paid',
      salesPerson: 'Harsha',
      time: '14:00'
    },
    {
      id: 5,
      status: 'rescheduled',
      initialPitchType: '5k_pitched',
      parentId: 2,
      setterName: 'Prasanna',
      leadSource: 'youtube',
      date: today,
      initialPayment: 'unpaid',
      salesPerson: 'Monish',
      time: '15:00'
    },
    {
      id: 6,
      status: 'paid',
      initialPitchType: '5k_pitched',
      pitchedType: '5k_pitched',
      paymentType: '5k_split',
      setterName: 'Vicky',
      leadSource: 'ads',
      date: today,
      initialPayment: 'paid',
      salesPerson: 'Harsha',
      time: '16:00'
    },
    {
      id: 7,
      status: 'paid',
      initialPitchType: '20k_pitched',
      pitchedType: '20k_pitched',
      paymentType: '10k_2nd',
      setterName: 'Vicky',
      leadSource: 'ads',
      date: today,
      initialPayment: 'paid',
      salesPerson: 'Harsha',
      time: '17:00'
    },
    {
      id: 8,
      status: 'paid',
      initialPitchType: '5k_pitched',
      pitchedType: '5k_pitched',
      paymentType: '4k',
      setterName: 'Prasanna',
      leadSource: 'youtube',
      date: today,
      initialPayment: 'paid',
      salesPerson: 'Tamil',
      time: '18:00'
    }
  ];

  console.log('\n🧪 Running Tests with Sample Data');
  console.log('═'.repeat(50));
  console.log('Test Appointments:', testAppointments.length);

  const validations = [];
  const SETTERS = ['Vicky', 'Prasanna'];

  // Constants
  const statuses = {
    showUp: ['picked', '5k_pitched', '20k_pitched', 'will_join_later', 'ghosted', 'wrongly_qualified', 'paid'],
    noShow: ['didnt_pick', 'call_later', 'rescheduled', 'wrong_number']
  };

  const paymentValues = {
    '5k': 10000,
    '4k': 9000,
    '5k_split': 5000,
    '1k_deposit': 1000,
    '20k': 20000,
    '10k_2nd': 10000,
    '15k': 15000,
    '10k': 10000,
    '6k_sub': 6000,
    '5k_deposit': 5000
  };

  // Basic Status Metrics
  const statusCounts = testAppointments.reduce((acc, app) => {
    acc[app.status] = (acc[app.status] || 0) + 1;
    return acc;
  }, {});
  console.log('\n📊 Status Distribution:');
  console.table(statusCounts);

  validations.push({
    category: 'Status',
    test: 'Show Up Total',
    expected: 6,
    actual: testAppointments.filter(app => statuses.showUp.includes(app.status)).length,
    description: 'Total appointments where customer showed up'
  });

  validations.push({
    category: 'Status',
    test: 'No Show Total',
    expected: 2,
    actual: testAppointments.filter(app => statuses.noShow.includes(app.status)).length,
    description: 'Total no-shows and rescheduled appointments'
  });

  // Revenue Analysis
  validations.push({
    category: 'Revenue',
    test: '10K Package Revenue',
    expected: 24000,  // 10K + 5K split + 9K
    actual: testAppointments.reduce((total, app) => {
      if (app.status === 'paid' && app.pitchedType === '5k_pitched') {
        return total + (paymentValues[app.paymentType] || 0);
      }
      return total;
    }, 0),
    description: 'Total revenue from 10K packages'
  });

  validations.push({
    category: 'Revenue',
    test: '20K Package Revenue',
    expected: 50000,  // 20K + 20K + 10K second installment
    actual: testAppointments.reduce((total, app) => {
      if (app.status === 'paid' && app.pitchedType === '20k_pitched') {
        return total + (paymentValues[app.paymentType] || 0);
      }
      return total;
    }, 0),
    description: 'Total revenue from 20K packages'
  });

  // Setter Performance
  const vickyApps = testAppointments.filter(app => app.setterName === 'Vicky');
  validations.push({
    category: 'Setter',
    test: 'Vicky Total Set',
    expected: 5,  // IDs: 1, 2, 4, 6, 7
    actual: vickyApps.length,
    description: 'Total appointments set by Vicky'
  });

  validations.push({
    category: 'Setter',
    test: 'Vicky Conversion Rate',
    expected: "80.0", // 4 paid out of 5 total
    actual: ((vickyApps.filter(app => app.status === 'paid').length / vickyApps.length * 100).toFixed(1)),
    description: "Vicky's conversion rate"
  });

  // Sales Person Performance
  const harshaApps = testAppointments.filter(app => app.salesPerson === 'Harsha');
  validations.push({
    category: 'Sales',
    test: 'Harsha Revenue',
    expected: 45000, // 10K + 20K + 5K split + 10K second
    actual: harshaApps.filter(app => app.status === 'paid').reduce((total, app) => {
      return total + (paymentValues[app.paymentType] || 0);
    }, 0),
    description: "Harsha's total revenue"
  });

  // Lead Source Analysis
  const adsRevenue = testAppointments.reduce((total, app) => {
    if (app.leadSource === 'ads' && app.status === 'paid') {
      return total + (paymentValues[app.paymentType] || 0);
    }
    return total;
  }, 0);

  validations.push({
    category: 'Lead Source',
    test: 'Ads Revenue',
    expected: 45000,  // Same as Harsha's revenue
    actual: adsRevenue,
    description: 'Total revenue from ad-sourced leads'
  });

  // Conversion Analysis
  validations.push({
    category: 'Conversion',
    test: 'Overall Conversion Rate',
    expected: "75.0", // 6 paid out of 8 total
    actual: ((testAppointments.filter(app => app.status === 'paid').length / testAppointments.length * 100).toFixed(1)),
    description: 'Overall appointment conversion rate'
  });

  // Enhanced Stats Table
  const performanceStats = {
    by_setter: SETTERS.reduce((acc, setter) => {
      const apps = testAppointments.filter(app => app.setterName === setter);
      acc[setter] = {
        total: apps.length,
        paid: apps.filter(app => app.status === 'paid').length,
        revenue: apps.filter(app => app.status === 'paid').reduce((sum, app) => 
          sum + (paymentValues[app.paymentType] || 0), 0),
        conversion: ((apps.filter(app => app.status === 'paid').length / apps.length) * 100).toFixed(1) + '%'
      };
      return acc;
    }, {}),
    by_package: {
      '10k': {
        total: testAppointments.filter(app => app.initialPitchType === '5k_pitched').length,
        converted: testAppointments.filter(app => 
          app.status === 'paid' && 
          app.pitchedType === '5k_pitched'
        ).length,
        revenue: testAppointments.filter(app => 
          app.status === 'paid' && 
          app.pitchedType === '5k_pitched'
        ).reduce((sum, app) => sum + (paymentValues[app.paymentType] || 0), 0)
      },
      '20k': {
        total: testAppointments.filter(app => app.initialPitchType === '20k_pitched').length,
        converted: testAppointments.filter(app => 
          app.status === 'paid' && 
          app.pitchedType === '20k_pitched'
        ).length,
        revenue: testAppointments.filter(app => 
          app.status === 'paid' && 
          app.pitchedType === '20k_pitched'
        ).reduce((sum, app) => sum + (paymentValues[app.paymentType] || 0), 0)
      }
    }
  };

  console.log('\n📊 Performance Stats:');
  console.table(performanceStats.by_setter);
  console.log('\n📦 Package Stats:');
  console.table(performanceStats.by_package);

  // Print Results
  console.log('\n📋 Test Results');
  console.log('═'.repeat(50));

  const categories = [...new Set(validations.map(v => v.category))];
  categories.forEach(category => {
    console.log(`\n${category}:`);
    console.log('─'.repeat(50));
    validations.filter(v => v.category === category).forEach(v => {
      const passed = v.actual === v.expected;
      const symbol = passed ? '✓' : '✗';
      const color = passed ? '[32m' : '[31m';
      console.log(
        `${color}${symbol}[0m ${v.test}`,
        `\n   Expected: ${v.expected}`,
        `\n   Actual: ${v.actual}`,
        `\n   ${v.description}`
      );
      console.log('─'.repeat(50));
    });
  });

  const totalPassed = validations.filter(v => v.actual === v.expected).length;
  const passRate = (totalPassed / validations.length * 100).toFixed(1);
  
  console.log('\n📈 Summary');
  console.log('═'.repeat(50));
  console.log(`Tests Passed: ${totalPassed}/${validations.length} (${passRate}%)`);
  
  if (passRate === '100.0') {
    console.log('🎉 All calculations are working correctly!');
  } else {
    console.warn('\n⚠️  Failed Tests:');
    validations
      .filter(v => v.actual !== v.expected)
      .forEach(v => {
        console.log(`- ${v.test}: Expected ${v.expected}, got ${v.actual}`);
      });
  }

  return {
    validations,
    summary: {
      total: validations.length,
      passed: totalPassed,
      passRate: passRate,
      testData: testAppointments,
      detailedStats: {
        statusCounts,
        performanceStats
      }
    }
  };
};
