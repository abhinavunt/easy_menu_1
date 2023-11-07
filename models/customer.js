const mongoose = require('mongoose');

const CustomerSchema = mongoose.Schema({
    "name":{
        type: String,
        required: true
    },
    "phone":{
        type: String,
        required: false
    }
})

const Customer = module.exports = mongoose.model('customers', CustomerSchema);