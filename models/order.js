const mongoose = require('mongoose');

const OrderSchema = mongoose.Schema({
    "customerName":{
        type: String,
        required: true
    },
    "phoneNumber":{
        type: String,
        required: false
    },
    "paymentMode":{
        type: String,
        required: false
    },
    "tipMode":{
        type: String,
        required: false
    },
    "tipAmount":{
        type: Number,
        required: false
    },
    "employee":{
        type: String,
        required: false
    },
    "total":{
        type: Number,
        required: true
    },
    "state":{
        type: String,
        required: true
    },
    "items":{
        type: Array,
        required: true
    },
    "time" : { 
        type : Date, 
        required: true
    }
})

const Order = module.exports = mongoose.model('orders', OrderSchema);