'use strict';

describe('Directive: videoBox', function () {

  // load the directive's module and view
  beforeEach(module('artifactsteachAppApp'));
  beforeEach(module('app/videoBox/videoBox.html'));

  var element, scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<video-box></video-box>');
    element = $compile(element)(scope);
    scope.$apply();
    expect(element.text()).toBe('this is the videoBox directive');
  }));
});