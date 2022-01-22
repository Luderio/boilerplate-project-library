/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       
*/

const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');
const res = require('express/lib/response');

chai.use(chaiHttp);

let id1 = '';

suite('Functional Tests', function() {

  /*
  * ----[EXAMPLE TEST]----
  * Each test should completely test the response of the API end-point including response status code!
  */
  /*test('#example Test GET /api/books', function(done){
     chai.request(server)
      .get('/api/books')
      .end(function(err, res) {
        assert.equal(res.status, 200);
        assert.isArray(res.body, 'response should be an array');
        assert.property(res.body[0], 'commentcount', 'Books in array should contain commentcount');
        assert.property(res.body[0], 'title', 'Books in array should contain title');
        assert.property(res.body[0], '_id', 'Books in array should contain _id');
        assert.property(res.body[0], 'comments', 'Books in array should contain comments');
        done();
      });
  });*/
  /*
  * ----[END of EXAMPLE TEST]----
  */

  suite('Routing tests', function() {


    suite('POST /api/books with title => create book object/expect book object', function() {
      
      test('Test POST /api/books with title', function(done) {
        chai.request(server)
        .post('/api/books')
        .send({"title": 'Test Title'})
        .end(function(err, res) {
          assert.isObject(res.body, 'response should be an object');
          assert.property(res.body, '_id', 'the object property muts be equal to "_id"');
          assert.property(res.body, 'title', 'the object property muts be equal to "title"');
          id1 = res.body._id;
          console.log('id 1 has been set as: ' + id1);
          done();
        });
      });
      
      test('Test POST /api/books with no title given', function(done) {
        chai.request(server)
        .post('/api/books')
        .send({"title": ''})
        .end(function(err, res) {
          assert.equal(res.body, 'missing required field title', 'the object must contain "missing required field title"');
          done();
        });
      });
      
    });


    suite('GET /api/books => array of books', function(){
      
      test('Test GET /api/books',  function(done){
        chai.request(server)
        .get('/api/books')
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.isArray(res.body, 'response should be an array');
          assert.property(res.body[0], '_id', 'Books in array should contain commentcount');
          assert.property(res.body[0], 'title', 'Books in array should contain title');
          assert.property(res.body[0], 'comments', 'Books in array should contain _id');
          assert.property(res.body[0], 'commentcount', 'Books in array should contain comments');
          done();
        });
      });
    });


    suite('GET /api/books/[id] => book object with [id]', function(){
      
      test('Test GET /api/books/[id] with id not in db',  function(done){
        chai.request(server)
        .get('/api/books/_id')
        .query({"_id": 'Invalid id'})
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.isString(res.body, 'response should be a String');
          assert.equal(res.body, 'no book exists', 'response must contain "no book exists"');
          done();
        });
      });
      
      test('Test GET /api/books/[id] with valid id in db',  function(done){
        chai.request(server)
        .get('/api/books/_id')
        .query({"_id": id1})
        .end(function(err, res) {
          assert.isObject(res.body, 'response should be an Object');
          assert.property(res.body, '_id', 'property should be equal to "_id"');
          assert.property(res.body, 'title', 'property should be equal to "title"');
          assert.property(res.body, 'comments', 'property should be equal to "comments"');
          done();
        });
      });
    });


    suite('POST /api/books/[id] => add comment/expect book object with id', function(){
      
      test('Test POST /api/books/[id] with comment', function(done){
        
      });

      test('Test POST /api/books/[id] without comment field', function(done){
        //done();
      });

      test('Test POST /api/books/[id] with comment, id not in db', function(done){
        //done();
      });
      
    });

    suite('DELETE /api/books/[id] => delete book object id', function() {

      test('Test DELETE /api/books/[id] with valid id in db', function(done){
        //done();
      });

      test('Test DELETE /api/books/[id] with  id not in db', function(done){
        //done();
      });

    });

  });

});
