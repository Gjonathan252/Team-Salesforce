const mongoose = require('mongoose');

const StatusSchema = mongoose.Schema({
    status: {
        type: Number,
        required: true
    },
    Name:{
        type: String,
        default: 'Master'
    }
    
});

module.exports = mongoose.model('status', StatusSchema);

// 1 = full dining and take out
// 2 = limited seating and take out
// 3 = outdoor seating and take out
// 4 = take out only