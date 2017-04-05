import { Component } from 'react'

import KnowledgeBase from './KnowledgeBase.jsx'

export default class Index extends Component {
  componentWillMount () {
    document.title = 'SARS'
  }

  render () {
    return <KnowledgeBase/>
  }
}
