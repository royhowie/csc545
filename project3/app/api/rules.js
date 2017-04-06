import { Meteor } from 'meteor/meteor'
import { Mongo } from 'meteor/mongo'
import { SimpleSchema } from 'meteor/aldeed:simple-schema'
import { check } from 'meteor/check'

import { Predicates } from './predicates.js'

export const Rules = new Mongo.Collection('rules')

if (Meteor.isServer) {
  Meteor.publish('rules', function rulesPublication () {
    return Rules.find()
  })

  Meteor.methods({
    'rules.insert' (text) {
      check(text, String)

      text = text.trim()

      if (text.indexOf(':') === -1) {
        throw new Meteor.Error(`Missing a colon! Did you mean "T:${text}"?`)
      }

      // If the rule is of the form `T:predicate(...)`, then immediately insert it
      let trueOrFalseForm = /T|F:\w+\([\w,]+\)/
      if (trueOrFalseForm.test(text)) {
        let trueOrFalse = Predicates.findOne({ text: text[0] })
        let format = /(\w+)\(([\w,]+)\)/
        let [ RHS, predicate, args ] = text.split(':').pop().match(format)

        args = args.split(',')

        let object = { predicate, arity: args.length }
        let P = Predicates.findOne(object)

        let _id = null
        if (P) {
          _id = P._id
        } else {
          object.args = args
          object.text = RHS
          _id = Predicates.insert(object)
        }

        return Rules.insert({ LHS: [ trueOrFalse._id ], RHS: _id, text })
      }

      // LHS should be of the form `P(a,b,...,z)&Q(a,b,...,z)`
      let LHS_format = /(\w\([\w,]+\))/g
      // RHS should only be of the form `P(a,b,c,...,z)`
      let RHS_format = /\w+\([\w,]+\)/

      let [ LHS, RHS ] = text.split(':')

      if (!LHS_format.test(LHS)) {
        throw new Meteor.Error('LHS improper syntax!')
      } else if (!RHS_format.test(RHS)) {
        throw new Meteor.Error('RHS improper syntax!')
      }

      let LHS_pieces = LHS.split('&')

      LHS_pieces.forEach(condition => {
        if (!RHS_format.test(condition)) {
          throw new Meteor.Error(`LHS improper syntax: "${condition}".`)
        }
      })

      let predicateIds = []
      let format = /(\w+)\(([\w,]+)\)/
      for (let piece of LHS_pieces.concat(RHS)) {
        let [ text, predicate, args ] = piece.match(format)

        args = args.split(',')

        let P = Predicates.findOne({ text, predicate, arity: args.length })
        let _id = null
        if (P) {
          _id = P._id
        } else {
          _id = Predicates.insert({ text, predicate, arity: args.length, args })
        }
        predicateIds.push(_id)
      }

      let conclusionId = predicateIds.pop()

      return Rules.insert({ LHS: predicateIds, RHS: conclusionId, text })
    },
    'rules.remove' (_id) {
      check(_id, String)
      Rules.remove({ _id })
    }
  })
}

Rules.schema = new SimpleSchema({
  _id: {
    type: String,
    label: 'Id',
    regEx: SimpleSchema.RegEx.Id,
  },
  LHS: {
    type: [String],
    label: 'Predicate arguments',
    regEx: SimpleSchema.RegEx.Id,
  },
  RHS: {
    type: String,
    label: 'Conclusion',
    regEx: SimpleSchema.RegEx.Id,
  },
  text: {
    type: String,
    label: 'Text',
  },
})

Rules.attachSchema(Rules.schema)
