const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const OwnerSchema = new Schema({
    name:{
        type: String,
        require: true
    },
    email:{
        type: String,
        require: true
    },
    password:{
        type: String,
        require: true
    }
});

module.exports = mongoose.model('Owner' , OwnerSchema);