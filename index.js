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
                console.log(req.params.bookNumber)
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
                console.log(books)
                res.send(books)
            }catch(e){
                res.send("error")
            }
        })
        
        app.get("/sold/:bookId", async (req,res)=>{
            try{
        
                console.log(req.params.bookId)
                const book = await Book.findOne({_id: req.params.bookId})
                book.isAvailable = false
                console.log(".........")
                console.log(book)
                await book.save()
                console.log("<<<<<<<<<<<<")
                if(book.instaLink === ''){
                    res.send('done')
                }else{
                    console.log(">>>>>>>>>>>>")
                    res.send(book.instaLink)
                }
            }catch(e){
                res.send('error')
            }
        })
        
        app.post('/instaPost',async (req,res)=>{
            try{
                console.log(req.body)
        
                const {books, instaLink } = req.body
                console.log(books)
                if(typeof(books) != 'string'){
                    for (bookId of books){
                        const book = await Book.findOne({_id: bookId})
                        book.instaLink = instaLink
                        await book.save()
                    }
                }else if(books != undefined){
                    console.log('---------')
                    console.log(books)
                    const book = await Book.findOne({_id: books})
                    console.log(':::::::::::::::::::::')
                    console.log(book)
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