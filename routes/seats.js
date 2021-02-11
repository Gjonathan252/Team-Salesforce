const express = require('express');
const router = express.Router();
const Seat = require('../models/Seat');

router.post('/', async (req,res)=>{
    const seat = new Seat({
        seat_number : req.body.seat_number,
        capacity : req.body.capacity,
        section : req.body.section
    });
    try{
        const savedSeat = await seat.save();
        res.json(savedSeat);
    }catch (err){
        res.json({message: err});
    }
});


//get all seat info

router.get('/',async(req,res)=>{
    const allseats=await Seat.find()
    res.json(allseats)
})

//get list of table for a section
router.get('/:section_id',async(req,res)=>{
    const allseats=await Seat.find({section:req.params.section_id})
    res.json(allseats)
})

module.exports = router;