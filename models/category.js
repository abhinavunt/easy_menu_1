const mongoose = require('mongoose');

const CategorySchema = mongoose.Schema({
    "categoryName":{
        type: String,
        required: true
    },
    "time" : { 
        type : Date, 
        default: Date.now 
    }
})

const Category = module.exports = mongoose.model('categories', CategorySchema);