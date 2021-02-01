const mongoose = require('mongoose');
//const timeZone = require('mongoose-timezone');

const PostSchema = mongoose.Schema({
    user_name:{
        type:String,
        required:true
    },
    party_size:{
        type:Number,
        required:true
    },
    table_num: {
        type: Number,
        required: true
    },
    start_date: {
        type: Date,
        //default: Date.now
    },
    end_date: {
        type: Date,
        required: true
    }
})
//PostSchema.plugin(timeZone,{ paths: ['date', 'datea'] });
module.exports = mongoose.model('reservations',PostSchema);