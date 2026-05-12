import React from 'react';
import { Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

/**
 * GuestRoute prevents logged-in users from accessing login/signup/home pages.
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children - Component to render if not logged in
 */
const GuestRoute = ({ children }) => {
    const token = localStorage.getItem('token');

    if (token) {
        try {
            const decoded = jwtDecode(token);
            const userRole = decoded.role?.toLowerCase();
            
            // Redirect to appropriate dashboard based on role
            const redirectPath = userRole === 'owner' ? '/owner/dashboard' : '/tenant/dashboard';
            return <Navigate to={redirectPath} replace />;
        } catch (error) {
            // If token is malformed, treat as guest
            localStorage.removeItem('token');
        }
    }

    return children;
};

export default GuestRoute;
