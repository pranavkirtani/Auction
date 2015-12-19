var express=require('express');
var users=require('./model');
var bodyParser=require('body-parser');
var app=express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());
process.auction=false;
process.current_user;
process.winning_user;
process.socket=[];
var requireLogin=function(req,res,next){
    
    if(req.user){
    
     next();
    }
    else{
       var query={user_name:req.body.user_name};
        users.findOne(query,function(err,user){
            if(user){
            
              req.user=user;
              next();
            }
            else{
              var user_new={
                        user_name:req.body.user_name,
                        balance:req.body.balance,
                        inventory:[{item_name:'Dhoni'},{item_name:'Sachin'},{item_name:'Sehwag'},{item_name:'Kapil'},{item_name:'Sunil'},{item_name:'dravid'}]
                
                    }
              
              req.user=user_new;
               var userData= new users(user_new);
                userData.save(function(err,result){
                 
                    next();
                })
              }
        });
    }

}

app.post('/auction',requireLogin,function(req,res){
    res.json({'user_data':req.user});
})


   
app.get('/checkAuction',function(req,res){
  res.json({"auction":process.auction});
})

app.post('/createAuction',function(req,res){
    process.auction=true;
    process.current_user={
        user_name:req.body.user_name,
        item_name:req.body.item_name,
        minimum_bid:req.body.minimum_bid
    }
    process.socket.map(function(sock){
            sock.emit('auctionStart',{"current_user":process.current_user});
    })
    
    res.json({'auction': process.auction,'current_user':process.current_user });
    setTimerForAuction();
});

app.post('/placeBid',function(req,res){

    process.winning_user=req.body.user;
    process.winning_user.winning_bid=req.body.bid;
     process.socket.map(function(sock){
            sock.emit('bidPlaced',{"winning_bid":req.body.bid,"winning_user":process.winning_user});
           
    })
    
    
    res.json({'winning_user': process.winning_user});
    
})
io.on('connection', function (socket) {

  socket.emit('start', { 'auction': process.auction,'current_user':process.current_user });
    if(process.winning_user){
        socket.emit('bidPlaced',{"winning_bid": process.winning_user.winning_bid,"winning_user":process.winning_user});
    }
  process.socket.push(socket);
});

app.get('/',function(req,res){
res.sendFile(__dirname+'/index.html');
});
app.use(express.static(__dirname));
//var node_server=app.listen(9000);
server.listen(9000);
console.log('Listening on 9000');

function setTimerForAuction(){
    process.count=90;
    setTimeout(stopAuction,"90000");
    setInterval(function(count){
        if(process.count<=0){
            clearInterval();
        }
        sendTimePerSecond(process.count);
        process.count--;
    },"1000");

}

function stopAuction(){
    process.auction=false;
    process.current_user=null;
    process.winning_user=false;
        process.socket.map(function(sock){
             sock.emit('auctionStop',{"current_user":process.current_user});
        })
    
}
function sendTimePerSecond(){
    
     process.socket.map(function(sock){
             
             sock.emit('timeRemaining',{"time":process.count});
        })

}