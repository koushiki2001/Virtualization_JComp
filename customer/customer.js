const express = require('express');
const bodyparser = require('body-parser');
const mongoose = require('mongoose');
const ejs = require('ejs');
const session = require('express-session');
const axios = require('axios');
let Customer = require('./models/customer');
const app = express();


app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.use(bodyparser.urlencoded({ extended: false }));
app.use(bodyparser.json());
app.use(
    session({
        secret: 'secret',
        loggedInCustomerName: '',
        loggedInCustomerId:'',
    })
  );

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


app.get('/custRegister',(req,res)=>{
    res.render('customer-register');
});


app.get('/custLogin',(req,res)=>{
    res.render('customer-login');
});

app.post("/customer/register", async (req, res) => {
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
            res.redirect('/custLogin');
        })
        .catch((err) =>{

            if(err)
            throw err;
        })
        
    }
});


app.post('/customer/login',(req,res) => {
    const {name,phone} = req.body;
    Customer.findOne({Name:name,Phone:phone})
    .then((cust) => {
        if(!cust)
res.send('User does not exist');
else {
    req.session.loggedInCustomerId = cust._id;
    req.session.loggedInCustomerName = cust.Name;
    res.redirect('/getcustomerDashboardDetails');
    // res.send('Logged in successfully');
}
    })
});


app.get('/getcustomerDashboardDetails',(req,res) => {
    axios.get('http://localhost:3000/books/view').then((response)=> {
        console.log(response.data);
        res.render('customer-dashboard',{items:response.data,id:req.session.loggedInCustomerId,name:req.session.loggedInCustomerName});
    })
});




app.get('/all-customers/view',(req,res)=> {
    Customer.find()
    .then((customer)=> {
        res.send(customer);
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

app.get('/',(req,res)=>{
    res.send('This is the main endpoint');
})

app.listen(5555 , () => {
    console.log('Server is up and running');
})