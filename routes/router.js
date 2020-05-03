const express = require('express');
const router = express.Router();
const User = require('../model/user')

//date regex
let dateRegex = /([12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]))/i

//add a user
router.post('/new-user', (req, res, next)=>{
    // console.log(req.body.username);
    // console.log()
    User.findOne({username:req.body.username}, function(err, data){
        if(data){
            res.send({"error":"username already taken"})
        }
    })
    User.create(req.body).then((user)=>res.send(user)).catch(next)
    
});

router.get('/users', (req, res, next)=>{
    User.find({}).then((users)=>{
        res.send(users)
    })
});

router.post('/add/', (req, res, next)=>{
    let userid = req.body.userId;
    let date = req.body.date;
    let duration = req.body.duration;
    if(date === ""){
        date = new Date().toJSON().slice(0,10);
    }
    // console.log(date)
    if(!(dateRegex.test(date))){
        return res.send({"error":"Date format is wrong, kindly enter the date in the format YYYY-MM-DD"})
    }
    if(isNaN(duration)){
        return res.send({"error":"Duration must be a number"})
    }
    let updates = {
            "description":req.body.description,
            "duration":duration,
            "date":date
        }

    User.findById({_id:userid}).then((user)=>{
        console.log(user)
        user.log.push(updates);
        user.save().then(()=>{
            User.findById({_id:userid}).then((results)=>{
                res.send(results);
            }).catch(next);
        }).catch(next);
    }).catch(next);
});

//full exercise log of any user
//I can retrieve a full exercise log of any user by getting /api/exercise/log with a parameter of userId(_id). Return will be the user object with added array log and count (total exercise count).
router.get('/log/:id', (req, res, next)=>{
    let userid = req.params.id;
    let from= req.query.from;
    let to = req.query.to;
    let limit = req.query.limit;
    console.log(from, to, limit)
    if(from === undefined && to === undefined && limit === undefined){
        User.findById({_id:userid}).then((user)=>{
            return res.send(user)
        }).catch(next);
    }else{
        if(!(dateRegex.test(from) && dateRegex.test(to))){
            return res.json({"error":"Incorrect query format, ensure from & to are in yyyy-mm-dd & limit is a number"});
        }
    }
    //query from the urls return strings...so I need to reword on this

    if(!(Number.isInteger(limit))){
        res.json({"error":"Incorrect query format, ensure from & to are in yyyy-mm-dd & limit is an integer"});
    }
    // User.findById({_id:userid}).then((user)=>{
        
    // });
    // User.findById({_id:userid}).then((user)=>{
    //     res.send(user)
    // }).catch(next);
});


router.get('/test/:id', (req,res,next)=>{
    let userid = req.params.id;
    let from= new Date(req.query.from);
    let to = new Date(req.query.to);
    let limit = req.query.limit;
    
   
    // User.find().where({"_id":userid}).$where(function(){
    //     // for(i=0; i <= limit; i++){
    //     //     return this.log[i].date >= from || this.log[i].date <= to
    //     // }
    //     return this.log.filter((item)=>item.date <= this.from || item.date >= this.to)
    // }).then((user)=>{res.send(user)}).catch(next);
    User.findById({"_id":userid}).then((user)=>{
        let logs = user.log.filter((elem)=>new Date(elem.date) >= from || new Date(elem.date) <= to);
        console.log(logs.length)
        res.json({
            "_id":user._id,
            "username": user.username,
            "count": logs.length,
            "log": logs
        })

    }).catch(next);
});

//I can retrieve part of the log of any user by also passing along optional parameters of from & to or limit. (Date format yyyy-mm-dd, limit = int)


module.exports = router