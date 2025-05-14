import { initializeApp } from 'firebase/app';
import { getDatabase, ref, set, get, onValue, remove, update } from 'firebase/database';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL
};

// Log environment info (safely)
console.log('Current environment:', import.meta.env.MODE);
console.log('Using database URL:', import.meta.env.VITE_FIREBASE_DATABASE_URL);
console.log('Project ID:', import.meta.env.VITE_FIREBASE_PROJECT_ID);

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

// Database utility functions with environment-aware logging
export const saveAppointment = async (appointment) => {
  try {
    console.log(`[${import.meta.env.MODE}] Saving appointment:`, appointment.id);
    const appointmentsRef = ref(database, 'appointments/' + appointment.id);
    await set(appointmentsRef, {
      ...appointment,
      date: appointment.date.toISOString(),
      environment: import.meta.env.MODE // Track which environment created this
    });
    console.log(`[${import.meta.env.MODE}] Appointment saved successfully`);
    return true;
  } catch (error) {
    console.error(`[${import.meta.env.MODE}] Error saving appointment:`, error);
    throw error;
  }
};

export const deleteAppointment = async (appointmentId) => {
  try {
    console.log(`[${import.meta.env.MODE}] Deleting appointment:`, appointmentId);
    const appointmentRef = ref(database, 'appointments/' + appointmentId);
    await remove(appointmentRef);
    console.log(`[${import.meta.env.MODE}] Appointment deleted successfully`);
    return true;
  } catch (error) {
    console.error(`[${import.meta.env.MODE}] Error deleting appointment:`, error);
    throw error;
  }
};

export const loadAppointments = async () => {
  try {
    console.log(`[${import.meta.env.MODE}] Loading appointments...`);
    const appointmentsRef = ref(database, 'appointments');
    const snapshot = await get(appointmentsRef);
    if (snapshot.exists()) {
      const appointments = Object.values(snapshot.val()).map(app => ({
        ...app,
        date: new Date(app.date)
      }));
      console.log(`[${import.meta.env.MODE}] Appointments loaded:`, appointments.length);
      return appointments;
    }
    console.log(`[${import.meta.env.MODE}] No appointments found`);
    return [];
  } catch (error) {
    console.error(`[${import.meta.env.MODE}] Error loading appointments:`, error);
    return [];
  }
};

export const subscribeToAppointments = (callback) => {
  try {
    console.log(`[${import.meta.env.MODE}] Setting up appointments subscription...`);
    const appointmentsRef = ref(database, 'appointments');
    return onValue(appointmentsRef, (snapshot) => {
      if (snapshot.exists()) {
        const appointments = Object.values(snapshot.val()).map(app => ({
          ...app,
          date: new Date(app.date)
        }));
        console.log(`[${import.meta.env.MODE}] Real-time update:`, appointments.length, 'appointments');
        callback(appointments);
      } else {
        console.log(`[${import.meta.env.MODE}] No appointments in real-time update`);
        callback([]);
      }
    });
  } catch (error) {
    console.error(`[${import.meta.env.MODE}] Error in subscription:`, error);
    callback([]);
    return () => {};
  }
};

// New attendance functions with date-specific tracking
export const saveAttendanceStatus = async (salesPeople, date) => {
  try {
    console.log(`[${import.meta.env.MODE}] Saving attendance status for date:`, date);
    const dateKey = date.toISOString().split('T')[0];
    const attendanceRef = ref(database, `attendance/${dateKey}`);
    await set(attendanceRef, {
      salesPeople,
      lastUpdated: new Date().toISOString()
    });
    console.log(`[${import.meta.env.MODE}] Attendance status saved successfully`);
    return true;
  } catch (error) {
    console.error(`[${import.meta.env.MODE}] Error saving attendance status:`, error);
    throw error;
  }
};

export const subscribeToAttendance = (callback, date) => {
  try {
    console.log(`[${import.meta.env.MODE}] Setting up attendance subscription for date:`, date);
    const dateKey = date.toISOString().split('T')[0];
    const attendanceRef = ref(database, `attendance/${dateKey}`);
    return onValue(attendanceRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        console.log(`[${import.meta.env.MODE}] Attendance status updated`);
        callback(data.salesPeople);
      }
    });
  } catch (error) {
    console.error(`[${import.meta.env.MODE}] Error in attendance subscription:`, error);
    return () => {};
  }
};

