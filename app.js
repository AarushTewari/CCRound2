const express = require('express')
require('./db/mongoose')
const User = require('./Models/users')
const bookRouter = require('./routers/book')
const userRouter = require('./routers/user')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')


const app = express()

app.use(express.json())
app.use(bookRouter)
app.use(userRouter)

app.listen(3000, () => {
    console.log('Listening on Port 3000')
})


