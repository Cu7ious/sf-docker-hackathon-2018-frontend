import React, {Component} from 'react'
import uniqid from 'uniqid'

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import getMuiTheme from 'material-ui/styles/getMuiTheme'
import Theme from '../utils/theme'

import FloatingActionButton from 'material-ui/FloatingActionButton'
import ArrowTop from 'material-ui/svg-icons/navigation/arrow-upward'

import TextField from 'material-ui/TextField'

import AppSidebar from './aside/sidebar'
import Board from './board/board'

import './app.css'

class App extends Component {
	componentWillMount() {
		this.state = {
			currentProject: localStorage.getItem("currentProject") || null,
			projects: [],
			user: ""
		}

		window.socket = this.props.socket
		document.body.style.display = 'block'

		this.navButton = document.getElementById('app-main-nav-button')
		this.navButton.addEventListener('click', (e) => {
			e.preventDefault()
			document.body.classList.toggle('active-left-place')
		}, false)

		this.props.socket.on('connect', () => {
			this.props.socket.emit('getProjects')
		})

		this.props.socket.on('noProjects', () => {
			this.setState({projects: []})
			console.log(this.state);
		})

		this.props.socket.on('connected', who => {
			this.setState({user: who})
		})

		this.props.socket.on('someoneConnected', who => {
			this.notify(who)
		})

		this.props.socket.on('fetchClientData', data => {
			// console.log(data);

			this.setState({
				projects: [],
				currentProject: localStorage.getItem("currentProject") || 0
			})

			this.setState({
				projects: data,
			})

			// console.log(this.state);

			// forceUpdate()
		})

	}


	notify = (who) => {
		let noty = document.getElementById("Notification")
		window.noty = noty

		noty.getElementsByTagName('h3')[0].innerText = `${who} has joined`
		noty.style.opacity = 0.8
		setTimeout(() => {
			noty.style.opacity = 0
		}, 7000)
	}

	appendTask = (text, id) => {
		const where = id.split(":")
		let project_id = where[0], board_id = where[1]

		this.props.socket.emit('createTask', {
			project_id,
			board_id,
			task: this._createTask(text)
		})
	}

	onDragStart = (e) => {
		console.log(e);
		e.dataTransfer.effectAllowed = "move"
	}

	onDragOver = (e) => {
		// console.log("onDragOver", e);
		e.dataTransfer.dropEffect = "move"
	}

	onDrop = (e) => {
		console.log(e);
		e.preventDefault();
		// Get the id of the target and add the moved element to the target's DOM
		var data = e.dataTransfer.getData("text/html");
		console.log(data);
		e.target.appendChild(document.getElementById(data));
	}

	deleteTask = id => {
		const where = id.split(":")
		let project_id = where[0], board_id = where[1], task_id = where[2]

		this.props.socket.emit('removeTask', {
			project_id,
			board_id,
			task_id
		})
	}

	_createTask = (task) => {
		return {
			id: uniqid(),
			text: task
		}
	}

	renderAppBody (project) {
		if (project !== null && this.state.projects[project]) {
			const { ToDo, InProgress, Done } = this.state.projects[project].boards

			return (
				<section className='dynamic-block'>
					<Board
						id={this.state.projects[this.state.currentProject].id}
						title="To Do"
						actions={{
							appendTask: this.appendTask,
							deleteTask: this.deleteTask,
							onDragStart: this.onDragStart,
							onDrop: this.onDrop,
							onDragOver: this.onDragOver
						}}
						tasks={ToDo}
						/>
					<Board
						id={this.state.projects[this.state.currentProject].id}
						title="In Progress"
						actions={{
							appendTask: this.appendTask,
							deleteTask: this.deleteTask,
							onDragStart: this.onDragStart,
							onDrop: this.onDrop,
							onDragOver: this.onDragOver
						}}
						tasks={InProgress}
						/>
					<Board
						id={this.state.projects[this.state.currentProject].id}
						title="Done"
						actions={{
							appendTask: this.appendTask,
							deleteTask: this.deleteTask,
							onDragStart: this.onDragStart,
							onDrop: this.onDrop,
							onDragOver: this.onDragOver
						}}
						tasks={Done}
						/>
				</section>
			)
		}

		return (<div>Loading...</div>)
	}

	renderPanel () {
		const handleKeyPress = e => {
			if (e.key === 'Enter' && e.target.value) {
				this.props.socket.emit("createProject", {
					text: e.target.value
				})

				e.target.value = ""
			}
		}

		let project = null;

		if (this.state.currentProject !== null && this.state.projects[this.state.currentProject])
			project = `Project: ${this.state.projects[this.state.currentProject].name}`
		else
			project = <MuiThemeProvider muiTheme={getMuiTheme(Theme)}><TextField onKeyPress={handleKeyPress} autoFocus hintText="Create your firs project" /></MuiThemeProvider>

		return (
			<div className='panel'>
				<h3>{project}</h3>
				<h3>User: {this.state.user}</h3>
			</div>
		)
	}

	setCurrentProject = current => {
		// console.log(current);

		localStorage.setItem("currentProject", current)

		this.setState({
			currentProject: current
		})

		document.body.classList.toggle('active-left-place')
		this.props.socket.emit('switchProjects')
	}

	renderCurrentProject = () => {
		return localStorage.getItem("currentProject") || null
	}

	renderActionButtons () {
		const styles = {
			position: 'fixed',
			bottom: 30,
			right: 30,
			borderBottom: '4px solid #078674'
		}

		return (
			<FloatingActionButton style={styles}>
				<ArrowTop/>
			</FloatingActionButton>
		)
	}

	render () {
		// You are alone here / Collaborating with:
		return (
			<div>
				<div id="Notification">
					<h3>Someone has connected</h3>
				</div>
				<AppSidebar
					socket={this.props.socket}
					projects={this.state.projects}
					currentProject={this.state.currentProject}
					action={this.setCurrentProject}
				/>

				{this.renderPanel()}

				<MuiThemeProvider muiTheme={getMuiTheme(Theme)}>
					<main className='boards-wrapper'>
						<div className='canban-board'>
							{this.renderAppBody(this.state.currentProject)}
							{this.renderActionButtons()}
						</div>
					</main>
				</MuiThemeProvider>
			</div>
		)
	}
}

export default App
