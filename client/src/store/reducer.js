import { combineReducers } from 'redux'
import ltiReducer from './reducers/lti'
import userReducer from './reducers/user'
import coursesReducer from './reducers/courses'
import assignmentGroupsReducer from './reducers/assignmentGroups'

const rootReducer = combineReducers({
  lti: ltiReducer,
  user: userReducer,
  courses: coursesReducer,
  assignmentGroups: assignmentGroupsReducer,
})

export default rootReducer
