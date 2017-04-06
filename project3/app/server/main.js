import { Meteor } from 'meteor/meteor'
import { Predicates } from '../api/predicates.js'
import { Rules } from '../api/rules.js'

Meteor.startup(() => {
  Predicates.remove({})
  Rules.remove({})
  ;[ 'T', 'F' ].forEach(predicate => {
    if (!Predicates.findOne({ predicate }))
      Predicates.insert({ arity: 0, args: [], predicate, text: predicate })
  })
})
