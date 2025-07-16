import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar = () => {
    return (
        <div className="bg-gray-800 text-white w-64 h-full p-4">
            <h2 className="text-xl font-bold mb-4">Gym Management</h2>
            <ul>
                <li className="mb-2">
                    <Link to="/dashboard" className="hover:text-gray-400">Dashboard</Link>
                </li>
                <li className="mb-2">
                    <Link to="/members" className="hover:text-gray-400">Members</Link>
                </li>
                <li className="mb-2">
                    <Link to="/plans" className="hover:text-gray-400">Plans</Link>
                </li>
                <li className="mb-2">
                    <Link to="/subscriptions" className="hover:text-gray-400">Subscriptions</Link>
                </li>
                <li className="mb-2">
                    <Link to="/check-subscription" className="hover:text-gray-400">Check Subscription</Link>
                </li>
            </ul>
        </div>
    );
};

export default Sidebar;