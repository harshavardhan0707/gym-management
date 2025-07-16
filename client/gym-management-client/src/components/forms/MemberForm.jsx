import React, { useState } from 'react';

const MemberForm = ({ setMembers }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [membershipType, setMembershipType] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        const newMember = { name, email, phone, membershipType };
        
        // Here you would typically send the newMember to your API
        // For now, we will just log it and reset the form
        console.log('New Member:', newMember);
        setMembers(prevMembers => [...prevMembers, newMember]);
        
        // Reset form fields
        setName('');
        setEmail('');
        setPhone('');
        setMembershipType('');
    };

    return (
        <form onSubmit={handleSubmit} className="mb-4">
            <h2 className="text-xl font-bold mb-2">Add New Member</h2>
            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700" htmlFor="name">Name</label>
                <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                />
            </div>
            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700" htmlFor="email">Email</label>
                <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                />
            </div>
            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700" htmlFor="phone">Phone</label>
                <input
                    type="tel"
                    id="phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                />
            </div>
            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700" htmlFor="membershipType">Membership Type</label>
                <select
                    id="membershipType"
                    value={membershipType}
                    onChange={(e) => setMembershipType(e.target.value)}
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                >
                    <option value="">Select Membership Type</option>
                    <option value="basic">Basic</option>
                    <option value="premium">Premium</option>
                    <option value="vip">VIP</option>
                </select>
            </div>
            <button type="submit" className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600">
                Add Member
            </button>
        </form>
    );
};

export default MemberForm;