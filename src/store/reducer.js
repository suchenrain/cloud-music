import { combineReducers } from 'redux-immutable';
import { reducer as recommendReducer } from '@application/recommend/store';
import { reducer as singersReducer } from '@application/singers/store';

export default combineReducers({
  recommend: recommendReducer,
  singers: singersReducer,
});
