import { Outlet } from 'react-router';
import jwt_decode from 'jwt-decode';
import { getToken } from '../utils/storage';

const AdminRoute = () => {
  const token = getToken();
  const decodedUser = jwt_decode(token);

  if (decodedUser?.position !== 0) {
    const error = new Error('You are not authorized to access this page!');
    error.status = 403;
    throw error;
  }

  return <Outlet />;
};

export default AdminRoute;
