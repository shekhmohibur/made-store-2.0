import { Navigate, useLocation, Outlet } from 'react-router-dom';
import { useStore } from '../../store/useStore';

/**
 * Enterprise Route Guard for Trivora Commerce
 * Protects administrative & merchant portals against unauthorized or unauthenticated access.
 */
const ProtectedRoute = ({ allowedRoles = [], children }) => {
    const { currentAuthUser } = useStore();
    const location = useLocation();

    // 1. Unauthenticated -> Redirect to Login with origin state
    if (!currentAuthUser) {
        return <Navigate to="/login" replace state={{ from: location }} />;
    }

    // 2. Pending Applicant trying to access protected dashboards -> Redirect to Pending Approval
    if (currentAuthUser.status === 'Pending' && !location.pathname.startsWith('/pending-approval')) {
        return <Navigate to="/pending-approval" replace />;
    }

    // 3. Role Restriction Check
    if (allowedRoles.length > 0 && !allowedRoles.includes(currentAuthUser.role)) {
        // If an approved merchant tries to access Super Admin panel, bounce them to their Owner portal
        if (currentAuthUser.role === 'Owner' || currentAuthUser.role === 'Merchant' || currentAuthUser.role === 'Merchant Admin') {
            return <Navigate to="/owner" replace />;
        }
        // If a Super Admin tries to access a restricted route
        if (currentAuthUser.role === 'Super Admin') {
            return <Navigate to="/panel" replace />;
        }
        return <Navigate to="/login" replace />;
    }

    return children ? children : <Outlet />;
};

export default ProtectedRoute;
