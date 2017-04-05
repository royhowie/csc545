import { Meteor } from 'meteor/meteor'
import { Mongo } from 'meteor/mongo'
import { SimpleSchema } from 'meteor/aldeed:simple-schema'

export const KnowledgeBase = new Mongo.Collection('knowledge-base')

if (Meteor.isServer) {
  Meteor.publish('knowledge-base', function knowledgeBasePublication () {
    return KnowledgeBase.find()
  })
}

KnowledgeBase.schema = new SimpleSchema({
  _id: {
    type: String,
    label: 'Id',
    regEx: SimpleSchema.RegEx.Id,
  },
  name: {
    type: String,
    label: 'Name',
  },
  text: {
    type: String,
    label: 'Text',
  }
})

KnowledgeBase.attachSchema(KnowledgeBase.schema)
