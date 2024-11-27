import {useEffect} from 'react';
import {BrowserRouter as Router, Navigate, Route, Routes} from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Search from './pages/Search';
import Calendar from './pages/Calendar';
import Settings from './pages/Settings';
import Admin from './pages/Admin';
import Login from './pages/Login';
import ErrorBoundary from './components/ErrorBoundary';
import {isAuthenticated} from './services/authService';
import {getScheduledNotifications} from './services/notificationService';

function PrivateRoute({ children }: { children: React.ReactNode }) {
  return isAuthenticated() ? <>{children}</> : <Navigate to="/login" />;
}

function App() {
  useEffect(() => {
    // Initialize notifications on app start
    const notifications = getScheduledNotifications();
    notifications.forEach(notification => {
      const notificationDate = new Date(notification.scheduledFor);
      const timeUntilNotification = notificationDate.getTime() - Date.now();

      if (timeUntilNotification > 0) {
        setTimeout(() => {
          if (Notification.permission === 'granted') {
            new Notification(notification.title, {
              body: notification.message,
              icon: '/pwa-192x192.png'
            });
          }
        }, timeUntilNotification);
      }
    });
  }, []);

  return (
    <ErrorBoundary>
      <Router>
        <div className="min-h-screen bg-gray-900">
          <Navbar />
          <main className="container mx-auto px-4 py-8">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/search" element={<Search />} />
              <Route path="/calendar" element={<Calendar />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/login" element={<Login />} />
              <Route
                path="/admin"
                element={
                  <PrivateRoute>
                    <Admin />
                  </PrivateRoute>
                }
              />
            </Routes>
          </main>
        </div>
      </Router>
    </ErrorBoundary>
  );
}

export default App;
