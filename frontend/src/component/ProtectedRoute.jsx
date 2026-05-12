import React, { createContext, useContext } from 'react';
import { Navigate, useLocation, Outlet } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

// Create a context for the authenticated user
const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

/**
 * ProtectedRoute component secures internal routes.
 * 
 * @param {Object} props
 * @param {React.ReactNode} [props.children] - Component to render if authorized (for non-nested routes)
 * @param {Array<string>} [props.allowedRoles] - List of roles permitted to access this route
 */
const ProtectedRoute = ({ children, allowedRoles }) => {
    const token = localStorage.getItem('token');
    const location = useLocation();

    if (!token) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    try {
        const decoded = jwtDecode(token);
        const userRole = decoded.role?.toLowerCase();

        if (allowedRoles && !allowedRoles.includes(userRole)) {
            const redirectPath = userRole === 'owner' ? '/owner/dashboard' : '/tenant/dashboard';
            return <Navigate to={redirectPath} replace />;
        }

        // Provide the user object via Context so any child can access it
        const content = children || <Outlet />;

        return (
            <AuthContext.Provider value={{ user: decoded }}>
                {/* 
                  Wait: Many existing components expect 'user' as a prop. 
                  Cloning and passing prop is limited to direct children. 
                  For nested routes, we could wrap the Outlet but that doesn't pass props to the matched route element easily.
                  
                  Actually, since I'm refactoring, I'll update the switcher and dashboards to use this context or keep prop passing for simplicity where possible.
                */}
                {React.isValidElement(content) ? React.cloneElement(content, { user: decoded }) : content}
            </AuthContext.Provider>
        );
    } catch (error) {
        localStorage.removeItem('token');
        return <Navigate to="/login" state={{ from: location }} replace />;
    }
};

export default ProtectedRoute;
