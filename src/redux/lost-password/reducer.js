import {
  LOST_PASSWORD_STARTED, LOST_PASSWORD_SUCCESS, LOST_PASSWORD_ERROR,
  RESET_PASSWORD_STARTED, RESET_PASSWORD_SUCCESS, RESET_PASSWORD_ERROR,
} from 'redux/lost-password/actions';


export const STORE_KEY = 'lost-password';
export function extractLostPasswordState( globalState ) {
  return globalState[STORE_KEY].lostPassword;
}
const lostPasswordInitialState = {
  loading: false,
  error: null,
  succcess: null,
};
function lostPassword( state = lostPasswordInitialState, action ) {
  switch ( action.type ) {
    case LOST_PASSWORD_STARTED: {
      return {
        ...state,
        loading: true,
      };
    }
    case LOST_PASSWORD_SUCCESS: {
      return {
        ...state,
        loading: false,
        error: null,
        succcess: true,
      };
    }
    case LOST_PASSWORD_ERROR: {
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    }
    default: {
      return state;
    }
  }
}

export function extractResetPasswordState( globalState ) {
  return globalState[STORE_KEY].resetPassword;
}
const resetPasswordInitialState = {
  loading: false,
  error: null,
  succcess: null,
};
function resetPassword( state = resetPasswordInitialState, action ) {
  switch ( action.type ) {
    case RESET_PASSWORD_STARTED: {
      return {
        ...state,
        loading: true,
      };
    }
    case RESET_PASSWORD_SUCCESS: {
      return {
        ...state,
        loading: false,
        error: null,
        succcess: true,
      };
    }
    case RESET_PASSWORD_ERROR: {
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    }
    default: {
      return state;
    }
  }
}


const initialState = {
  lostPassword: lostPasswordInitialState,
  resetPassword: resetPasswordInitialState,
};

export default ( state = initialState, action ) => ({
  lostPassword: lostPassword(state.lostPassword, action),
  resetPassword: resetPassword(state.resetPassword, action),
});
