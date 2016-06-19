var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// create a schema
var groupSchema = new Schema({
  groupId: { type: String, required: true, unique: true},
  child: { type: Array, required: true},
  parent: { type: String, required: true},
  doctor: { type: Array, required: true},
  medical: {type: Array, required: true}
});

// the schema is useless so far
// we need to create a model using it
var Group = mongoose.model('Group', groupSchema );

// make this available to our users in our Node applications
module.exports = Group;