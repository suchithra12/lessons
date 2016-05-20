'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var LessonSchema = new Schema({
  title: String,
  user_ids: [],
  artifacts: []
});

module.exports = mongoose.model('Lesson', LessonSchema);