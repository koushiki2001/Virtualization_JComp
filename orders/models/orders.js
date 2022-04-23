const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const orderSchema = new Schema({

    CustomerID : {type: mongoose.SchemaTypes.ObjectId,required:true},
    BookID : {type: mongoose.SchemaTypes.ObjectId,required:true},
    InitialDate : {type: Date,required:true},
    DeliveryDate : {type: Date,required:true},
        


},
{
    timestamps: true,
}
);

const Order = mongoose.model('Order',orderSchema);

module.exports = Order;