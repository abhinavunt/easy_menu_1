require('dotenv').config();
var express = require('express');
var mongoose = require('mongoose');
var bodyparser = require('body-parser');
var cors = require('cors');
var path = require('path');
var app = express();
const port = 3000;
const route = require('./route');

app.use(cors());
app.use(bodyparser.json());
app.use(express.static(path.join(__dirname,'public')));
app.use('/api',route);

//mongoose.connect('mongodb://localhost:27017/smart-menu');
mongoose.connect(process.env.MONGO_URI);
mongoose.connection.on('connected',()=>{
    console.log("Connected to Mongo database at port 27017 !!!");
});
mongoose.connection.on('error',(err)=>{
    if(err){
        console.log(err);
    }
    
});

app.listen((process.env.PORT || port),()=>{
    console.log("Server is started at port :"+port);
});