'use strict';

describe('Filter: filterArtifacts', function () {

  // load the filter's module
  beforeEach(module('artifactsteachAppApp'));

  // initialize a new instance of the filter before each test
  var filterArtifacts;
  beforeEach(inject(function ($filter) {
    filterArtifacts = $filter('filterArtifacts');
  }));

  it('should return the input prefixed with "filterArtifacts filter:"', function () {
    var text = 'angularjs';
    expect(filterArtifacts(text)).toBe('filterArtifacts filter: ' + text);
  });

});
