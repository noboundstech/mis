var mongoose = require('mongoose');
var schema = new mongoose.schema({
	"name" :string,
	"password" : string
})
module.export = mongoose.model('schema',user);