'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  path = require('path'),
  thumbnailPluginLib = require('mongoose-thumbnail'),
  thumbnailPlugin = thumbnailPluginLib.thumbnailPlugin,
  make_upload_to_model = thumbnailPluginLib.make_upload_to_model,
	Schema = mongoose.Schema;


var uploads_base = path.join(__dirname, '../../public/uploads');
var uploads = path.join(uploads_base, 'u');

/**
 * Product Schema
 */
var ProductSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Product name',
		trim: true
	},
	description: {
		type: String,
		default: '',
		trim: true
	},
	created: {
		type: Date,
		default: Date.now
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	}
});

ProductSchema.plugin(thumbnailPlugin, {
    name: 'photo',
    format: 'png',
    size: 80,
    inline: false,
    save: true,
    upload_to: make_upload_to_model(uploads, 'photos'),
    relative_to: uploads_base
});

mongoose.model('Product', ProductSchema);
