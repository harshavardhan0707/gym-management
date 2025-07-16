import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
    return (
        <nav className="bg-blue-500 p-4">
            <div className="container mx-auto flex justify-between items-center">
                <h1 className="text-white text-xl font-bold">Gym Management</h1>
                <div>
                    <Link to="/dashboard" className="text-white px-4">Dashboard</Link>
                    <Link to="/members" className="text-white px-4">Members</Link>
                    <Link to="/plans" className="text-white px-4">Plans</Link>
                    <Link to="/subscriptions" className="text-white px-4">Subscriptions</Link>
                    <Link to="/check-subscription" className="text-white px-4">Check Subscription</Link>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;