import { all, call, fork, put, select, takeLatest } from 'redux-saga/effects'
import initCACCL from 'caccl/client/cached'

const { getStatus } = initCACCL()

const fetchLTI = async (userId) => {
  const ltiStatus = await getStatus()
  return ltiStatus
}

function* handleLTIReq(action) {
  const cached = yield select((state) => state.lti)
  if (Object.keys(cached).length > 0) {
  } else {
    const payload = yield call(fetchLTI, action.payload)
    yield put({
      type: 'GOT_LTI_STATUS',
      payload
    })
  }
}

function* watchLTIRequest() {
  yield takeLatest('FETCH_LTI_STATUS', handleLTIReq)
}

export default function* ltiSaga() {
  yield all([fork(watchLTIRequest)])
}
