import { Component } from 'react'

import KnowledgeBase from './KnowledgeBase.jsx'

export default class Index extends Component {
  componentWillMount () {
    document.title = 'Automated Reasoning System'
  }

  render () {
    return (
      <div>
        Database:
        <KnowledgeBase/>
      </div>
    )
  }
}
