import { all, call, fork, put, select, takeLatest } from 'redux-saga/effects'
import ltiSaga from './sagas/lti'
import userSaga from './sagas/user'
import coursesSagas from './sagas/courses'


export default function* rootSaga () {
  yield all([
    fork(ltiSaga),
    fork(userSaga),
    fork(coursesSagas),
  ])
}
