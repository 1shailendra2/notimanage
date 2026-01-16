const mongoose = require('mongoose');
const newsSchema = new mongoose.Schema({
    groupId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Group',
        required: true
    },
title:{
    type: String,
    required:true
},
content:{
    type: String,
    required:true
},
postedBy:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required:true
}
}, { timestamps: true });

module.exports = mongoose.model('News', newsSchema);