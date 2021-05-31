import * as actionTypes from './constants';
import { getBannerReq, getRecommendListReq } from '@api/request';
import { fromJS } from 'immutable';

export const changeBannerList = (data) => ({
  type: actionTypes.CHANGE_BANNER,
  data: fromJS(data),
});

export const changeRecommendList = (data) => ({
  type: actionTypes.CHANGE_RECOMMEND_LIST,
  data: fromJS(data),
});

export const changeEnterLoading = (data) => ({
  type: actionTypes.CHANGE_ENTER_LOADING,
  data,
});

export const getBannerList = () => {
  return (dispatch) => {
    getBannerReq()
      .then((data) => {
        // @ts-ignore
        dispatch(changeBannerList(data.banners));
      })
      .catch(() => {
        console.log('轮播图数据传输错误');
      });
  };
};

export const getRecommendList = () => {
  return (dispatch) => {
    getRecommendListReq()
      .then((data) => {
        // @ts-ignore
        dispatch(changeRecommendList(data.result));
        dispatch(changeEnterLoading(false));
      })
      .catch(() => {
        console.log('推荐歌单数据传输错误');
      });
  };
};
