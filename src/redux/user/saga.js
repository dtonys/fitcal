import lodashGet from 'lodash/get';
import { put, call, fork, all, select } from 'redux-saga/effects';
import { takeOne } from 'redux/sagaHelpers';
import { redirect } from 'redux-first-router';

import {
  LOAD_USER_REQUESTED, LOAD_USER_STARTED, LOAD_USER_SUCCESS, LOAD_USER_ERROR,
  LOGOUT_REQUESTED, LOGOUT_SUCCESS,
  LOGIN_REQUESTED, LOGIN_STARTED, LOGIN_SUCCESS, LOGIN_ERROR,
  SIGNUP_REQUESTED, SIGNUP_STARTED, SIGNUP_SUCCESS, SIGNUP_ERROR,
  LOAD_USERS_REQUESTED, LOAD_USERS_STARTED, LOAD_USERS_SUCCESS, LOAD_USERS_ERROR,
} from './actions';
import {
  ROUTE_HOME,
  ROUTE_SCHEDULE,
} from 'redux/routesMap';


function* loadUser(action, { request }) {
  yield put({ type: LOAD_USER_STARTED });
  try {
    const userData = yield call(request, '/api/session');
    const userPayload = lodashGet(userData, 'data.currentUser', null);
    yield put({ type: LOAD_USER_SUCCESS, payload: userPayload });
  }
  catch ( httpError ) {
    const httpErrorMessage = lodashGet( httpError, 'error.message' );
    const errorMessage = httpErrorMessage || httpError.message;
    yield put({ type: LOAD_USER_ERROR, payload: errorMessage });
  }
}

function* logout(action, { request }) {
  yield call(request, '/api/logout');
  yield put({ type: LOGOUT_SUCCESS });
  yield put( redirect({ type: ROUTE_HOME }) );
}

function* login(action, { request }) {
  yield put({ type: LOGIN_STARTED });
  try {
    yield call( request, '/api/login', {
      method: 'POST',
      body: action.payload,
    });
    yield put({ type: LOGIN_SUCCESS });
    yield* loadUser(null, { request });
    const globalState = yield select();
    const nextAction = lodashGet(globalState, 'location.query.next');
    const nextActionParsed = nextAction ? JSON.parse(nextAction) : { type: ROUTE_SCHEDULE };
    yield put( redirect( nextActionParsed ) );
  }
  catch ( httpError ) {
    const httpErrorMessage = lodashGet( httpError, 'error.message' );
    const errorMessage = httpErrorMessage || httpError.message;
    yield put({ type: LOGIN_ERROR, payload: errorMessage });
  }
}

function* signup(action, { request }) {
  yield put({ type: SIGNUP_STARTED });
  try {
    yield call( request, '/api/signup', {
      method: 'POST',
      body: action.payload,
    });
    yield put({ type: SIGNUP_SUCCESS });
  }
  catch ( httpError ) {
    const httpErrorMessage = lodashGet( httpError, 'error.message' );
    const errorMessage = httpErrorMessage || httpError.message;
    yield put({ type: SIGNUP_ERROR, payload: errorMessage });
  }
}

function* loadUsers(action, { request }) {
  yield put({ type: LOAD_USERS_STARTED });
  try {
    const users = yield call( request, '/api/users');
    const userList = lodashGet( users, 'data.items' );
    yield put({ type: LOAD_USERS_SUCCESS, payload: userList });
  }
  catch ( httpError ) {
    const httpErrorMessage = lodashGet( httpError, 'data.message' );
    const errorMessage = httpErrorMessage || httpError.message;
    yield put({ type: LOAD_USERS_ERROR, payload: errorMessage });
  }
}

export default function* ( context ) {
  yield all([
    fork( takeOne( LOAD_USER_REQUESTED, loadUser, context ) ),
    fork( takeOne( LOGOUT_REQUESTED, logout, context ) ),
    fork( takeOne( LOGIN_REQUESTED, login, context ) ),
    fork( takeOne( SIGNUP_REQUESTED, signup, context ) ),
    fork( takeOne( LOAD_USERS_REQUESTED, loadUsers, context ) ),
  ]);
}
