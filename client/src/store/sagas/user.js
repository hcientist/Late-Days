import { all, call, fork, put, select, takeLatest } from 'redux-saga/effects'
import initCACCL from 'caccl/client/cached'

const { api } = initCACCL()

const fetchSelfUser = async () => {
  const profile = await api.user.self.getProfile()
  console.log('profile in saga', profile)
  return profile
}

function* handleUserReq(action) {
  console.log('handleUserReq')
  const cached = yield select((state) => state.user)
  if (Object.keys(cached).length > 0) {
    console.log('redundant call, already have user:', cached)
  } else {
    const payload = yield call(fetchSelfUser, action.payload)
    yield put({
      type: 'GOT_USER',
      payload
    })
  }
}

function* watchUserRequest() {
  console.log('watchUserRequest')
  yield takeLatest('FETCH_USER', handleUserReq)
}

export default function* userSaga() {
  console.log('userSaga')
  yield all([fork(watchUserRequest)])
}
