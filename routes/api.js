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
    "comment": {"type": Array, "required": true}
  });

  //MODEL
  const Books = mongoose.model("Books", bookLibrarySchema);

  //================================================================

  app.route('/api/books')
    .get(function (req, res){
      //response will be array of book objects
      //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
    })
    
    .post(function (req, res){
      let title = req.body.title;
      
      const newBook = new Books({
        "title": title
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
      //if successful response will be 'complete delete successful'
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
