import { fromJS } from 'immutable';
import React, { createContext, useReducer } from 'react';

// context
export const CategoryDataContext = createContext({});

export const CHANGE_CATEGORY = 'singers/CHANGE_CATEGORY';
export const CHANGE_ALPHA = 'singers/CHANGE_ALPHA';
export const CHANGE_AREA = 'singers/CHANGE_AREA';

//reducer pure function
const reducer = (state, action) => {
  switch (action.type) {
    case CHANGE_CATEGORY:
      return state.set('category', action.data);
    case CHANGE_ALPHA:
      return state.set('alpha', action.data);
    case CHANGE_AREA:
      return state.set('area', action.data);

    default:
      return state;
  }
};

//Provider 组件
export const Data = (props) => {
  //useReducer 的第二个参数中传入初始值
  const [data, dispatch] = useReducer(
    reducer,
    fromJS({
      category: '',
      alpha: '',
      area: '',
    })
  );
  return (
    <CategoryDataContext.Provider value={{ data, dispatch }}>
      {props.children}
    </CategoryDataContext.Provider>
  );
};
