const mongoose = require('mongoose');

const OrderSchema = mongoose.Schema({
    customer_name: {
        type: String
    },
    customer_contact: {
        type: String
    },
    item_list: {
        type: [String],
        validate: v => Array.isArray(v) && v.length > 0
    },
    //found here https://stackoverflow.com/questions/36860342/mongoose-make-array-required
    total_price: {
        type: [Number]
    },
    quantity: {
        type: [Number]
    },
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('orders', OrderSchema);