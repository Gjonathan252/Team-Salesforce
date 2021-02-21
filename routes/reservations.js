const express = require('express');
const router = express.Router();
const Reserve = require('../models/reservation');
const Order = require('../models/Order');
const Status = require('../models/Status');

router.post('/', async (req,res)=>{
    let timestamp = req.body.date+'T'+req.body.time+':00.000Z'
    const xxx = await Reserve.exists({start_date: {$lte: timestamp}, end_date: {$gte: timestamp}, table_num: req.body.table_num});
    const xxxx = await Reserve.exists({start_date: {$lte: new Date(timestamp).setHours(new Date(timestamp).getHours() +2)}, end_date: {$gte: new Date(timestamp).setHours(new Date(timestamp).getHours() +2)},table_num: req.body.table_num});
    console.log(xxx)
    if(xxx){
        return res.send({
            "success":false,
            "msg":"This table already reserved for this time",
            "data": xxx
        })
    }
    if(xxxx){
        return res.send({
            "success":false,
            "msg":"This table already reserved for this time",
            "data": xxx
        })
    }
    
    const post = new Reserve({
        user_name:req.body.name,
        party_size:req.body.party_size,
        table_num: req.body.table_num,
        start_date: timestamp,
        end_date:  new Date(timestamp).setHours(new Date(timestamp).getHours() +2)
    });
    try {
        const savedPost = await post.save();
        console.log(savedPost.start_date.toString());
        res.send({
            "success":true,
            "msg":"table is reserved",
            "data": savedPost
        })
    } catch (err){
        res.json(err);
    }
})

router.get('/is_reserved/:table_id/:date', async (req,res) => {
    try{
        const posts = await Reserve.exists({start_date: {$lte: req.params.date}, end_date: {$gte: req.params.date}, table_num: req.params.table_id});
        res.json(posts);
    }catch(err){
        res.json(err);
    }
});

router.get('/', async (req,res) => {
    try{
       
        const reservations = await Reserve.find();
        //reservations = reservations.start_date.toString();
        // console.log(reservations);
        res.json(reservations);
    }catch(err){
        res.json(err);
    }
});

router.post('/check_status',async(req,res)=>{
    try{
        let no_ofTables=7; ///assign no of table
        let posts;
        let timestamp = req.body.date+'T'+req.body.time+':00.000Z'
        let table_status=[]
     
        console.log(timestamp)

        for(let i=1;i<no_ofTables;i++){
             posts = await Reserve.exists( {$or:[{start_date: {$lte: timestamp}, end_date: {$gte: timestamp}, table_num: i},{start_date: {$lte: new Date(timestamp).setHours(new Date(timestamp).getHours() +2)}, end_date: {$gte: new Date(timestamp).setHours(new Date(timestamp).getHours() +2)}, table_num: i}]});
             table_status.push({
                 table_id:i,
                 status:posts
             })
        }

        res.send(table_status)
    }catch(e){
        res.json(e)
    }
})
//below deals with 2 admin views to manage orders and reservations
//delete reservation
router.get('/delete/:reservationId', async (req,res)=>{
    try{
        const removedReservation = await Reserve.deleteOne({_id: req.params.reservationId});
        res.redirect("/reservations/view")
    }catch (err){
        res.json({message: err});
    }
});
router.get('/remove/:orderId', async (req,res)=>{
    try{
        const removedOrder = await Order.deleteOne({_id: req.params.orderId});
        res.redirect("/reservations/view")
    }catch (err){
        res.json({message: err});
    }
});
//Patch/change statuse

router.post('/update/:statusId', async (req, res)=>{
    try{
        const updatedStatus = await Status.findOneAndUpdate(
            {_id: req.params.statusId},
            {$set: {status: req.body.status}},
            {new: true}
            
        );
        //res.send(updatedStatus);
        res.redirect("/reservations/view");
    } catch (err){
        res.json({mseeage: err});
    }
});

//render amdin reservation page for ALL ORDERS AND RESERVATIONS
router.get('/view', async (req, res)=>{
    try{
        const statusCheck = await Status.find({});
        const allReservations = await Reserve.find({}).sort({"start_date": 1});
        const allOrders = await Order.find({}).sort({"date": 1});
        res.render('reservation', {reservations: allReservations, orders:allOrders, status:statusCheck});
    }catch(err){
        console.log(err);
    }

})

module.exports =router;