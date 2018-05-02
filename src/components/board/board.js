import React, {Component} from 'react'
import BoardInput from './board-input'
import BoardTask from './task'

class Board extends Component {

	componentWillMount () {
		this.tasks = this.props.tasks || 0
	}

	renderList () {
		return (
			<ul>
			{
				this.tasks.map((el, idx) => (
					<BoardTask
						onDragStart={this.props.actions.onDragStart}
						key={el.id}
						id={`${this.props.id}:${this.props.title.split(" ").join("")}:${el.id}`}
						text={el.text}
						action={this.props.actions.deleteTask}
					/>
				))
			}
			</ul>
		)
	}

	render () {
		const list = this.tasks.length ? this.renderList() : null
		const id = `${this.props.id}:${this.props.title.split(" ").join("")}`

		return (
			<div
				className="Board"
				id={'d-' + id}
				onDragOver={this.props.actions.onDragOver}
				onDrop={this.props.actions.onDrop}>
				<h3>{this.props.title}</h3>
				<div className="Board-internals">
					<BoardInput
						id={id}
						action={this.props.actions.appendTask}
					/>
					{list}
				</div>
			</div>
		)
	}
}

export default Board
