const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const bodyParser = require('body-parser')
const { boolean } = require('webidl-conversions')

const schema = mongoose.Schema(
    {
        bookName : String,
        bookNumber : String,
        instaLink : String,
        price: String,
        isAvailable: Boolean
    }
)

const Book = mongoose.model('book', schema);

mongoose.connect("mongodb+srv://Jenish-Detroja:jenish_9917@cluster0.c06lr7u.mongodb.net/Demo?retryWrites=true&w=majority",
{ useNewUrlParser: true }).then(
    ()=>{
        const app = express()

        app.use(cors())
        
        app.use(bodyParser.urlencoded({extended: true}))
        app.use(bodyParser.json({extended: true}))
        
        app.get('/save/:bookNumber/:bookName/:price', async (req,res)=>{
            try{
                const book = await Book({
                    bookNumber : req.params.bookNumber,
                    bookName : req.params.bookName,
                    price : req.params.price,
                    instaLink : '',
                    isAvailable : true
                })
                await book.save()
                res.send(book)
            }catch(e){
                res.send("error")
            }
        })
        
        app.get('/allBooks', async (req,res)=>{
            try{
                const books = await  Book.find()
                res.send(books)
            }catch(e){
                res.send("error")
            }
        })
        
        app.get("/sold/:bookId", async (req,res)=>{
            try{
        
                const book = await Book.findOne({_id: req.params.bookId})
                book.isAvailable = false
                await book.save()
                if(book.instaLink === ''){
                    res.send('done')
                }else{
                    res.send(book.instaLink)
                }
            }catch(e){
                res.send('error')
            }
        })
        
        app.post('/instaPost',async (req,res)=>{
            try{
        
                const {books, instaLink } = req.body
                if(typeof(books) != 'string'){
                    for (bookId of books){
                        const book = await Book.findOne({_id: bookId})
                        book.instaLink = instaLink
                        await book.save()
                    }
                }else if(books != undefined){
                    const book = await Book.findOne({_id: books})
                    book.instaLink = instaLink
                    await book.save()
                }
                res.send("all set")
            }catch(e){
                res.status(501)
            }
        })
        
        
        app.listen(3000, ()=>{
            console.log("connected")
        })
        
    }
)