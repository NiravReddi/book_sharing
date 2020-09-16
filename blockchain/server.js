var sh=require('sha256');
var blk=require('./block');

var block1=new blk.Block("hello");
console.log(block1.generatehash());