import { combineReducers } from 'redux-immutable';
import { reducer as recommendReducer } from '@application/recommend/store';

export default combineReducers({
  recommend: recommendReducer,
});
