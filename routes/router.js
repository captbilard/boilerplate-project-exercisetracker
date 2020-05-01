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
router.get('/log')

module.exports = router