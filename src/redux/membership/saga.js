import lodashGet from 'lodash/get';
import { fork, all, put, call } from 'redux-saga/effects';
import { takeOne } from 'redux/sagaHelpers';

import {
  CREATE_MEMBERSHIP_STARTED, CREATE_MEMBERSHIP_SUCCESS, CREATE_MEMBERSHIP_ERROR, CREATE_MEMBERSHIP_REQUESTED,
  DELETE_MEMBERSHIP_STARTED, DELETE_MEMBERSHIP_SUCCESS, DELETE_MEMBERSHIP_ERROR, DELETE_MEMBERSHIP_REQUESTED,
  LOAD_MY_MEMBERSHIPS_STARTED, LOAD_MY_MEMBERSHIPS_SUCCESS, LOAD_MY_MEMBERSHIPS_ERROR, LOAD_MY_MEMBERSHIPS_REQUESTED,
  UPDATE_MEMBERSHIP_STARTED, UPDATE_MEMBERSHIP_SUCCESS, UPDATE_MEMBERSHIP_ERROR, UPDATE_MEMBERSHIP_REQUESTED,
} from 'redux/membership/actions';


function* create( action, { request } ) {
  yield put({ type: CREATE_MEMBERSHIP_STARTED });
  try {
    yield call( request, '/api/memberships', {
      method: 'POST',
      body: action.payload,
    });
    yield put({ type: CREATE_MEMBERSHIP_SUCCESS });
    yield put({ type: LOAD_MY_MEMBERSHIPS_REQUESTED });
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
    yield put({ type: LOAD_MY_MEMBERSHIPS_REQUESTED });
  }
  catch ( httpError ) {
    const httpErrorMessage = lodashGet( httpError, 'error.message' );
    const errorMessage = httpErrorMessage || httpError.message;
    yield put({ type: DELETE_MEMBERSHIP_ERROR, payload: errorMessage });
  }
}

function* loadMyMemberships( action, { request } ) {
  yield put({ type: LOAD_MY_MEMBERSHIPS_STARTED });
  try {
    const response = yield call( request, '/api/memberships' );
    yield put({ type: LOAD_MY_MEMBERSHIPS_SUCCESS, payload: response.data.items });
  }
  catch ( httpError ) {
    const httpErrorMessage = lodashGet( httpError, 'error.message' );
    const errorMessage = httpErrorMessage || httpError.message;
    yield put({ type: LOAD_MY_MEMBERSHIPS_ERROR, payload: errorMessage });
  }
}

function* updateMembership( action, { request } ) {
  yield put({ type: UPDATE_MEMBERSHIP_STARTED });
  try {
    yield call( request, `/api/memberships/${action.payload.id}`, {
      method: 'PATCH',
      body: action.payload,
    });
    yield put({ type: UPDATE_MEMBERSHIP_SUCCESS });
    yield put({ type: LOAD_MY_MEMBERSHIPS_REQUESTED });
  }
  catch ( httpError ) {
    const httpErrorMessage = lodashGet( httpError, 'error.message' );
    const errorMessage = httpErrorMessage || httpError.message;
    yield put({ type: UPDATE_MEMBERSHIP_ERROR, payload: errorMessage });
  }
}

export default function* ( context ) {
  yield all([
    fork( takeOne( CREATE_MEMBERSHIP_REQUESTED, create, context ) ),
    fork( takeOne( DELETE_MEMBERSHIP_REQUESTED, _delete, context ) ),
    fork( takeOne( LOAD_MY_MEMBERSHIPS_REQUESTED, loadMyMemberships, context ) ),
    fork( takeOne( UPDATE_MEMBERSHIP_REQUESTED, updateMembership, context ) ),
  ]);
}
