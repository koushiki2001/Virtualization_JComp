const express = require('express');
const bodyparser = require('body-parser');
const mongoose = require('mongoose');
const ejs = require('ejs');
let Customer = require('./models/customer');
const app = express();


app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.use(bodyparser.json());

mongoose.connect(
    "mongodb+srv://ecommerce:rupai2001@cluster0.sv7i5.mongodb.net/customerDB?retryWrites=true&w=majority",
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    },
    () => {
        console.log(`Customer-Service DB Connected`);
    }
);

app.post("/customer/create", async (req, res) => {
    console.log(req.body);
    const { name, age, address, phone } = req.body;

    const userExists = await Customer.findOne({ Name:name, Phone:phone});
    if (userExists) {
        return res.json({ message: "User already exists" });
    } else{
        const newUser = new Customer({
            Name:name,
            Age:age,
            Address:address,
            Phone:phone
        })

        

        newUser.save()
        .then((user) => {
            return res.json(user);
        })
        .catch((err) =>{

            if(err)
            throw err;
        })
        
    }
});

app.get('/all-customers/view',(req,res)=> {
    Customer.find()
    .then((customer)=> {
        return res.json(customer);
    })
    .catch((err) => {
        if(err)
        throw err;
    })
});


app.get('/customer/:id',(req,res)=> {

    Customer.findById(req.params.id).then((customer) => {

        if(customer)
        res.json(customer);
        else
        {
            res.sendStatus(404);
        }
    }).catch(err => {
        if(err)
        throw err;
    })
});


app.delete('/customer/:id',(req,res) => {
    Customer.findByIdAndRemove(req.params.id).then(() => {
        res.send('Customer removed successfully');
    }).catch((err) => {
        if(err)
        throw err;

    })
})

app.listen(5555 , () => {
    console.log('Server is up and running');
})