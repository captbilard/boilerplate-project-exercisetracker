require('dotenv').config()
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const shortid = require("shortid");

const cors = require('cors')

const mongoose = require('mongoose')
const Schema = mongoose.Schema;
mongoose.connect(process.env.MLAB_URI || 'mongodb://localhost/exercise-track' )
// const userSchema = new Schema({
//   username: String,
//   _id: {
//     'type': String,
//     'default': shortid.generate
//   },
// });
// const User = mongoose.model('User', userSchema);
// //find a user in the db
// let findOneUser = function(user){
//    User.find({username:user}, function(err, userFound){
//     if (err) return console.log(err);
//     if(userFound){
//       return true
//     }
//     if(userFound.length == 0){
//       return false
//     }
    
//   });
// };
// let createAndSaveUser = function(newuser){
//   let newlyCreatedUser = new User({username:newuser});
//   newlyCreatedUser.save(function(err, data){
//     if(err) return console.log(err);
//     done(null)
//   });
// };

app.use(cors())

app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())


app.use(express.static('public'))
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});
let takenUsername = [];
let userArray = []
//saving a new user
app.post('/api/exercise/new-user', (req, res)=>{
  let submittedUser = req.body.username;
  if (takenUsername.includes(submittedUser)){
    return res.send("username already taken")
  }
  let userDetails ={username:submittedUser, _id:shortid.generate()}
  takenUsername.push(submittedUser);
  userArray.push(userDetails);
  return res.json(userDetails)
});

//getting all users
app.get('api/exercise/users', (req, res)=>{
  console.log(userArray);
  res.json(userArray)
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


//saving a new user
// app.post('/api/exercise/new-user', (req, res)=>{
//   let submittedUser = req.body.username;
//   User.find({name: submittedUser}, (err, arr, done)=> {
//     if (err){
//       console.log(err)
//     }
//     res.json({"checker":arr})
//     done()
//   });

//   console.log(submittedUser)
// });