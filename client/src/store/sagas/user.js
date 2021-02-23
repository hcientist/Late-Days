import { all, call, fork, put, select, takeLatest } from 'redux-saga/effects'
import initCACCL from 'caccl/client/cached'

const { api } = initCACCL()

const fetchSelfUser = async () => {
  const profile = await api.user.self.getProfile()
  return profile
}

function* handleUserReq(action) {
  const cached = yield select((state) => state.user)
  if (Object.keys(cached).length > 0) {
  } else {
    const payload = yield call(fetchSelfUser, action.payload)
    yield put({
      type: 'GOT_USER',
      payload
    })
  }
}

function* watchUserRequest() {
  yield takeLatest('FETCH_USER', handleUserReq)
}

export default function* userSaga() {
  yield all([fork(watchUserRequest)])
}
