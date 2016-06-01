'use strict';

// Development specific configuration
// ==================================
module.exports = {
  // MongoDB connection options
  mongo: {
    uri: 'mongodb://localhost/artifactsteachapp-dev'
    // uri: 'mongodb://heroku_app37250104:91rdcsl3u00bbun1i04em3nhb8@ds045001.mongolab.com:45001/heroku_app37250104'
  },

  seedDB: true
};
