import { Component, PropTypes } from 'react'
import ReactDOM from 'react-dom'
import { createContainer } from 'meteor/react-meteor-data'

import QueryResult from './QueryResult.jsx'
import Rule from './Rule.jsx'

import { Rules } from '../../api/rules.js'
import { Predicates } from '../../api/predicates.js'

function $ (_) { return document.querySelector(_) }

class KnowledgeBase extends Component {
  constructor (props) {
    super(props)
    this.state = {
      showQuery: false,
      error: null,
      steps: [],
    }
  }
  renderRules () {
    return this.props.rules.map((rule) => {
      return <Rule key={rule._id} rule={rule} />
    })
  }

  addRule (event) {
    event.preventDefault()

    const node = ReactDOM.findDOMNode(this.refs.addRule)
    const target = $('#onAddError')

    Meteor.call('rules.insert', node.value.trim(), function (err, res) {
      if (err) {
        target.textContent = err.error
        target.classList.remove('hidden')
      } else {
        target.classList.add('hidden')
        target.textContent = ''
        node.value = ''
      }
    })
  }

  processQuery (event) {
    event.preventDefault()

    const node = ReactDOM.findDOMNode(this.refs.query)
    const query = (node.value || '').trim()

    if (query === '') {
      return this.setState({ showQuery: false, error: null, steps: [] })
    }

    const predicates = this.props.predicates
    const rules = this.props.rules

    let lookupById = new Map(predicates.map(p => [p._id, p]))
    let lookupByKey = new Map(predicates.map(p => [p.predicate, p]))
    let lookupByRHS = new Map(
      rules.map(r => [lookupById.get(r.RHS).predicate, r])
    )

    try {
      this.setState({ showQuery: false, error: null, steps: [] })
      let format = /(\w+)\(([\w,]+)\)/

      if (!format.test(query)) {
        throw new Meteor.Error('Improper query format!')
      }

      let pieces = query.match(format)
      let predicate = pieces[1]
      let args = pieces[2].split(',')

      let TRUE = lookupByKey.get('T')
      let LHS = lookupByKey.get(predicate)

      if (!LHS) {
        throw new Meteor.Error(`The predicate "${predicate
          }" does not exist in the database!`)
      }

      let list = [{ LHS: [ LHS ], steps: [], bindings: {} }]
      args.forEach((arg, index) => {
        list[0].bindings[
          lookupByKey.get(predicate).args[index]
        ] = arg
      })

      let next = null

      do {
        next = list.shift()

        if (next.LHS.length === 0) {
          break
        }

        next.LHS.forEach((leftPredicate, index) => {
          let option = lookupByRHS.get(leftPredicate.predicate)
          let clone = {
            LHS: [],
            steps: next.steps.concat(next),
            bindings: Object.assign({}, next.bindings),
          }

          // Start with `next.LHS`
          clone.LHS.push(...next.LHS)

          // Remove the current LHS predicate being resolved.
          clone.LHS.splice(index, 1)

          // Add all of the LHS of the rule being resolved with.
          let newRules = option.LHS.map(id => lookupById.get(id))
          let hasTrue = newRules.find(r => r.predicate === 'T')

          // If there is a T on the LHS:
          if (hasTrue) {
            // Find the predicate which T implies.
            let conclusion = lookupById.get(option.RHS)

            // Find the default arguments for this predicate.
            // That is [p, q, r] instead of [me, you, it].
            let T_args = conclusion.text.match(/\(([\w,]+)\)/)[1].split(',')

            // Find the specific arguments for this predicate.
            // That is [me, you, it] instead of [p, q, r].
            let RHS_args = rules.filter(
              rule => rule.RHS === conclusion._id && rule.LHS[0] === TRUE._id
            )[0].text
            .match(/T:\w+\(([\w,]+)\)/)[1]
            .split(',')

            // Iterate through the arguments and check `next.bindings`.
            // For example, if we have that T -> A(me) and we are substituting
            // into A(p) & B(p) -> C(p) and wish to prove that C(you) is true,
            // then we would check that (bindings[p] = me) == you, which is
            // false, so resolving with T -> A(me) is not an available option.
            for (let i = 0; i < RHS_args.length; i++) {
              let key = T_args[i]
              if (next.bindings[key] && next.bindings[key] !== RHS_args[i]) {
                return;
              }
            }
          }

          clone.LHS.push(...option.LHS.map(id => lookupById.get(id)))

          // Filter out any `TRUE` on the LHS.
          clone.LHS = clone.LHS.filter(p => p._id !== TRUE._id)

          // Add the current statement to be investigated.
          list.push(clone)
        })
      } while (list.length > 0)

      // T -> F has been found, so the theorem was proven.
      if (next !== null && next.LHS.length === 0) {
        this.setState({ showQuery: true, error: null, steps: next.steps })

      // Otherwise, the list is empty/no solution was found.
      } else {
        throw new Meteor.Error('Query could not be proven!')
      }
    } catch (err) {
      this.setState({ showQuery: true, error: err.error, steps: [] })
    }
  }

  render () {
    if (!this.props.ready) {
      return <p>Loading...</p>
    }

    return (
      <div className='col-lg-7'>
        <h1>Simple Automated Reasoning System</h1>
        <p>
          <strong>Rules: </strong>
          For <code>A(p)&nbsp;&and;&nbsp;B(p)&nbsp;&rarr;&nbsp;C(p)</code>,
          use  <code>A(p)&B(p):C(p)</code>.
        </p>
        <p>
          <strong>Facts: </strong>
          Use <code>T</code> for true and <code>F</code> for false.
        </p>

        <ul className='rule-list'>
          {this.renderRules()}
        </ul>

        <form onSubmit={this.addRule.bind(this)}>
          <div className='form-group'>
            <input
              className='form-control'
              ref='addRule'
              id='addRule'
              placeholder='Hit enter to add a rule.'
            />
          </div>
        </form>
        <p id='onAddError' className='bg-danger hidden'></p>

        <p>
          <strong>Query: </strong>
          Use <code>predicate(arg1,...,argN)</code>.
        </p>
        <form onSubmit={this.processQuery.bind(this)}>
          <div className='form-group'>
            <input className='form-control' ref='query' id='query'
              placeholder='Query'/>
          </div>
        </form>
        <QueryResult
          show={this.state.showQuery}
          error={this.state.error}
          steps={this.state.steps}
        />
      </div>
    )
  }
}

KnowledgeBase.propTypes = {
  predicates: PropTypes.array.isRequired,
  ready: PropTypes.bool,
  rules: PropTypes.array.isRequired,
}

export default createContainer((props) => {
  let handle = Meteor.subscribe('rules')
  let h = Meteor.subscribe('predicates')
  return {
    predicates: Predicates.find({}).fetch(),
    ready: handle.ready(),
    rules: Rules.find({}, { sort: { text: -1 } }).fetch(),
  }
}, KnowledgeBase)
