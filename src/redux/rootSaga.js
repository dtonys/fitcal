import {
  fork,
  all,
} from 'redux-saga/effects';
import demoSaga from 'redux/demo/saga';
import userSaga from 'redux/user/saga';
import lostPasswordSaga from 'redux/lost-password/saga';
import eventSaga from 'redux/event/saga';
import membershipSaga from 'redux/membership/saga';


export default function* rootSaga(context) {
  yield all([
    fork(demoSaga, context),
    fork(userSaga, context),
    fork(lostPasswordSaga, context),
    fork(eventSaga, context),
    fork(membershipSaga, context),
  ]);
}
