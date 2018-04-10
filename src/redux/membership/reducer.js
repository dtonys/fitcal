import {
  CREATE_MEMBERSHIP_STARTED, CREATE_MEMBERSHIP_SUCCESS, CREATE_MEMBERSHIP_ERROR,
  DELETE_MEMBERSHIP_STARTED, DELETE_MEMBERSHIP_SUCCESS, DELETE_MEMBERSHIP_ERROR,
} from 'redux/membership/actions';

const crudApiReducer = ( state, action ) => {
  switch ( action.type ) {
    case CREATE_MEMBERSHIP_STARTED:
    case DELETE_MEMBERSHIP_STARTED: {
      return {
        ...state,
        loading: true,
      };
    }
    case CREATE_MEMBERSHIP_SUCCESS:
    case DELETE_MEMBERSHIP_SUCCESS: {
      return {
        ...state,
        loading: false,
        error: null,
      };
    }
    case CREATE_MEMBERSHIP_ERROR:
    case DELETE_MEMBERSHIP_ERROR: {
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
};

export const STORE_KEY = 'membership';

const CREATE_KEY = 'create';
const DELETE_KEY = 'delete';
const apiInitialState = {
  loading: false,
  error: null,
};

export function extractState( globalState ) {
  return globalState[STORE_KEY];
}
export function extractCreateMembershipState( globalState ) {
  return globalState[STORE_KEY][CREATE_KEY];
}
export function extractDeleteMembershipState( globalState ) {
  return globalState[STORE_KEY][DELETE_KEY];
}

const initialState =  {
  [CREATE_KEY]: apiInitialState,
  [DELETE_KEY]: apiInitialState,
};

function mapCrudActionToStateKey( actionType ) {
  if ( actionType.indexOf( 'CREATE_' ) === 0 ) return CREATE_KEY;
  if ( actionType.indexOf( 'DELETE_' ) === 0 ) return DELETE_KEY;
  return undefined;
}

export default ( state = initialState, action ) => {
  const crudStateKey = mapCrudActionToStateKey( action.type );
  const crudUpdates = {};
  if ( crudStateKey ) {
    crudUpdates[crudStateKey] = crudApiReducer( state[crudStateKey], action );
  }
  return {
    ...state,
    ...crudUpdates,
  };
};
