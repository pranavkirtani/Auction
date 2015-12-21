var mongoose = require('mongoose');
//mongoose.connect('mongodb://localhost:27017/auction');
mongoose.connect('mongodb://10.44.188.88:27017/bidme-dev');
module.exports=mongoose;