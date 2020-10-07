const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const ObjectID = require('mongodb').ObjectID;
const http = require("http").createServer(app);
const io = require("socket.io")(http);
const formidable = require('formidable');
const fs = require('fs');


const session = require('express-session');
app.use(
  session({
    key: "admin",
    secret: "any random String", 
    // proxy: true,
    resave: true,
    saveUninitialized: true
  })
); 

app.use("/static", express.static(__dirname + "/static"));
// app.use(express.static("public"));
app.set("view engine", "ejs");


      app.use(
        bodyParser.urlencoded({
          extended: true,
        })
      );
      app.use(bodyParser.json());

var MongoClient = require('mongodb').MongoClient;
MongoClient.connect(
  "mongodb://localhost:27017",
  {useNewUrlParser: true,
  useUnifiedTopology: true
}, function(error, client){
      var blog = client.db('blog');
      console.log('DB Connected !! ');

      app.get("/", function (req, res) {
          blog.collection("posts").find().toArray(function(error, posts){
              posts = posts.reverse();
          res.render("user/home", {posts: posts});
      });

      app.get('/do-logout', function(req, res){
          req.session.destroy();
          res.redirect("/admin");
      });

      });
      app.get('/admin/dashboard', function (req, res) {
          if(req.session.admin){
          res.render('admin/dashboard');
          } else {
              res.redirect("/admin");
          }
      });
       app.get("/admin/posts", function (req, res) { 
           if (req.session.admin) {
             res.render("admin/posts");
           } else {
             res.redirect("/admin");
           }
       });

       app.post('/do-admin-login', function(req, res){
           blog.collection("admins").findOne({"email": req.body.email, "password": req.body.password},
            function(error, admin){
               if(admin != ""){
                   req.session.admin = admin;
               } 
               res.send(admin);
           });
       });

       app.get('/admin', function(req, res){
           res.render('admin/login');
       });

       app.get('/admin/posts/:id', function(req, res){
           blog.collection('posts').findOne({"_id": ObjectID(req.params.id)}, function(error, post){
               res.render('user/post', {post: post});
           });
       });

       app.post('/do-post', function(req, res){
           blog.collection("posts").insertOne(req.body, function(error, document){
               res.send({
                   text: "Posted Successfully !!!",
                   _id: document.insertedId
               });
           });
       });
       app.post('/do-comment', function(req, res){
           blog.collection("posts").update({"_id": ObjectID(req.body.post_id)}, {
               $push: {
                   "comments": {username: req.body.username, comment: req.body.comment}
               }
           }, function(error, post){
               res.send('Comment Display Successfully !!!');
           });
       });

       app.post("/do-upload-image", function(req, res){
           var formData = new formidable.IncomingForm();
           formData.parse(req, function(error, fields, files){
               var oldPath = files.file.path;
               var newPath = "static/images/" + files.file.name;
               fs.rename(oldPath, newPath, function(err){
                   res.send("/" + newPath);
               });
               
           });
       });

       io.on("connection", function(socket){
           console.log("User Connected Successfully !!!");
           socket.on("new_post", function(formData){
               console.log(formData);
               socket.broadcast.emit("new_post", formData);
           });
       });


      http.listen(3000, function () {
          console.log('Server is running on port 3000');
      });
  }
);




















