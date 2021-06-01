import * as actionTypes from './constants';
import { getSingerListRequest, getHotSingerListRequest } from '@api/request';

import { fromJS } from 'immutable';

const changeSingerList = (data) => ({
  type: actionTypes.CHANGE_SINGER_LIST,
  data: fromJS(data),
});

const changePageCount = (data) => ({
  type: actionTypes.CHANGE_PAGE_COUNT,
  data,
});

//进场loading
const changeEnterLoading = (data) => ({
  type: actionTypes.CHANGE_ENTER_LOADING,
  data,
});

//滑动最底部loading
const changePullUpLoading = (data) => ({
  type: actionTypes.CHANGE_PULLUP_LOADING,
  data,
});

//顶部下拉刷新loading
const changePullDownLoading = (data) => ({
  type: actionTypes.CHANGE_PULLDOWN_LOADING,
  data,
});

//第一次加载热门歌手
const getHotSingerList = () => {
  return (dispatch) => {
    getHotSingerListRequest(0)
      .then((res) => {
        // @ts-ignore
        const data = res.artists;
        dispatch(changeSingerList(data));
        dispatch(changeEnterLoading(false));
        dispatch(changePullDownLoading(false));
      })
      .catch(() => {
        console.log('热门歌手数据获取失败');
      });
  };
};

//加载更多热门歌手
const refreshMoreHotSingerList = () => {
  return (dispatch, getState) => {
    const pageCount = getState().getIn(['singers', 'pageCount']);
    const pageSize = getState().getIn(['singers', 'pageSize']);
    const singerList = getState().getIn(['singers', 'singerList']).toJS();
    getHotSingerListRequest(pageCount * pageSize)
      .then((res) => {
        // @ts-ignore
        const data = [...singerList, ...res.artists];
        dispatch(changeSingerList(data));
        dispatch(changePullUpLoading(false));
      })
      .catch(() => {
        console.log('热门歌手数据获取失败');
      });
  };
};

//第一次加载对应类别的歌手
const getSingerList = (category, area, alpha) => {
  return (dispatch, getState) => {
    getSingerListRequest(category, area, alpha, 0)
      .then((res) => {
        // @ts-ignore
        const data = res.artists;
        dispatch(changeSingerList(data));
        dispatch(changeEnterLoading(false));
        dispatch(changePullDownLoading(false));
      })
      .catch(() => {
        console.log('歌手数据获取失败');
      });
  };
};

//加载更多歌手
const refreshMoreSingerList = (category, area, alpha) => {
  return (dispatch, getState) => {
    const pageCount = getState().getIn(['singers', 'pageCount']);
    const pageSize = getState().getIn(['singers', 'pageSize']);
    const singerList = getState().getIn(['singers', 'singerList']).toJS();
    getSingerListRequest(category, area, alpha, pageCount * pageSize, pageSize)
      .then((res) => {
        // @ts-ignore
        const data = [...singerList, ...res.artists];
        dispatch(changeSingerList(data));
        dispatch(changePullUpLoading(false));
      })
      .catch(() => {
        console.log('歌手数据获取失败');
      });
  };
};

export {
  changePageCount,
  changePullDownLoading,
  changePullUpLoading,
  changeEnterLoading,
  getHotSingerList,
  refreshMoreHotSingerList,
  getSingerList,
  refreshMoreSingerList,
};
