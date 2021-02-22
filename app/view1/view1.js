'use strict';

// 1.5.10

angular
  .module('myApp')
  .decorator('$exceptionHandler', ['$delegate', ($delegate) => {
    return function (exception, errorMessage) {
        // If a promise is rejected (d.reject('abc')), then there are 2 params and the second will have the "possibly unhandled ..."
        // Otherwise, if there is an exception inside of some .then(), then there will be just one param 
        const strMessage = exception && errorMessage ? errorMessage : exception;
        if ((strMessage.toString().toLowerCase()).startsWith("possibly unhandled rejection")) {
            console.warn('CAUGHT!');
            // console.log(exception);
        }
        $delegate.apply(null, arguments);
    };
  }]);


angular.module('myApp.view1', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/view1', {
    templateUrl: 'view1/view1.html',
    controller: 'View1Ctrl'
  });
}])

.controller('View1Ctrl', ['$q', '$http', function($q, $http) {
  // const apiKey = '16da40803f5f12b6407e4e7af5598e46' + 's';
  // $http.get(`http://api.openweathermap.org/data/2.5/weather?q=London,uk&appid=${apiKey}`)
  //   .then(data => {
  //     console.log('SUCCESS!');
  //     // throw new Error('fuck you');
  //     return data;
  //   }, error => {
  //     return $q.reject(error);
  //   }).then(data => {
  //     console.log('DATA:');
  //     console.log(data);
  //   });

  window.addEventListener('rejectionhandled', event => {
    console.log('handled');
    console.log(event);
  });

  window.addEventListener('unhandledrejection', event => {
    console.log('unhandled');
    console.log(event);
  });

  let p = new Promise((resolve, reject) => {
    setTimeout(() => {
      reject('NO!');
    }, 1000);
  });

  p.catch(e => {
    console.log('Sorry, forgot to handle. Here it is');
  });

  // setTimeout(() => {
  //   p.catch(e => {
  //     console.log('Sorry, forgot to handle. Here it is');
  //   });
  // }, 3000);

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
