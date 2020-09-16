var sha256=require("crypto-js/sha256");

class Block{
    constructor(data){
        this.id=0;
        this.nonce=144444;
        this.body=data;
        this.hash="";
    }
    generatehash(){
        return sha256(this.data);
    }
}

module.exports.Block = Block;