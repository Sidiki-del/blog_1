const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const ObjectID = require('mongodb').ObjectID;
const formidable = require('formidable');
const fs = require('fs');

app.set("view engine", "ejs");

var MongoClient = require('mongodb').MongoClient;
MongoClient.connect(
  "mongodb://localhost:27017",
  {useNewUrlParser: true,
  useUnifiedTopology: true
}, function(error, client){
      var blog = client.db('blog');
      console.log('DB Connected !! ');

      app.use(
        bodyParser.urlencoded({
          extended: true,
        })
      );
      app.use(bodyParser.json());
      app.use(express.static("public"));
      app.get("/", function (req, res) {
          blog.collection("posts").find().toArray(function(error, posts){
              posts = posts.reverse();
          res.render("user/home", {posts: posts});

          });
        
      });
      app.get('/admin/dashboard', function (req, res) {
          res.render('admin/dashboard', );
      })
       app.get("/admin/posts", function (req, res) {
         res.render("admin/posts");
       });

       app.get('/admin/posts/:id', function(req, res){
           blog.collection('posts').findOne({"_id": ObjectID(req.params.id)}, function(error, post){
               res.render('user/post', {post: post});
           });
       });

       app.post('/do-post', function(req, res){
           blog.collection("posts").insertOne(req.body, function(error, document){
               res.send('Successfully Sent !!!');
           })
          
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
               res.send(oldPath);
           })
       });


      app.listen(3000, function () {
          console.log('Server is running on port 3000');
      })
  }
);




















