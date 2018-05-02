import React, {Component} from 'react'

class BoardInput extends Component {
	callbackAction = (e) => {
		if (e.keyCode === 13 && e.target.value) {
			this.props.action(e.target.value, this.props.id)
			e.target.value = ""
		}
	}

	render () {
		return (
			<div className="input-form">
				<input type="text" onKeyUp={this.callbackAction} />
			</div>
		)
	}
}

export default BoardInput
