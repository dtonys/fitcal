import lodashGet from 'lodash/get';
import { put, call, fork, all } from 'redux-saga/effects';
import { takeOne } from 'redux/sagaHelpers';

import {
  LOST_PASSWORD_REQUESTED, LOST_PASSWORD_STARTED, LOST_PASSWORD_SUCCESS, LOST_PASSWORD_ERROR,
  RESET_PASSWORD_REQUESTED, RESET_PASSWORD_STARTED, RESET_PASSWORD_SUCCESS, RESET_PASSWORD_ERROR,
} from 'redux/lost-password/actions';


function* lostPassword( action, context ) {
  yield put({ type: LOST_PASSWORD_STARTED });
  try {
    yield call( context.request, '/api/lost-password', {
      method: 'POST',
      body: action.payload,
    });
    yield put({ type: LOST_PASSWORD_SUCCESS });
  }
  catch ( error ) {
    const httpErrorMessage = lodashGet( error, 'error.message' );
    const errorMessage = httpErrorMessage || error.message;
    yield put({ type: LOST_PASSWORD_ERROR, payload: errorMessage });
  }
}

function* resetPassword( action, context ) {
  yield put({ type: RESET_PASSWORD_STARTED });
  try {
    yield call( context.request, '/api/reset-password', {
      method: 'POST',
      body: action.payload,
    });
    yield put({ type: RESET_PASSWORD_SUCCESS });
  }
  catch ( error ) {
    const httpErrorMessage = lodashGet( error, 'error.message' );
    const errorMessage = httpErrorMessage || error.message;
    yield put({ type: RESET_PASSWORD_ERROR, payload: errorMessage });
  }

  console.log('resetPassword'); // eslint-disable-line no-console
  yield true;
}

export default function* ( context ) {
  yield all([
    fork( takeOne( LOST_PASSWORD_REQUESTED, lostPassword, context ) ),
    fork( takeOne( RESET_PASSWORD_REQUESTED, resetPassword, context ) ),
  ]);
}
