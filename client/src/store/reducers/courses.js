const coursesReducer = (state = [], action) => {
  switch (action.type) {
    case 'GOT_COURSES':
      console.log('action.payload')
      return action.payload
    default:
      return state
  }
}

export default coursesReducer
