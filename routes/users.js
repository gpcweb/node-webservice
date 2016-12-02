var express = require('express');
var router = express.Router();

var promise = require('bluebird');
var options = { promiseLib: promise };
var pgp     = require('pg-promise')(options);

var connectionString = 'postgres://localhost:5432/users';
var db               = pgp(connectionString);

var multer  = require('multer');
var upload  = multer();

//* Parse the user id
router.param('id', function (req, res, next, id) {
  req.userId = parseInt(id);
  next();
});

checkValidUser = function(req, res, next) {
  var username = req.body.username;

  if (username == 'usuario1') {
    next();
  }
  else {
    var err = new Error('Unauthorized');
    err.status = 401;
    next(err);
  }
}

checkValidData = function(req, res, next) {
  var username  = req.body.username;
  var image     = req.file;

  if ((username == '' || username == null) || (typeof image == 'undefined' || image.size == 0 )) {
    var err = new Error('Bad Request');
    err.status = 400;
    next(err);
  }
  else {
    next();
  }
}

/* GET all users. */
router.get('/', function(req, res, next){
  db.any('SELECT * FROM users')
    .then(function (data) {
      res.status(200)
        .json({
          status: 'success',
          data: data
        });
    })
    .catch(function (err) {
      return next(err);
    });
});

/* GET a single user. */
router.get('/:id', function(req, res, next) {
    db.one('SELECT * FROM users WHERE id = $1', req.userId)
    .then(function(userInfo) {
      res.render('users/show', { username: userInfo.username, image: userInfo.image });
    })
    .catch(function (err) {
      return next(err);
    });
});

router.use(upload.single('image'));
router.use('/', checkValidUser);
router.use('/', checkValidData);

/* Post a single user */
router.post('/', function(req, res, next) {
  req.file = req.file.buffer.toString('base64');
  db.one('INSERT INTO users(username, image)' + 'values(${username}, ${image}) RETURNING id', { username: req.body.username, image: req.file })
    .then(function (data) {
      res.setHeader('Location', '/users/' + data.id);
      res.status(201).send(null);
    })
    .catch(function (err) {
      return next(err);
    });
});

module.exports = router;
