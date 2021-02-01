const express = require('express');
const router = express.Router();
const Reserve = require('../Models/reservation');

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
             posts = await Reserve.exists({start_date: {$lte: timestamp}, end_date: {$gte: timestamp}, table_num: i});
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

module.exports =router;