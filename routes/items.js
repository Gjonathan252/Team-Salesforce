const express = require('express');
const router = express.Router();
const Item = require('../models/Item');

//Add menu item
router.post('/items/new', async (req,res)=>{
    const item = new Item({
        item_name: req.body.item_name,
        item_price: req.body.item_price,
        item_category: req.body.item_category,
        item_details: req.body.item_details
    });
    try{
        const savedItem = await item.save();
        //res.json(savedItem);
        res.redirect("/items/admin")
    }catch (err){
        res.json({message: err});
    }
});

//Update menu item not using this
router.patch('/:itemId', async (req,res) =>{
    try{
        const updatedItem = await Item.updateOne(
            {_id: req.params.itemId},
            {$set: {item_name: req.body.item_name, item_price: req.body.item_price, item_category: req.body.item_category, item_details: req.body.item_details}}
        );
        res.json(updatedItem);
    }catch (err){
        res.json({message: err});
    }
});

//Delete a menu item
router.get('/delete/:itemId', async (req,res)=>{// changed to app.get to work with admin menu
    try{
        const removedItem = await Item.deleteOne({_id: req.params.itemId});
        res.redirect("/items/admin")
    }catch (err){
        res.json({message: err});
    }
});

//Return all menu items then passing to ejs tempalte for customer menu
router.get('/', (req, res)=>{
     Item.find({}, function(err, list){
         res.render('customermenu', {
             menu: list
         })
     }).select("-_id");
});

//Return all menu items then passing to ejs tempalte for admin menu
router.get('/admin', (req, res)=>{
    Item.find({}, function(err, items){
        res.render('adminmenu', {
            itemList: items
        })
    });
});
//FIXED

//Find by id// not using
router.get('/find/:itemId', async (req, res)=>{
    try{
        const item = await Item.findById(req.params.itemId);
        res.json(item); 
    }catch (err){
        res.json({message: err});
    }
});

//Find by category// not using
router.get('/category/:type', async (req, res)=>{
    try{
        const item = await Item.find({item_category: req.params.type});
        res.json(item); 
    }catch (err){
        res.json({message: err});
    }
});
module.exports = router;