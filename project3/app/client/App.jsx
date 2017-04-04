import { Component } from 'react'
import {
  BrowserRouter as Router,
  Link,
  Route,
  Switch,
} from 'react-router-dom'

import Index from './components/Index.jsx'
import NotFound from './components/NotFound.jsx'

const App = () => (
  <Router>
    <div>
      <div className='container'>
        <Switch>
          <Route path='/' exact component={Index}/>
          <Route component={NotFound}/>
        </Switch>
      </div>
    </div>
  </Router>
)

export default App
