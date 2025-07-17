import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import Sidebar from "./components/Sidebar.jsx";
import PrivateRoute from "./components/PrivateRoute.jsx";
import Login from "./pages/Login.jsx";
import Members from "./pages/Members.jsx";
import Plans from "./pages/Plans.jsx";
import Subscriptions from "./pages/Subscriptions.jsx";
import CheckSubscription from "./pages/CheckSubscription.jsx";
import AdminProfile from "./pages/AdminProfile.jsx";

function AppLayout({ children }) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-4 bg-gray-50">{children}</main>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/*"
          element={
            <PrivateRoute>
              <AppLayout>
                <Routes>
                  <Route path="/members" element={<Members />} />
                  <Route path="/plans" element={<Plans />} />
                  <Route path="/subscriptions" element={<Subscriptions />} />
                  <Route path="/check-subscription" element={<CheckSubscription />} />
                  <Route path="/admin-profile" element={<AdminProfile />} />
                  <Route path="*" element={<Members />} />
                </Routes>
              </AppLayout>
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
