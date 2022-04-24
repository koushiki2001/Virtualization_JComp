const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const wishlistSchema = new Schema({

    CustomerID : {type: mongoose.SchemaTypes.ObjectId,required:true},
    Books : {type: Array,default: [],required:true},
    
        


},
{
    timestamps: true,
}
);

const Wishlist = mongoose.model('Wishlist',wishlistSchema);

module.exports = Wishlist;