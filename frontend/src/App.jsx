import React, { useState, useEffect } from 'react';
import Manifest from '@mnfst/sdk';
import LandingPage from './screens/LandingPage';
import DashboardPage from './screens/DashboardPage';
import { testBackendConnection } from './services/apiService.js';
import config from './constants';
import './index.css';

function App() {
  const [user, setUser] = useState(null);
  const [restaurants, setRestaurants] = useState([]);
  const [currentScreen, setCurrentScreen] = useState(null); // Start as null to show loading
  const [backendConnected, setBackendConnected] = useState(false);

  // Initialize Manifest SDK with config from constants.js
  const manifest = new Manifest({
    baseURL: config.BACKEND_URL,
    appId: config.APP_ID
  });

  useEffect(() => {
    const initializeApp = async () => {
      console.log('🚀 [APP] Initializing application...');
      const connectionResult = await testBackendConnection();
      setBackendConnected(connectionResult.success);

      if (connectionResult.success) {
        console.log('✅ [APP] Backend connection successful.');
        try {
          const currentUser = await manifest.from('User').me();
          setUser(currentUser);
          setCurrentScreen('dashboard');
          console.log('👤 [APP] User is logged in:', currentUser.email);
        } catch (error) {
          setUser(null);
          setCurrentScreen('landing');
          console.log('👤 [APP] No active user session found.');
        }
      } else {
        console.error('❌ [APP] Backend connection failed:', connectionResult.error);
        setCurrentScreen('landing'); // Show landing page even if backend fails
      }
    };

    initializeApp();
  }, []);

  const handleLogin = async (email, password) => {
    try {
      await manifest.login(email, password);
      const loggedInUser = await manifest.from('User').me();
      setUser(loggedInUser);
      setCurrentScreen('dashboard');
    } catch (error) {
      console.error('Login failed:', error);
      alert('Login failed. Please check your credentials.');
    }
  };

  const handleLogout = async () => {
    await manifest.logout();
    setUser(null);
    setRestaurants([]);
    setCurrentScreen('landing');
  };

  const loadRestaurants = async () => {
    try {
      const response = await manifest.from('Restaurant').find({ include: ['owner'] });
      setRestaurants(response.data);
    } catch (error) {
      console.error('Failed to load restaurants:', error);
    }
  };

  const createRestaurant = async (restaurantData) => {
    try {
      const newRestaurant = await manifest.from('Restaurant').create(restaurantData);
      // Eager load owner info for the new item
      const newRestaurantWithOwner = { ...newRestaurant, owner: user };
      setRestaurants([newRestaurantWithOwner, ...restaurants]);
    } catch (error) {
      console.error('Failed to create restaurant:', error);
      alert('Error creating restaurant. Please check the details and try again.');
    }
  };

  const renderContent = () => {
    if (currentScreen === null) {
      return <div className="min-h-screen flex items-center justify-center bg-gray-50">Loading...</div>;
    }

    if (currentScreen === 'dashboard' && user) {
      return (
        <DashboardPage
          user={user}
          restaurants={restaurants}
          onLogout={handleLogout}
          onLoadRestaurants={loadRestaurants}
          onCreateRestaurant={createRestaurant}
        />
      );
    }

    return <LandingPage onLogin={handleLogin} />;
  };

  return (
    <div>
      <div className="fixed top-4 right-4 z-50 flex items-center space-x-2">
        <div className={`w-3 h-3 rounded-full ${backendConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
        <span className="text-xs text-gray-600">{backendConnected ? 'API Connected' : 'API Disconnected'}</span>
      </div>
      {renderContent()}
    </div>
  );
}

export default App;
