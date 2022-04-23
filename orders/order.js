const express = require('express');
const bodyparser = require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose');
const axios = require('axios');

let Order  = require('./models/orders');

const app = express();


app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.use(bodyparser.json());



mongoose.connect(
    "mongodb+srv://ecommerce:rupai2001@cluster0.sv7i5.mongodb.net/ordersDB?retryWrites=true&w=majority",
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    },
    () => {
        console.log(`Order-Service DB Connected`);
    }
);

app.post('/create/order',(req,res)=>{
    const newOrder = new Order({
        CustomerID: mongoose.Types.ObjectId(req.body.CustomerID),
        BookID: mongoose.Types.ObjectId(req.body.BookID),
        InitialDate: req.body.InitialDate,
        DeliveryDate:req.body.DeliveryDate

    })



    
        newOrder.save()
        .then((order)=> {
            console.log("Order has been placed successfully");
            return res.json(order);
        }).catch((err) => {
            if(err)
            throw err;
        })
    
})



app.get('/all-orders/view',(req,res)=> {
    Order.find()
    .then((order)=> {
        return res.json(order);
    })
    .catch((err) => {
        if(err)
        throw err;
    })
});


app.get('/order/:id', (req,res) => {
    Order.findById(req.params.id).then((order) => {
        if(order){

            axios.get('http://localhost:5555/customer/'+order.CustomerID).then((response) => {
                

                const orderObject = {customerName: response.data.Name, customerPhone: response.data.Phone, deliveryAddress:response.data.Address, BookTitle :''}

                axios.get('http://localhost:3000/book/'+order.BookID).then((response) => {
                    orderObject.BookTitle = response.data.Title;
                    return res.json(orderObject);
                })

            })
            

        }
        else{
            res.send('Invalid order');
        }
    })
})



app.listen(4545 , ()=> {
    console.log('Server is up and running');
})