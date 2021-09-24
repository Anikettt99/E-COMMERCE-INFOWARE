const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const orderschema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    orderItems: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'OrderItem',
            required: true
        }
    ],
    shippingAddress1: {
        type: String,
        required: true
    },
    shippingAddress2: {
        type: String,
        deafult: " "
    },
    city: {
        type: String,
        required: true
    },
    zip: {
        type: String,
        required: true
    },
    country: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    totalPrice:{
        type: Number
    },
    dateOrdered: {
        type: Date,
        deafult: Date.now
    }

});

module.exports = mongoose.model('Order' , orderschema);