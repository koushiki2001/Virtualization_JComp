const express = require('express');
const bodyparser = require('body-parser');
const mongoose = require('mongoose');
const ejs = require('ejs');
let Book = require('./models/book');
const app = express();

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.use(bodyparser.urlencoded({ extended: false }));
app.use(bodyparser.json());

mongoose.connect(
    "mongodb+srv://ecommerce:rupai2001@cluster0.sv7i5.mongodb.net/booksDB?retryWrites=true&w=majority",
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    },
    () => {
        console.log(`Books-Service DB Connected`);
    }
);

app.get('/',(req,res)=>{
    res.send("This is our main endpoint");
});

app.get('/book/Entry',(req,res)=>{
    res.render('bookEntry');
});



app.post("/book/create",  (req, res) => {
    console.log(req.body);
    const { title, author, publisher, pages } = req.body;

    
        const newBook = new Book({
            Title:title,
            Author:author,
            Publisher:publisher,
            Pages:pages
        })

        

        newBook.save()
        .then((book) => {
            res.redirect('http://localhost:5000/adminDashboard');
        })
        .catch((err) =>{

            if(err)
            throw err;
        })
        
    
});

app.get('/books/view', (req,res)=> {
     Book.find()
    .then(books=> {
        console.log(books)
        res.send(books);
        
    })
    .catch((err) => {
        if(err)
        throw err;
    })
});


app.get('/books/getAll', async (req,res)=> {
    await Book.find()
   .then(books=> {
    //    console.log(books)
       res.send(books)
   })
   .catch((err) => {
       if(err)
       throw err;
   })
});


app.get('/bookData/:id',(req,res)=> {

    Book.findById(req.params.id).then((book) => {

        if(book)
        return res.json(book);
        else
        {
            res.sendStatus(404);
        }
    }).catch(err => {
        if(err)
        throw err;
    })
});


app.get('/book/:id',(req,res)=> {

    Book.findById(req.params.id).then((book) => {

        if(book)
        res.render('BookEnlargedView',{item:book});
        else
        {
            res.sendStatus(404);
        }
    }).catch(err => {
        if(err)
        throw err;
    })
});

app.get('/bookdelete/:id',(req,res) => {
    Book.findByIdAndRemove(req.params.id).then(() => {
        res.send('Book removed successfully');
    }).catch((err) => {
        if(err)
        throw err;

    })
});



app.listen(3000,()=>{
    console.log('Server is running');
})