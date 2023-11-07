const express = require('express');
const router = express.Router();
const Admin = require('./models/admin');
const Category = require('./models/category');
const Item = require('./models/item');
const Customer = require('./models/customer');
const Order = require('./models/order');

router.get('/',(req, res, next)=>{
    res.send("here is the res");
})

router.get('/getAllAdmin',(req, res, next)=>{
    Admin.find((err, contacts)=>{
        res.json(contacts);
    })
});

router.post('/addAdmin',(req, res, next)=>{
    let newAdmin = new Admin({
        login: req.body.login,
        password: req.body.password,
        role: req.body.role
    });

    newAdmin.save((err, contact)=>{
        if(err){
            res.json({message: "Failed to add Admin"});
        }else{
            res.json({message: "Successfully added Admin"});
        }
    })
});

router.post('/adminLogin',(req, res, next)=>{
    Admin.findOne({login: req.body.userName, password:req.body.password},function(err, user) {
        if (err) {
            throw err;
        }else if(!user){
            // not found
            return res.json({"status":"not_found", "user":{}});
        }else{
             return res.json({"status":"found", "user":user});
        }
    });
});

router.get('/getCategories',(req, res, next)=>{
    Category.find((err, category)=>{
        res.json(category);
    })
});

router.get('/getItems',(req, res, next)=>{
    Item.find((err, items)=>{
        if(!items){
            res.json([]);
        }else{
            res.json(items);
        }
    })
});

router.post('/categorySave',(req, res, next)=>{
    let newCategory = new Category({
        categoryName: req.body.categoryName
    });

    newCategory.save((err, category)=>{
        if(err){
            res.json({state: "Failed", message: "Failed to category"});
        }else{
            res.json({state: "Success", message: "Successfully added category"});
        }
    });
});

router.post('/categoryUpdate',(req, res, next)=>{
    Category.findByIdAndUpdate(req.body._id, { categoryName: req.body.categoryName},(err, docs)=> {
        if (err){
            res.json({state: "Failed", message: "Failed to updated category"});
        }
        else{
            res.json({state: "Success", message: "Successfully updated category"});
        }
    });
});

router.post('/categoryDelete',(req, res, next)=>{
    Item.deleteMany({categoryId: req.body.categoryId}, (err, docs)=> {
        if (err){
            res.json({state: "Failed", message: "Failed to delete category"});
        }
        else{
            Category.findByIdAndRemove(req.body.categoryId, (err, docs)=> {
                if (err){
                    res.json({state: "Failed", message: "Failed to delete category"});
                }
                else{
                    res.json({state: "Success", message: "Successfully deleted category"});
                }
            });
        }
    });
});

router.post('/itemSave',(req, res, next)=>{
    let newItem = new Item({
        item: req.body.itemName,
        price: req.body.price,
        categoryId: req.body.categoryId
    });

    newItem.save((err, category)=>{
        if(err){
            res.json({state: "Failed", message: "Failed to add item"});
        }else{
            res.json({state: "Success", message: "Successfully added item"});
        }
    });
});

router.post('/updateItem',(req, res, next)=>{
    Item.findByIdAndUpdate(req.body._id, { item: req.body.item, price: req.body.price },(err, docs)=> {
        if (err){
            res.json({state: "Failed", message: "Failed to updated item"});
        }
        else{
            res.json({state: "Success", message: "Successfully updated item"});
        }
    });
});

router.post('/deleteItem',(req, res, next)=>{
    Item.findByIdAndRemove(req.body.itemId, (err, docs)=> {
        if (err){
            res.json({state: "Failed", message: "Failed to delete item"});
        }
        else{
            res.json({state: "Success", message: "Successfully deleted item"});
        }
    });
});

router.post('/isCustomerExist',(req, res, next)=>{
    Customer.findOne({phone: req.body.phoneNumber},function(err, customer) {
        if (err) {
            throw err;
        }else if(!customer){
            // not found
            return res.json({state:"not_found", customer:{}});
        }else{
             return res.json({state:"found", customer:customer});
        }
    });
});

