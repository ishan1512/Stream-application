import { axiosInstance } from './axios';

export const getAuthUser = async () => {
  const res = await axiosInstance.get('/auth/checkAuth');
  return res.data;
};

export const signup = async (signupData) => {
  const response = await axiosInstance.post('/auth/signup', signupData);
  return response.data;
};

export const completeOnboarding = async (userData) => {
  const response = await axiosInstance.post('/auth/onboarding', userData);
  return response.data;
};
