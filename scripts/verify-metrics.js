const dotenv = require('dotenv');
const firebase = require('firebase/app');
const { getDatabase, ref, get } = require('firebase/database');
const { calculateLeadSourceStats } = require('./calendar-utils.cjs');

// Load environment variables
dotenv.config();

// Firebase configuration
const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID,
  databaseURL: process.env.VITE_FIREBASE_DATABASE_URL
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const database = getDatabase(app);

const noShowStatuses = ['didnt_pick', 'call_later', 'rescheduled', 'wrong_number'];

// Function to get appointments for March 29th
async function getMarch29Appointments() {
  try {
    const appointmentsRef = ref(database, 'appointments');
    const snapshot = await get(appointmentsRef);
    const appointments = [];
    
    snapshot.forEach((childSnapshot) => {
      const appointment = childSnapshot.val();
      appointment.id = childSnapshot.key;
      appointment.date = new Date(appointment.date);
      
      // Filter for March 29th
      if (appointment.date.getDate() === 29 && appointment.date.getMonth() === 2) {
        appointments.push(appointment);
      }
    });
    
    return appointments;
  } catch (error) {
    console.error('Error fetching appointments:', error);
    process.exit(1);
  }
}

// Function to calculate calendar view metrics
function calculateCalendarMetrics(appointments) {
  const metrics = {
    total: appointments.length,
    noShows: {
      total: 0,
      byStatus: {},
      bySource: {
        ads: 0,
        youtube: 0
      }
    }
  };

  appointments.forEach(app => {
    if (noShowStatuses.includes(app.status)) {
      metrics.noShows.total++;
      metrics.noShows.byStatus[app.status] = (metrics.noShows.byStatus[app.status] || 0) + 1;
      if (app.leadSource === 'ads') {
        metrics.noShows.bySource.ads++;
      } else if (app.leadSource === 'youtube') {
        metrics.noShows.bySource.youtube++;
      }
    }
  });

  return metrics;
}

// Function to print comparison
function printComparison(calendarMetrics, leadSourceMetrics) {
  console.log('\n=== March 29th Metrics Comparison ===\n');

  // Print total appointments
  console.log('Total Appointments:', calendarMetrics.total);
  console.log('\n=== Calendar View Metrics ===');
  console.log('No Shows Total:', calendarMetrics.noShows.total);
  console.log('\nBy Status:');
  Object.entries(calendarMetrics.noShows.byStatus).forEach(([status, count]) => {
    console.log(`${status}: ${count}`);
  });
  console.log('\nBy Source:');
  console.log('Ads:', calendarMetrics.noShows.bySource.ads);
  console.log('YouTube:', calendarMetrics.noShows.bySource.youtube);

  console.log('\n=== Lead Source Performance Metrics ===');
  console.log('\nAds:');
  console.log(`10K No Shows: ${leadSourceMetrics.ads.stats10k.didntShowUp}`);
  console.log(`20K No Shows: ${leadSourceMetrics.ads.stats20k.didntShowUp}`);
  console.log('\nYouTube:');
  console.log(`10K No Shows: ${leadSourceMetrics.youtube.stats10k.didntShowUp}`);
  console.log(`20K No Shows: ${leadSourceMetrics.youtube.stats20k.didntShowUp}`);

  // Compare totals
  const leadSourceTotal = 
    leadSourceMetrics.ads.stats10k.didntShowUp +
    leadSourceMetrics.ads.stats20k.didntShowUp +
    leadSourceMetrics.youtube.stats10k.didntShowUp +
    leadSourceMetrics.youtube.stats20k.didntShowUp;

  console.log('\n=== Comparison ===');
  console.log('Calendar View Total No Shows:', calendarMetrics.noShows.total);
  console.log('Lead Source Total No Shows:', leadSourceTotal);
  
  if (calendarMetrics.noShows.total !== leadSourceTotal) {
    console.log('\n⚠️  DISCREPANCY DETECTED!');
    console.log(`Difference: ${Math.abs(calendarMetrics.noShows.total - leadSourceTotal)}`);
  } else {
    console.log('\n✅ Totals match!');
  }
}

// Main function
async function verifyMetrics() {
  console.log('Fetching March 29th appointments...');
  const appointments = await getMarch29Appointments();
  
  console.log(`Found ${appointments.length} appointments for March 29th`);
  
  // Calculate metrics both ways
  const calendarMetrics = calculateCalendarMetrics(appointments);
  const leadSourceMetrics = calculateLeadSourceStats(appointments);
  
  // Print comparison
  printComparison(calendarMetrics, leadSourceMetrics);
}

// Run the verification
verifyMetrics().catch(console.error);
