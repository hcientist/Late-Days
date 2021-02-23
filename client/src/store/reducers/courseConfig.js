const initialCourseConfigState = {
  eligibleGroups: {},
  // FIXME: assumes only 1 "kind" of late day (that can be used across any assignment group in the list)
  defaultDays: 2,
  maxPerAssignment: 2,
  applyHoursBeforeDeadline: 0, //let it go negative
  trackingAssignmentId: -1
}

const courseConfig = (state = initialCourseConfigState, action) => {
  switch (action.type) {
    case 'GOT_ASSIGNMENT_GROUPS':
      if (Object.keys(state.eligibleGroups).length === 0) { // FIXME: this check would be simpler if I just used a map instead of an obj
        return {
          ...state, 
          eligibleGroups: action.payload
        }
      }
      return state
    case 'GOT_ASSIGNMENT_GROUP_DETAILS':
      // FIXME: the data structure as it is makes this a huge PITA /-:
      const courseId = Object.keys(action.payload)[0]
      const updatedGroups = { ...state.eligibleGroups }
      if (!(courseId in state.eligibleGroups)) {
        updatedGroups[courseId] = {}
      }
      const assnGroupId = Object.keys(action.payload[courseId])[0]
      updatedGroups[courseId][assnGroupId] = action.payload[courseId][assnGroupId]
      return {
        ...state,
        eligibleGroups: updatedGroups
      }
    case 'ADD_GROUP_TO_ELIGIBLE':
      // FIXME: the data structure as it is makes this a huge PITA /-:
      const courseToAddTo = Object.keys(state.eligibleGroups)[0]
      const nowEligible = { ...state.eligibleGroups }
      nowEligible[courseToAddTo][action.payload.id] = action.payload
      return {
        ...state,
        eligibleGroups: nowEligible
      }
    case 'DROP_GROUP_FROM_ELIGIBLE':
      // FIXME: the data structure as it is makes this a huge PITA /-:
      const courseToDropFrom = Object.keys(state.eligibleGroups)[0]
      const remainingEligible = {}
      // const remainingEligible = {...state.eligibleGroups}
      // i bet this delete killed me /-:
      // delete remainingEligible[courseToDropFrom][action.payload]
      for (const [gId, group] of Object.entries(state.eligibleGroups[courseToDropFrom])) {
        if (gId !== action.payload)
        remainingEligible[gId] = group
      }
      return {
        ...state, 
        eligibleGroups: {
          [courseToDropFrom]: remainingEligible
        }
      }
    case 'ASSIGN_TRACKING_ASSIGNMENT':
      return {
        ...state, 
        trackingAssignmentId: parseInt(action.payload, 10)
      }
    case 'UPDATE_STARTING_DAYS':
      return {
        ...state, 
        defaultDays: action.payload
      }
    default:
      return state
  }
}

export default courseConfig
