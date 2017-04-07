import { Component, PropTypes } from 'react'

// Transform a set of bindings { p:val_1, q:val_2, ... } into a string of the
// form 'p=val_1, q=val_2, ...'
function formatBindings (o) {
  return Object.keys(o).map(key => `${key}=${o[key]}`).join(', ')
}

export default class QueryResult extends Component {
  renderLHS (LHS) {
    return (
      <code>
        {LHS[0].text}
        {
          LHS.slice(1).map((piece, i) => {
            return <span key={i}>&nbsp;&and;&nbsp;{piece.text}</span>
          })
        }
        &nbsp;&rarr;&nbsp;F
      </code>
    )
  }

  renderRow (step, index) {
    return (
      <tr key={index}>
        <td>{index + 1}</td>
        <td>{this.renderLHS(step.LHS)}</td>
        <td>
          <code>
            {`{ ${formatBindings(step.bindings)} }`}
          </code>
        </td>
      </tr>
    )
  }

  renderSteps () {
    const rows = this.props.steps.map((step, i) => this.renderRow(step, i))

    return (
      <table className='table table-condensed'>
        <thead>
          <tr>
            <th>step</th>
            <th>sentence</th>
            <th>bindings</th>
          </tr>
        </thead>
        <tbody>
          {rows}
          <tr key={rows.length+1}>
            <td>{rows.length+1}</td>
            <td><code>T&nbsp;&rarr;&nbsp;F</code></td>
            <td></td>
          </tr>
        </tbody>
      </table>
    )
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

    return (
      <div className='query'>
        {this.renderSteps()}
        <p>
          This is a contradiction, so
          <code>{this.props.query}</code> has been proven.
        </p>
      </div>
    )
  }
}

QueryResult.propTypes = {
  query: PropTypes.string,
  show: PropTypes.bool.isRequired,
  error: PropTypes.string,
  steps: PropTypes.array.isRequired,
}
