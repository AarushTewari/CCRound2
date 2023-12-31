const express = require('express')
const router = new express.Router()
const auth = require('../middleware/auth')
const User = require('../Models/users')

//create a new user
router.post('/users', async (req, res) => {
    const user = new User(req.body)

    try {
        await user.save()
        const  token = await user.generateAuthToken()
        res.status(201).send({ user, token })
    } catch(e) {
        res.status(400).send(e)
    }
})

router.post('/users/login', async (req,res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()
        res.send({user, token})
    } catch (e) {
        res.status(400).send()
    }
})

router.post('/users/logout', auth, async(req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token
        })
        await req.user.save()

        res.send()
    }catch (e) {
        res.status(500).send()
    }
})

router.post('/users/logoutall', auth, async (req,res) => {
    try {
        req.user.tokens = []
        await req.user.save()
        res.send()
    } catch (e) {
        res.status(500).send()
    }
})

/*get all users  didn't implement this because ofcourse a user shouldn't be able to see credentials of others
router.get('/users', async (req,res) => {

    try {
        const user = await User.find({})
        res.send(user)
    } catch(e) { 
        res.status(500).send()
    }
})*/

//get user logged in
router.get('/users/me', auth, async (req,res) => {

    res.send(req.user )
})

//update user
router.patch('/users/me', auth, async (req,res) => {
    const updates = Object.keys(req.body)
    try {
        updates.forEach((update) => req.user[update] = req.body[update])
        await req.user.save()

        res.send(req.user)
    } catch (e) {
        res.status(400).send()
    }
})

//delete user
router.delete('/users/me', auth, async (req,res) => {
    try {
        await req.user.remove()

        res.send(req.user)//sending deleted user as response
    } catch (e) {
        res.status(500).send()
    }
})

module.exports = router