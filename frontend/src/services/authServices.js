import { authApiClient } from '../utils/apiClient';

class AuthService {
  login(payload) {
    return authApiClient.post('login', payload);
  }
  logout() {
    return authApiClient.post('logout');
  }
  changePassword(payload) {
    return authApiClient.put('change-password', payload);
  }
  forgetPassword(payload) {
    return authApiClient.post('forgot-password', payload);
  }
  resetPassword(payload, token) {
    return authApiClient.post('reset-password/' + token, payload);
  }
  verifyEmail(token) {
    return authApiClient.post('verify-email/' + token);
  }
}
const authService = new AuthService();

export default authService;
