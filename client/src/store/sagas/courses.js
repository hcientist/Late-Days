import { all, call, fork, put, select, takeLatest } from 'redux-saga/effects'
import initCACCL from 'caccl/client/cached'

const { api } = initCACCL()

const fetchSelfCourses = async () => {
  const courses = await api.user.self.listCourses()
  console.log('courses in saga', courses)
  return courses
}

function* handleCoursesReq(action) {
  console.log('handleCoursesReq')
  const cached = yield select((state) => state.courses)
  if (cached.length > 0) {
    console.log('redundant call, already have courses:', cached)
  } else {
    const payload = yield call(fetchSelfCourses, action.payload)
    yield put({
      type: 'GOT_COURSES',
      payload
    })
  }
}

function* watchCoursesRequest() {
  console.log('watchCoursesRequest')
  yield takeLatest('FETCH_COURSES', handleCoursesReq)
}

// export function* coursesSaga() {
//   console.log('coursesSaga')
//   yield all([fork(watchCoursesRequest)])
// }

const fetchAssignmentGroupsForCourse = async (courseId) => {
  console.log('fetchAssignmentGroupsForCourse', courseId)
  const assgnGroups = await api.course.assignmentGroup.list({ courseId })
  console.log('assignmentgroups in saga', assgnGroups)
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
  console.log('handleGroupsReq', action)
  const cached = yield select((state) => state.assignmentGroups)
  if (action.payload in cached) {
    console.log("redundant call, already have course's assignment groups:", cached)
  } else {
    const groups = yield call(fetchAssignmentGroupsForCourse, action.payload)
    yield put({
      type: 'GOT_ASSIGNMENT_GROUPS',
      payload: {[action.payload]: groups }
    })
  }
}

function* watchGroupsRequest () {
  console.log('watchGroupsRequest')
  // yield takeLatest('FETCH_ASSIGNMENT_GROUPS', handleGroupsReqWrapper(courseId)) // but i don't have courseId
  yield takeLatest('FETCH_ASSIGNMENT_GROUPS', handleGroupsReq)
}

// export function* assignmentGroupsSaga () {
//   console.log('assignmentGroupsSaga')
//   yield all([fork(watchGroupsRequest)])
// }

const fetchAssignmentGroupDetails = async ({courseId, assignmentGroupId}) => {
  console.log('fetchAssignmentGroupsForCourse', courseId, assignmentGroupId)
  const assgnGroupDetails = await api.course.assignmentGroup.get({ courseId, assignmentGroupId, includeAssignments: true })
  console.log('assignmentgroup details in saga', assgnGroupDetails)
  return assgnGroupDetails
}

function* handleGroupDetailsReq(action) {
  console.log('handleGroupDetailsReq', action)
  const cached = yield select((state) => state.assignmentGroups)
  const { courseId, assignmentGroupId } = action.payload
  if (cached &&
    courseId in cached &&
    assignmentGroupId in cached[courseId] &&
    'assignments' in cached[courseId][assignmentGroupId]) {
    console.log("redundant call, already have course's assignment group's details:", cached[action.payload.courseId])
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
  console.log('watchGroupDetailsRequest')
  yield takeLatest('FETCH_ASSIGNMENT_GROUP_DETAILS', handleGroupDetailsReq)
}

// export function* assignmentGroupDetailsSaga() {
//   console.log('assignmentGroupsSaga')
//   yield all([fork(watchGroupDetailsRequest)])
// }

export default function* coursesSagas() {
  yield all([
    fork(watchCoursesRequest),
    fork(watchGroupsRequest),
    fork(watchGroupDetailsRequest),
  ])
}