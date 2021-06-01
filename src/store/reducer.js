import { combineReducers } from 'redux-immutable';
import { reducer as recommendReducer } from '@application/recommend/store';
import { reducer as singersReducer } from '@application/singers/store';
import { reducer as rankReducer } from '@application/rank/store';
import { reducer as albumReducer } from '@application/album/store';

export default combineReducers({
  recommend: recommendReducer,
  singers: singersReducer,
  rank: rankReducer,
  album: albumReducer,
});
