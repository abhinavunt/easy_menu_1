const mongoose = require('mongoose');

const AdminSchema = mongoose.Schema({
    "login":{
        type: String,
        required: true
    },
    "password":{
        type: String,
        required: true
    },
    "role":{
        type: String,
        required: true
    }
})

const Admin = module.exports = mongoose.model('admins', AdminSchema);