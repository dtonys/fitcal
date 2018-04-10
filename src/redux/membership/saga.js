import lodashGet from 'lodash/get';
import { fork, all, put, call } from 'redux-saga/effects';
import { takeOne } from 'redux/sagaHelpers';

import {
  CREATE_MEMBERSHIP_STARTED, CREATE_MEMBERSHIP_SUCCESS, CREATE_MEMBERSHIP_ERROR, CREATE_MEMBERSHIP_REQUESTED,
  DELETE_MEMBERSHIP_STARTED, DELETE_MEMBERSHIP_SUCCESS, DELETE_MEMBERSHIP_ERROR, DELETE_MEMBERSHIP_REQUESTED,
} from 'redux/membership/actions';


function* create( action, { request } ) {
  yield put({ type: CREATE_MEMBERSHIP_STARTED });
  try {

    yield call( request, '/api/memberships', {
      method: 'POST',
      body: action.payload,
    });
    yield put({ type: CREATE_MEMBERSHIP_SUCCESS });
    // yield put({ type: LOAD_CREATED_EVENTS_REQUESTED });
  }
  catch ( httpError ) {
    const httpErrorMessage = lodashGet( httpError, 'error.message' );
    const errorMessage = httpErrorMessage || httpError.message;
    yield put({ type: CREATE_MEMBERSHIP_ERROR, payload: errorMessage });
  }
}

function* _delete( action, { request } ) {
  yield put({ type: DELETE_MEMBERSHIP_STARTED });
  try {
    // yield call( request, `/api/events/${action.payload}`, { method: 'DELETE' });
    yield put({ type: DELETE_MEMBERSHIP_SUCCESS });
    // yield put({ type: LOAD_CREATED_EVENTS_REQUESTED });
  }
  catch ( httpError ) {
    const httpErrorMessage = lodashGet( httpError, 'error.message' );
    const errorMessage = httpErrorMessage || httpError.message;
    yield put({ type: DELETE_MEMBERSHIP_ERROR, payload: errorMessage });
  }
}


export default function* ( context ) {
  yield all([
    fork( takeOne( CREATE_MEMBERSHIP_REQUESTED, create, context ) ),
    fork( takeOne( DELETE_MEMBERSHIP_REQUESTED, _delete, context ) ),
  ]);
}
