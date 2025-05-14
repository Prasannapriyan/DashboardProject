import { initializeApp } from 'firebase/app';
import { 
  getDatabase, 
  ref, 
  push, 
  update, 
  remove, 
  onValue, 
  set, 
  get 
} from 'firebase/database';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL
};

console.log('Initializing Firebase with database URL:', firebaseConfig.databaseURL);

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

// Monitor connection status
const connectedRef = ref(database, '.info/connected');
onValue(connectedRef, (snap) => {
  if (snap.val() === true) {
    console.log('✅ Connected to Firebase Database');
  } else {
    console.log('❌ Disconnected from Firebase Database');
  }
});

// Verify database existence
const verifyDatabase = async () => {
  try {
    const infoRef = ref(database, '_info');
    const snapshot = await get(infoRef);
    if (!snapshot.exists()) {
      console.warn('Database structure not found, initializing...');
      await set(ref(database), {
        appointments: {},
        salesPeople: [],
        _info: {
          lastUpdated: new Date().toISOString(),
          initialized: true,
          version: '1.0.0',
          description: 'FitX120 Sales Calendar Database'
        }
      });
      console.log('Database initialized successfully');
    }
  } catch (error) {
    console.error('Database verification failed:', error);
  }
};

// Run verification
verifyDatabase();

// Appointments functions
export const saveAppointment = async (appointment) => {
  try {
    console.log('Saving appointment:', appointment);
    if (appointment.id) {
      const updates = {};
      updates[`/appointments/${appointment.id}`] = appointment;
      await update(ref(database), updates);
      console.log('Updated existing appointment:', appointment.id);
    } else {
      const appointmentsRef = ref(database, 'appointments');
      const newRef = await push(appointmentsRef, appointment);
      console.log('Created new appointment:', newRef.key);
    }
  } catch (error) {
    console.error('Error saving appointment:', error);
    throw error;
  }
};

export const deleteAppointment = async (appointmentId) => {
  try {
    console.log('Deleting appointment:', appointmentId);
    await remove(ref(database, `appointments/${appointmentId}`));
    console.log('Appointment deleted successfully');
  } catch (error) {
    console.error('Error deleting appointment:', error);
    throw error;
  }
};

export const subscribeToAppointments = (callback) => {
  try {
    console.log('Setting up appointments subscription');
    const appointmentsRef = ref(database, 'appointments');
    const unsubscribe = onValue(appointmentsRef, (snapshot) => {
      const appointments = [];
      snapshot.forEach((childSnapshot) => {
        if (childSnapshot.key !== '_metadata') {
          const appointment = childSnapshot.val();
          appointment.id = childSnapshot.key;
          appointment.date = new Date(appointment.date);
          appointments.push(appointment);
        }
      });
      console.log('Received appointments update:', appointments.length, 'appointments');
      callback(appointments);
    }, (error) => {
      console.error('Error in appointments subscription:', error);
    });

    return unsubscribe;
  } catch (error) {
    console.error('Error setting up appointments subscription:', error);
    return () => {};
  }
};

// Sales People Attendance functions
export const saveSalesPeopleStatus = async (salesPeople) => {
  try {
    console.log('Saving sales people status:', salesPeople);
    await set(ref(database, 'salesPeople'), salesPeople);
    console.log('Successfully saved sales people status');
  } catch (error) {
    console.error('Error saving sales people status:', error);
    throw error;
  }
};

export const subscribeToSalesPeopleStatus = (callback) => {
  try {
    console.log('Setting up sales people status subscription');
    const salesPeopleRef = ref(database, 'salesPeople');
    const unsubscribe = onValue(salesPeopleRef, (snapshot) => {
      if (snapshot.exists()) {
        const status = snapshot.val();
        console.log('Received sales people status update');
        callback(status);
      }
    }, (error) => {
      console.error('Error in sales people status subscription:', error);
    });

    return unsubscribe;
  } catch (error) {
    console.error('Error setting up sales people status subscription:', error);
    return () => {};
  }
};

export { app, database };
