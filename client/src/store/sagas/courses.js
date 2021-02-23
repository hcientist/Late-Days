import { all, call, fork, put, select, takeEvery, takeLatest } from 'redux-saga/effects'
import initCACCL from 'caccl/client/cached'

const { api } = initCACCL()

const fetchSelfCourses = async () => {
  const courses = await api.user.self.listCourses()
  return courses
}

function* handleCoursesReq(action) {
  const cached = yield select((state) => state.courses)
  if (cached.length > 0) {
  } else {
    const payload = yield call(fetchSelfCourses, action.payload)
    yield put({
      type: 'GOT_COURSES',
      payload
    })
  }
}

function* watchCoursesRequest() {
  yield takeLatest('FETCH_COURSES', handleCoursesReq)
}

// export function* coursesSaga() {
//   yield all([fork(watchCoursesRequest)])
// }

const fetchAssignmentGroupsForCourse = async (courseId) => {
  const assgnGroups = await api.course.assignmentGroup.list({ courseId })
  return groupsById(assgnGroups)
}

const groupsById = (groups => {
  const groupsDict = {}
  groups.forEach((group) => {
    groupsDict[group.id] = group
  })
  return groupsDict
})

// function* handleGroupsReqWrapper(courseId) {
  // return function* (action) {
function* handleGroupsReq(action) {
  const cached = yield select((state) => state.assignmentGroups)
  if (action.payload in cached) {
  } else {
    const groups = yield call(fetchAssignmentGroupsForCourse, action.payload)
    yield put({
      type: 'GOT_ASSIGNMENT_GROUPS',
      payload: {[action.payload]: groups }
    })
  }
}

function* watchGroupsRequest () {
  // yield takeLatest('FETCH_ASSIGNMENT_GROUPS', handleGroupsReqWrapper(courseId)) // but i don't have courseId
  yield takeLatest('FETCH_ASSIGNMENT_GROUPS', handleGroupsReq)
}

// export function* assignmentGroupsSaga () {
//   yield all([fork(watchGroupsRequest)])
// }

const fetchAssignmentGroupDetails = async ({courseId, assignmentGroupId}) => {
  const assgnGroupDetails = await api.course.assignmentGroup.get({ courseId, assignmentGroupId, includeAssignments: true })
  return assgnGroupDetails
}

function* handleGroupDetailsReq(action) {
  const cached = yield select((state) => state.assignmentGroups)
  const { courseId, assignmentGroupId } = action.payload
  if (cached &&
    courseId in cached &&
    assignmentGroupId in cached[courseId] &&
    'assignments' in cached[courseId][assignmentGroupId]) {
  } else {
    const groupDetails = yield call(fetchAssignmentGroupDetails, action.payload)
    yield put({
      type: 'GOT_ASSIGNMENT_GROUP_DETAILS',
      payload: {
        [courseId]: {
          [assignmentGroupId]: groupDetails
        }
      }
    })
  }
}

function* watchGroupDetailsRequest() {
  yield takeEvery('FETCH_ASSIGNMENT_GROUP_DETAILS', handleGroupDetailsReq)
}

// export function* assignmentGroupDetailsSaga() {
//   yield all([fork(watchGroupDetailsRequest)])
// }

export default function* coursesSagas() {
  yield all([
    fork(watchCoursesRequest),
    fork(watchGroupsRequest),
    fork(watchGroupDetailsRequest),
  ])
}