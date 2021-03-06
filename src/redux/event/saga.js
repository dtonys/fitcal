import lodashGet from 'lodash/get';
import { put, call, fork, all } from 'redux-saga/effects';
import { takeOne } from 'redux/sagaHelpers';


import {
  CREATE_EVENT_STARTED, CREATE_EVENT_SUCCESS, CREATE_EVENT_ERROR, CREATE_EVENT_REQUESTED,
  UPDATE_EVENT_STARTED, UPDATE_EVENT_SUCCESS, UPDATE_EVENT_ERROR, UPDATE_EVENT_REQUESTED,
  DELETE_EVENT_STARTED, DELETE_EVENT_SUCCESS, DELETE_EVENT_ERROR, DELETE_EVENT_REQUESTED,
  LOAD_CREATED_EVENTS_REQUESTED, LOAD_CREATED_EVENTS_STARTED, LOAD_CREATED_EVENTS_SUCCESS, LOAD_CREATED_EVENTS_ERROR,
  LOAD_JOINED_EVENTS_REQUESTED, LOAD_JOINED_EVENTS_STARTED, LOAD_JOINED_EVENTS_SUCCESS, LOAD_JOINED_EVENTS_ERROR,
  LOAD_USER_EVENTS_REQUESTED, LOAD_USER_EVENTS_STARTED, LOAD_USER_EVENTS_SUCCESS, LOAD_USER_EVENTS_ERROR,
  JOIN_EVENT_REQUESTED, JOIN_EVENT_STARTED, JOIN_EVENT_SUCCESS, JOIN_EVENT_ERROR,
  LOAD_EVENT_DETAIL_REQUESTED, LOAD_EVENT_DETAIL_STARTED, LOAD_EVENT_DETAIL_SUCCESS, LOAD_EVENT_DETAIL_ERROR,
} from 'redux/event/actions';
import {
  ROUTE_SCHEDULE,
} from 'redux/routesMap';

function* loadList({
  request,
  apiUrl,
  startAction,
  successAction,
  errorAction,
}) {
  yield put({ type: startAction });
  try {
    const response = yield call( request, apiUrl );
    yield put({ type: successAction, payload: response.data.items });
  }
  catch ( httpError ) {
    const httpErrorMessage = lodashGet( httpError, 'error.message' );
    const errorMessage = httpErrorMessage || httpError.message;
    yield put({ type: errorAction, payload: errorMessage });
  }
}

function* loadCreatedEvents( action, { request } ) {
  yield* loadList({
    request,
    apiUrl: '/api/created/events',
    startAction: LOAD_CREATED_EVENTS_STARTED,
    successAction: LOAD_CREATED_EVENTS_SUCCESS,
    errorAction: LOAD_CREATED_EVENTS_ERROR,
  });
}

function* loadJoinedEvents( action, { request } ) {
  yield* loadList({
    request,
    apiUrl: '/api/joined/events',
    startAction: LOAD_JOINED_EVENTS_STARTED,
    successAction: LOAD_JOINED_EVENTS_SUCCESS,
    errorAction: LOAD_JOINED_EVENTS_ERROR,
  });
}

function* loadUserEvents( action, { request } ) {
  yield* loadList({
    request,
    apiUrl: `/api/${action.payload}/events`,
    startAction: LOAD_USER_EVENTS_STARTED,
    successAction: LOAD_USER_EVENTS_SUCCESS,
    errorAction: LOAD_USER_EVENTS_ERROR,
  });
}

function* _delete( action, { request } ) {
  yield put({ type: DELETE_EVENT_STARTED });
  try {
    yield call( request, `/api/events/${action.payload}`, { method: 'DELETE' });
    yield put({ type: DELETE_EVENT_SUCCESS });
    yield put({ type: LOAD_CREATED_EVENTS_REQUESTED });
  }
  catch ( httpError ) {
    const httpErrorMessage = lodashGet( httpError, 'error.message' );
    const errorMessage = httpErrorMessage || httpError.message;
    yield put({ type: DELETE_EVENT_ERROR, payload: errorMessage });
  }
}

function* update( action, { request } ) {
  yield put({ type: UPDATE_EVENT_STARTED });
  try {
    yield call( request, `/api/events/${action.payload.id}`, {
      method: 'PATCH',
      body: action.payload,
    });
    yield put({ type: UPDATE_EVENT_SUCCESS });
    yield put({ type: LOAD_CREATED_EVENTS_REQUESTED });
  }
  catch ( httpError ) {
    const httpErrorMessage = lodashGet( httpError, 'error.message' );
    const errorMessage = httpErrorMessage || httpError.message;
    yield put({ type: UPDATE_EVENT_ERROR, payload: errorMessage });
  }
}

function* create( action, { request } ) {
  yield put({ type: CREATE_EVENT_STARTED });
  try {
    yield call( request, '/api/events', {
      method: 'POST',
      body: action.payload,
    });
    yield put({ type: CREATE_EVENT_SUCCESS });
    yield put({ type: LOAD_CREATED_EVENTS_REQUESTED });
  }
  catch ( httpError ) {
    const httpErrorMessage = lodashGet( httpError, 'error.message' );
    const errorMessage = httpErrorMessage || httpError.message;
    yield put({ type: CREATE_EVENT_ERROR, payload: errorMessage });
  }
}

function* joinEvent( action, { request } ) {
  yield put({ type: JOIN_EVENT_STARTED });
  try {
    yield call( request, `/api/events/${action.payload}/join`, {
      method: 'POST',
    });
    yield put({ type: JOIN_EVENT_SUCCESS });
    yield put({ type: ROUTE_SCHEDULE });
  }
  catch ( httpError ) {
    const httpErrorMessage = lodashGet( httpError, 'error.message' );
    const errorMessage = httpErrorMessage || httpError.message;
    yield put({ type: JOIN_EVENT_ERROR, payload: errorMessage });
  }
}

function* loadEventDetail( action, { request } ) {
  yield put({ type: LOAD_EVENT_DETAIL_STARTED });
  try {
    const { data } = yield call( request, `/api/events/${action.payload}`);
    yield put({ type: LOAD_EVENT_DETAIL_SUCCESS, payload: data });
  }
  catch ( httpError ) {
    const httpErrorMessage = lodashGet( httpError, 'error.message' );
    const errorMessage = httpErrorMessage || httpError.message;
    yield put({ type: LOAD_EVENT_DETAIL_ERROR, payload: errorMessage });
  }
}
export default function* ( context ) {
  yield all([
    fork( takeOne( CREATE_EVENT_REQUESTED, create, context ) ),
    fork( takeOne( UPDATE_EVENT_REQUESTED, update, context ) ),
    fork( takeOne( DELETE_EVENT_REQUESTED, _delete, context ) ),
    fork( takeOne( JOIN_EVENT_REQUESTED, joinEvent, context ) ),
    fork( takeOne( LOAD_EVENT_DETAIL_REQUESTED, loadEventDetail, context ) ),
    fork( takeOne( LOAD_CREATED_EVENTS_REQUESTED, loadCreatedEvents, context ) ),
    fork( takeOne( LOAD_JOINED_EVENTS_REQUESTED, loadJoinedEvents, context ) ),
    fork( takeOne( LOAD_USER_EVENTS_REQUESTED, loadUserEvents, context ) ),
  ]);
}
