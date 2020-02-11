const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const mysql = require('mysql');
const cors = require('cors');
 
// parse application/json
app.use(cors());
app.use(bodyParser.json());
 
//create database connection
const conn = mysql.createConnection({
  host: '',
  user: '',
  password: '',
  database: ''
});

//----------------------------------
//----------------------------------
//----------------------------------


 //connect to database
conn.connect((err) =>{
  if(err) throw err;
  console.log('Mysql Connected...');
});


app.post('/',(req, res) => {
  res.send("Instagram API");
});


// Insere new post with user ID
app.post('/api/inserePostWithUser',(req, res) => {
  let data = {
    postimage:req.body.postimage, 
    description:req.body.description, 
    IDuser:req.body.IDuser};
  let sql = "INSERT INTO posts SET ?";
  let query = conn.query(sql, data,(err, results) => {
    if(err) throw err;
    
    res.status(200).send(results)
  });
});




// Update user image to user
app.put('/api/insereUserImage',(req, res) => {
  let data = {
    userimage:req.body.userimage,
    };
  var IDuser = req.body.IDuser;
  let sql = "UPDATE user set userimage='"+data.userimage+"' where IDuser="+IDuser;
  let query = conn.query(sql, data,(err, results) => {
    if(err) throw err;
    
    res.status(200).send({"response": results})
  });
});



// Get all Posts 
app.get('/api/getAllPosts',(req, res) => {
  let sql = "SELECT postimage,description,userimage,username FROM posts,user Where posts.IDuser = user.IDuser ORDER BY IDpost DESC";
  let query = conn.query(sql, (err, results) => {
    if(err) throw err;
    //res.send(JSON.stringify({"status": 200, "error": null, "response": results}));
    res.status(200).send({results});
  });
});



// Get all posts bt User ID
app.get('/api/getAllPostsByUser',(req, res) => {
 var IDuser2 = req.query.IDuser;

  let sql = 'SELECT postimage,description,userimage,username FROM posts,user Where posts.IDuser = user.IDuser and user.IDuser='+IDuser2+' ORDER BY IDpost DESC';
  let query = conn.query(sql, (err, results) => {
    if(err) throw err;
    res.status(200).send({results});
  });
});



// Verify if user exists 
app.post('/api/verifyUser',(req, res) => {
  let email = req.body.email;
  let password = req.body.password;

  let sql = "SELECT * FROM user WHERE email='"+email+"'";
  let query = conn.query(sql, (err, results) => {
    if(err) 
      throw err;

      if(results.length === 0){
        res.sendStatus(204)
      }else{
        res.status(200).send({"response": results});
      }
    
  });
});


// Register new user
app.post('/api/registerUser',(req, res) => {
  let data = {
    username:req.body.username,
    nome:req.body.nome,
    userimage:req.body.userimage,
    email:req.body.email,
    password:req.body.password
  };

  let sql = "INSERT INTO user SET ?";
  let query = conn.query(sql, data,(err, results) => {
    
    if(err){
      res.sendStatus(400);
    }else{
      res.status(201).send({"response": results});
    }

  });
});



//Server listening
app.listen(3000,() =>{
  console.log('Server started on port 3000...');
});