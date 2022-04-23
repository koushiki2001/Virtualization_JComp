const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const bookSchema = new Schema({

    Title : {type: String,required:true},
    Author : {type: String,required:true},
    Publisher : {type: String,required:true},
    Pages : {type: String,required:true},
        


},
{
    timestamps: true,
}
);

const Book = mongoose.model('Book',bookSchema);

module.exports = Book;