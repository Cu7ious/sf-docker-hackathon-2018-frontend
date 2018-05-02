import React from 'react'
import ReactDOM from 'react-dom'
import io from 'socket.io-client'
import App from './components/app'
import registerServiceWorker from './registerServiceWorker'

import './main.css'

const socket = io('http://localhost:3030')

socket.once('connect', () => {
  console.log(`Connected to ${socket.io.uri}`, `ID: ${socket.id}`)
})

socket.on('disconnect', () => {
  console.log('Connection lost')
})

socket.on('reconnect', () => {
  console.log(`Re-connected to ${socket.io.uri}`, `ID: ${socket.id}`)
})


ReactDOM.render(
  <App socket={socket} />,
  document.getElementById('root')
)

registerServiceWorker()
