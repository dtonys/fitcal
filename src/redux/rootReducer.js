import { combineReducers } from 'redux';
import demoReducer, { STORE_KEY as DEMO_STORE_KEY } from 'redux/demo/reducer';
import userReducer, { STORE_KEY as USER_STORE_KEY } from 'redux/user/reducer';
import lostPasswordReducer, { STORE_KEY as LOST_PASSWORD_STORE_KEY } from 'redux/lost-password/reducer';
import eventReducer, { STORE_KEY as EVENT_STORE_KEY } from 'redux/event/reducer';


export default ( routeReducer ) => {
  return combineReducers({
    [DEMO_STORE_KEY]: demoReducer,
    [USER_STORE_KEY]: userReducer,
    [LOST_PASSWORD_STORE_KEY]: lostPasswordReducer,
    [EVENT_STORE_KEY]: eventReducer,
    location: routeReducer,
  });
};
