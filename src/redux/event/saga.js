import lodashGet from 'lodash/get';
import { put, call, fork, all } from 'redux-saga/effects';
import { takeOne } from 'redux/sagaHelpers';


import {
  CREATE_EVENT_STARTED, CREATE_EVENT_SUCCESS, CREATE_EVENT_ERROR, CREATE_EVENT_REQUESTED,
  UPDATE_EVENT_STARTED, UPDATE_EVENT_SUCCESS, UPDATE_EVENT_ERROR, UPDATE_EVENT_REQUESTED,
  DELETE_EVENT_STARTED, DELETE_EVENT_SUCCESS, DELETE_EVENT_ERROR, DELETE_EVENT_REQUESTED,
  LOAD_EVENT_LIST_REQUESTED, LOAD_EVENT_LIST_STARTED, LOAD_EVENT_LIST_SUCCESS, LOAD_EVENT_LIST_ERROR,
} from 'redux/event/actions';


function* loadList( action, { request } ) {
  yield put({ type: LOAD_EVENT_LIST_STARTED });
  try {
    const response = yield call( request, action.meta.apiUrl );
    yield put({ type: LOAD_EVENT_LIST_SUCCESS, payload: response.data.items });
  }
  catch ( httpError ) {
    const httpErrorMessage = lodashGet( httpError, 'error.message' );
    const errorMessage = httpErrorMessage || httpError.message;
    yield put({ type: LOAD_EVENT_LIST_ERROR, payload: errorMessage });
  }
}

function* _delete( action, { request } ) {
  yield put({ type: DELETE_EVENT_STARTED });
  try {
    yield call( request, `/api/events/${action.payload}`, { method: 'DELETE' });
    yield put({ type: DELETE_EVENT_SUCCESS });
    yield put({ type: LOAD_EVENT_LIST_REQUESTED });
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
    yield put({ type: LOAD_EVENT_LIST_REQUESTED });
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
    yield put({ type: LOAD_EVENT_LIST_REQUESTED });
  }
  catch ( httpError ) {
    const httpErrorMessage = lodashGet( httpError, 'error.message' );
    const errorMessage = httpErrorMessage || httpError.message;
    yield put({ type: CREATE_EVENT_ERROR, payload: errorMessage });
  }
}

export default function* ( context ) {
  yield all([
    fork( takeOne( CREATE_EVENT_REQUESTED, create, context ) ),
    fork( takeOne( UPDATE_EVENT_REQUESTED, update, context ) ),
    fork( takeOne( DELETE_EVENT_REQUESTED, _delete, context ) ),
    fork( takeOne( LOAD_EVENT_LIST_REQUESTED, loadList, context ) ),
  ]);
}