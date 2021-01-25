'use strict';

angular.module('myApp.view2', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/view2', {
    templateUrl: 'view2/view2.html',
    controller: 'View2Ctrl'
  });
}])
.run(myRun)
.config(myConfig)

.controller('View2Ctrl', ['$scope', '$http', function($scope, $http) {
  $scope.get = function(validUrl, handleError) {
    const apiKey = '16da40803f5f12b6407e4e7af5598e46' + (validUrl ? '' : 's');
    let url = `http://api.openweathermap.org/data/2.5/weather?q=London,uk&appid=${apiKey}`;

    let errorCallback = function(response) {
      alert('LOCAL errorCallback called');
    };
    if (!handleError) errorCallback = null;

    $http.get(url).then(s => s).then(function(response) {
      alert('Success callback called');
    }, errorCallback);
  }
}]);


function myRun($rootScope) {
	$rootScope.$on('unhandledHttpError', function(event, response) {
		alert('FALLBACK errorCallback called');
    //TODO: replace previous line with actual fallback error handling
	});
}

function hasCatch(promiseRoot) {
  if (promiseRoot.$$state
    && Array.isArray(promiseRoot.$$state.pending)
    && promiseRoot.$$state.pending.length > 0) { // has child promises that have then-ed this one
      const hasCatchArr = [];
      for (let childTuple of promiseRoot.$$state.pending) { // pending is an array of child promises subscribed to this one
        const childDeferred = childTuple[0];
        const childError = childTuple[2];
        hasCatchArr.push(
          !!childError || hasCatch(childDeferred.promise)
        );
      }
      if (hasCatchArr.every(s => s)) {
        return true;
      }
  } else {
    return false;
  } 
}

//myConfig's only job is to fire unhandledHttpError event when an http request fails with no errorCallback specified
function myConfig($provide) {
	//START//
  $provide.decorator('$http', function($delegate, $rootScope) {
    var $http = $delegate;

    var httpService = function(config) {
      var promise = $http(config);
      var childPromises = null;

      promise.catch(err => {
        const preudoPromise = {
          $$state: {
            pending: childPromises
          }
        };
        if (!hasCatch(preudoPromise)) {
          setTimeout(() => {
            $rootScope.$emit('unhandledHttpError', err);
          });
        }
      });

      var promiseThen = promise.then;
      promise.then = function(successCallback, errorCallback, notifyCallback) {
        const v = promiseThen.call(promise, successCallback, errorCallback, notifyCallback);
        childPromises = promise.$$state.pending;
        return v;
      };

      return promise;
    };
    angular.extend(httpService, $http);

    //handle shortcuts
    httpService.get = function(url, config) {
      config = config || {};
      config.method = "GET";
      config.url = url;
      return httpService(config);
    };
    httpService.delete = function(url, config) {
      config = config || {};
      config.method = "DELETE";
      config.url = url;
      return httpService(config);
    };
    httpService.head = function(url, config) {
      config = config || {};
      config.method = "HEAD";
      config.url = url;
      return httpService(config);
    };
    httpService.jsonp = function(url, config) {
      config = config || {};
      config.method = "JSONP";
      config.url = url;
      return httpService(config);
    };
    httpService.post = function(url, data, config) {
      config = config || {};
      config.method = "POST";
      config.url = url;
      config.data = data;
      return httpService(config);
    };
    httpService.put = function(url, data, config) {
      config = config || {};
      config.method = "PUT";
      config.url = url;
      config.data = data;
      return httpService(config);
    };
    httpService.patch = function(url, data, config) {
      config = config || {};
      config.method = "PATCH";
      config.url = url;
      config.data = data;
      return httpService(config);
    };

    return httpService;
  });
	//END//
}
