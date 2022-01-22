'use strict';

const { response } = require("../server");
const mongoose = require('mongoose');

module.exports = function (app) {

  //DATABASE SETUP
  const mySecret = process.env['DB'];
  mongoose.connect(mySecret);

  //SCHEMA
  const bookLibrarySchema = mongoose.Schema({
    "title": String,
    "comment": Array,
    "commentcount": Number
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

      if (!title) {
        return res.json("missing required field title");
      }
      
      const newBook = new Books({
        "title": title,
        "comment": [],
        "commentcount": 0
      });

      newBook.save((error, book) => {
        if (!error && book) {
          return res.json({"_id": book.id, "title": book.title});
        }
      });

    })
    
    .delete(function(req, res){
      Books.deleteMany({}, (error, result) => {
        if (!error && result) {
          res.send("complete delete successful");
        }else if (!result){
          return res.send("unable to delete all the books")
        }
      });
    });



  app.route('/api/books/:id')
  
  //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]} .. 
  .get(function (req, res){
    let bookid = req.params.id;

    Books.findById({"_id": bookid}, (error, searchResult) => {
      if (!error && searchResult) {
        res.json({"_id": searchResult.id, "title": searchResult.title, "comments": searchResult.comment});
      }else if (!searchResult) {
        return res.send("no book exists");
      }
      
    });
  })
    
    .post(function(req, res){
      let bookid = req.params.id;
      let comment = req.body.comment;

      if (!comment) {
        return res.send("missing required field comment");
      }

      Books.findById({"_id": bookid}, (error, updatedComment) => {
        if (!error && updatedComment) {

          updatedComment.comment.push(comment);
          updatedComment.commentcount = updatedComment.commentcount + 1;
  
          updatedComment.save((error, updatedRecord) => {
            if (!error && updatedRecord) {
              return res.json({"_id": updatedRecord.id, "title": updatedRecord.title, "comments": updatedRecord.comment, "commentcount": updatedRecord.commentcount});
            }else if (!updatedRecord) {
              return res.send("no book exists");
            }
          });
        }else if (!updatedComment) {
          return res.send("no book exists");
        }
      });
      
    })
    
    .delete(function(req, res){
      let bookid = req.params.id;
      
      Books.findByIdAndRemove(bookid, (error, result) => {
        if (!error && result) {
          return res.send("delete successful");
        }else if (!result) {
          return res.send("no book exists");
        }
      });
    });
  
};
