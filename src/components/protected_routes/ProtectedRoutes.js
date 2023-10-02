import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoutes = () => {
    const auth = useSelector(state => state.auth);
    return (
        auth.isAuthenticated !== true ? <Navigate to="/login" /> : <Outlet />
    )
}

export default ProtectedRoutes;
