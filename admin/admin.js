const express = require('express');
const bodyparser = require('body-parser');
const mongoose = require('mongoose');
const ejs = require('ejs');
const axios = require('axios');
let Admin = require('./models/adminDetails');
const app = express();
const session = require('express-session');

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.use(bodyparser.urlencoded({ extended: false }));
app.use(bodyparser.json());
app.use(
    session({
        secret: 'secret',
        loggedIn: '',
    })
  );
mongoose.connect(
    "mongodb+srv://ecommerce:rupai2001@cluster0.sv7i5.mongodb.net/adminDB?retryWrites=true&w=majority",
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    },
    () => {
        console.log(`Admin-Service DB Connected`);
    }
);


app.get('/',(req,res) => {
    res.send('This is the main endpoint');
});

app.get('/admin/register',(req,res) => {
    res.render('admin_register');
});

app.get('/admin/login',(req,res) => {
    res.render('admin_login');
});

app.get('/adminView/all-customers',async(req,res) => {

    await axios.get('http://localhost:5555/all-customers/view').then((response) => {

        console.log(response);
        res.render('viewCustomerAdmin',{items:response.data});
        
    })


})

app.get('/adminView/all-orders',async(req,res) => {

    await axios.get('http://localhost:4545/all-orders/view').then((response) => {
        console.log(response);
        res.render('viewOrdersAdmin',{items:response.data});
    })


})


app.get('/adminDashboard',async function(req,res){

    await axios.get('http://localhost:3000/books/getAll').then((response) => {
    // console.log(response.data);
    const books = [] ;
    response.data.forEach(element => {
        const book = {
            ID:element._id, 
            Title:element.Title,
            Author:element.Author,
            Publisher:element.Publisher,
            Pages:element.Pages

        }

        books.push(book);
        
    });
    console.log(req.session.loggedIn);
    res.render('adminDashboard',{items:books,id:req.session.loggedIn});
    
    
    })
      
  });


app.post('/registerAdmin',(req,res) => {

    const { name,email,password,phone} = req.body;


        const newAdmin = new Admin({
            Name:name,
            Email:email,
            Password:password,
            Phone:phone
        });

        newAdmin.save()
        .then((admin) => {
            res.redirect('/admin/login');
        })

    

});


app.post("/adminLogin",(req,res) => {
    const {email , password} = req.body;

    Admin.findOne({Email:email,Password:password})
    .then((admin) => {
        if(admin)
        {
            req.session.loggedIn = admin.Email;
            res.redirect('/adminDashboard');
        }
        else{
            res.send('User does not exist');
        }
    })
});

app.get('/admin/Logout',(req,res) => {
    req.session.destroy((err) => {
        res.redirect('/admin/login') // will always fire after session is destroyed
      })
})

app.listen(5000,()=>{
    console.log('Server is running');
})