router.post('/saveCustomer',(req, res, next)=>{
    let newCustomer = new Customer({
        name: req.body.name,
        phone: req.body.phone
        
    });
    
    newCustomer.save((err, customerRes)=>{
        if(err){
            res.json({state: "Failed", message: "Failed to add customer"});
        }else{
            res.json({state: "Success", customer: customerRes});
        }
    })
});

router.post('/checkIn',(req, res, next)=>{
    let newOrder = new Order({
        customerName: req.body.customerName,
        phoneNumber: req.body.phoneNumber,
        paymentMode: req.body.paymentMode,
        tipMode: req.body.tipMode,
        tipAmount: req.body.tipAmount,
        employee: req.body.employee,
        total: req.body.total,
        state: req.body.state,
        items: req.body.items,
        time: new Date()
    });
    
    newOrder.save((err, orderRes)=>{
        if(err){
            res.json({state: "Failed", err: err});
        }else{
            let now = new Date();
            let offset = parseInt(req.body.offset);
            now.setMinutes(now.getMinutes() - offset);
            let startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getUTCDate());
            let endOfDay = new Date(startOfDay);
            endOfDay.setHours(endOfDay.getHours() + 24);
            Order.find({time: {$gte: startOfDay, $lt: endOfDay}, state:"new"},(err, Orders)=>{
                if(err){
                    res.json({state: "Success",waitingNo: "-"});
                }else{
                    res.json({state: "Success", waitingNo: Orders.length});
                }
            })
        }
    })
});

router.get('/getOrders',(req, res, next)=>{
    let now = new Date();
    now.setDate(now.getDate() - parseInt(req.query.day));
    let offset = parseInt(req.query.offset);
    now.setMinutes(now.getMinutes() - offset);
    let startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getUTCDate());
    let endOfDay = new Date(startOfDay);
    endOfDay.setHours(startOfDay.getHours() + 24);
    startOfDay.setMinutes(startOfDay.getMinutes() + offset);
    endOfDay.setMinutes(endOfDay.getMinutes() + offset);
    Order.find({time: {$gte: startOfDay, $lt: endOfDay}},(err, Orders)=>{
        res.json(Orders);
    });
});

router.get('/getReport',(req, res, next)=>{
    let year = parseInt(req.query.year);
    let month = parseInt(req.query.month) - 1;
    let week = parseInt(req.query.week);
    let offset = parseInt(req.query.offset);
    let lastDate;

    let firstDay = 7 * (week-1) + 1;
    let firstDate = new Date(year, month, firstDay);
    firstDate.setUTCHours(0,0,0,0);
    firstDate.setMinutes(firstDate.getMinutes() + offset);
    
    if(week !== 4){
        lastDate = new Date(firstDate.getFullYear(), firstDate.getMonth(), firstDate.getUTCDate()+7);
        lastDate.setUTCHours(0,0,0,0);
        lastDate.setMinutes(lastDate.getMinutes() + offset);
    }else{
        lastDate = new Date(firstDate.getFullYear(), firstDate.getMonth()+1, 1);
        lastDate.setUTCHours(0,0,0,0);
        lastDate.setMinutes(lastDate.getMinutes() + offset);
    }
    
    Order.find({time: {$gte: firstDate, $lt: lastDate}, state: { $ne: 'new' }},(err, Orders)=>{
        res.json(Orders);
    })
});

router.get('/getTotalOrderCount',(req, res, next)=>{
    let result = getDates(req);
    let firstDate = result[0];
    let lastDate = result[1];
    Order.count({time: {$gte: firstDate, $lt: lastDate}, state: { $ne: 'new' }},(err, count)=>{
        res.json({'total_orders': count});
    });
});

