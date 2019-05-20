const express = require('express')
const app = express()
const bodyParser = require('body-parser')

const cors = require('cors')

const mongoose = require('mongoose')
mongoose.connect(process.env.MLAB_URI || 'mongodb://localhost/exercise-track' )

app.use(cors())

app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

app.use(express.static('public'))
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

var Schema= mongoose.Schema;
var exerciseSchema= new Schema({username: String});
var Exercise= mongoose.model('Exercise', exerciseSchema);

var dae= "Mon Jan 01 1000";
var mae= new Date(dae);
var sae= "Wed Jan 01 3000";
var mae2= new Date(sae);


app.post('/api/exercise/new-user', function(req,res,next){
  if(req.body.username){
    Exercise.findOne({username:req.body.username},function(err,data){
     if(err){
     return err;
     }
     if(data){
     res.send('The username is unavailable.');     
     }
     else{
     Exercise.create({username:req.body.username}, function(error,dat){
      if(error){
      return error;
      }
      else{
      res.json({username: dat.username, id: dat._id})
      }
     
     })  
       
     }
      
    })
     
  }
  else{
   res.send("Please enter a valid username.");
  }
  
})

app.get('/api/exercise/users', function(req,res){
  Exercise.find({},function(err,dat){
   if(err){
   return err;
   }
   res.send(dat);
  })
})

var eLog= new Schema({username: String, description: String, duration: Number, date: String});
var ExerciseAdd= mongoose.model('ExerciseAdd', eLog);

app.post('/api/exercise/add', function(req,res){

Exercise.findOne({_id: req.body.userId} ,function(err, dat){  
  if(err){
    res.send('Invalid Id.')
  return err;
  }
  if(dat){
   if(!req.body.description){
    res.send("Path 'description' is required.")
   }
   else{
    var ma= /[^\d]/gi;
    if(!req.body.duration || ma.test(req.body.duration) == true){
    res.send("Path 'duration' is required.")
      return false;
    }
    else{
    var dadate= req.body.date;    
      
    if(req.body.date){
    var date= new Date(dadate);
    var n= date.toDateString();     
    }
    if(!req.body.date){
    dadate= new Date();
    var n= dadate.toDateString();    
    }
      
    ExerciseAdd.create({username: dat.username, description: req.body.description, duration: req.body.duration, date: n})
     
     res.send({username: dat.username, description: req.body.description, duration: req.body.duration, _id: dat._id, date: n})
   
    
    }
    } 
  }

})

})

app.get('/api/exercise/log',function(req,res){
  var userId= req.query.userId;
  if(userId){
    
    if(req.query.limit){
      var limit= req.query.limit;
    }else{
      var limit=100000;
    }
    if(req.query.from){
      var from= new Date(req.query.from);
    }else{
      var from=mae;
    }
    if(req.query.to){
      var to= new Date(req.query.to);
    }else{
      var to=mae2;
    }
    
    Exercise.findOne({_id:req.query.userId}, function(err,data){
    if(err!=null){
    res.send('Invalid User Id');
    }
    else{
      
    ExerciseAdd.find({username:data.username}, function(error, dat){
    
    //res.send(dat)
      var myArr=[];
      var myObj={};
      if(dat.length<limit){
      limit= dat.length;
      }
      var m=0;
    for(var i=0; i<limit; i++){
      myObj["description"]= dat[i]["description"];
      myObj["duration"]= dat[i]["duration"];
      myObj["date"]= dat[i]["date"];
      
      var dadate= new Date(myObj["date"]);
 
      if(dadate>=from && dadate<=to){
      myArr.push(myObj);
      m=m+1;
      }
      myObj={};
    }
    console.log(myArr)
    
      
    res.json({_id:data.id, username: data.username, count: m, log: myArr})
    
      
    })  
      
      
      
    }
    })
  
  
  } 
})

// Not found middleware
app.use((req, res, next) => {
  return next({status: 404, message: 'not found'})
})

// Error Handling middleware
app.use((err, req, res, next) => {
  let errCode, errMessage

  if (err.errors) {
    // mongoose validation error
    errCode = 400 // bad request
    const keys = Object.keys(err.errors)
    // report the first validation error
    errMessage = err.errors[keys[0]].message
  } else {
    // generic or custom error
    errCode = err.status || 500
    errMessage = err.message || 'Internal Server Error'
  }
  res.status(errCode).type('txt')
    .send(errMessage)
})

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
