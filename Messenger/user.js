var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// create a schema
var userSchema = new Schema({
  firstName: { type: String, required: true},
  unique: Number,
  lastName: { type: String, required: true},
  userId: { type: String, required: true, unique: true }
});

// the schema is useless so far
// we need to create a model using it
var User = mongoose.model('User', userSchema);

// make this available to our users in our Node applications
module.exports = User;