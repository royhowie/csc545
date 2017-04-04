import { Component } from 'react'
import { withRouter } from 'react-router'

class NotFound extends Component {
  componentWillMount () {
    setTimeout(() => {
      this.props.history.push('/')
    }, 2500)
  }
  render () {
    return (
      <div id='not-found-block' className='text-center'>
        <h1>404: That's a dead-end!</h1>
        <p>Sending you back to the home page.</p>
      </div>
    )
  }
}

export default withRouter(NotFound)
