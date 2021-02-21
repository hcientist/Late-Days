const assignmentGroupsReducer = (state = {}, action) => {
  switch (action.type) {
    case 'GOT_ASSIGNMENT_GROUPS':
      console.log('action.payload', action.payload)
      return action.payload
    case 'GOT_ASSIGNMENT_GROUP_DETAILS':
      console.log('state, action', state, action)
      // const { courseId, courseId: {groupId, groupId: data}} = action.payload
      const courseId = Object.keys(action.payload)[0]
      const groupId = Object.keys(action.payload[courseId])[0]
      const data = action.payload[courseId][groupId].assignments
      console.log(courseId, groupId, data)
      // const group = state.assignmentGroups[courseId][groupId]
      // group.assignments = data.assignments

      const groups = {...state}
      groups[courseId][groupId].assignments = data
      return {
        ...groups
      }
    default:
      return state
  }
}

export default assignmentGroupsReducer
