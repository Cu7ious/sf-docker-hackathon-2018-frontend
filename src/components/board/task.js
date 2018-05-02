import React, {Component} from 'react'

class BoardTask extends Component {
	callbackAction = () => {
		this.props.action(this.props.id)
	}

	render () {
		return (
			<li
				key={this.props.id}
				draggable="true"
				onDragStart={this.props.onDragStart}
			>
				<span>{this.props.text}</span>
				<i
					className="control remove"
					onClick={this.callbackAction}
				>
					×
				</i>
			</li>
		)
	}
}

export default BoardTask
