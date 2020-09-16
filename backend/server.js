var express= require("express");
var mysql= require("mysql");
var cors= require("cors");
var bodyparser = require("body-parser");
var jwt = require('jsonwebtoken');
var multer = require("multer");

port= process.env.PORT || 3000 

process.env.SECRET_KEY= 'secret';
var app=express()
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: false }));
app.use(cors());
app.use('/uploads',express.static(__dirname+'/uploads'));



var connection = mysql.createConnection({
  host : "localhost",
  user : "root",
  password : "root",
  database : "book-app"
});
connection.connect(function(err){
  if(err){
    console.log(err);
  }
  else{
     console.log("connected  completely!!");
  }
})
app.listen(port);

const storage = multer.diskStorage({
    destination: (req, file, callBack) => {
        callBack(null, './uploads');
    },
    filename: (req, file, callBack) => {
        callBack(null, new Date().toISOString().replace(/:/g, '-') + file.originalname);
    }
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
      cb(null, true);
    } else {
      cb(null, false);
    }
};
const upload = multer({
    storage: storage,
    fileFilter: fileFilter
});



console.log("server started !");

app.get("/"){
  res.render("index")
}

app.post("/addbooks",upload.single('image'), function(req , res){
  console.log(req.file.path);
  var query = "INSERT INTO books (bname,bprice,status,path,uid) VALUES "+"("+"'"+req.body.name+"'"+","+"'"+req.body.price+"'"+","+"'"+req.body.status+"',"+"'"+req.file.path+"'"+","+"'"+(req.body.userId)+"'"+")";
  connection.query(query, function(err,rows,fields){
    if(err){
      console.log(err);
    }
    else{
      return res.send(rows);
    }
  })
})

app.post("/sign-up", function(req , res){
  var query = "INSERT INTO new_table (uname,password,cnumber) VALUES "+"("+"'"+req.body.uname+"'"+","+"'"+req.body.password+"'"+","+"'"+(req.body.cnumber)+"'"+")";
  connection.query(query, function(err,rows,fields){
    if(err){
      console.log(err);
    }
    else{
      return res.send(rows);
    }
  })
})
app.post("/sign-in", function(req , res){
  console.log(req.body.uname);
  var query = "SELECT * FROM new_table WHERE uname = '"+req.body.uname+"' && "+"password = '"+req.body.password+"'";
  connection.query(query, function(err,rows,fields){
    if(err){
      console.log(err);
    }
    else{
      if(rows.length == 1){
        let token = jwt.sign({data : rows}, process.env.SECRET_KEY, {
          expiresIn: 2000
        });
        res.json({ token: token });
      }
      else{
        return res.sendStatus(401);
      }
    }
  })
})
app.post("/get-data",function(req,res){
  var query = "SELECT * from books where uid ="+"'"+req.body.userId+"'";
  connection.query(query, function(err,rows,fields){
    if(err){
      console.log(err);
    }else{
      return res.send(rows);
    }
  })
})
