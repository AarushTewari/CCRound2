const express = require('express')
const router = new express.Router()
const auth = require('../middleware/auth')
const Book = require('../Models/books')

//create new book
router.post('/books', auth, async (req, res) => {
    const book = new Book({
        ...req.body,
        owner: req.user._id
    })

    try {
        await book.save()
        res.status(201).send(book)
    } catch(e) {
        res.status(400).send(e)
    }
})

//get all books
router.get('/books', auth, async (req,res) => {
    
    try {
        const books = await Book.find({ owner: req.user._id })
        res.send(books)
    } catch(e) { 
        res.status(500).send()
    }
})

//get book by id
router.get('/books/:id', auth, async (req,res) => {
    const _id = req.params.id
    
    try {
        const book = await Book.findOne({ _id, owner: req.user._id})
        if(!book) {
            return res.status(404).send()
        }

        res.send(book)
    } catch (e) {
        res.status(500).send()
    }
})

//update book
router.patch('/books/:id', auth, async (req,res) => {
    const updates = Object.keys(req.body)

    try {
        const book = await Book.findOne({ _id: req.params.id, owner: req.user._id })
                
        if (!book) {
            return res.status(404).send()
        }
        updates.forEach((update) => book[update] = req.book[update])
        await book.save()
        res.send(book)
    } catch (e) {
        res.status(400).send()
    }
})

//delete book
router.delete('/books/:id', auth, async (req,res) => {
    try {
        const book = await Book.findOneAndDelete({ _id: req.params.id, owner: req.user._id })
        if(!book) {
            return res.status(404).send()
        }

        res.send(book)//sending deleted book as response
    } catch (e) {
        res.status(500).send()
    }
})

module.exports = router