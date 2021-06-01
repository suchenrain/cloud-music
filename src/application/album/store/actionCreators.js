import { getAlbumDetailReq } from '@api/request';
import { fromJS } from 'immutable';
import * as actionTypes from './constants';

const changeCurrentAlbum = (data) => ({
  type: actionTypes.CHANGE_CURRENT_ALBUM,
  data: fromJS(data),
});

export const changeEnterLoading = (data) => ({
  type: actionTypes.CHANGE_ENTER_LOADING,
  data,
});

export const getAlbumList = (id) => {
  return (dispatch) => {
    getAlbumDetailReq(id)
      .then((res) => {
        // @ts-ignore
        let data = res.playlist;
        dispatch(changeCurrentAlbum(data));
        dispatch(changeEnterLoading(false));
      })
      .catch(() => {
        console.log('get album detail failed!');
      });
  };
};
