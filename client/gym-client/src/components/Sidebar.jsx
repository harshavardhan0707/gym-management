import React from "react";
import { Link, useLocation } from "react-router-dom";

const navLinks = [
  { to: "/members", label: "Members", icon: "👥" },
  { to: "/plans", label: "Plans", icon: "📋" },
  { to: "/subscriptions", label: "Subscriptions", icon: "💳" },
  { to: "/check-subscription", label: "Check", icon: "🔍" },
  // Profile link removed
];

const Sidebar = () => {
  const location = useLocation();
  return (
    <aside className="w-64 bg-gradient-to-b from-blue-50 via-white to-white/80 border-r border-blue-100 shadow-xl h-full p-8 flex flex-col">
      <nav className="flex flex-col gap-2 mt-4">
        {navLinks.map((link) => (
          <Link
            key={link.to}
            to={link.to}
            className={`flex items-center gap-3 px-4 py-2 rounded-lg text-base font-medium transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 shadow-sm ${
              location.pathname === link.to
                ? "bg-blue-100 text-blue-700 font-bold border-r-4 border-blue-600 scale-[1.03] shadow-md"
                : "text-gray-700 hover:bg-blue-50 hover:text-blue-700"
            }`}
          >
            <span className="text-lg">{link.icon}</span>
            {link.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
