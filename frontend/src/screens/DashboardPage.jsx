import React, { useEffect, useState } from 'react';
import config from '../constants.js';

const DashboardPage = ({ user, restaurants, onLogout, onLoadRestaurants, onCreateRestaurant }) => {
  const [newRestaurant, setNewRestaurant] = useState({ name: '', description: '', address: '' });

  useEffect(() => {
    onLoadRestaurants();
  }, [onLoadRestaurants]);

  const handleCreateRestaurant = async (e) => {
    e.preventDefault();
    if (!newRestaurant.name || !newRestaurant.address) {
      alert('Name and Address are required.');
      return;
    }
    await onCreateRestaurant(newRestaurant);
    setNewRestaurant({ name: '', description: '', address: '' });
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">FoodieFinds</h1>
            <p className="text-sm text-gray-500">Welcome, {user.name}!</p>
          </div>
          <div className="flex items-center space-x-4">
            <a
              href={`${config.BACKEND_URL}/admin`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium text-gray-600 hover:text-blue-600 transition"
            >
              Admin Panel
            </a>
            <button
              onClick={onLogout}
              className="bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-red-700 transition"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4 text-gray-800">Add New Restaurant</h2>
              <form onSubmit={handleCreateRestaurant} className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
                  <input
                    id="name"
                    type="text"
                    placeholder="My Awesome Pizzeria"
                    value={newRestaurant.name}
                    onChange={(e) => setNewRestaurant({ ...newRestaurant, name: e.target.value })}
                    className="mt-1 w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                  <textarea
                    id="description"
                    placeholder="Best pizza in town..."
                    value={newRestaurant.description}
                    onChange={(e) => setNewRestaurant({ ...newRestaurant, description: e.target.value })}
                    className="mt-1 w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    rows="3"
                  />
                </div>
                <div>
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700">Address</label>
                  <input
                    id="address"
                    type="text"
                    placeholder="123 Main St, Anytown"
                    value={newRestaurant.address}
                    onChange={(e) => setNewRestaurant({ ...newRestaurant, address: e.target.value })}
                    className="mt-1 w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-md font-semibold hover:bg-blue-700 transition">
                  Create Restaurant
                </button>
              </form>
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4 text-gray-800">Available Restaurants</h2>
              {restaurants.length === 0 ? (
                <p className="text-gray-500">No restaurants found. Add one to get started!</p>
              ) : (
                <div className="space-y-4">
                  {restaurants.map(restaurant => (
                    <div key={restaurant.id} className="border border-gray-200 rounded-lg p-4 flex items-start space-x-4">
                      <div className="w-32 h-20 bg-gray-200 rounded-md flex-shrink-0">
                        {restaurant.image && <img src={restaurant.image.thumbnail.url} alt={restaurant.name} className="w-full h-full object-cover rounded-md" />}
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg text-gray-900">{restaurant.name}</h3>
                        <p className="text-sm text-gray-600 mt-1">{restaurant.description}</p>
                        <p className="text-xs text-gray-500 mt-2">{restaurant.address}</p>
                        <p className="text-xs text-gray-500 mt-1">Owner: {restaurant.owner ? restaurant.owner.name : 'N/A'}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;
