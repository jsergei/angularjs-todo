'use strict';

// 1.5.10

// angular
//     .module('myApp')
//     .decorator('$exceptionHandler', ['$delegate', ($delegate) => {
//       return function (exception, errorMessage) {
//           // If a promise is rejected (d.reject('abc')), then there are 2 params and the second will have the "possibly unhandled ..."
//           // Otherwise, if there is an exception inside of some .then(), then there will be just one param 
//           const strMessage = exception && errorMessage ? errorMessage : exception;
//           if ((strMessage.toString().toLowerCase()).startsWith("possibly unhandled rejection")) {
//               console.warn('CAUGHT!');
//               console.log(exception);
//           }
//           $delegate.apply(null, arguments);
//       };
//     }]);


angular.module('myApp.view1', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/view1', {
    templateUrl: 'view1/view1.html',
    controller: 'View1Ctrl'
  });
}])

// Error Interceptor
.factory('errorInterceptor', ['$q', ($q) => {
  return {
    response: function (response) {
      return response;
    },
    responseError: function (response) {
      return $q.reject(response);
    }
  };
}])
.config(['$httpProvider', ($httpProvider) => {
  $httpProvider.interceptors.push('errorInterceptor');
}])

.controller('View1Ctrl', ['$q', '$http', function($q, $http) {
  const apiKey = '16da40803f5f12b6407e4e7af5598e46' + 's';
  $http.get(`http://api.openweathermap.org/data/2.5/weather?q=London,uk&appid=${apiKey}`)
    .then(data => {
      console.log('SUCCESS!');
      console.log(data);
    }, error => {
      console.log('ERROR!');
      console.log(error);
    });
}]);



// .controller('View1Ctrl', ['$q', '$http', function($q, $http) {
//   function okToGreet(name) {
//     return name === 'Robin Hood';
//   }

//   function asyncGreet(name) {
//     var deferred = $q.defer();
  
//     setTimeout(function() {
//       deferred.notify('About to greet ' + name + '.');
  
//       if (okToGreet(name)) {
//         deferred.resolve('Hello, ' + name + '!');
//       } else {
//         deferred.reject('Greeting ' + name + ' is not allowed.');
//       }
//     }, 1000);
  
//     return deferred.promise;
//   }
  
//   var promise = asyncGreet('Robin Hood');
//   promise
//     .then(greeting => {
//       throw new Error('busted!');
//     });
//     // .then(function(greeting) {
//     //   console.log('Success: ' + greeting);
//     // });
//     // throw new Error('fuck you');
//     // .then(function(greeting) {
//     //   console.log('Success: ' + greeting);
//     // }, function(reason) {
//     //   console.warn('Failed: ' + reason);
//     // }, function(update) {
//     //   console.info('Got notification: ' + update);
//     // });
// }]);
