import { getSingerInfoReq } from '@api/request';
import { fromJS } from 'immutable';
import * as actionTypes from './constants';

const changeArtist = (data) => ({
  type: actionTypes.CHANGE_ARTIST,
  data: fromJS(data),
});
const changeSongs = (data) => ({
  type: actionTypes.CHANGE_SONGS_OF_ARTIST,
  data: fromJS(data),
});

export const changeEnterLoading = (data) => ({
  type: actionTypes.CHANGE_ENTER_LOADING,
  data,
});

export const getSingerInfo = (id) => {
  return (dispatch) => {
    getSingerInfoReq(id).then((data) => {
      // @ts-ignore
      dispatch(changeArtist(data.artist));
      // @ts-ignore
      dispatch(changeSongs(data.hotSongs));
      dispatch(changeEnterLoading(false));
    });
  };
};
