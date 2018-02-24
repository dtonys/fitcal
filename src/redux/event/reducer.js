import {
  CREATE_EVENT_STARTED, CREATE_EVENT_SUCCESS, CREATE_EVENT_ERROR,
  UPDATE_EVENT_STARTED, UPDATE_EVENT_SUCCESS, UPDATE_EVENT_ERROR,
  DELETE_EVENT_STARTED, DELETE_EVENT_SUCCESS, DELETE_EVENT_ERROR,

  LOAD_CREATED_EVENTS_STARTED, LOAD_CREATED_EVENTS_SUCCESS, LOAD_CREATED_EVENTS_ERROR,
  LOAD_JOINED_EVENTS_STARTED, LOAD_JOINED_EVENTS_SUCCESS, LOAD_JOINED_EVENTS_ERROR,

  LOAD_EVENT_DETAIL_STARTED, LOAD_EVENT_DETAIL_SUCCESS, LOAD_EVENT_DETAIL_ERROR,
  JOIN_EVENT_STARTED, JOIN_EVENT_SUCCESS, JOIN_EVENT_ERROR,

  LOAD_USER_EVENTS_STARTED, LOAD_USER_EVENTS_SUCCESS, LOAD_USER_EVENTS_ERROR,
} from 'redux/event/actions';


const eventDetailReducer = ( state, action ) => {
  switch ( action.type ) {
    case LOAD_EVENT_DETAIL_STARTED: {
      return {
        ...state,
        loading: true,
      };
    }
    case LOAD_EVENT_DETAIL_SUCCESS: {
      return {
        ...state,
        loading: false,
        error: null,
        data: action.payload,
      };
    }
    case LOAD_EVENT_DETAIL_ERROR: {
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
    case LOAD_USER_EVENTS_STARTED:
    case LOAD_CREATED_EVENTS_STARTED:
    case LOAD_JOINED_EVENTS_STARTED: {
      return {
        ...state,
        loading: true,
      };
    }
    case LOAD_USER_EVENTS_SUCCESS:
    case LOAD_CREATED_EVENTS_SUCCESS:
    case LOAD_JOINED_EVENTS_SUCCESS: {
      return {
        ...state,
        loading: false,
        error: null,
        items: action.payload,
      };
    }
    case LOAD_USER_EVENTS_ERROR:
    case LOAD_CREATED_EVENTS_ERROR:
    case LOAD_JOINED_EVENTS_ERROR: {
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

const crudApiReducer = ( state, action ) => {
  switch ( action.type ) {
    case JOIN_EVENT_STARTED:
    case CREATE_EVENT_STARTED:
    case UPDATE_EVENT_STARTED:
    case DELETE_EVENT_STARTED: {
      return {
        ...state,
        loading: true,
      };
    }

    case JOIN_EVENT_SUCCESS:
    case CREATE_EVENT_SUCCESS:
    case UPDATE_EVENT_SUCCESS:
    case DELETE_EVENT_SUCCESS: {
      return {
        ...state,
        loading: false,
        error: null,
      };
    }
    case JOIN_EVENT_ERROR:
    case CREATE_EVENT_ERROR:
    case UPDATE_EVENT_ERROR:
    case DELETE_EVENT_ERROR: {
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

const CREATE_KEY = 'create';
const UPDATE_KEY = 'update';
const DELETE_KEY = 'delete';
const CREATED_EVENTS_KEY = 'createdEvents';
const JOINED_EVENTS_KEY = 'joinedEvents';
const USER_EVENTS_KEY = 'userEvents';
const EVENT_DETAIL_KEY = 'eventDetail';
const JOIN_EVENT_KEY = 'joinEvent';

export const STORE_KEY = 'event';
export function extractState( globalState ) {
  return globalState[STORE_KEY];
}
export function extractCreatedEventsState( globalState ) {
  return globalState[STORE_KEY][CREATED_EVENTS_KEY];
}
export function extractJoinedEventsState( globalState ) {
  return globalState[STORE_KEY][JOINED_EVENTS_KEY];
}
export function extractUserEventsState( globalState ) {
  return globalState[STORE_KEY][USER_EVENTS_KEY];
}
export function extractEventDetailState( globalState ) {
  return globalState[STORE_KEY][EVENT_DETAIL_KEY];
}

const apiInitialState = {
  loading: false,
  error: null,
};
const listInitialState = {
  ...apiInitialState,
  items: [],
};
const detailInitialState = {
  ...apiInitialState,
  data: null,
};
const initialState = {
  [CREATE_KEY]: apiInitialState,
  [UPDATE_KEY]: apiInitialState,
  [DELETE_KEY]: apiInitialState,
  [JOIN_EVENT_KEY]: apiInitialState,
  [CREATED_EVENTS_KEY]: listInitialState,
  [USER_EVENTS_KEY]: listInitialState,
  [JOINED_EVENTS_KEY]: listInitialState,
  [EVENT_DETAIL_KEY]: detailInitialState,
};
function mapCrudActionToStateKey( actionType ) {
  if ( actionType.indexOf( 'CREATE_' ) === 0 ) return CREATE_KEY;
  if ( actionType.indexOf( 'UPDATE_' ) === 0 ) return UPDATE_KEY;
  if ( actionType.indexOf( 'DELETE_' ) === 0 ) return DELETE_KEY;
  return undefined;
}
function mapListActionToStateKey( actionType ) {
  if ( actionType.indexOf( 'LOAD_CREATED_EVENTS_' ) === 0 ) return CREATED_EVENTS_KEY;
  if ( actionType.indexOf( 'LOAD_JOINED_EVENTS_' ) === 0 ) return JOINED_EVENTS_KEY;
  if ( actionType.indexOf( 'LOAD_USER_EVENTS_' ) === 0 ) return USER_EVENTS_KEY;
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
    [EVENT_DETAIL_KEY]: eventDetailReducer( state[EVENT_DETAIL_KEY], action ),
    [JOIN_EVENT_KEY]: eventDetailReducer( state[EVENT_DETAIL_KEY], action ),
  };
};

