const ltiReducer = (state = {}, action) => {
  switch (action.type) {
    case 'GOT_LTI_STATUS':
      console.log('GOT_LTI_STATUS', action)
      return action.payload
    default:
      return state
  }
}

export default ltiReducer
