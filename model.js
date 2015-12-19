var mongoose = require('./database.js');
var Schema = mongoose.Schema;

var userSchema = new Schema({
  user_name:String,
  balance:Number,
  inventory:[{
    item_name:String,
    quantity:Number
  }]
    
});
var User = mongoose.model('User', userSchema);
module.exports=User;