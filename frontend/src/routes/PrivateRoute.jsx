import { Navigate, Outlet } from 'react-router';
import { getToken } from '../utils/storage';

const PrivateRoute = () => {
  let token = getToken();

  if (!token) {
    return <Navigate to="/login" />;
  }
  return <Outlet />;
};

export default PrivateRoute;
