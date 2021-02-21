const userReducer = (state = {}, action) => {
  console.log('action', action)
  switch (action.type) {
    case 'GOT_USER':
      console.log('action.payload', action.payload)
      return action.payload
    default:
      return state
  }
}

export default userReducer
