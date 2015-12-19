myAppModule.controller('userLoginController', function($scope,$rootScope, $http) {
    
  
   $scope.login=function(){
   
        if($scope.user_name){
            $rootScope.user_name=$scope.user_name;
            $rootScope.balance=$scope.balance;
            window.location='#/auction';
        }
       else{
            alert(' Please enter a  username!!');
       }
   }
    
 });