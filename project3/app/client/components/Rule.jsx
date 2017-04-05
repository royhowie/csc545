import { Component, PropTypes } from 'react'

export default class Rule extends Component {
  formatRule () {
    // Split the rule at & and at :
    let pieces = this.props.rule.text.split(/&|:/g)
    return (
      <code>
        {pieces[0]}
        {
          pieces.slice(1, -1).map((piece,i) => {
            return <span key={i}>&nbsp;&and;&nbsp;{piece}</span>
          })
        }
        &nbsp;
        &rarr;
        &nbsp;
        {pieces.pop()}
      </code>
    )
  }

  remove (event) {
    event.preventDefault()
    Meteor.call('rules.remove', this.props.rule._id)
  }

  render () {
    return (
      <li key={this.props.rule._id} className='rule'>
        {this.formatRule()}
        <button
          type='button'
          onClick={this.remove.bind(this)}
          className='btn btn-danger btn-xs pull-right'>
            &times;
        </button>
      </li>
    )
  }
}

Rule.propTypes = {
  rule: PropTypes.object.isRequired,
}
