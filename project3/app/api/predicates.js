import { Meteor } from 'meteor/meteor'
import { Mongo } from 'meteor/mongo'
import { SimpleSchema } from 'meteor/aldeed:simple-schema'

export const Predicates = new Mongo.Collection('predicates')

if (Meteor.isServer) {
  Meteor.publish('predicates', function () {
    return Predicates.find()
  })
}

Predicates.schema = new SimpleSchema({
  _id: {
    type: String,
    label: 'Id',
    regEx: SimpleSchema.RegEx.Id,
  },
  arity: {
    type: Number,
    label: 'Number of arguments',
  },
  args: {
    type: [String],
    label: 'Arguments to predicate',
  },
  predicate: {
    type: String,
    label: 'Predicate',
  },
  text: {
    type: String,
    label: 'Text',
  },
})

Predicates.attachSchema(Predicates.schema)
