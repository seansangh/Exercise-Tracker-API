# Exercise-Tracker-API

*Keeps track of user info*

This is an app that allows you to track/record your exercises (e.g. date, duration, etc.).

Additionally, this app allows all other users that access it to similarly upload their information.

...

**Home Page**

<img src="/ExerciseTracker.PNG" title="home page" alt="home page" width="500px">


---


## Table of Contents 

> Sections
- [Sample Code](#Sample_Code)
- [Installation](#installation)
- [Features](#features)
- [Contributing](#contributing)
- [Team](#team)
- [FAQ](#faq)
- [Support](#support)
- [License](#license)


---

## Sample Code

```javascript
// code

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

```

---

## Installation


### Setup


>  install npm package

```shell
$ npm install
```

- For all of the packages used, refer to the package.json file [here](/package.json).

---

## Features
## Usage (Optional)
## Documentation (Optional)
## Tests (Optional)
## Contributing
## Team

> Contributors/People

| [**seansangh**](https://github.com/seansangh) |
| :---: |
| [![seansangh](https://avatars0.githubusercontent.com/u/45724640?v=3&s=200)](https://github.com/seansangh)    |
| [`github.com/seansangh`](https://github.com/seansangh) | 

-  GitHub user profile

---

## FAQ

- **Have any *specific* questions?**
    - Use the information provided under *Support* for answers

---

## Support

Reach out to me at one of the following places!

- Twitter at [`@sean13nay`](https://twitter.com/sean13nay?lang=en)
- Github at [`seansangh`](https://github.com/seansangh)

---

## Donations (Optional)

- If you appreciate the code provided herein, feel free to donate to the author via [Paypal](https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=4VED5H2K8Z4TU&source=url).

[<img src="https://www.paypalobjects.com/webstatic/en_US/i/buttons/cc-badges-ppppcmcvdam.png" alt="Pay with PayPal, PayPal Credit or any major credit card" />](https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=4VED5H2K8Z4TU&source=url)

---

## License

[![License](http://img.shields.io/:license-mit-blue.svg?style=flat-square)](http://badges.mit-license.org)

- **[MIT license](http://opensource.org/licenses/mit-license.php)**
- Copyright 2019 © <a>S.S.</a>
