const express = require('express');
const bodyParser = require('body-parser');
const mongo = require('mongodb');
const assert = require('assert');

const url = 'mongodb://now:KiedWepsetE6@ds161471.mlab.com:61471/blog';

const router = express.Router();

router.get('/posts', (req, res) => {
  let posts = [];
  mongo.connect(url, (err, db) => {
    assert.equal(null, err);
    const cursor = db.collection('posts').find();
    cursor.forEach((post, err) => {
      assert.equal(null, err);
      posts.push(post);
    }, () => {
      db.close();
      res.json(posts);
    });
  });
});

router.get('/post/:id', (req, res) => {
  let comments = [];
  mongo.connect(url, (err, db) => {
    assert.equal(null, err);
    const cursor = db.collection(`post_${req.params.id}`).find();
    cursor.forEach((comment, err) => {
      assert.equal(null, err);
      comments.push(comment);
    }, () => {
      db.close();
      res.json(comments);
    });
  });
});

router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

router.post('/posts', (req, res) => {
  const post = {
    name: req.body.name,
    time: req.body.time,
    content: req.body.content,
    postID: req.body.postID,
  };
  mongo.connect(url, (err, db) => {
    assert.equal(null, err);
    db.collection('posts').insertOne(post, (err, res) => {
      assert.equal(null, err);
      db.close();
    });
  });
  res.send('post added');
});

router.post('/post/:id', (req, res) => {
  const comment = {
    name: req.body.name,
    time: req.body.time,
    content: req.body.content
  };
  mongo.connect(url, (err, db) => {
    assert.equal(null, err);
    db.collection(`post_${req.params.id}`).insertOne(comment, (err, res) => {
      assert.equal(null, err);
      db.close();
    });
  });
  res.send('comment added');
});

module.exports = router;
