import React from "react";

const AdminProfile = () => (
  <div className="min-h-[70vh] flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 px-4 py-8">
    <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl p-8 animate-fade-in">
      <h2 className="text-3xl font-extrabold text-blue-700 mb-2 text-center">Admin Profile</h2>
      <p className="text-gray-500 text-center mb-6">Admin profile details and settings will be implemented here.</p>
      <div className="flex flex-col gap-4 items-center">
        <div className="w-24 h-24 rounded-full bg-blue-100 flex items-center justify-center text-4xl text-blue-600 font-bold mb-2">
          <span>👤</span>
        </div>
        <div className="w-full flex flex-col gap-2">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
            <span className="font-semibold text-gray-700">Name:</span>
            <span className="text-gray-900">Admin</span>
          </div>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
            <span className="font-semibold text-gray-700">Email:</span>
            <span className="text-gray-900">admin@example.com</span>
          </div>
        </div>
      </div>
      <div className="mt-8 text-center text-gray-400 text-sm">More profile settings coming soon...</div>
    </div>
  </div>
);

export default AdminProfile;
