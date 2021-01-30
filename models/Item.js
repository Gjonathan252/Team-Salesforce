const mongoose = require ('mongoose');


const ItemSchema = mongoose.Schema({
    item_name: {
        type: String,
        required: true
    },
    item_price: {
        type: Number,
        required: true
    },
    item_category: {//drink, steak, pasta, burger
        type: String,
        required: true
    },
    item_details: {
        type: String,
        required: true
    }
});
module.exports = mongoose.model('Items', ItemSchema);