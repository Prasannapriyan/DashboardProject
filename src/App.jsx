import React, { useState, useEffect } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import SalesCalendar from './components/SalesCalendar';
import DailyBookingData from './components/DailyBookingData';
import { loadAppointments, subscribeToAppointments } from './firebase';

function ErrorFallback({ error, resetErrorBoundary }) {
  return (
    <div className="min-h-screen bg-red-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6">
        <div className="text-red-600 text-xl font-bold mb-4">
          Something went wrong
        </div>
        <div className="text-gray-600 mb-4">
          {error.message || 'An unexpected error occurred'}
        </div>
        <pre className="text-sm bg-gray-100 p-4 rounded mb-4 overflow-auto max-h-48">
          {error.stack}
        </pre>
        <div className="flex justify-end">
          <button
            onClick={resetErrorBoundary}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
          >
            Try again
          </button>
        </div>
      </div>
    </div>
  );
}

function logError(error, info) {
  console.error('Error caught by error boundary:', error, info);
}

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('calendar');
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    // Initial load of appointments
    const fetchAppointments = async () => {
      try {
        const appointmentsData = await loadAppointments();
        setAppointments(appointmentsData);
        setIsLoading(false);
      } catch (error) {
        console.error('Error loading appointments:', error);
        setIsLoading(false);
      }
    };

    fetchAppointments();

    // Subscribe to real-time updates
    const unsubscribe = subscribeToAppointments((appointmentsData) => {
      setAppointments(appointmentsData);
    });

    return () => unsubscribe();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-lg text-blue-600">Loading application...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex flex-col items-center space-y-2">
            <h1 className="text-2xl font-bold text-gray-900">
              FITX120 Sales Calendar
            </h1>
            <div className="text-sm text-gray-500">
              {import.meta.env.DEV ? 'Development Mode' : 'Production Mode'}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-6">
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('calendar')}
                className={`
                  py-2 px-1 border-b-2 font-medium text-sm
                  ${activeTab === 'calendar'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
                `}
              >
                Calendar
              </button>
              <button
                onClick={() => setActiveTab('dailyBookings')}
                className={`
                  py-2 px-1 border-b-2 font-medium text-sm
                  ${activeTab === 'dailyBookings'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
                `}
              >
                Daily Booking Data
              </button>
            </nav>
          </div>
        </div>

        <ErrorBoundary
          FallbackComponent={ErrorFallback}
          onError={logError}
          onReset={() => window.location.reload()}
        >
          {activeTab === 'calendar' ? (
            <SalesCalendar />
          ) : (
            <DailyBookingData appointments={appointments} />
          )}
        </ErrorBoundary>
      </main>

      <footer className="bg-white border-t mt-auto">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="text-center text-sm text-gray-500">
            © {new Date().getFullYear()} FITX120 Sales Calendar. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
