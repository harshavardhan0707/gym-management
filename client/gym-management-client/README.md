# Gym Management System - Frontend

A modern, professional frontend for the Gym Management System built with React, Tailwind CSS, and Lucide React icons.

## 🚀 Features

- **Modern UI/UX**: Clean, professional design with smooth animations
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile
- **Real-time Data**: Live updates from the backend API
- **Authentication**: JWT-based authentication with protected routes
- **CRUD Operations**: Full Create, Read, Update, Delete functionality for all entities
- **Search & Filter**: Advanced search capabilities across all data
- **Status Indicators**: Visual badges for subscription and payment status
- **Toast Notifications**: User-friendly feedback for all actions

## 🛠️ Tech Stack

- **React 19**: Latest React with hooks and functional components
- **Tailwind CSS**: Utility-first CSS framework with custom design system
- **Lucide React**: Beautiful, customizable icons
- **React Router**: Client-side routing with protected routes
- **Axios**: HTTP client for API communication
- **React Toastify**: Toast notifications
- **Vite**: Fast build tool and development server

## 🎨 Design System

The application uses a custom design system inspired by modern SaaS applications:

- **Colors**: Professional blue gradient theme with semantic colors
- **Typography**: Clean, readable fonts with proper hierarchy
- **Components**: Reusable UI components with consistent styling
- **Animations**: Smooth transitions and hover effects
- **Layout**: Sidebar navigation with responsive design

## 📁 Project Structure

```
src/
├── components/
│   ├── ui/           # Reusable UI components
│   │   ├── Button.jsx
│   │   ├── Input.jsx
│   │   ├── Card.jsx
│   │   └── Badge.jsx
│   └── Layout.jsx    # Main layout component
├── pages/            # Page components
│   ├── Login.jsx
│   ├── Dashboard.jsx
│   ├── Members.jsx
│   ├── Plans.jsx
│   ├── Subscriptions.jsx
│   └── CheckSubscription.jsx
├── services/         # API services
│   └── api.js
├── utils/            # Utility functions
│   ├── constants.js
│   └── cn.js
└── index.css         # Global styles and design tokens
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Backend server running on port 5000

### Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the development server:**
   ```bash
   npm run dev
   ```

3. **Open your browser:**
   Navigate to `http://localhost:5173`

### Build for Production

```bash
npm run build
```

## 🔧 Configuration

### API Configuration

The frontend is configured to connect to the backend API at `http://localhost:5000/api`. You can modify this in:

```javascript
// src/utils/constants.js
export const API_BASE_URL = 'http://localhost:5000/api';
```

### Environment Variables

Create a `.env` file in the root directory:

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

## 📱 Pages Overview

### 1. Login Page
- Professional login form with demo credentials
- JWT token storage
- Automatic redirect to dashboard

### 2. Dashboard
- Overview statistics (members, subscriptions, plans)
- Recent members list
- Quick action buttons
- Real-time data from API

### 3. Members Management
- Table view with search functionality
- Add/Edit/Delete members
- Modal forms for data entry
- Roll number badges

### 4. Plans Management
- Subscription plans table
- Plan creation and editing
- Duration and pricing management
- Search and filter capabilities

### 5. Subscriptions Management
- Comprehensive subscription tracking
- Status indicators (active, expired, expiring soon)
- Payment status tracking
- Member and plan associations

### 6. Check Subscription Status
- Search by roll number
- Detailed subscription information
- Visual status indicators
- Days remaining calculation

## 🎯 Key Features

### Authentication
- JWT-based authentication
- Protected routes
- Automatic token management
- Logout functionality

### Data Management
- Real-time API integration
- Optimistic updates
- Error handling
- Loading states

### User Experience
- Responsive design
- Smooth animations
- Toast notifications
- Confirmation dialogs
- Search and filtering

### Status Management
- Subscription status tracking
- Payment status indicators
- Expiry date calculations
- Visual status badges

## 🔒 Security Features

- JWT token validation
- Protected route components
- API request authentication
- Secure token storage

## 🎨 Customization

### Colors
The design system uses CSS custom properties for easy customization:

```css
:root {
  --primary: 199 89% 48%;
  --success: 142 76% 36%;
  --warning: 38 92% 50%;
  --destructive: 0 84.2% 60.2%;
}
```

### Components
All UI components are built with Tailwind CSS and can be easily customized by modifying the component files.

## 🐛 Troubleshooting

### Common Issues

1. **API Connection Error**
   - Ensure the backend server is running on port 5000
   - Check the API_BASE_URL in constants.js

2. **Authentication Issues**
   - Clear localStorage and try logging in again
   - Check if the JWT token is valid

3. **Build Errors**
   - Clear node_modules and reinstall dependencies
   - Check for version conflicts

## 📄 License

This project is part of the Gym Management System and follows the same license terms.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📞 Support

For support and questions, please refer to the main project documentation or create an issue in the repository.