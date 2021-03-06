import { axiosInstance } from './axios';

export const getBannerReq = () => {
  return axiosInstance.get('/banner');
};

export const getRecommendListReq = () => {
  return axiosInstance.get('/personalized');
};

export const getHotSingerListRequest = (count, limit = 30) => {
  return axiosInstance.get(`/top/artists?offset=${count}&limit=${limit}`);
};

export const getSingerListRequest = (
  category,
  area,
  alpha,
  count,
  limit = 30
) => {
  return axiosInstance.get(
    `/artist/list?type=${category}&area=${area}&initial=${alpha.toLowerCase()}&offset=${count}&limit=${limit}`
  );
};

export const getRankListReq = () => {
  return axiosInstance.get(`toplist/detail`);
};

export const getAlbumDetailReq = (id) => {
  return axiosInstance.get(`/playlist/detail?id=${id}`);
};

export const getSingerInfoReq = (id) => {
  return axiosInstance.get(`/artists?id=${id}`);
};

export const getLyricReq = (id) => {
  return axiosInstance.get(`/lyric?id=${id}`);
};

export const getHotKeyWordsReq = () => {
  return axiosInstance.get(`/search/hot`);
};

export const getSuggestListReq = (query) => {
  return axiosInstance.get(`/search/suggest?keywords=${query}`);
};

export const getResultSongsListReq = (query) => {
  return axiosInstance.get(`/search?keywords=${query}`);
};

export const getSongDetailReq = (id) => {
  return axiosInstance.get(`/song/detail?ids=${id}`);
};