export const subscribeToUnavailableSlots = (callback) => {
  try {
    console.log(`[${import.meta.env.MODE}] Setting up unavailable slots subscription...`);
    const slotsRef = ref(database, 'unavailableSlots');
    return onValue(slotsRef, (snapshot) => {
      if (snapshot.exists()) {
        const slots = snapshot.val();
        console.log(`[${import.meta.env.MODE}] Unavailable slots updated`);
        callback(slots);
      } else {
        callback({});
      }
    });
  } catch (error) {
    console.error(`[${import.meta.env.MODE}] Error in unavailable slots subscription:`, error);
    callback({});
    return () => {};
  }
};

export const loadAttendanceStatus = async (date) => {
  try {
    console.log(`[${import.meta.env.MODE}] Loading attendance status for date:`, date);
    const dateKey = date.toISOString().split('T')[0];
    const attendanceRef = ref(database, `attendance/${dateKey}`);
    const snapshot = await get(attendanceRef);
    if (snapshot.exists()) {
      const data = snapshot.val();
      console.log(`[${import.meta.env.MODE}] Attendance status loaded`);
      return data.salesPeople;
    }
    console.log(`[${import.meta.env.MODE}] No attendance status found`);
    return null;
  } catch (error) {
    console.error(`[${import.meta.env.MODE}] Error loading attendance status:`, error);
    return null;
  }
};

// Default unavailable slots configuration
const DEFAULT_UNAVAILABLE_SLOTS = {
  "default_13:00": { 
    type: "break",
    label: "Lunch Break",
    isDefault: true,
    isGlobal: true
  },
  "default_16:00": {
    type: "break", 
    label: "Tea Break",
    isDefault: true,
    isGlobal: true
  },
  "default_monish_20:30": {
    type: "personal",
    label: "Unavailable",
    isDefault: true,
    isGlobal: false,
    person: "Monish"
  }
};

// Initialize default unavailable slots
export const initializeDefaultSlots = async () => {
  try {
    const slotsRef = ref(database, 'unavailableSlots');
    const snapshot = await get(slotsRef);
    const existingSlots = snapshot.val() || {};
    
    // Only add default slots if they don't exist
    const updates = {};
    Object.entries(DEFAULT_UNAVAILABLE_SLOTS).forEach(([key, value]) => {
      if (!existingSlots[key]) {
        updates[key] = value;
      }
    });

    if (Object.keys(updates).length > 0) {
      await update(ref(database, 'unavailableSlots'), updates);
      console.log('Default unavailable slots initialized');
    }
  } catch (error) {
    console.error('Error initializing default slots:', error);
  }
};

// Save user-set unavailable slots
export const saveUserUnavailableSlots = async (slots, date) => {
  try {
    console.log(`[${import.meta.env.MODE}] Saving user unavailable slots for date:`, date);
    const dateKey = date.toISOString().split('T')[0];
    const slotsRef = ref(database, `userUnavailableSlots/${dateKey}`);
    await set(slotsRef, slots);
    console.log(`[${import.meta.env.MODE}] User unavailable slots saved successfully`);
    return true;
  } catch (error) {
    console.error(`[${import.meta.env.MODE}] Error saving user unavailable slots:`, error);
    throw error;
  }
};

// Load user-set unavailable slots
export const loadUserUnavailableSlots = async (date) => {
  try {
    console.log(`[${import.meta.env.MODE}] Loading user unavailable slots for date:`, date);
    const dateKey = date.toISOString().split('T')[0];
    const slotsRef = ref(database, `userUnavailableSlots/${dateKey}`);
    const snapshot = await get(slotsRef);
    if (snapshot.exists()) {
      console.log(`[${import.meta.env.MODE}] User unavailable slots loaded`);
      return snapshot.val();
    }
    console.log(`[${import.meta.env.MODE}] No user unavailable slots found`);
    return {};
  } catch (error) {
    console.error(`[${import.meta.env.MODE}] Error loading user unavailable slots:`, error);
    return {};
  }
};

// Subscribe to user unavailable slots
export const subscribeToUserUnavailableSlots = (callback, date) => {
  try {
    console.log(`[${import.meta.env.MODE}] Setting up user unavailable slots subscription...`);
    const dateKey = date.toISOString().split('T')[0];
    const slotsRef = ref(database, `userUnavailableSlots/${dateKey}`);
    return onValue(slotsRef, (snapshot) => {
      if (snapshot.exists()) {
        const slots = snapshot.val();
        console.log(`[${import.meta.env.MODE}] User unavailable slots updated`);
        callback(slots);
      } else {
        callback({});
      }
    });
  } catch (error) {
    console.error(`[${import.meta.env.MODE}] Error in user unavailable slots subscription:`, error);
    callback({});
    return () => {};
  }
};

// Run initialization
initializeDefaultSlots();

export default database;
