import { getSongDetailReq } from '@api/request';
import { fromJS } from 'immutable';
import * as actionTypes from './constants';

export const changeCurrentSong = (data) => ({
  type: actionTypes.SET_CURRENT_SONG,
  data: fromJS(data),
});

export const changeFullScreen = (data) => ({
  type: actionTypes.SET_FULL_SCREEN,
  data,
});

export const changePlayingState = (data) => ({
  type: actionTypes.SET_PLAYING_STATE,
  data,
});

export const changeSequecePlayList = (data) => ({
  type: actionTypes.SET_SEQUECE_PLAYLIST,
  data: fromJS(data),
});

export const changePlayList = (data) => ({
  type: actionTypes.SET_PLAYLIST,
  data: fromJS(data),
});

export const changePlayMode = (data) => ({
  type: actionTypes.SET_PLAY_MODE,
  data,
});

export const changeCurrentIndex = (data) => ({
  type: actionTypes.SET_CURRENT_INDEX,
  data,
});

export const changeShowPlayList = (data) => ({
  type: actionTypes.SET_SHOW_PLAYLIST,
  data,
});

export const deleteSong = (data) => ({
  type: actionTypes.DELETE_SONG,
  data,
});

export const insertSong = (data) => ({
  type: actionTypes.INSERT_SONG,
  data,
});

export const getSongDetail = (id) => {
  return (dispatch) => {
    getSongDetailReq(id).then((data) => {
      // @ts-ignore
      let song = data.songs[0];
      console.log(song);
      dispatch(insertSong(song));
    });
  };
};
