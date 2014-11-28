'use strict';
/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    uuid = require('node-uuid'),
    multiparty = require('multiparty'),
    Product = mongoose.model('Product'),
    fs = require('fs');

exports.index = function(req, res) {
	res.render('index', {
		user: req.user || null,
		request: req
	});
};

exports.postImage = function(req, res) {
  var form = new multiparty.Form();

  console.log(req.body);

	var product = new Product(req.body);
	product.user = req.user;


  form.parse(req, function(err, fields, files) {
    var file = files.file[0];
    var contentType = file.headers['content-type'];
    var tmpPath = file.path;
    var extIndex = tmpPath.lastIndexOf('.');
    var extension = (extIndex < 0) ? '' : tmpPath.substr(extIndex);
    // uuid is for generating unique filenames.
    var fileName = uuid.v4() + extension;
    var destPath = 'path/to/where/you/want/to/store/your/files/' + fileName;

    // Server side file type checker.
    if (contentType !== 'image/png' && contentType !== 'image/jpeg') {
      fs.unlink(tmpPath);
      return res.status(400).send('Unsupported file type.');
    }

    fs.rename(tmpPath, destPath, function(err) {
      if (err) {
        return res.status(400).send('Image is not saved:');
      }
      return res.json(destPath);
    });
  });
};
