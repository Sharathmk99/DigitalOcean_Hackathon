var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// create a schema
var configSchema = new Schema({
  groupId: { type: String, unique: true},
  child: { type: Array},
  parent: { type: String},
  doctor: { type: Array},
  medical: {type: Array},
  createdBy: {type: String},
  unique: {type: Number}
});

// the schema is useless so far
// we need to create a model using it
var Config = mongoose.model('Config', configSchema );

// make this available to our users in our Node applications
module.exports = Config;