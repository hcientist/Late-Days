const assignmentGroupsReducer = (state = {}, action) => {
  switch (action.type) {
    case 'GOT_ASSIGNMENT_GROUPS':
      return action.payload
    case 'GOT_ASSIGNMENT_GROUP_DETAILS':
      // const { courseId, courseId: {groupId, groupId: data}} = action.payload
      const courseId = Object.keys(action.payload)[0]
      const groupId = Object.keys(action.payload[courseId])[0] //FIXME: this is hardcoded?
      const data = action.payload[courseId][groupId].assignments
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
