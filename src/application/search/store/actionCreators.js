import {
  getHotKeyWordsReq,
  getResultSongsListReq,
  getSuggestListReq,
} from '@api/request';
import { fromJS } from 'immutable';
import * as actionTypes from './constants';

const changeHotKeyWords = (data) => ({
  type: actionTypes.SET_HOT_KEYWRODS,
  data: fromJS(data),
});

const changeSuggestList = (data) => ({
  type: actionTypes.SET_SUGGEST_LIST,
  data: fromJS(data),
});

const changeResultSongs = (data) => ({
  type: actionTypes.SET_RESULT_SONGS_LIST,
  data: fromJS(data),
});

export const changeEnterLoading = (data) => ({
  type: actionTypes.SET_ENTER_LOADING,
  data,
});

export const getHotKeyWords = () => {
  return (dispatch) => {
    getHotKeyWordsReq().then((data) => {
      // 拿到关键词列表
      // @ts-ignore
      let list = data.result.hots;
      dispatch(changeHotKeyWords(list));
    });
  };
};
export const getSuggestList = (query) => {
  return (dispatch) => {
    getSuggestListReq(query).then((data) => {
      if (!data) return;
      // @ts-ignore
      let res = data.result || [];
      dispatch(changeSuggestList(res));
    });
    getResultSongsListReq(query).then((data) => {
      if (!data) return;
      // @ts-ignore
      let res = data.result.songs || [];
      dispatch(changeResultSongs(res));
      dispatch(changeEnterLoading(false)); // 关闭 loading
    });
  };
};
