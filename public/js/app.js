var app = angular.module('article',['ngRoute','ngResource']);

app.config(function($routeProvider){
    $routeProvider
        .when('/', {
            templateUrl: 'partials/main/main',
            controller: 'mainCtrl'
        });
});

app.controller('mainCtrl',function($scope){
   $scope.variable1 = "variable1";
    //$scope.templates = {[
    //    template: { url: 'partials/main/latest-posts' }
    //]};
    $scope.template = {url:'partials/main/latest-posts'}
});

app.filter('cut', function () {
    return function (value, wordwise, max, tail) {
        if (!value) return '';

        max = parseInt(max, 10);
        if (!max) return value;
        if (value.length <= max) return value;

        value = value.substr(0, max);
        if (wordwise) {
            var lastspace = value.lastIndexOf(' ');
            if (lastspace != -1) {
                value = value.substr(0, lastspace);
            }
        }

        return value + (tail || '.');
    };
});

app.controller('latestPosts',function($scope,$http){
    $http.get('/api/latest-articles')
        .success(function(data) {
            $scope.lPosts = data;
            //console.log(data);
        })
        .error(function(data) {
            console.log('Error: ' + data);
        });
});

app.run(function($rootScope, $location) {
    $rootScope.$on('$routeChangeError', function(evt, current, previous, rejection) {
        if(rejection === 'not authorized') {
            $location.path('/');
        }
    });
});