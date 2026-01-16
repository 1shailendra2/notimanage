const mongoose = require('mongoose');

const groupSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String
    },
    parentGroup: {
type: mongoose.Schema.Types.ObjectId,
ref: 'Group',
default: null    
}},
{
    timestamps: true
});
module.exports = mongoose.model('Group', groupSchema);      
