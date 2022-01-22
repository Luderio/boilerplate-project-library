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
        if (error) {
          console.log(error);
          return res.json("unable to delete all the books")
        }
        res.json("complete delete successful");
      });
    });



  app.route('/api/books/:id')
    .get(function (req, res){
      let bookid = req.params.id;
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
    })
    
    .post(function(req, res){
      let bookid = req.params.id;
      let comment = req.body.comment;
      //json res format same as .get
    })
    
    .delete(function(req, res){
      let bookid = req.params.id;
      //if successful response will be 'delete successful'
    });
  
};
