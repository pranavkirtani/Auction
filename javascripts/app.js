

var myAppModule = angular.module('myApp', ['ngRoute']);
myAppModule.config(function($routeProvider, $locationProvider) {
    
   
  $routeProvider
   .when('/auction', {
    templateUrl: 'views/auction.html',
    controller: 'auctionController',
    }
    ).when('/edit/:param1',{
  
   templateUrl: 'views/edit.html',
    controller: 'ticketEditController'
  
  
    }).when('/',{
  
     templateUrl: 'views/login.html',
    controller: 'userLoginController'
  
  })





});