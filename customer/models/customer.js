const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const customerSchema = new Schema({

    Name : {type: String,required:true},
    Age : {type: String,required:true},
    Address : {type: String,required:true},
    Phone : {type: String,required:true},
        


},
{
    timestamps: true,
}
);

const Customer = mongoose.model('Customer',customerSchema);

module.exports = Customer;