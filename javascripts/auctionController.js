myAppModule.controller('auctionController', function($scope,$rootScope, $http) {
     var socket = io.connect('http://localhost:9000');
    socket.on('start', function (data) {
                            $scope.$apply(function() {
                                $scope.auction=data.auction;
                                $scope.current_user=data.current_user;
                             })
    });
    socket.on('bidPlaced',function(data){
        $scope.current_user.winning_bid=data.winning_bid;
         
         $scope.$apply(function() {
                                $scope.winning_bid=data.winning_bid;
                                $scope.winning_user=data.winning_user;
                               
                             })
        
    })
    socket.on('auctionStart',function(data){
         $scope.$apply(function(){
             $scope.auction=true;
             $scope.current_user=data.current_user;
             $scope.time=90;
         })
    });
         socket.on('auctionStop',function(data){
                $scope.$apply(function(){
                        $scope.auction=false;
                        $scope.current_user=data.current_user;
                        $scope.winning_bid=false;
                })
            
    
        });
        
        
        socket.on('timeRemaining',function(data){
                
            $scope.$apply(function(){
                       $scope.time=data.time;
                })
            
    
        });
        
$http.post('/auction',{'user_name':$rootScope.user_name,balance:$rootScope.balance}).success(function(data,status){
                        $scope.user=data.user_data;
                      
                         
                        
                            });
    
    
    
    
    $scope.startAuction=function(user,item_name){
       $http.get('/checkAuction').success(function(data,status){
           if(data.auction){
              alert("There is an active auction currently in progress");
               return;
           }
           
          // var quantity=prompt("Please enter quantity of the item you want to sell");
           var minimum_bid=prompt("Please enter  your bid");
           $http.post('/createAuction',{user_name:user.user_name,item_name:item_name,minimum_bid:minimum_bid}).success(function(data,status){
                  
                                $scope.auction=data.auction;
                                $scope.current_user=data.current_user;
                         
                          
               
           })
       
       });
    };
    $scope.placeBid=function(){
        if($scope.winning_bid){
             var min_bid=parseFloat(document.getElementsByClassName('minimum_bid')[1].innerHTML.split(':')[1]);
        }
        else{
            var min_bid=parseFloat(document.getElementsByClassName('minimum_bid')[0].innerHTML.split(':')[1]);
        }
        
       
        if($scope.mybid<=min_bid&&$scope.winning_bid){
          alert("please bid value greater than winning bid");
             return;
        }
         if($scope.mybid<min_bid){
          alert("please bid the minimum bid value");
            return;
        }
        $http.post('/placeBid',{"bid":$scope.mybid,"user":$scope.user}).success(function(data,status){
              $scope.winning_bid=data.winning_user.winning_bid;
              
            $scope.$apply(function(){
                       $scope.winning_user=data.winning_user;
                })
        
        });
    }

 });