// components/modules/Settings.jsx
import React from "react";
import GenericPage from "../../utils/GenericPage";
import { Settings } from "lucide-react";

const SettingsPage = () => {
  return (
    <GenericPage
      title="Account Settings"
      description="Manage your personal information, password, and preferences"
      icon={<Settings className="w-8 h-8 text-green-600" />}
    >
      <div className="space-y-8 mt-6">
        {/* Personal Info */}
        <section className="bg-white p-6 rounded-xl border shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Personal Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-700 mb-1">
                Full Name
              </label>
              <input
                type="text"
                placeholder="Stephan Malobeka"
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                placeholder="stephan@example.com"
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
          </div>
          <div className="mt-4 text-right">
            <button className="bg-green-600 hover:bg-green-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition">
              Save Changes
            </button>
          </div>
        </section>

        {/* Password Change */}
        <section className="bg-white p-6 rounded-xl border shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Change Password</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm text-gray-700 mb-1">
                Current Password
              </label>
              <input
                type="password"
                placeholder="••••••••"
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-1">
                New Password
              </label>
              <input
                type="password"
                placeholder="••••••••"
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-1">
                Confirm Password
              </label>
              <input
                type="password"
                placeholder="••••••••"
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
          </div>
          <div className="mt-4 text-right">
            <button className="bg-green-600 hover:bg-green-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition">
              Update Password
            </button>
          </div>
        </section>

        {/* Notification Preferences */}
        <section className="bg-white p-6 rounded-xl border shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Notifications</h3>
          <div className="space-y-4">
            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                className="form-checkbox h-4 w-4 text-green-600"
              />
              <span className="text-sm text-gray-700">
                Email me system alerts
              </span>
            </label>
            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                className="form-checkbox h-4 w-4 text-green-600"
              />
              <span className="text-sm text-gray-700">
                Email me activity logs
              </span>
            </label>
          </div>
          <div className="mt-4 text-right">
            <button className="bg-green-600 hover:bg-green-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition">
              Save Preferences
            </button>
          </div>
        </section>
      </div>
    </GenericPage>
  );
};

export default SettingsPage;
