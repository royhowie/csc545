import { Meteor } from 'meteor/meteor'
import { Predicates } from '../api/predicates.js'
import { Rules } from '../api/rules.js'

Meteor.startup(() => {
  Predicates.remove({})
  Rules.remove({})
  Predicates.insert({ arity: 0, args: [], predicate: 'T', text: 'T' })
  Predicates.insert({ arity: 0, args: [], predicate: 'F', text: 'F' })
})
