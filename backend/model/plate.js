const mongoose = require('mongoose');

const plateSchema = new mongoose.Schema({
    plateNumber: {
        type: String,
        required: true,
    },
    timestamp: {
        type: Date,
        default: Date.now,
    },
});

const Plate = mongoose.model('Plate', plateSchema);

module.exports = Plate;