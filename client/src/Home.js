// Import React
import React, { Component } from 'react'
import { useSelector } from 'react-redux'

// Import resources
import logo from './logo.svg'
import './App.css'

import {
  Link
} from 'react-router-dom'

const messageByStatus = (status, profile, taught) => {
  console.log('messageByStatus', status)
  if (Object.keys(status).length === 0) return 'Status unknown.'
  if (!status.launched) return 'Please launch this app from Canvas.'
  if (!status.authorized) return "We don't have access to Canvas. Please re-launch the app."

  if (taught.length > 0) return `Hi ${profile.name}! Your CACCL app is ready with ${taught.length} courses!`

  return 'default message'
}

const Home = () => {
  const status = useSelector(state => state.lti)
  console.log('ltistatus in home', status)
  const user = useSelector(state => state.user)
  console.log('user in home', user)
  const courses = useSelector(state => state.courses)
  console.log('courses in home', courses)

  const taught = courses.filter(course => course.enrollments.filter(enrollment => enrollment.type === 'teacher').length > 0)

  // FIXME: could use status.launchInfo.courseId to redirect?

  // Render the component
  return (
    <div className='App'>
      <header className='App-header'>
        {
          taught && taught.map((course) => <Link className='App-link' key={course.id} to={`/config/${course.id}`}>Configure Late Days for {course.name}</Link>)
        }
        <img src={logo} className='App-logo' alt='logo' />
        <p>
          <strong>{messageByStatus(status, user, courses)}</strong>
        </p>
        <p>
          Edit <code>client/src/App.js</code> and save to recompile.
          </p>

          Resources:
          <a
          className='App-link'
          href='https://harvard-edtech.github.io/caccl/'
          target='_blank'
          rel='noopener noreferrer'
        >
          CACCL Docs
          </a>
        <a
          className='App-link'
          href='https://reactjs.org'
          target='_blank'
          rel='noopener noreferrer'
        >
          Learn React
          </a>
      </header>
    </div>
  )
}

export default Home
