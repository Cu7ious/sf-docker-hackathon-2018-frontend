import React, { Component } from 'react'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import getMuiTheme from 'material-ui/styles/getMuiTheme'
import Theme from '../../utils/theme'
import TextField from 'material-ui/TextField'
import Cu7iousWatermark from './by-Cu7ious-watermark-black.svg'

class AppSidebar extends Component {
  componentWillMount () {
    this.magnetOverlay = document.getElementById('magnet-overlay')
    this.magnetOverlay.addEventListener('click', this.handleCloseSidebar, false)
    document.addEventListener('keyup', this.handleCloseSidebar, false)
  }

  handleCloseSidebar = e => {
    if (e.type === 'keyup' && e.keyCode === 27) {
      if (document.body.classList.length) {
        document.body.classList.toggle('active-left-place')
      }
    } else if (e.type === 'click') {
      document.body.classList.toggle('active-left-place')
    }
  }

  handleKeyPress = e => {
          if (e.key === 'Enter' && e.target.value) {
                  this.props.socket.emit("createProject", {
                        text: e.target.value
                  })

                  e.target.value = ""
          }
  }

  handleClick = e => {
        e.preventDefault()
        this.props.action(e.target.id)
  }

  renderProjects = (projs, current) => {
        if (projs && projs.length)
        {
                const projects = projs.map((el, idx) => {
                        return (idx === current)
                                ? <li key={idx} id={idx} className="project-current" onClick={this.handleClick}>{el.name}</li>
                                : <li key={idx} id={idx} onClick={this.handleClick}>{el.name}</li>
                })

                return (
                        <ul>
                                {projects}
                        </ul>
                )
        }
  }

  render () {
    return (
      <aside id='main-sidebar'>
        <div className='main-sidebar-wrapper'>
          <div className='header-section'>
            <h2>React, Socket.io, Docker</h2>
            <h3>with React and Socket.io</h3>
            <button onClick={this.handleCloseSidebar}>⨯</button>
          </div>
          <section className='container-fluid'>
            <div className='row'>
              <aside className='canban-board-sidebar'>
                      <MuiThemeProvider muiTheme={getMuiTheme(Theme)}><TextField onKeyPress={this.handleKeyPress} autoFocus hintText="New Project" /></MuiThemeProvider>
              </aside>
              <aside className='canban-board-sidebar'>
                      {this.renderProjects(this.props.projects, this.props.currentProject)}
              </aside>
            </div>
          </section>
        </div>
        <footer className='main-footer'>
          <p>Designed &amp; coded with &hearts;
            <a target='_blank' rel='noopener noreferrer' href='//cu7io.us/'>
              <img src={Cu7iousWatermark} alt='by-Cu7ious' />
            </a>
          </p>
        </footer>
      </aside>
    )
  }
}

export default AppSidebar
