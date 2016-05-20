'use strict';

var _ = require('lodash');
var Artifact = require('./artifact.model');

// Get list of artifacts
exports.index = function(req, res) {
  Artifact.find(function (err, artifacts) {
    if(err) { return handleError(res, err); }
    return res.json(200, artifacts);
  });
};

// Get a single artifact
exports.show = function(req, res) {
  Artifact.findById(req.params.id, function (err, artifact) {
    if(err) { return handleError(res, err); }
    if(!artifact) { return res.send(404); }
    return res.json(artifact);
  });
};

// Creates a new artifact in the DB.
exports.create = function(req, res) {
  Artifact.create(req.body, function(err, artifact) {
    if(err) { return handleError(res, err); }
    return res.json(201, artifact);
  });
};

// Updates an existing artifact in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Artifact.findById(req.params.id, function (err, artifact) {
    if (err) { return handleError(res, err); }
    if(!artifact) { return res.send(404); }
    var updated = _.merge(artifact, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.json(200, artifact);
    });
  });
};

// Deletes a artifact from the DB.
exports.destroy = function(req, res) {
  Artifact.findById(req.params.id, function (err, artifact) {
    if(err) { return handleError(res, err); }
    if(!artifact) { return res.send(404); }
    artifact.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.send(204);
    });
  });
};

function handleError(res, err) {
  return res.send(500, err);
}