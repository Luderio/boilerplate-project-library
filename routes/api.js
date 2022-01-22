'use strict';

const { response } = require("../server");
const mongoose = require('mongoose');

module.exports = function (app) {

  //DATABASE SETUP
  const mySecret = process.env['DB'];
  mongoose.connect(mySecret);

  //SCHEMA
  const bookLibrarySchema = mongoose.Schema({
    "title": {"type": String, "required": true},
    "comment": {"type": Array, "required": true},
    "commentcount": {"type": Number, "default": 0}
  });

  //MODEL
  const Books = mongoose.model("Books", bookLibrarySchema);

  //================================================================

  let responseObject = {};

  app.route('/api/books')
    .get(function (req, res){
      
      Books.find({}, (error, result) => {
        if (error) return console.log(error);

        let bookRecords = result.map(book => {
          let books = {
            "_id": book.id,
            "title": book.title,
            "comments": book.comment,
            "commentcount": book.commentcount
          };
          return books;
        });

        responseObject = bookRecords;

        res.json(responseObject);
      });
    })
    
    .post(function (req, res){
      let title = req.body.title;
      
      const newBook = new Books({
        "title": title,
        "comment": [],
        "commentcount": 0
      });

      newBook.save((error, book) => {
        if (error) {
          console.log(error);
          return res.send("missing required field title");
        }
        res.json({"_id": book.id, "title": book.title});
      });

    })
    
    .delete(function(req, res){
      Books.deleteMany({}, (error, result) => {
        if (!error && result) {
          res.send("complete delete successful");
        }else if (!result){
          console.log(error);
          return res.send("unable to delete all the books")
        }
      });
    });



  app.route('/api/books/:id')
  
  //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]} .. 
  .get(function (req, res){
    let bookid = req.params.id;

    Books.findById({"_id": bookid}, (error, searchResult) => {
      if (error) {
        console.log(error);
        return res.send("no books exists");
      }
      res.json({"_id": searchResult.id, "title": searchResult.title, "comments": searchResult.comment});
    });
  })
    
    .post(function(req, res){
      let bookid = req.params.id;
      let comment = req.body.comment;

      if (!comment) {
        return res.send("missing required field comment");
      }

      let commentcounter = 0;
      commentcounter = commentcounter + 1;

      Books.findOneAndUpdate({"_id": bookid}, {"comment": comment, "commentcount": commentcounter}, {new: true}, (error, updatedComment) => {
        if (!error && updatedComment) {
          return res.json({"_id": updatedComment.id, "title": updatedComment.title, "comments": updatedComment.comment, "commentcount": updatedComment.commentcount});
        }else if (!updatedComment) {
          return res.send("no book exists");
        }
      });
      
    })
    
    .delete(function(req, res){
      let bookid = req.params.id;
      //if successful response will be 'delete successful'
    });
  
};
