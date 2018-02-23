import lodashFind from 'lodash/find';
import {
  CREATE_EVENT_STARTED, CREATE_EVENT_SUCCESS, CREATE_EVENT_ERROR,
  UPDATE_EVENT_STARTED, UPDATE_EVENT_SUCCESS, UPDATE_EVENT_ERROR,
  DELETE_EVENT_STARTED, DELETE_EVENT_SUCCESS, DELETE_EVENT_ERROR,
  LOAD_EVENT_LIST_STARTED, LOAD_EVENT_LIST_SUCCESS, LOAD_EVENT_LIST_ERROR,
  LOAD_EVENT_DETAIL_STARTED, LOAD_EVENT_DETAIL_SUCCESS, LOAD_EVENT_DETAIL_ERROR,
  JOIN_EVENT_STARTED, JOIN_EVENT_SUCCESS, JOIN_EVENT_ERROR,
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
        item: action.payload,
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
const crudApiReducer = ( state, action ) => {
  switch ( action.type ) {
    case JOIN_EVENT_STARTED:
    case LOAD_EVENT_LIST_STARTED:
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
    case LOAD_EVENT_LIST_SUCCESS: {
      return {
        ...state,
        loading: false,
        error: null,
        items: action.payload,
      };
    }

    case JOIN_EVENT_ERROR:
    case LOAD_EVENT_LIST_ERROR:
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
const LIST_KEY = 'eventList';
const EVENT_DETAIL_KEY = 'eventDetail';
const JOIN_EVENT_KEY = 'joinEvent';

export const STORE_KEY = 'event';
export function extractState( globalState ) {
  return globalState[STORE_KEY];
}
export function extractListState( globalState ) {
  return globalState[STORE_KEY][LIST_KEY];
}
export function extractListEventById( globalState, id ) {
  const eventList = extractListState(globalState);
  return lodashFind(eventList.items, { _id: id }, null);
}
export function extractEventDetailState( globalState ) {
  return globalState[STORE_KEY][EVENT_DETAIL_KEY];
}

const apiInitialState = {
  loading: false,
  error: null,
};
const initialState = {
  [CREATE_KEY]: apiInitialState,
  [UPDATE_KEY]: apiInitialState,
  [DELETE_KEY]: apiInitialState,
  [LIST_KEY]: {
    ...apiInitialState,
    items: [],
  },
  [EVENT_DETAIL_KEY]: {
    ...apiInitialState,
    item: null,
  },
  [JOIN_EVENT_KEY]: apiInitialState,
};
function mapActionToStateKey( actionType ) {
  if ( actionType.indexOf( 'CREATE_' ) === 0 ) return CREATE_KEY;
  if ( actionType.indexOf( 'UPDATE_' ) === 0 ) return UPDATE_KEY;
  if ( actionType.indexOf( 'DELETE_' ) === 0 ) return DELETE_KEY;
  if ( actionType.indexOf( 'LOAD_EVENT_LIST_' ) === 0 ) return LIST_KEY;
  return undefined;
}
export default ( state = initialState, action ) => {
  const stateKey = mapActionToStateKey( action.type );
  const updates = {};
  if ( stateKey ) {
    updates[stateKey] = crudApiReducer( state[stateKey], action );
  }
  // if ( !stateKey ) return state;
  return {
    ...state,
    ...updates,
    [EVENT_DETAIL_KEY]: eventDetailReducer( state[EVENT_DETAIL_KEY], action ),
    [JOIN_EVENT_KEY]: eventDetailReducer( state[EVENT_DETAIL_KEY], action ),
  };
};