router.get('/getTotalCardValue',(req, res, next)=>{
    let result = getDates(req);
    let firstDate = result[0];
    let lastDate = result[1];
    Order.aggregate([
        { $match: {
            time: {$gte: firstDate, $lt: lastDate}, 
            state: { $ne: 'new' },
            paymentMode: {$eq: 'online'}
        }},
        {
            $group:
              {
                _id:null,
                totalAmount: { $sum: "$total" }
              }
        }
    ]).exec((err, total) => {
        if (err) throw err;
        else{
            if(total.length>0){
                res.json({'total_card': total[0]['totalAmount']});
            }else{
                res.json({'total_card': 0});
            }
        }
    });
});

router.get('/getTotalCashValue',(req, res, next)=>{
    let result = getDates(req);
    let firstDate = result[0];
    let lastDate = result[1];
    Order.aggregate([
        { $match: {
            time: {$gte: firstDate, $lt: lastDate}, 
            state: { $ne: 'new' },
            paymentMode: {$eq: 'cash'}
        }},
        {
            $group:
              {
                _id:null,
                totalAmount: { $sum: "$total" }
              }
        }
    ]).exec((err, total) => {
        if (err) throw err;
        else{
            if(total.length>0){
                res.json({'total_cash': total[0]['totalAmount']});
            }else{
                res.json({'total_cash': 0});
            }
        }
    });
});

router.get('/getTotalTipCashValue',(req, res, next)=>{
    let result = getDates(req);
    let firstDate = result[0];
    let lastDate = result[1];
    Order.aggregate([
        { $match: {
            time: {$gte: firstDate, $lt: lastDate}, 
            state: { $ne: 'new' },
            tipMode: {$eq: 'cash'}
        }},
        {
            $group:
              {
                _id:null,
                totalAmount: { $sum: "$tipAmount" }
              }
        }
    ]).exec((err, total) => {
        if (err) throw err;
        else{
            if(total.length>0){
                res.json({'total_tip_cash': total[0]['totalAmount']});
            }else{
                res.json({'total_tip_cash': 0});
            }
        }
    });
});

router.get('/getTotalTipCardValue',(req, res, next)=>{
    let result = getDates(req);
    let firstDate = result[0];
    let lastDate = result[1];
    Order.aggregate([
        { $match: {
            time: {$gte: firstDate, $lt: lastDate}, 
            state: { $ne: 'new' },
            tipMode: {$eq: 'online'}
        }},
        {
            $group:
              {
                _id:null,
                totalAmount: { $sum: "$tipAmount" }
              }
        }
    ]).exec((err, total) => {
        if (err) throw err;
        else{
            if(total.length>0){
                res.json({'total_tip_card': total[0]['totalAmount']});
            }else{
                res.json({'total_tip_card': 0});
            }
        }
    });
});

router.post('/completeOrder',(req, res, next)=>{
    Order.findByIdAndUpdate(req.body._id, { paymentMode: req.body.paymentMode, tipMode: req.body.tipMode, tipAmount: req.body.tipAmount, employee: req.body.employee, total: req.body.total, items: req.body.items, state: req.body.state},(err, docs)=> {
        if (err){
            res.json({state: "Failed", message: "Failed to complete order"});
        }
        else{
            res.json({state: "Success", message: "Successfully completed order"});
        }
    });
});

function getDates(req){
    let year = parseInt(req.query.year);
    let month = parseInt(req.query.month) - 1;
    let offset = parseInt(req.query.offset);
    let lastDate;

    let firstDay = 1;
    let firstDate = new Date(year, month, firstDay);
    firstDate.setUTCHours(0,0,0,0);
    firstDate.setMinutes(firstDate.getMinutes() + offset);
    
    lastDate = new Date(firstDate.getFullYear(), firstDate.getMonth()+1, 1);
    lastDate.setUTCHours(0,0,0,0);
    lastDate.setMinutes(lastDate.getMinutes() + offset);
    return [firstDate, lastDate];
}



module.exports = router;