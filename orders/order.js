const express = require('express');
const bodyparser = require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose');
const axios = require('axios');

let Order  = require('./models/orders');
let Wishlist = require('./models/wishlist');

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


app.get('/addToWishlist/:bookid/:custid',(req,res) => {

    Wishlist.findOne({CustomerID:req.params.custid}).then((cust) => {
        if(cust)
        {
            Wishlist.updateOne({CustomerID:req.params.custid},{$push:{Books:req.params.bookid}})
            .then((book) => {
                return res.json(book);
            })
        }
        else{
            const newWishList = new Wishlist({CustomerID:req.params.custid,Books:[req.params.bookid]});
            newWishList.save()
            .then(()=>{
                res.send('Saved Successfully');
            })

        }
    })



});

app.get('/allOrders/:id',(req,res) => {

    Order.findOne({CustomerID:req.params.id})
    .then((orderslist) => {
        return res.json(orderslist);
    })

});


app.get('/viewWishlist/:id',(req,res) => {

    Wishlist.findOne({CustomerID:req.params.id})
    .then((wishlist) => {
        return res.json(wishlist);
    })

});

app.get('/create/order/:bookid/:custid',(req,res)=>{
    const now = new Date();
    const newOrder = new Order({
        CustomerID: mongoose.Types.ObjectId(req.params.custid),
        BookID: mongoose.Types.ObjectId(req.params.bookid),
        InitialDate:now, 
        DeliveryDate:now.setDate(now.getDate() + 7 )

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