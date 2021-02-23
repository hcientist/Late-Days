const coursesReducer = (state = [], action) => {
  switch (action.type) {
    case 'GOT_COURSES':
      return action.payload
    default:
      return state
  }
}

export default coursesReducer
