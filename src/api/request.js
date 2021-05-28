import { axiosInstance } from './axios';

export const getBannerReq = () => {
  return axiosInstance.get('/banner');
};

export const getRecommendListReq = () => {
  return axiosInstance.get('/personalized');
};
