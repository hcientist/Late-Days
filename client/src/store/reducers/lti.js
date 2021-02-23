const ltiReducer = (state = {}, action) => {
  switch (action.type) {
    case 'GOT_LTI_STATUS':
      return action.payload
    default:
      return state
  }
}

export default ltiReducer
