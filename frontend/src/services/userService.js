import api from './api';

class UserService {
  // Get current user profile
  async getCurrentUserProfile() {
    try {
      const response = await api.get('/user/profile');
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Update user profile
  async updateProfile(profileData) {
    try {
      const response = await api.put('/user/profile', profileData);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Update password
  async updatePassword(passwordData) {
    try {
      const response = await api.put('/user/password', passwordData);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Delete user account
  async deleteAccount() {
    try {
      const response = await api.delete('/user/account');
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Check if username is available
  async checkUsernameAvailability(username) {
    try {
      const response = await api.get(`/auth/check-username/${username}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Check if email is available
  async checkEmailAvailability(email) {
    try {
      const response = await api.get(`/auth/check-email/${email}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Handle API errors
  handleError(error) {
    const message = error.response?.data?.error || 
                   error.response?.data?.message || 
                   error.message || 
                   'An unexpected error occurred';
    return new Error(message);
  }
}

export default new UserService();
