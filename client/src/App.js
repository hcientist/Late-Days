import React from 'react'
import { useDispatch } from 'react-redux'

import {
  BrowserRouter as Router,
  Switch,
  Route
} from 'react-router-dom'

import Home from './Home'
import Config from './Config/index'

const App = () => {
  const dispatch = useDispatch()
  dispatch({ type: 'FETCH_LTI_STATUS' })
  dispatch({ type: 'FETCH_USER' })
  dispatch({ type: 'FETCH_COURSES' })
  return (
    <Router>
      {/* FIXME: put like navbar here? */}
      <div>Late Days navbar?</div>
      <Switch>
        <Route path='/config/:courseId'>
          <Config />
        </Route>
        <Route path='/'>
          <Home />
        </Route>
      </Switch>
    </Router>
  )
}

export default App
