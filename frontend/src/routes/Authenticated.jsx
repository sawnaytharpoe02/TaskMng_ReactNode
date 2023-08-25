import { Navigate, Outlet, useLocation } from 'react-router';
import { getToken } from '../utils/storage';

const Authenticated = () => {
  const location = useLocation();
  const token = getToken();

  if (token && location.pathname === '/login') {
    return <Navigate to="/" />;
  }

  return <Outlet />;
};

export default Authenticated;
