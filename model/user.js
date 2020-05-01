const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const shortid = require("shortid");
const ExerciseSchema = require("./exercise")

const UserSchema = new Schema({
    _id: {
        'type': String,
        'default':shortid.generate
    },
    username:{
        'type':String,
        'required':[true, "Username is required"]
    },
    log:{'type':[ExerciseSchema]}
},{usePushEach:true});

const User = mongoose.model('User', UserSchema);

module.exports = User;