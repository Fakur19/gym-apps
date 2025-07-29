const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CheckinSchema = new Schema({
    member: {
        type: Schema.Types.ObjectId,
        ref: 'Member',
        required: true
    },
    memberName: {
        type: String,
        required: true
    },
    checkInTime: {
        type: Date,
        default: Date.now,
        index: true
    }
});

module.exports = mongoose.model('Checkin', CheckinSchema);