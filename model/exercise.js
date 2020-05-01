const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const ExerciseSchema = new Schema({
    description:String,
    duration: Number,
    date:{
        'type':String,
        'default': new Date().toJSON().slice(0,10)
    },
    
});



module.exports = ExerciseSchema;