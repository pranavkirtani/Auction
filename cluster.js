var http = require("http");
var cluster = require("cluster");
var numCPUs = require("os").cpus().length;
if (cluster.isMaster) {
for (var i = 0; i < numCPUs; i++) {
console.log("Forking child");
cluster.fork();
}
    cluster.on('exit',function(){
    cluster.fork();
    })
    
} else {
require('./server');
}