const mongoose = require('mongoose');

const ItemSchema = mongoose.Schema({
    "item":{
        type: String,
        required: true
    },
    "price":{
        type: Number,
        required: true
    },
    "categoryId":{
        type: String,
        required: true
    },
    "time" : { 
        type : Date, 
        default: Date.now 
    }
})

const Item = module.exports = mongoose.model('items', ItemSchema);