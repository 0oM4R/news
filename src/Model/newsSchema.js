const mongoose =require('mongoose')
const validator = require('validator')
const newsSchema= mongoose.Schema({
    title: {
        type: 'string',
        required: true,
        trim: true,
        default: 'news title'
    },
    description: {
        type: 'string',
        required: true,
        default: 'news description'
    },
    dateOfCreation: {
        type: Date,
        default :Date.now
    },
    publisher:{
        type: mongoose.Types.ObjectId,
        ref:'Reporter',
        required: true
    },
    thumbnail:{
        type:Buffer
    }
})
const newsModel= mongoose.model('News',newsSchema);

module.exports =newsModel;