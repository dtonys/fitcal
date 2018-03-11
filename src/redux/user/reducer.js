import {
  LOAD_USER_STARTED, LOAD_USER_SUCCESS, LOAD_USER_ERROR,
  LOGOUT_SUCCESS,
  SIGNUP_STARTED, SIGNUP_SUCCESS, SIGNUP_ERROR,
  LOGIN_STARTED, LOGIN_SUCCESS, LOGIN_ERROR,
  LOAD_USERS_STARTED, LOAD_USERS_SUCCESS, LOAD_USERS_ERROR,
  LOAD_PAYMENT_METHOD_STARTED, LOAD_PAYMENT_METHOD_SUCCESS, LOAD_PAYMENT_METHOD_ERROR,
} from './actions';


export const STORE_KEY = 'user';

export function extractSignupState( globalState ) {
  return globalState[STORE_KEY].signup;
}
const signupInitialState = {
  loading: false,
  error: null,
  success: false,
};
function signupReducer( state = signupInitialState, action ) {
  switch ( action.type ) {
    case SIGNUP_STARTED: {
      return {
        ...state,
        loading: true,
      };
    }
    case SIGNUP_SUCCESS: {
      return {
        ...state,
        loading: false,
        error: null,
        success: true,
      };
    }
    case SIGNUP_ERROR: {
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

export function extractLoginState( globalState ) {
  return globalState[STORE_KEY].login;
}
const loginInitialState = {
  loading: false,
  error: null,
};
function loginReducer( state = loginInitialState, action ) {
  switch ( action.type ) {
    case LOGIN_STARTED: {
      return {
        ...state,
        loading: true,
      };
    }
    case LOGIN_SUCCESS: {
      return {
        ...state,
        loading: false,
        error: null,
      };
    }
    case LOGIN_ERROR: {
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

export function extractUserState( globalState ) {
  return globalState[STORE_KEY].user;
}
const initialUserState = {
  user: null,
  loading: false,
  error: null,
};
function userReducer( state = initialUserState, action ) {
  switch ( action.type ) {
    case LOAD_USER_STARTED: {
      return {
        ...state,
        loading: true,
      };
    }
    case LOAD_USER_SUCCESS: {
      return {
        ...state,
        user: action.payload,
        error: null,
        loading: false,
      };
    }
    case LOAD_USER_ERROR: {
      return {
        ...state,
        error: action.payload,
        loading: false,
      };
    }
    case LOGOUT_SUCCESS: {
      return {
        ...state,
        error: null,
      };
    }
    default: {
      return state;
    }
  }
}


export function extractUsersState( globalState ) {
  return globalState[STORE_KEY].users;
}
export function extractUserById( globalState, id ) {
  const users = extractUsersState(globalState).users;
  return users.filter((user) => user._id === id)[0];
}
const usersInitialState = {
  users: null,
  loading: false,
  error: null,
};
function usersReducer( state = usersInitialState, action ) {
  switch ( action.type ) {
    case LOAD_USERS_STARTED: {
      return {
        ...state,
        loading: true,
      };
    }
    case LOAD_USERS_SUCCESS: {
      return {
        ...state,
        loading: false,
        users: action.payload,
      };
    }
    case LOAD_USERS_ERROR: {
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

export function extractPaymentMethodState( globalState ) {
  return globalState[STORE_KEY].paymentMethod;
}
const paymentMethodInitialState = {
  loading: false,
  error: null,
  data: null,
};
function paymentMethodReducer( state = usersInitialState, action ) {
  switch ( action.type ) {
    case LOAD_PAYMENT_METHOD_STARTED: {
      return {
        ...state,
        loading: true,
      };
    }
    case LOAD_PAYMENT_METHOD_SUCCESS: {
      return {
        ...state,
        loading: false,
        data: action.payload,
        error: null,
      };
    }
    case LOAD_PAYMENT_METHOD_ERROR: {
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
  user: initialUserState,
  signup: signupInitialState,
  login: loginInitialState,
  users: usersInitialState,
  paymentMethod: paymentMethodInitialState,
};
export default ( state = initialState, action ) => {
  return {
    user: userReducer( state.user, action ),
    signup: signupReducer( state.signup, action ),
    login: loginReducer( state.login, action ),
    users: usersReducer( state.users, action ),
    paymentMethod: paymentMethodReducer( state.paymentMethod, action ),
  };
};
