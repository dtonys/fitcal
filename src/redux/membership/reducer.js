import {
  CREATE_MEMBERSHIP_STARTED, CREATE_MEMBERSHIP_SUCCESS, CREATE_MEMBERSHIP_ERROR,
  DELETE_MEMBERSHIP_STARTED, DELETE_MEMBERSHIP_SUCCESS, DELETE_MEMBERSHIP_ERROR,
  LOAD_MY_MEMBERSHIPS_STARTED, LOAD_MY_MEMBERSHIPS_SUCCESS, LOAD_MY_MEMBERSHIPS_ERROR,
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

const listApiReducer = ( state, action ) => {
  switch ( action.type ) {
    case LOAD_MY_MEMBERSHIPS_STARTED: {
      return {
        ...state,
        loading: true,
      };
    }
    case LOAD_MY_MEMBERSHIPS_SUCCESS: {
      return {
        ...state,
        loading: false,
        error: null,
        items: action.payload,
      };
    }
    case LOAD_MY_MEMBERSHIPS_ERROR: {
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
const MY_MEMBERSHIPS_KEY = 'myMemberships';

export function extractState( globalState ) {
  return globalState[STORE_KEY];
}
export function extractCreateMembershipState( globalState ) {
  return globalState[STORE_KEY][CREATE_KEY];
}
export function extractDeleteMembershipState( globalState ) {
  return globalState[STORE_KEY][DELETE_KEY];
}
export function extractMyMembershipsState( globalState ) {
  return globalState[STORE_KEY][MY_MEMBERSHIPS_KEY];
}

const apiInitialState = {
  loading: false,
  error: null,
};
const listInitialState = {
  ...apiInitialState,
  items: [],
};
const initialState =  {
  [CREATE_KEY]: apiInitialState,
  [DELETE_KEY]: apiInitialState,
  [MY_MEMBERSHIPS_KEY]: listInitialState,
};

function mapCrudActionToStateKey( actionType ) {
  if ( actionType.indexOf( 'CREATE_' ) === 0 ) return CREATE_KEY;
  if ( actionType.indexOf( 'DELETE_' ) === 0 ) return DELETE_KEY;
  return undefined;
}
function mapListActionToStateKey( actionType ) {
  if ( actionType.indexOf( 'LOAD_MY_MEMBERSHIPS_' ) === 0 ) return MY_MEMBERSHIPS_KEY;
  return undefined;
}

export default ( state = initialState, action ) => {
  const crudStateKey = mapCrudActionToStateKey( action.type );
  const crudUpdates = {};
  if ( crudStateKey ) {
    crudUpdates[crudStateKey] = crudApiReducer( state[crudStateKey], action );
  }
  const listStateKey = mapListActionToStateKey( action.type );
  const listUpdates = {};
  if ( listStateKey ) {
    listUpdates[listStateKey] = listApiReducer( state[listStateKey], action );
  }
  return {
    ...state,
    ...crudUpdates,
    ...listUpdates,
  };
};
