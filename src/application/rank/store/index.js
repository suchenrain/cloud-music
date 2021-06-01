import { getRankListReq } from '@api/request';
import { fromJS } from 'immutable';

//constants
export const CHANGE_RANK_LIST = 'rank/CHANGE_RANK_LIST';
export const CHANGE_RANK_LOADING = 'rank/CHANGE_RANK_LOADING';

// action creator
const changeRankList = (data) => ({
  type: CHANGE_RANK_LIST,
  data: fromJS(data),
});

const changeLoading = (data) => ({
  type: CHANGE_RANK_LOADING,
  data,
});

export const getRankList = () => {
  return (dispatch) => {
    getRankListReq().then((data) => {
      // @ts-ignore
      let list = data && data.list;
      dispatch(changeRankList(list));
      dispatch(changeLoading(false));
    });
  };
};

// reducer

const defaultState = fromJS({
  rankList: [],
  loading: false,
});

const reducer = (state = defaultState, action) => {
  switch (action.type) {
    case CHANGE_RANK_LIST:
      return state.set('rankList', action.data);
    case CHANGE_RANK_LOADING:
      return state.set('loading', action.data);

    default:
      return state;
  }
};

export { reducer };
