import { Component, PropTypes } from 'react'

const LAST_STEP = { LHS: [{ text: 'T' }] }

export default class QueryResult extends Component {
  renderSteps () {
    return this.props.steps.concat(LAST_STEP).map((step, index) => {
      return (
        <div key={index}>
          <code>
            {index}.
            &nbsp;
            {step.LHS[0].text}
            {
              step.LHS.slice(1).map((piece, i) => {
                return <span key={i}>&nbsp;&and;&nbsp;{piece.text}</span>
              })
            }
            &nbsp;
            &rarr;
            &nbsp;
            F
          </code>
        </div>
      )
    })
  }

  render () {
    if (!this.props.show) {
      return <div></div>
    }

    if (this.props.error) {
      return (
        <div>
          <p className='bg-danger query'>{this.props.error}</p>
        </div>
      )
    }

    if (this.props.steps.length === 0) {
      return (
        <div>
          <p className='bg-danger query'>
            Unable to prove theorem.
          </p>
        </div>
      )
    }

    return <div className='bg-success query'>
      {this.renderSteps()}
      <p>
        As this is a contradiction: <code>QED</code>.
      </p>
    </div>
  }
}

QueryResult.propTypes = {
  show: PropTypes.bool.isRequired,
  error: PropTypes.string,
  steps: PropTypes.array.isRequired,
}
